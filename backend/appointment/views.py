from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Appointment
from .serializers import AppointmentSerializer
from .permissions import IsHospitalOrDonor

from notifictions.models import Notification


class AppointmentViewSet(viewsets.ModelViewSet):

    # Get appointments with the newest ones first
    queryset = Appointment.objects.all().order_by("-created_at")

    # Tell Django which serializer to use
    serializer_class = AppointmentSerializer

    # Only logged-in users can access appointments
    permission_classes = [IsHospitalOrDonor]

    def get_queryset(self):

        # Get the current logged in user
        user = self.request.user

        # Hospital users can see all appointments
        if user.role == "HOSPITAL":
            return Appointment.objects.all().order_by("-created__at")

        # Donor can only see their own appointments
        if user.role == "DONOR":
            return Appointment.objects.filter(
                donor__user=user
            ).order_by("-created_at")

        # Other roles should see nothing
        return Appointment.objects.none()

    def perform_create(self, serializer):

        # Save the new appointment
        appointment = serializer.save()

        # Get the donor who is attending
        donor = appointment.donor

        # Create a notification for the donor
        Notification.objects.create(
            user = donor.user,
            notification_type = Notification.NotificationType.APPOINTMENT,
            message = (
                f"You have a new blood donation appointment at"
                f"{appointment.hospital.hospital_name}"
            )
        )