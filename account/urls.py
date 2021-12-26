from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import LoginView

from . import views
urlpatterns = [
    path('', views.profile),
    path('register/', views.register, name="register"),
    path('login/', views.login, name="login")
]
