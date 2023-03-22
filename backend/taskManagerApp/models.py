from django.db import models
# from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin
from django.contrib.auth import get_user_model

User = get_user_model()


class Project(models.Model):
    users = models.ManyToManyField(User,related_name='projects', blank=True)
    title = models.CharField(max_length=255)


class List(models.Model):
    projectId = models.ForeignKey(Project, related_name='lists', on_delete=models.CASCADE)
    index = models.IntegerField()
    title = models.CharField(max_length=255)

    def __str__(self):
        return self.title

class Card(models.Model):
    listId = models.ForeignKey(List, related_name='cards', on_delete=models.CASCADE)
    index = models.IntegerField()
    text = models.CharField(max_length=255)
    done = models.BooleanField(default=False)
    due = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.text
