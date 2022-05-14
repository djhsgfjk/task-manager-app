# from django.shortcuts import render
from rest_framework import viewsets #, status
# from rest_framework.decorators import action
# from rest_framework.response import Response
from .serializers import CardSerializer, ListSerializer
from .models import Card, List


class CardView(viewsets.ModelViewSet):
    serializer_class =CardSerializer
    queryset = Card.objects.all()

    # @action(detail=True, methods=['put'], name='change card text')
    # def update(self, request):
    #     card = self.get_object()
    #     serializer = CardSerializer(data=request.DATA)
    #     if serializer.is_valid():
    #         card.update(serializer.data['text'])
    #         card.save()
    #         return Response({'status': 'password set'})
    #     else:
    #         return Response(serializer.errors,
    #                         status=status.HTTP_400_BAD_REQUEST)

class ListView(viewsets.ModelViewSet):
    serializer_class =ListSerializer
    queryset = List.objects.all()

