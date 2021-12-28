from django.db import models
from account.models import *

def get_course_banner_filepath(self, filename):
    return f'banner/{self.pk}/{"banner.png"}'

def get_default_banner_image():
    return f'banner/banner.png'

class Course(models.Model):
    name = models.CharField(max_length=100, null=False)
    description = models.TextField(null=False)
    profile_image   = models.ImageField(max_length=255, upload_to=get_course_banner_filepath, null=True, blank=True, default=get_default_banner_image())
    ratings = models.FloatField(null=False, default=0)

class UserCourse(models.Model):
    user = models.ManyToManyField(User, related_name="course")
    course = models.ManyToManyField(Course, related_name="user")
    rate = models.IntegerField(default=0)
    progress = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)

class RelaxSettings(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="relax_settings")
    
class MusicLinks(models.Model):
    owner = models.ForeignKey(RelaxSettings, on_delete=models.CASCADE, related_name="music")
    link = models.CharField(max_length=500, null=False)

class RelaxText(models.Model):
    owner = models.ForeignKey(RelaxSettings, on_delete=models.CASCADE, related_name="text")
    text =  models.CharField(max_length=200, null=False)
