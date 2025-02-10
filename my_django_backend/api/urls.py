from django.shortcuts import redirect
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import TopicViewSet, CardViewSet

router = DefaultRouter()
router.register(r'topics', TopicViewSet)
router.register(r'cards', CardViewSet)

def redirect_to_api(request):
    return redirect('/api/')  # Redirects users from / to /api/

urlpatterns = [
    path('', redirect_to_api),  # Redirect root URL to /api/
    path('', include(router.urls)),  # Remove the 'api/' prefix here
]