from django.db import models

# Create your models here.
class Users(models.Model):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)
    confirmPassword = models.CharField(max_length=100)
    firstName = models.CharField(max_length=30)
    lastName = models.CharField(max_length=30)
    bio = models.CharField(max_length=150)
    profileImage = models.ImageField(upload_to='users_images/', default='none')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email