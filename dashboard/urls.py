from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('dashboard/', views.home, name='dashboard'),
    path('agenda/', views.agenda, name='agenda'),
    path('agenda/API/', views.agenda_api, name='agenda_API'),
    path('relax/', views.relax, name='relax'),
    path('', views.welcome, name='welcome')
]
