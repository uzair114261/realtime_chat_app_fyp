from rest_framework import serializers
from .models import Users

class UsersSerializers(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = '__all__'

class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ('email', 'password')

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ('firstName', 'lastName', 'bio', 'profileImage')