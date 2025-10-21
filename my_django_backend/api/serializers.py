from rest_framework import serializers
from .models import Topic, Card, PeerRelationship, TopicShare, ShareAccess
from django.contrib.auth.models import User

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = '__all__'

class TopicSerializer(serializers.ModelSerializer):
    cards = CardSerializer(many=True, required=False)

    class Meta:
        model = Topic
        fields = ['id', 'name', 'collapsed', 'cards']  # Exclude user field
        read_only_fields = ['id']

    def create(self, validated_data):
        cards_data = validated_data.pop('cards', [])
        topic = Topic.objects.create(**validated_data)
        for card_data in cards_data:
            Card.objects.create(topic=topic, **card_data)
        return topic

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]
        extra_kwargs = {
            'password': {'write_only': True, 'required': True},
            'email': {'required': False},
        }

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user

class UserPublicSerializer(serializers.ModelSerializer):
    """Serializer for public user information (for peer search)"""
    class Meta:
        model = User
        fields = ["id", "username"]

class PeerRelationshipSerializer(serializers.ModelSerializer):
    requester = UserPublicSerializer(read_only=True)
    addressee = UserPublicSerializer(read_only=True)
    
    class Meta:
        model = PeerRelationship
        fields = ['id', 'requester', 'addressee', 'status', 'created_at', 'updated_at']

class TopicShareSerializer(serializers.ModelSerializer):
    topic = TopicSerializer(read_only=True)
    peer = UserPublicSerializer(read_only=True)
    owner = UserPublicSerializer(read_only=True)
    
    class Meta:
        model = TopicShare
        fields = ['id', 'topic', 'owner', 'peer', 'permission_level', 'shared_at', 'is_active']

class SharedTopicSerializer(serializers.ModelSerializer):
    """Serializer for topics shared with the current user"""
    cards = CardSerializer(many=True, read_only=True)
    owner = UserPublicSerializer(source='user', read_only=True)  # Map 'user' field to 'owner'
    
    class Meta:
        model = Topic
        fields = ['id', 'name', 'cards', 'owner']

