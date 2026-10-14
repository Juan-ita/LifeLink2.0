from django.urls import path
from .views import DonorProfileView, DonorAvailabilityView

urlpatterns = [
    path("me/", DonorProfileView.as_view(), name="donor-profile"),
    path(
        "me/availability/",
        DonorAvailabilityView.as_view(),
        name="donor-availability",
    ),
]