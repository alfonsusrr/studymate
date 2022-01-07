from django.contrib import admin
from django.urls import path, include

from . import views
urlpatterns = [
    path('preview/<id>', views.preview, name="course_preview"),
    path('search/', views.search, name="course_search"),
    path('learn/<course_id>/', views.learn, name="learn_course"),
    path('mycourse/', views.my_course, name="my_course"),
    path('new/', views.make_course, name="make_course"),
    path('enroll/<course_id>', views.enroll, name="enroll_course")
]
