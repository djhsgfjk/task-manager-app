# Generated by Django 4.0.3 on 2022-04-09 16:25

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Card',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('listId', models.IntegerField()),
                ('index', models.IntegerField()),
                ('text', models.CharField(max_length=150)),
            ],
        ),
    ]
