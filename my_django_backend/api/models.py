from django.db import models
from django.contrib.auth.models import User

class Topic(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Link topic to user
    name = models.CharField(max_length=255)
    collapsed = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class Card(models.Model):
    topic = models.ForeignKey('Topic', related_name='cards', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    resource = models.TextField(blank=True)
    note = models.TextField(blank=True)
    progress = models.IntegerField(default=0)
    starred = models.BooleanField(default=False)
    collapsed = models.BooleanField(default=True)
