from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TopicViewSet, CardViewSet, CreateuserView, PeerViewSet, SharedTopicViewSet, UserProfileView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'topics', TopicViewSet, basename='topic')   # /api/topics/
router.register(r'cards', CardViewSet, basename='card')       # /api/cards/
router.register(r'peers', PeerViewSet, basename='peer')       # /api/peers/
router.register(r'shared-topics', SharedTopicViewSet, basename='shared-topic')  # /api/shared-topics/

urlpatterns = [
    *router.urls,  # expands to topics/, cards/, peers/, shared-topics/, etc.
    path('user/register/', CreateuserView.as_view(), name='register'),
    path('user/profile/', UserProfileView.as_view(), name='user_profile'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api-auth/', include('rest_framework.urls')),  # optional DRF login/logout UI
]
