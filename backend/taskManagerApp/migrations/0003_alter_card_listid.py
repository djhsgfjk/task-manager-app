# Generated by Django 4.0.3 on 2022-04-13 15:00

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('taskManagerApp', '0002_list_alter_card_listid'),
    ]

    operations = [
        migrations.AlterField(
            model_name='card',
            name='listId',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='cards', to='taskManagerApp.list'),
        ),
    ]
