from django.contrib import admin
from django.urls import path, include

from . import views
urlpatterns = [
    path('preview/<id>', views.preview, name="course_preview"),
    path('search/', views.search, name="course_search"),
    path('learn/<id>/', views.learn, name="course_learn"),
    path('mycourse/', views.my_course, name="my_course"),
    path('new/', views.make_course, name="make_course"),

]
