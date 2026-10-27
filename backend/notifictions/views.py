from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action


from .models import Notification
from .serializers import NotificationSerializer
from rest_framework.exceptions import PermissionDenied

# Create your views here.
class NotificationViewSet(viewsets.ModelViewSet):

    # Use the newest notifications first
    queryset = Notification.objects.all().order_by("-created_at")

    # Convert notifications into JSON
    serializer_class = NotificationSerializer

    # Only logged-in users can access notifications
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        # Get the currently logged-in user
        user = self.request.user

        # Users can only see their own notifications
        return Notification.objects.filter(
            user=user
        ).order_by("-created_at")

    def perform_create(self, serializer):
        # Notifications are created by the system
        raise PermissionDenied(
            "Notifications are created automatically by the system."
        )


    def perform_update(self, serializer):
        # Allow users to mark only their own notifications as read.
        notification = self.get_object()

        # Save changes such as marking a notification as read
        serializer.save(user=notification.user)

    def destroy(self, request, *args, **kwargs):

        #Users should not delete system notifications
        raise PermissionDenied(
            "Notifations cannot be deleted."
        )

    @action(detail=False, methods=["post"], url_path="mark-all-read")
    def mark_all_read(self, request):
        # Mark only the logged-in user's notifications as read.
        updated_count = self.get_queryset().filter(is_read=False).update(is_read=True)
    
        return Response({
            "message": "Notifications marked as read.",
            "updated_count": updated_count
        })
