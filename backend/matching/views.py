from django.shortcuts import render
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from math import radians, sin, cos, sqrt, atan2

from Donors.models import DonorProfile
from blood_requests.models import BloodRequest

# Define which donor blood groups can potentially match each recipient group.
# These are used only for platform matching and do not replace
# medical screening by qualified healthcare professionals.
BLOOD_COMPATIBILITY = {
    "O-": ["O-"],
    "O+": ["O-", "O+"],
    "A-": ["O-", "A-"],
    "A+": ["O-", "O+", "A-", "A+"],
    "B-": ["O-", "B-"],
    "B+": ["O-", "O+", "B-", "B+"],
    "AB-": ["O-", "A-", "B-", "AB-"],
    "AB+": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
}

#Haversine formula.
def claculate_distance(lat1, lon1, lat2, lon2):

    # Radius of earth in km
    earth_radius = 6371

    # Donor (lat1, lon2) Hospital (lat2, lon2)

    # covert lat and long from degrees to radiants
    lat1 = radians(lat1)
    lat2 = radians(lat2)
    lon1 = radians(lon1)
    lon2 = radians(lon2)

    # Difference between the coordinates (distance between the donor and the hospital)
    dlat = lat2 - lat1
    dlon = lon2 - lon1

    # Haversine formula
    a = (sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon /2) ** 2)

    c = 2 * atan2(sqrt(a), sqrt(1-a))

    return earth_radius * c


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

        # Get the blood groups that can potentially match this request
        compatible_groups = BLOOD_COMPATIBILITY.get(
            blood_request.blood_group,
            []
        )

        # Find available donor whose blood group is compatible
        matching_donors = DonorProfile.objects.filter(
            blood_group__in = compatible_groups,
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

            # Calculate the donor's distance from the hospital
            distance = None

            # Only calculate didtance when both Locations are available
            if(
                donor.latitude is not None
                and donor.longitude is not None
                and blood_request.hospital.latitude is not None
                and blood_request.hospital.longitude is not None
            ):
                distance = claculate_distance(
                    donor.latitude,
                    donor.longitude,
                    blood_request.hospital.latitude,
                    blood_request.hospital.longitude,
                )

            # Start the donor's score at zero
            score = 0

            # Give compatible donor 40 points
            # Exact blood group gets the full compatibility score
            if donor.blood_group == blood_request.blood_group:
                score += 40
            else:
                score +=30 

            # Give available donor 20 points
            if donor.is_available:
                score += 20

            # Give eligible donors 20 points
            score += 0

            # Add the donor and their score to the results
            results.append({
                'id':donor.id,
                "username":donor.user.username,
                "blood_group":donor.blood_group,
                "phone":donor.phone,
                "is_available":donor.is_available,
                "match_score":score,
                "distance_km": round(distance, 2) if distance is not None else None,
            })

        # Return matching donor
        return Response({
            "blood_request":blood_request.id,
            "matches":results,
            "total_matches":len(results),
        })
