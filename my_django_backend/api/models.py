from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

class Topic(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_index=True)  # Index for user filtering
    name = models.CharField(max_length=255, db_index=True)  # Index for search/sorting
    collapsed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)  # Index for ordering
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),  # Composite index for user topics by date
            models.Index(fields=['user', 'name']),  # Composite index for user topics by name
        ]

    def __str__(self):
        return self.name

class Card(models.Model):
    topic = models.ForeignKey('Topic', related_name='cards', on_delete=models.CASCADE, db_index=True)
    name = models.CharField(max_length=255, db_index=True)  # Index for search
    resource = models.TextField(blank=True)
    note = models.TextField(blank=True)
    progress = models.IntegerField(default=0, db_index=True)  # Index for filtering by progress
    starred = models.BooleanField(default=False, db_index=True)  # Index for filtering starred
    collapsed = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['topic', 'starred']),  # For filtering starred cards by topic
            models.Index(fields=['topic', 'progress']),  # For filtering by progress within topic
            models.Index(fields=['topic', '-created_at']),  # For topic cards by date
        ]

    def __str__(self):
        return f"{self.name} ({self.topic.name})"

class PeerRelationship(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('blocked', 'Blocked'),
    ]
    
    requester = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_peer_requests', db_index=True)
    addressee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_peer_requests', db_index=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending', db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('requester', 'addressee')
        indexes = [
            models.Index(fields=['requester', 'status']),  # For requester's relationships by status
            models.Index(fields=['addressee', 'status']),  # For addressee's relationships by status
            models.Index(fields=['status', '-created_at']),  # For pending requests by date
        ]
    
    def clean(self):
        if self.requester == self.addressee:
            raise ValidationError("Users cannot add themselves as peers")
    
    def __str__(self):
        return f"{self.requester.username} -> {self.addressee.username} ({self.status})"

class TopicShare(models.Model):
    PERMISSION_CHOICES = [
        ('read_only', 'Read Only'),
    ]
    
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='shares', db_index=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_shares', db_index=True)
    peer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='peer_shares', db_index=True)
    permission_level = models.CharField(max_length=20, choices=PERMISSION_CHOICES, default='read_only')
    shared_at = models.DateTimeField(auto_now_add=True, db_index=True)
    is_active = models.BooleanField(default=True, db_index=True)
    
    class Meta:
        unique_together = ('topic', 'peer')
        indexes = [
            models.Index(fields=['peer', 'is_active']),  # For peer's active shares
            models.Index(fields=['owner', '-shared_at']),  # For owner's shares by date
            models.Index(fields=['topic', 'is_active']),  # For active shares of a topic
        ]
    
    def clean(self):
        if self.topic.user != self.owner:
            raise ValidationError("Only topic owner can share topics")
        if self.owner == self.peer:
            raise ValidationError("Cannot share topic with yourself")
    
    def __str__(self):
        return f"{self.topic.name} shared with {self.peer.username}"

class ShareAccess(models.Model):
    ACCESS_TYPE_CHOICES = [
        ('view_topic', 'View Topic'),
        ('view_card', 'View Card'),
    ]
    
    topic_share = models.ForeignKey(TopicShare, on_delete=models.CASCADE, related_name='access_logs')
    accessed_at = models.DateTimeField(auto_now_add=True)
    access_type = models.CharField(max_length=20, choices=ACCESS_TYPE_CHOICES, default='view_topic')
    
    def __str__(self):
        return f"{self.topic_share.peer.username} accessed {self.topic_share.topic.name}"
