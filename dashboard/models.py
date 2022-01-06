from django.db import models
from account.models import *
from studymate.storage import OverwriteStorage
from course.models import *
from django.dispatch import receiver
from django.db.models.signals import pre_save, post_delete

def get_bg_filepath(self, filename):
    extension = filename.split(".")[-1]
    date = datetime.date.today()
    return f'background/{self.user.pk}/{date.year}/{date.month}/{date.day}/{uuid.uuid4()}.{extension}'

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

@receiver(pre_save, sender=RelaxSettings)
def pre_save_notes(sender, instance, *args, **kwargs):
    try:
        old_file = instance.__class__.objects.get(id=instance.id).local_image.path
        try:
            new_file = instance.local_image.path
        except:
            new_file = None
        import os
        if os.path.exists(old_file) and new_file != old_file:
            os.remove(old_file)
    except:
        pass