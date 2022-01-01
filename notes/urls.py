from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('archive/', views.archive, name='archive'),
    path('share/', views.share, name='note_share'),
    path('upload/', views.upload, name='upload_notes'),
    path('delete/', views.delete_notes, name="delete_notes"),
    path('getarchive/', views.get_archive, name='get_archive')
]