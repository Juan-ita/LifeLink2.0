from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Notification
from .serializers import NotificationSerializers

# Create your views here.
class NotificationViewSet(viewsets.ModelViewSet):

    # Use the newest notifications first
    queryset = Notification.objects.all().order_by("-created_at")

    # Convert notifications into JSON
    serializer_class = NotificationSerializers

    # Only logged-in users can access notifications
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        # Get the currently logged-in user
        user = self.request.user

        # Users can only see their own notifications
        return Notification.objects.filter(
            user=user
        ).order_by("-created_at")

    def perform_update(self, serializer):

        # Save changes such as marking a notification as read
        serializer.save()
