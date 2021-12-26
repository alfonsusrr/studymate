from django.db import models

class User(models.Model):
    email = models.Charfield(max_length=200, null=False)
    password = models.Charfield(max_length=200, null=False)
    username = models.Charfield(max_length=100, null=False)
    name = models.Charfield(max_length=200, null=False)
    date_created = models.DateTimeFielf(auto_now_add=True, null=True)

    def __str__(self):
        return f"{self.username}, {self.email}, {self.name}"

