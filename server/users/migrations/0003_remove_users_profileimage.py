# Generated by Django 5.0.1 on 2024-02-20 17:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_alter_users_profileimage'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='users',
            name='profileImage',
        ),
    ]
