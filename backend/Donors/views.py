from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import DonorProfile
from .serializers import DonorProfileSerializer


class DonorProfileView(APIView):
    # Only authenticated users can access this endpoint.
    permission_classes = [IsAuthenticated]

    def get_donor_profile(self, request):
        # Only donor accounts may access donor-profile endpoints.
        if request.user.role != "DONOR":
            return None

        # Return this user's profile, never another donor's profile.
        return DonorProfile.objects.filter(user=request.user).first()

    def get(self, request):
        donor = self.get_donor_profile(request)

        if donor is None:
            return Response(
                {"error": "Donor profile not found or account is not a donor."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = DonorProfileSerializer(donor)
        return Response(serializer.data)

    def patch(self, request):
        donor = self.get_donor_profile(request)

        if donor is None:
            return Response(
                {"error": "Donor profile not found or account is not a donor."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = DonorProfileSerializer(
            donor,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )


class DonorAvailabilityView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        # Prevent non-donor accounts from changing donor availability.
        if request.user.role != "DONOR":
            return Response(
                {"error": "Only donor accounts can change availability."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Look up only the profile belonging to the authenticated user.
        donor = DonorProfile.objects.filter(user=request.user).first()

        if donor is None:
            return Response(
                {"error": "Donor profile not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Require an explicit true/false value.
        availability = request.data.get("is_available")

        if not isinstance(availability, bool):
            return Response(
                {"error": "is_available must be true or false."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        donor.is_available = availability
        donor.save(update_fields=["is_available", "updated_at"])

        return Response({
            "message": "Availability updated successfully.",
            "is_available": donor.is_available,
        })