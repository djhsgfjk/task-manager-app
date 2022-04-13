from django.db import models

class List(models.Model):
    index = models.IntegerField()
    title = models.CharField(max_length=50)

    def __str__(self):
        return self.title

class Card(models.Model):
    listId = models.ForeignKey(List, related_name='cards', on_delete=models.CASCADE)
    index = models.IntegerField()
    text = models.CharField(max_length=150)

    def __str__(self):
        return self.text
