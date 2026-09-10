from rest_framework.routers import DefaultRouter
from .views import bloodRequestViewSet

# Create a router for our blood request API
router = DefaultRouter

# Register the BloodRequest endpoints
router.register(
    "blood-requests",
    bloodRequestViewSet,
    basename="blood-request",
)

urlpatterna = router.urls