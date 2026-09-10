from rest_framework.routers import DefaultRouter
from .views import BloodRequestViewSet

# Create a router for our blood request API
router = DefaultRouter()

# Register the BloodRequest endpoints
router.register(
    "blood-requests",
    BloodRequestViewSet,
    basename="blood-request",
)

urlpatterns = router.urls