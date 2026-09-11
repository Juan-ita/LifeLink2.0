from django.urls import path
from .views import DonorMatchingView

urlpatterns = [
    path("blood-requests/<int:request_id>/matches/",
          DonorMatchingView.as_view(), name="donor-matches",)
]