from django.db import models
from account.models import *
from studymate.storage import OverwriteStorage
import uuid
import datetime

def get_course_banner_filepath(self, filename):
    extension = filename.split(".")[-1]
    date = datetime.date.today()
    return f'course/banner/{date.year}/{date.month}/{date.day}/{uuid.uuid4()}.{extension}'

def get_default_banner_image():
    return f'course/banner/banner.jpg'

def get_course_instructor_filepath(self, filename):
    extension = filename.split(".")[-1]
    date = datetime.date.today()
    return f'profile_images/instructor/{date.year}/{date.month}/{date.day}/{uuid.uuid4()}.{extension}'

def get_default_instructor_image():
    return f'profile_images/profile.jpg'

class CourseCategory(models.Model):
    name = models.CharField(max_length=50, blank=False)

class CourseInstructor(models.Model):
    name = models.CharField(max_length=200, null=False)
    profile_image = models.ImageField(max_length=255, storage=OverwriteStorage(), upload_to=get_course_instructor_filepath, default=get_default_instructor_image())

class Course(models.Model):
    name = models.CharField(max_length=200, null=False)
    description = models.TextField(null=False)
    banner_image   = models.ImageField(max_length=255, storage=OverwriteStorage(), upload_to=get_course_banner_filepath, default=get_default_banner_image())
    categories = models.ManyToManyField(CourseCategory, related_name="courses")
    overall_ratings = models.FloatField(default=0)
    instructors = models.ManyToManyField(CourseInstructor, related_name="course")

class UserCourse(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="course")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="user")
    rate = models.IntegerField(default=0)
    course_progress = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)
    start_date = models.DateTimeField(auto_now_add=True)
    complete_date = models.DateTimeField(null=True)

class CourseContentGroup(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="content_group")
    order = models.PositiveIntegerField()
    title = models.CharField(max_length=200, blank=False)

class CourseContent(models.Model):
    content_group = models.ForeignKey(CourseContentGroup, on_delete=models.CASCADE, related_name="contents")
    title = models.CharField(max_length=200, default="")
    order = models.PositiveIntegerField()
    is_video = models.BooleanField(default=False)
    updated = models.DateTimeField(auto_now=True)
    video_link = models.CharField(max_length=200, null=True)
    content = models.TextField(default="")

class CourseUserProgress(models.Model):
    info = models.ForeignKey(UserCourse, on_delete=models.CASCADE, related_name="progress") 
    last_content_group = models.PositiveIntegerField(default=1)
    last_content = models.PositiveIntegerField(default=1)
