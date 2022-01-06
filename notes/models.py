from os import name
from django.db import models
from django.db.models.aggregates import Count
from django.db.models.deletion import CASCADE
from account.models import *
from django.dispatch import receiver
from django.db.models.signals import pre_save, post_delete
from studymate.storage import OverwriteStorage
import datetime
import uuid

def get_note_filepath(self, filename):
    extension = filename.split(".")[-1]
    date = datetime.date.today()
    return f'notes/file/{self.owner.pk}/{date.year}/{date.month}/{date.day}/{uuid.uuid4()}.{extension}'

def get_note_thumbnail_filepath(self, filename):
    extension = filename.split(".")[-1]
    date = datetime.date.today()
    return f'notes/thumbnail/{self.owner.pk}/{date.year}/{date.month}/{date.day}/{uuid.uuid4()}.{extension}'

def get_default_note_thumbnail():
    return f'notes/thumbnail.jpg' 

class NotesCategory(models.Model):
    name        = models.CharField(max_length=50, blank=False, unique=True)

class Notes(models.Model):
    title           = models.CharField(max_length=200, null=False)
    description     = models.TextField(null=True)
    owner           = models.ForeignKey(User, on_delete=CASCADE, related_name="notes")
    file            = models.FileField(upload_to=get_note_filepath, blank=False)
    uploaded_on     = models.DateTimeField(auto_now=True)
    thumbnail       = models.ImageField(upload_to=get_note_thumbnail_filepath,storage=OverwriteStorage, default=get_default_note_thumbnail())
    categories      = models.ManyToManyField(NotesCategory, related_name="notes")
    is_private      = models.BooleanField(default=False)
    overall_rating  = models.FloatField(default=0)


class NotesRating(models.Model):
    user            = models.ForeignKey(User, on_delete=CASCADE, related_name="notes_rating")
    note            = models.ForeignKey(Notes, on_delete=CASCADE, related_name="ratings")
    rating          = models.PositiveIntegerField(blank=False)
    review          = models.TextField(blank=True)
    last_modified   = models.DateTimeField(auto_now_add=True)
    votes_total     = models.IntegerField(default=0)

class NotesRatingVotes(models.Model):
    notes_rating    = models.ForeignKey(NotesRating, on_delete=CASCADE, related_name="votes")
    owner           = models.ForeignKey(User, on_delete=CASCADE, related_name="rating_votes")
    value           = models.IntegerField(blank=False)

class NotesDiscussion(models.Model):
    user           = models.ForeignKey(User, on_delete=CASCADE, related_name="notes_discussion")
    note           = models.ForeignKey(Notes, on_delete=CASCADE, related_name="discussion")
    comment        = models.TextField(null=False)
    parent         = models.ForeignKey("self", on_delete=CASCADE, blank=True, null=True, related_name="comment_parent")

@receiver(pre_save, sender=Notes)
def pre_save_notes(sender, instance, *args, **kwargs):
    try:
        old_file = instance.__class__.objects.get(id=instance.id).file.path
        old_thumb = instance.__class__.objects.get(id=instance.id).thumbnail.path
        try:
            new_file = instance.file.path
        except:
            new_file = None

        try:
            new_thumb = instance.thumbnail.path
        except:
            new_thumb = None
            
        import os
        if os.path.exists(old_file) and new_file != old_file and new_file != None:
            os.remove(old_file)

        if os.path.exists(old_thumb) and new_thumb != old_thumb and new_thumb != None:
            os.remove(old_file)
    except:
        pass

@receiver(post_delete, sender=Notes)
def post_delete_notes(sender, instance, *args, **kwargs):
    try:
        old_file = instance.file.path
        import os
        if os.path.exists(old_file):
            os.remove(old_file)
    except:
        pass

    try:
        old_thumb = instance.thumbnail.path
        import os
        if os.path.exists(old_thumb):
            os.remove(old_thumb)
    except:
        pass


