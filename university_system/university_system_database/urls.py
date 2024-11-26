from django.urls import path
from . import views

urlpatterns = [
    path('login',views.LoginPageView.as_view(), name='login'),
    path('home/', views.HomePageView.as_view(), name='home')
]