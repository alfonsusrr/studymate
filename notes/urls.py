from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('archieve/', views.archieve, name='archieve'),
    path('share/', views.share, name='note_share'),
]