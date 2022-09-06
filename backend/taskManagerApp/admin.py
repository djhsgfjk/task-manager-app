from django.contrib import admin
from .models import Card, List, Project

class CardInline(admin.TabularInline):
    model = Card

class ListInline(admin.TabularInline):
    model = List
    inlines = [CardInline]

class TaskManagerAdmin(admin.ModelAdmin):
    project_display = ("title")
    inlines = [ListInline]

admin.site.register(Project, TaskManagerAdmin)