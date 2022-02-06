from django.contrib import admin
from django.urls import path, include

from . import views
urlpatterns = [
    path('preview/<id>', views.preview, name="course_preview"),
    path('search/info/', views.search_info, name="search_info"),
    path('search/', views.search, name="course_search"),
    path('learn/<course_id>/', views.learn, name="learn_course"),
    path('mycourse/', views.my_course, name="my_course"),
    path('new/', views.make_course, name="make_course"),
    path('enroll/<course_id>', views.enroll, name="enroll_course"),
    path('unenroll/', views.unenroll, name="unenroll_course"),
    path('upload/image/', views.upload_image, name="upload_image"),
    path('markdown/', views.markdown, name="markdown"),
    path('info/', views.getCourseInfo, name="get_course_info"),
    path('info/progress/', views.getUserCourseInfo, name="get_user_course_info"),
    path('complete/content/', views.completeContent, name="complete_content"),
    path('set/lastview', views.setLastViewed, name="set_last_viewed"),
    path('complete/validate/', views.validateCompletion, name="validate_completion")
]
