from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from django.contrib.auth.hashers import make_password, check_password
from .models import Users
from .serializers import UsersSerializers

class AllUsersData(APIView):
    def get(self, request):
        users = Users.objects.all()
        serialized_users = []
        for user in users:
            serialized_data = {
                'id': user.id,
                'email': user.email,
                'firstName': user.firstName,
                'lastName': user.lastName,
                'bio': user.bio,
                'profileImage': user.profileImage.url if user.profileImage else None,
                'created_at': user.created_at
            }
            serialized_users.append(serialized_data)
        return Response(serialized_users, status=status.HTTP_200_OK)
    

# Create your views here.
@api_view(['POST'])
def create_user(request):
    serializer = UsersSerializers(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        if Users.objects.filter(email=email).exists():
            data = {
                'error' : 'User with this email already exists.'
            }
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
        # Hash passwords before saving
        password = make_password(serializer.validated_data['password'])
        confirm_password = make_password(serializer.validated_data['confirmPassword'])
        serializer.validated_data['password'] = password
        serializer.validated_data['confirmPassword'] = confirm_password
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        try:
            user = Users.objects.get(email=email)
        except Users.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        if not check_password(password, user.password):
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        user_data = {
                'id': user.id,
                'email': user.email,
                'firstName': user.firstName,
                'lastName': user.lastName,
                'bio': user.bio,
                'profileImage': user.profileImage.url if user.profileImage else None,
                'created_at': user.created_at,
            }
        data = {
            'refresh': str(refresh),
            'access': str(access_token),
            'user': user_data
        }

        return Response(data, status=status.HTTP_200_OK)