from django.db import models
from account.models import *
from studymate.storage import OverwriteStorage

def get_course_banner_filepath(self, filename):
    return f'banner/{self.pk}/{"banner.png"}'

def get_default_banner_image():
    return f'banner/banner.png'

def get_bg_filepath(self, filename):
    return f'background/{self.user.pk}/bg.png'

class Course(models.Model):
    name = models.CharField(max_length=100, null=False)
    description = models.TextField(null=False)
    profile_image   = models.ImageField(max_length=255, storage=OverwriteStorage(), upload_to=get_course_banner_filepath, null=True, blank=True, default=get_default_banner_image())
    ratings = models.FloatField(null=False, default=0)

class UserCourse(models.Model):
    user = models.ManyToManyField(User, related_name="course")
    course = models.ManyToManyField(Course, related_name="user")
    rate = models.IntegerField(default=0)
    progress = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)

class RelaxSettings(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="relax_settings")
    link_image = models.CharField(max_length=500, null=True)
    local_image = models.ImageField(max_length=255, storage=OverwriteStorage(), upload_to=get_bg_filepath, null=True, blank=True)
    use_default_image = models.BooleanField(default=True)
    use_default_music = models.BooleanField(default=True)
    use_default_text = models.BooleanField(default=True)
    
class MusicLinks(models.Model):
    owner = models.ForeignKey(RelaxSettings, on_delete=models.CASCADE, related_name="music")
    link = models.CharField(max_length=500, null=False)

class RelaxText(models.Model):
    owner = models.ForeignKey(RelaxSettings, on_delete=models.CASCADE, related_name="text")
    text =  models.CharField(max_length=200, null=False)

class Agenda(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="agenda")
    title = models.CharField(max_length=200, null=False)
    due = models.DateField()
    completed = models.BooleanField(default=False)