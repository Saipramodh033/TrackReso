from django.db import models

class Card(models.Model):
    topic = models.ForeignKey('Topic', related_name='cards', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    resource = models.TextField(blank=True)
    note = models.TextField(blank=True)
    progress = models.IntegerField(default=0)
    starred = models.BooleanField(default=False)
    collapsed = models.BooleanField(default=True)

class Topic(models.Model):
    name = models.CharField(max_length=255)
    collapsed = models.BooleanField(default=False)

    def __str__(self):
        return self.name
