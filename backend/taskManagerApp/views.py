from django.shortcuts import render
from rest_framework import viewsets
from .serializers import CardSerializer, ListSerializer
from .models import Card, List

class CardView(viewsets.ModelViewSet):
    serializer_class =CardSerializer
    queryset = Card.objects.all()

class ListView(viewsets.ModelViewSet):
    serializer_class =ListSerializer
    queryset = List.objects.all()

