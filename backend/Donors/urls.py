from django.urls import path
from .views import DonorProfileView, DonorAvailabilityView, HospitalDonorListView

urlpatterns = [
    path("me/", DonorProfileView.as_view(), name="donor-profile"),
    path(
        "me/availability/",
        DonorAvailabilityView.as_view(),
        name="donor-availability",
    ),
    path("directory/", HospitalDonorListView.as_view(), name="hospital-donor-directory"),
]