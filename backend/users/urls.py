from django.urls import path
from .views import CurrentUserView, RegisterView

urlpatterns = [
    path("me/", CurrentUserView.as_view(), name="current-user"),

     # Register a new donor account.
    path("register/", RegisterView.as_view(), name="register"),
]