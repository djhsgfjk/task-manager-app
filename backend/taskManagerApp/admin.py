from django.contrib import admin
from .models import Card, List

class CardInline(admin.TabularInline):
    model = Card

class TaskManagerAdmin(admin.ModelAdmin):
    list_display = ("index", "title")
    inlines = [CardInline]

admin.site.register(List, TaskManagerAdmin)