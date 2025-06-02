from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TopicViewSet, CardViewSet, CreateuserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'topics', TopicViewSet, basename='topic')   # /api/topics/
router.register(r'cards', CardViewSet, basename='card')       # /api/cards/

urlpatterns = [
    *router.urls,  # expands to topics/, cards/, etc.
    path('user/register/', CreateuserView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api-auth/', include('rest_framework.urls')),  # optional DRF login/logout UI
]
