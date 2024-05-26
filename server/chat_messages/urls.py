from django.urls import path
from chat_messages import views

urlpatterns = [
    path('all_messages/', views.AllMessages.as_view(), name='all_messages'),
    path('delete_messages/<int:id>/', views.DeleteMessage.as_view(), name='delete_messages'),

]
