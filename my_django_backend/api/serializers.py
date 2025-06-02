from rest_framework import serializers
from .models import Topic, Card
from django.contrib.auth.models import User

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = '__all__'

class TopicSerializer(serializers.ModelSerializer):
    cards = CardSerializer(many=True, required=False)

    class Meta:
        model = Topic
        fields = '__all__'

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
        return User.objects.create_user(**validated_data)
