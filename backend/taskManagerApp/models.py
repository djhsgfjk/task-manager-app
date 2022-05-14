from django.db import models
# from django.contrib.auth import get_user_model
#
# User = get_user_model()

class List(models.Model):
    index = models.IntegerField()
    title = models.CharField(max_length=50)

    def __str__(self):
        return self.title

class Card(models.Model):
    listId = models.ForeignKey(List, related_name='cards', on_delete=models.CASCADE)
    index = models.IntegerField()
    text = models.CharField(max_length=150)
    done = models.BooleanField(default=False)

    def __str__(self):
        return self.text
