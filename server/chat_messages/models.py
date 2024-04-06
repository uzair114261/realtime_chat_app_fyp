from django.db import models
from users.models import Users

# Create your models here.
class Message(models.Model):
    sender = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='message_sender')
    receiver = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='message_receiver')
    content = models.TextField(blank=True)
    content_type = models.CharField(max_length=255, choices=[('text', 'Text'), ('image', 'Image'), ('video', 'Video'), ('file', 'File'), ('audio', 'Audio')], default='text')
    file = models.FileField(upload_to='messages/', blank=True, null=True)
    image = models.ImageField(upload_to='messages/', blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    def __str__(self) :
        return f'{self.sender.firstName} {self.sender.lastName} -> {self.receiver.firstName} {self.receiver.lastName} ({self.timestamp})'