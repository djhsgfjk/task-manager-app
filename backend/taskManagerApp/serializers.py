from rest_framework import serializers
from .models import Card, List

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ("listId", "id", "index", "text", "done")

class CardInListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ("id", "index", "text", "done")

class ListSerializer(serializers.ModelSerializer):

    cards = CardInListSerializer(many=True, read_only=False, required=False)

    class Meta:
        model = List
        fields= ('id', 'index', 'title', 'cards')
