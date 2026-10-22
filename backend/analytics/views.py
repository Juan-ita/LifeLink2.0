from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from blood_requests.models import BloodRequest
from appointment.models import Appointment
from Donors.models import DonorProfile
from inventory.models import BloodInventory


class AnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Hospital accounts should only see their own hospital's data.
        if user.role == "HOSPITAL":
            hospital = getattr(user, "hospital_profile", None)

            if hospital is None:
                return Response({
                    "total_requests": 0,
                    "pending_requests": 0,
                    "approved_requests": 0,
                    "fulfilled_requests": 0,
                    "total_appointments": 0,
                    "total_donors": 0,
                    "total_inventory_units": 0,
                })

            requests = BloodRequest.objects.filter(hospital=hospital)
            appointments = Appointment.objects.filter(hospital=hospital)
            inventory = BloodInventory.objects.filter(hospital=hospital)

        # Administrators can see platform-wide totals.
        elif user.role == "ADMIN":
            requests = BloodRequest.objects.all()
            appointments = Appointment.objects.all()
            inventory = BloodInventory.objects.all()

        # Other roles should not receive hospital-wide statistics.
        else:
            requests = BloodRequest.objects.none()
            appointments = Appointment.objects.none()
            inventory = BloodInventory.objects.none()

        total_inventory_units = sum(
            item.units_available for item in inventory
        )

        return Response({
            "total_requests": requests.count(),
            "pending_requests": requests.filter(
                status=BloodRequest.Status.PENDING
            ).count(),
            "approved_requests": requests.filter(
                status=BloodRequest.Status.APPROVED
            ).count(),
            "fulfilled_requests": requests.filter(
                status=BloodRequest.Status.FULFILLED
            ).count(),
            "total_appointments": appointments.count(),
            "total_donors": DonorProfile.objects.count(),
            "total_inventory_units": total_inventory_units,
        })
