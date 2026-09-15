from rest_framework.routers import DefaultRouter

from .views import AppointmentViewSet


# Create a router for the appointment API
router = DefaultRouter()

# Register the appointment endpoints
router.register(
    "appointments",
    AppointmentViewSet,
    basename="appointment",
)

urlpatterns = router.urls