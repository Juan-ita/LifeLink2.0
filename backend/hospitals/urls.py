from django.urls import path
from .views import HospitalRegisterView

urlpatterns = [
    path(
        "hospital-register/",
        HospitalRegisterView.as_view(),
        name="hospital-register",
    ),
]