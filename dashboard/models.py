from django.db import models

class Course(models.Model):
    name = models.CharField(max_length=100, null=False)
    description = models.TextField(null=False)
    image= models.CharField(max_length=200, null=True)
    ratings = models.FloatField(null=False, default=0)