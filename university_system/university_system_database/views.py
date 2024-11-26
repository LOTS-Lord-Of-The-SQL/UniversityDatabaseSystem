from . import forms
from django.shortcuts import redirect, render
from django.views.generic import View, TemplateView
from django.contrib.auth import authenticate, login

from django.shortcuts import render
from rest_framework.views import APIView
from . models import *
from rest_framework.response import Response
from .serializers import *
from rest_framework import status





class LoginPageView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            user_serializer = UserSerializer(user)
            return Response({
                "user": user_serializer.data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    

class HomePageView(TemplateView):
    template_name = 'public/index.html'
    
    def get(self, request, *args, **kwargs):
        # Render the React app's index.html template
        return render(request, self.template_name)