from django.contrib import admin
from .models import Card

class TaskManagerAdmin(admin.ModelAdmin):
    list_display = ("listId", "index", "text")

#Register model

admin.site.register(Card, TaskManagerAdmin)