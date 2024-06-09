from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status 
from .serializers import MessageSerializer
from .models import Message

# Create your views here.
class AllMessages(APIView):
    def get(self, request):
        messages = Message.objects.all().order_by('timestamp')
        for message in messages:
            message.content = message.decrypted_content
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = MessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            messageData = Message.objects.get(id=serializer.data['id'])
            decrypted_content = messageData.decrypted_content
            response_data = serializer.data
            response_data['content'] = decrypted_content

            return Response(response_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class DeleteMessage(APIView):
    def get(self, request, id, format=None):
        try:
            message = Message.objects.get(pk=id)
            message.delete()
            return Response(status=status.HTTP_200_OK)
        except Message.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    
