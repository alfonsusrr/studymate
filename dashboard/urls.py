from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('dashboard/', views.home, name='dashboard'),
    path('agenda/', views.agenda, name='agenda'),
    path('relax/', views.relax, name='relax'),
    path('about/', views.about, name="about"), 
    path('', views.welcome, name='welcome')
]
