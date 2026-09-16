from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from blood_requests.models import BloodRequest
from appointment.models import Appointment
from Donors.models import DonorProfile
from inventory.models import BloodInventory

# Create your views here.
class AnalyticsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        # Count the main records in the platform
        total_requests = BloodRequest.objects.count()

        total_appointments = Appointment.objects.count()

        total_donors = DonorProfile.objects.count()

        total_inventory_units = sum(
            item.units_available
            for item in BloodInventory.objects.all()
        )

        # Count requests by their current status
        pending_requests = BloodRequest.objects.filter(
            status = BloodRequest.Status.PENDING
        ).count()

        approved_requests = BloodRequest.objects.filter(
            status = BloodRequest.Status.APPROVED
        ).count()

        fulfilled_requests = BloodRequest.objects.filter(
            status = BloodRequest.Status.FULFILLED
        ).count()

        return Response({
            "total_requests":total_requests,
            "pending_requests":pending_requests,
            "approved_requests":approved_requests,
            "fulfilled_requests":fulfilled_requests,
            "total_appointments":total_appointments,
            "total_donors":total_donors,
            "total_inventory_units":total_inventory_units,
        })