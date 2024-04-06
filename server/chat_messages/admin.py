from django.contrib import admin
from .models import Message

class MessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'receiver', 'content_type', 'timestamp')
    search_fields = ('sender', 'receiver', 'content')
    list_filter = ('content_type',)

admin.site.register(Message, MessageAdmin)