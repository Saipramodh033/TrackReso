from rest_framework.response import Response
from rest_framework import status, viewsets, generics
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from django.db.models import Q
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter, OpenApiResponse
from drf_spectacular.types import OpenApiTypes
from .models import Topic, Card, PeerRelationship, TopicShare, ShareAccess
from .serializers import (
    TopicSerializer, CardSerializer, UserSerializer, UserPublicSerializer,
    PeerRelationshipSerializer, TopicShareSerializer, SharedTopicSerializer
)

@extend_schema_view(
    list=extend_schema(
        summary="List all topics",
        description="Retrieve all learning topics created by the authenticated user",
        responses={200: TopicSerializer(many=True)}
    ),
    create=extend_schema(
        summary="Create a new topic",
        description="Create a new learning topic for the authenticated user",
        responses={201: TopicSerializer}
    ),
    retrieve=extend_schema(
        summary="Get topic details",
        description="Retrieve details of a specific topic including all its cards",
        responses={200: TopicSerializer}
    ),
    update=extend_schema(
        summary="Update topic",
        description="Update an existing topic",
        responses={200: TopicSerializer}
    ),
    destroy=extend_schema(
        summary="Delete topic",
        description="Delete a topic and all its associated cards",
        responses={204: None}
    )
)
class TopicViewSet(viewsets.ModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Topic.objects.filter(user=self.request.user).prefetch_related('cards')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['get'])
    def shares(self, request, pk=None):
        """Get list of peers who have access to this topic"""
        topic = self.get_object()
        shares = TopicShare.objects.filter(topic=topic, is_active=True)
        serializer = TopicShareSerializer(shares, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def share(self, request, pk=None):
        """Grant access to a peer for this topic"""
        topic = self.get_object()
        peer_id = request.data.get('peer_id')
        
        try:
            peer = User.objects.get(id=peer_id)
            
            # Check if they are peers
            peer_relationship = PeerRelationship.objects.filter(
                Q(requester=request.user, addressee=peer) | 
                Q(requester=peer, addressee=request.user),
                status='accepted'
            ).first()
            
            if not peer_relationship:
                return Response(
                    {'error': 'User is not in your peer list'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Create or reactivate share
            topic_share, created = TopicShare.objects.get_or_create(
                topic=topic,
                peer=peer,
                defaults={'owner': request.user, 'is_active': True}
            )
            
            if not created and not topic_share.is_active:
                topic_share.is_active = True
                topic_share.save()
            
            serializer = TopicShareSerializer(topic_share)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['delete'], url_path='shares/(?P<peer_id>[^/.]+)')
    def revoke_share(self, request, pk=None, peer_id=None):
        """Revoke access from a peer for this topic"""
        topic = self.get_object()
        
        try:
            share = TopicShare.objects.get(
                topic=topic, 
                peer_id=peer_id, 
                is_active=True
            )
            share.is_active = False
            share.save()
            return Response({'message': 'Access revoked'})
            
        except TopicShare.DoesNotExist:
            return Response(
                {'error': 'Share not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )

class CardViewSet(viewsets.ModelViewSet):
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Card.objects.filter(topic__user=self.request.user)

    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

class CreateuserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        print("Incoming data:", request.data)
        return super().create(request, *args, **kwargs)

class PeerViewSet(viewsets.ModelViewSet):
    serializer_class = PeerRelationshipSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Get all peer relationships for the current user"""
        return PeerRelationship.objects.filter(
            Q(requester=self.request.user) | Q(addressee=self.request.user),
            status='accepted'
        )
    
    @action(detail=False, methods=['post'])
    def search(self, request):
        """Search for users by username"""
        query = request.data.get('query', '').strip()
        if len(query) < 2:
            return Response(
                {'error': 'Query must be at least 2 characters'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Exclude current user and existing peers
        existing_peer_ids = PeerRelationship.objects.filter(
            Q(requester=request.user) | Q(addressee=request.user)
        ).values_list('requester_id', 'addressee_id')
        
        excluded_ids = set([request.user.id])
        for req_id, addr_id in existing_peer_ids:
            excluded_ids.add(req_id)
            excluded_ids.add(addr_id)
        
        users = User.objects.filter(
            username__icontains=query
        ).exclude(id__in=excluded_ids)[:10]
        
        serializer = UserPublicSerializer(users, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def request(self, request):
        """Send a peer request"""
        addressee_id = request.data.get('user_id')
        
        try:
            addressee = User.objects.get(id=addressee_id)
            
            # Check if relationship already exists
            existing = PeerRelationship.objects.filter(
                Q(requester=request.user, addressee=addressee) |
                Q(requester=addressee, addressee=request.user)
            ).first()
            
            if existing:
                return Response(
                    {'error': 'Peer relationship already exists'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            peer_request = PeerRelationship.objects.create(
                requester=request.user,
                addressee=addressee
            )
            
            serializer = PeerRelationshipSerializer(peer_request)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        """Accept a peer request"""
        try:
            peer_request = PeerRelationship.objects.get(
                id=pk,
                addressee=request.user,
                status='pending'
            )
            peer_request.status = 'accepted'
            peer_request.save()
            
            serializer = PeerRelationshipSerializer(peer_request)
            return Response(serializer.data)
            
        except PeerRelationship.DoesNotExist:
            return Response(
                {'error': 'Peer request not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject a peer request"""
        try:
            peer_request = PeerRelationship.objects.get(
                id=pk,
                addressee=request.user,
                status='pending'
            )
            peer_request.status = 'rejected'
            peer_request.save()
            
            return Response({'message': 'Peer request rejected'})
            
        except PeerRelationship.DoesNotExist:
            return Response(
                {'error': 'Peer request not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['get'])
    def requests(self, request):
        """Get pending peer requests"""
        pending_requests = PeerRelationship.objects.filter(
            addressee=request.user,
            status='pending'
        )
        serializer = PeerRelationshipSerializer(pending_requests, many=True)
        return Response(serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        """Remove peer relationship and cascade delete all shared topics"""
        try:
            peer_relationship = self.get_object()
            
            # Determine the other user in the relationship
            if peer_relationship.requester == request.user:
                other_user = peer_relationship.addressee
            else:
                other_user = peer_relationship.requester
            
            # Deactivate all topic shares between these users
            TopicShare.objects.filter(
                Q(owner=request.user, peer=other_user) |
                Q(owner=other_user, peer=request.user),
                is_active=True
            ).update(is_active=False)
            
            # Delete the peer relationship
            peer_relationship.delete()
            
            return Response(
                {'message': 'Peer removed and all shared topics revoked'}, 
                status=status.HTTP_204_NO_CONTENT
            )
            
        except PeerRelationship.DoesNotExist:
            return Response(
                {'error': 'Peer relationship not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )

class SharedTopicViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = SharedTopicSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Get topics shared with the current user"""
        shared_topic_ids = TopicShare.objects.filter(
            peer=self.request.user,
            is_active=True
        ).values_list('topic_id', flat=True)
        
        return Topic.objects.filter(id__in=shared_topic_ids).select_related('user').prefetch_related('cards')
    
    def retrieve(self, request, *args, **kwargs):
        """Get a specific shared topic and log access"""
        topic = self.get_object()
        
        # Log access
        topic_share = TopicShare.objects.get(
            topic=topic,
            peer=request.user,
            is_active=True
        )
        ShareAccess.objects.create(
            topic_share=topic_share,
            access_type='view_topic'
        )
        
        return super().retrieve(request, *args, **kwargs)
    
    @action(detail=True, methods=['post'])
    def leave(self, request, pk=None):
        """Leave/exit access to a shared topic"""
        topic = self.get_object()
        
        try:
            share = TopicShare.objects.get(
                topic=topic,
                peer=request.user,
                is_active=True
            )
            share.is_active = False
            share.save()
            
            return Response({'message': 'Successfully left shared topic'})
            
        except TopicShare.DoesNotExist:
            return Response(
                {'error': 'You do not have access to this topic'}, 
                status=status.HTTP_404_NOT_FOUND
            )

