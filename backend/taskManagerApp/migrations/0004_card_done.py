# Generated by Django 4.0.3 on 2022-05-13 17:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('taskManagerApp', '0003_alter_card_listid'),
    ]

    operations = [
        migrations.AddField(
            model_name='card',
            name='done',
            field=models.BooleanField(default=False),
        ),
    ]
