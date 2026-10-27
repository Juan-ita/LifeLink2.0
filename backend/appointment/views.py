from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from .models import Appointment
from .serializers import AppointmentSerializer
from .permissions import IsHospitalOrDonor

from notifictions.models import Notification

class AppointmentViewSet(viewsets.ModelViewSet):
  # Use the serializer that converts appointments to and from JSON.
  queryset = Appointment.objects.all().order_by("-created_at")
  serializer_class = AppointmentSerializer
  permission_classes = [IsHospitalOrDonor]
  
  
  def get_queryset(self):
      # Restrict results to appointments belonging to the logged-in user.
      user = self.request.user
  
      if user.role == "HOSPITAL":
          # HospitalProfile is linked to appointments through hospital.
          # Confirm the actual user relationship in your HospitalProfile model.
          return Appointment.objects.filter(
              hospital__hospital_user=user
          ).order_by("-created_at")
  
      if user.role == "DONOR":
          return Appointment.objects.filter(
              donor__user=user
          ).order_by("-created_at")
  
      return Appointment.objects.none()
  
  def perform_create(self, serializer):
      # New appointments should wait for hospital approval.
      appointment = serializer.save(
          status=Appointment.Status.PENDING
      )
  
      # Notify the donor that their booking is
  