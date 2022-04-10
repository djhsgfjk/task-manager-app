from django.db import models

class Card(models.Model):
    listId = models.IntegerField()
    index = models.IntegerField()
    text = models.CharField(max_length=150)

    def __str__(self):
        return self.text