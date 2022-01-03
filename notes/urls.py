from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('archive/', views.archive, name='archive'),
    path('share/', views.share, name='note_share'),
    path('upload/', views.upload, name='upload_notes'),
    path('delete/', views.delete_notes, name="delete_notes"),
    path('getarchive/', views.get_archive, name='get_archive'),
    path('view/<id>/', views.view_notes, name='view_notes'),
    path('rate/<id>/', views.rate_notes, name='rate_notes'),
    path('review/<id>/', views.review_notes, name='review_notes'),
    path('getcomments/id/<id>/', views.get_comments_by_id, name='get_comments_by_id'),
    path('votecomment/<id>/', views.vote_comment, name='vote_comment'),
    path('category/<name>/', views.category, name="category"),
    path('search/', views.search, name="search_notes")
]