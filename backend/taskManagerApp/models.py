from django.db import models
# from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin
from django.contrib.auth import get_user_model

User = get_user_model()
#
# class UserAccountManager(BaseUserManager):
#     def create_user(self, email, name, password=None):
#         if not email:
#             raise ValueError('Нужен email для регистрации')
#
#         email = self.normalize_email(email) #привести все символы к нижнему регистру
#         user = self.model(email=email, name=name)
#
#         user.set_password(password) #сохраняем хэш пароля
#         user.save()
#
#         return user
#
#     def create_superuser(self, email, name, password=None):
#         if not email:
#             raise ValueError('Нужен email для регистрации')
#
#         email = self.normalize_email(email) #привести все символы к нижнему регистру
#         user = self.model(email=email, name=name)
#
#         user.set_password(password) #сохраняем хэш пароля
#         user.save()
#
#         return user
#
# class UserAccount(AbstractBaseUser, PermissionsMixin):
#     email = models.EmailField(max_length=255, unique=True)
#     name = models.CharField(max_length=255)
#     is_active = models.BooleanField(default=True)
#     is_staff = models.BooleanField(default=False)
#
#     objects = UserAccountManager()
#
#     USERNAME_FIELD = 'email'
#     REQUIRED_FIELDS = ['name']
#
#     def get_full_name(self):
#         return self.name
#
#     def get_short_name(self):
#         return self.name
#
#     def __str__(self):
#         return self.email


class Project(models.Model):
    userId = models.ForeignKey(User, related_name='projects', on_delete=models.CASCADE, null=False, blank=False)
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
