from django.urls import path
from chat_messages import views

urlpatterns = [
    path('all_messages/', views.AllMessages.as_view(), name='all_messages')
]
