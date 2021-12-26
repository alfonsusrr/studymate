from django.db import models

class Users(models.Model):
    email = models.CharField(max_length=200, null=True)
    password = models.CharField(max_length=200, null=False)
    username = models.CharField(max_length=100, null=False)
    name = models.CharField(max_length=200, null=True)
    date_created = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return f"{self.username}, {self.email}, {self.name}"

