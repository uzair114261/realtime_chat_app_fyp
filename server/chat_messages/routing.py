# routing.py

from django.urls import path
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from chat_messages import consumers

application = ProtocolTypeRouter({
    'websocket': AuthMiddlewareStack(
        URLRouter([
            path('ws/chat/<str:room_name>/', consumers.ChatConsumer.as_asgi()),
        ])
    ),
})
