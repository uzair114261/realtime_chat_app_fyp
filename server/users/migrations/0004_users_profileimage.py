# Generated by Django 5.0.1 on 2024-02-20 17:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_remove_users_profileimage'),
    ]

    operations = [
        migrations.AddField(
            model_name='users',
            name='profileImage',
            field=models.ImageField(default='none', upload_to='users_images/'),
        ),
    ]