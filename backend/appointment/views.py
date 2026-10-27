from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Appointment
from .serializers import AppointmentSerializer
from .permissions import IsHospitalOrDonor
from notifictions.models import Notification


class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [IsHospitalOrDonor]

    def get_queryset(self):
        # Hospitals see their own appointments; donors see their bookings.
        user = self.request.user

        if user.role == "HOSPITAL":
            return Appointment.objects.filter(
                hospital__user=user
            ).order_by("-created_at")

        if user.role == "DONOR":
            return Appointment.objects.filter(
                donor__user=user
            ).order_by("-created_at")

        return Appointment.objects.none()

    def perform_create(self, serializer):
        # Every new booking must wait for hospital approval.
        appointment = serializer.save(
            status=Appointment.Status.PENDING
        )

        # Notify the donor that their booking was received.
        Notification.objects.create(
            user=appointment.donor.user,
            message=(
                f"Your appointment booking with "
                f"{appointment.hospital.hospital_name} "
                f"is awaiting approval."
            ),
            notification_type=Notification.NotificationType.APPOINTMENT,
        )

    @action(detail=True, methods=["post"], permission_classes=[IsHospitalOrDonor])
    def approve(self, request, pk=None):
        # Only the hospital assigned to this appointment may approve it.
        appointment = self.get_object()

        if request.user.role != "HOSPITAL":
            return Response(
                {"detail": "Only hospitals can approve appointments."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if appointment.status != Appointment.Status.PENDING:
            return Response(
                {"detail": "Only pending appointments can be approved."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        appointment.status = Appointment.Status.SCHEDULED
        appointment.save(update_fields=["status", "updated_at"])

        Notification.objects.create(
            user=appointment.donor.user,
            message=(
                f"Your appointment with "
                f"{appointment.hospital.hospital_name} "
                f"has been approved and scheduled."
            ),
            notification_type=Notification.NotificationType.APPOINTMENT,
        )

        return Response(AppointmentSerializer(appointment).data)

    @action(detail=True, methods=["post"], permission_classes=[IsHospitalOrDonor])
    def reject(self, request, pk=None):
        # Only the hospital assigned to this appointment may reject it.
        appointment = self.get_object()

        if request.user.role != "HOSPITAL":
            return Response(
                {"detail": "Only hospitals can reject appointments."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if appointment.status != Appointment.Status.PENDING:
            return Response(
                {"detail": "Only pending appointments can be rejected."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        appointment.status = Appointment.Status.CANCELLED
        appointment.save(update_fields=["status", "updated_at"])

        Notification.objects.create(
            user=appointment.donor.user,
            message=(
                f"Your appointment booking with "
                f"{appointment.hospital.hospital_name} "
                f"was declined by the hospital."
            ),
            notification_type=Notification.NotificationType.APPOINTMENT,
        )

        return Response(AppointmentSerializer(appointment).data)

