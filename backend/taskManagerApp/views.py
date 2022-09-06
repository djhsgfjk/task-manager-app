from rest_framework import viewsets
from .serializers import CardSerializer, ListSerializer, ProjectSerializer, SignUpSeriazliser
from .models import Card, List, Project, User
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserSerializer, IssueTokenRequestSerializer, TokenSeriazliser
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import logout, login, authenticate
from django.contrib.auth.forms import UserCreationForm




def logout_view(request):
    logout(request)
    return Response({"success": "Logged out"}, status=200)


@api_view()
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def user(request: Request):
    return Response({
        'data': UserSerializer(request.user).data
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def signup_view(request: Request):
    serializer = SignUpSeriazliser(data=request.data)
    if serializer.is_valid():
        user = User.objects.create_user(**serializer.validated_data)
        # authenticated_user = authenticate(**user.validated_data)
        # try:
        #     token = Token.objects.get(user=authenticated_user)
        # except Token.DoesNotExist:
        #     token = Token.objects.create(user=authenticated_user)
        return Response({'ok': True})
    else:
        return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([AllowAny])
def issue_token(request: Request):
    serializer = IssueTokenRequestSerializer(data=request.data)
    if serializer.is_valid():
        authenticated_user = authenticate(**serializer.validated_data)
        try:
            token = Token.objects.get(user=authenticated_user)
        except Token.DoesNotExist:
            token = Token.objects.create(user=authenticated_user)
        return Response(TokenSeriazliser(token).data)
    else:
        return Response(serializer.errors, status=400)

# @api_view(['POST'])
# @permission_classes([AllowAny])
# def logout(self, request: Request):
#     try:
#         Token.objects.filter(owner=self.request.user).delete()
#     except (AttributeError, ObjectDoesNotExist):
#         pass
#     logout(request)
#     return Response({"success": "Successfully logged out."}, status=200)


# @api_view(['POST'])
# @permission_classes([AllowAny])
# def login(request: Request):
#     serializer = LoginRequestSerializer(data=request.data)
#     if serializer.is_valid():
#         authenticated_user = authenticate(**serializer.validated_data)
#         if authenticated_user is not None:
#             login(request, authenticated_user)
#             return Response({'status': 'Success'})
#         else:
#             return Response({'error': 'Invalid credentials'}, status=403)
#     else:
#         return Response(serializer.errors, status=400)

# @api_view()
# @permission_classes([IsAuthenticated])
# @authentication_classes([JWTAuthentication])
# def user(request: Request):
#     return Response(UserSerializer(request.user).data)


class CardView(viewsets.ModelViewSet):
    serializer_class =CardSerializer
    queryset = Card.objects.all()

class ListView(viewsets.ModelViewSet):
    serializer_class =ListSerializer
    queryset = List.objects.all()

class ProjectView(viewsets.ModelViewSet):
    serializer_class =ProjectSerializer
    queryset = Project.objects.all()