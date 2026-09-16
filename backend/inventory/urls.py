from rest_framework.routers import DefaultRouter
from .views import BloodInventoryViewset

router = DefaultRouter()

router.register(
    "inventory",
    BloodInventoryViewset,
    basename="blood-inventory",
)

urlpatterns = router.urls