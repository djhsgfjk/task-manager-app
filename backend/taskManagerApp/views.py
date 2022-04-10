from django.shortcuts import render
from rest_framework import viewsets
from .serializers import CardSerializer
from .models import Card

class CardView(viewsets.ModelViewSet):
    serializer_class = CardSerializer
    queryset = Card.objects.all()
