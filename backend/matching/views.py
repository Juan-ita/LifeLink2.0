from django.shortcuts import render
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from Donors.models import DonorProfile
from blood_requests.models import BloodRequest

# Create your views here.
class DonorMatchingView(APIView):
    # Only login users can access donor matching
    permission_classes = [IsAuthenticated]

    def get(self, request, request_id):
        # Find the blood request we want to match donor for
        blood_request = BloodRequest.objects.get(id=request_id)

        #Get today's date so we can check donor eligibility
        today = timezone.now().date()

        # Find donors who:
        # 1. Have the required blood group
        # 2. Are currently available
        # 3. Have no future eligibility date

        matching_donors = DonorProfile.objects.filter(
            blood_group = blood_request.blood_group,
            is_available=True,
        ).filter(
             # Donors with no eligibility date are considered eligible
            # or donors whose eligibility date has already passed

            next_eligible_date__isnull = True
        ) | DonorProfile.objects.filter(
            blood_group=blood_request.blood_group,
            is_available=True,
            next_eligible_date__lte=today,
        )

        # Prepare the donor information for API response
        results = []

        for donor in matching_donors.distinct():
            results.append({
                'id':donor.id,
                "username":donor.user.username,
                "blood_group":donor.blood_group,
                "phone":donor.phone,
                "is_available":donor.is_available
            })

        # Return matching donor
        return Response({
            "blood_request":blood_request.id,
            "matches":results,
            "total_matches":len(results),
        })
