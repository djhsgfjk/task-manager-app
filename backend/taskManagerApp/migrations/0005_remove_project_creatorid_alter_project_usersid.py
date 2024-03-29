# Generated by Django 4.0.3 on 2023-03-22 15:39

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('taskManagerApp', '0004_alter_project_usersid'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='project',
            name='creatorId',
        ),
        migrations.AlterField(
            model_name='project',
            name='usersId',
            field=models.ManyToManyField(blank=True, related_name='projects', to=settings.AUTH_USER_MODEL),
        ),
    ]
