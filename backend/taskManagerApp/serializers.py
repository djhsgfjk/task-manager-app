from rest_framework import serializers
from .models import Card, List, Project, User
from rest_framework.serializers import Serializer, ModelSerializer, CharField
from rest_framework.authtoken.models import Token
from drf_writable_nested import WritableNestedModelSerializer

class IssueTokenRequestSerializer(Serializer):
    model = User

    username = CharField(required=True)
    password = CharField(required=True)


class TokenSeriazliser(ModelSerializer):
    class Meta:
        model = Token
        fields = ['key']


class SignUpSeriazliser(ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']


class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ("listId", "id", "index", "text", "done", "due")

class CardInListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ("id", "index", "text", "done", "due")

class ListSerializer(serializers.ModelSerializer):

    cards = CardInListSerializer(many=True, read_only=False, required=False)

    class Meta:
        model = List
        fields= ('projectId', 'id', 'index', 'title', 'cards')

class ListInProjectSerializer(serializers.ModelSerializer):

    cards = CardInListSerializer(many=True, read_only=False, required=False)

    class Meta:
        model = List
        fields = ('id', 'index', 'title', 'cards')


class ProjectSerializer(WritableNestedModelSerializer, serializers.ModelSerializer):
    lists = ListInProjectSerializer(many=True, read_only=False, required=False)

    class Meta:
        model = Project
        fields = ('id', 'users', 'title', 'lists')


class UserInProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')


class ProjectInUserSerializer(serializers.ModelSerializer):
    lists = ListInProjectSerializer(many=True, read_only=False, required=False)
    users = UserInProjectSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = ('id', 'users', 'title', 'lists')


class UserSerializer(serializers.ModelSerializer):

    projects = ProjectInUserSerializer(many=True, read_only=False, required=False)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'projects')