from django.urls import path
from users import views

urlpatterns = [
    path('api/create_user', views.create_user, name='create_user'),
    path('api/login', views.LoginView.as_view(), name='login'),
    path('api/all-users-data', views.AllUsersData.as_view(), name='all-users-data')
]
