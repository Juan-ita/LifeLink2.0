from rest_framework.routers import DefaultRouter
from .views import NotificationViewSet

# Create a router for the notification API
router = DefaultRouter()

# Register notification endpoints
router.register(
    "notifications",
    NotificationViewSet,
    basename="notification",
)
urlpatterns = router.urls