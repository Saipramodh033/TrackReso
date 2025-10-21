from django.contrib import admin
from .models import Topic, Card, PeerRelationship, TopicShare, ShareAccess

@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'collapsed']
    list_filter = ['user', 'collapsed']
    search_fields = ['name', 'user__username']

@admin.register(Card)
class CardAdmin(admin.ModelAdmin):
    list_display = ['name', 'topic', 'progress', 'starred']
    list_filter = ['topic__user', 'starred', 'progress']
    search_fields = ['name', 'topic__name']

@admin.register(PeerRelationship)
class PeerRelationshipAdmin(admin.ModelAdmin):
    list_display = ['requester', 'addressee', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['requester__username', 'addressee__username']

@admin.register(TopicShare)
class TopicShareAdmin(admin.ModelAdmin):
    list_display = ['topic', 'owner', 'peer', 'permission_level', 'is_active', 'shared_at']
    list_filter = ['permission_level', 'is_active', 'shared_at']
    search_fields = ['topic__name', 'owner__username', 'peer__username']

@admin.register(ShareAccess)
class ShareAccessAdmin(admin.ModelAdmin):
    list_display = ['topic_share', 'access_type', 'accessed_at']
    list_filter = ['access_type', 'accessed_at']