from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Appointment
from .serializers import AppointmentSerializer
from .permissions import IsHospitalUser


class AppointmentViewSet(viewsets.ModelViewSet):

    # Get appointments with the newest ones first
    queryset = Appointment.objects.all().order_by("-created_at")

    # Tell Django which serializer to use
    serializer_class = AppointmentSerializer

    # Only logged-in users can access appointments
    permission_classes = [IsHospitalUser]