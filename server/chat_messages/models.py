# models.py
from django.db import models
from users.models import Users
from .encryption_utils import encrypt_message, decrypt_message

class Message(models.Model):
    sender = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='message_sender')
    receiver = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='message_receiver')
    content = models.TextField(blank=True, null=True)
    content_type = models.CharField(max_length=255, default='text')
    file = models.FileField(upload_to='messages/', blank=True, null=True)
    image = models.ImageField(upload_to='messages/', blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.content:
            self.content = encrypt_message(self.content)
        super().save(*args, **kwargs)

    @property
    def decrypted_content(self):
        if self.content:
            return decrypt_message(self.content)
        return None

    def __str__(self):
        return f'{self.sender.firstName} {self.sender.lastName} -> {self.receiver.firstName} {self.receiver.lastName} ({self.timestamp})'
