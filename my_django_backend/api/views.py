from rest_framework.response import Response
from rest_framework import status, viewsets
from .models import Topic, Card
from .serializers import TopicSerializer, CardSerializer

class TopicViewSet(viewsets.ModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer

    def create(self, request, *args, **kwargs):
        print("Received Data:", request.data)  # Debugging
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            topic = serializer.save()  # Explicit save
            print("Saved Topic:", topic)  # Debugging
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print("Serializer Errors:", serializer.errors)  # Debugging
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CardViewSet(viewsets.ModelViewSet):
    queryset = Card.objects.all()
    serializer_class = CardSerializer

    def update(self, request, *args, **kwargs):
        print("PATCH/PUT request received:", request.data)  # Debugging
        response = super().update(request, *args, **kwargs)
        print("Updated card response:", response.data)  # Debugging
        return response

    def partial_update(self, request, *args, **kwargs):
        print("Partial Update (PATCH) Request:", request.data)  # Debugging
        response = super().partial_update(request, *args, **kwargs)
        print("Updated Card:", response.data)  # Debugging
        return response
