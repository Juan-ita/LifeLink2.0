from math import radians, sin, cos, sqrt, atan2

from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from Donors.models import DonorProfile
from blood_requests.models import BloodRequest
from users.models import User


# Potential blood-group compatibility for initial donor matching.
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


def calculate_distance(lat1, lon1, lat2, lon2):
    """
    Calculate the approximate distance in kilometres between
    two latitude/longitude coordinates using the Haversine formula.
    """
    earth_radius_km = 6371

    # Convert coordinates from degrees to radians.
    lat1 = radians(lat1)
    lon1 = radians(lon1)
    lat2 = radians(lat2)
    lon2 = radians(lon2)

    # Calculate the differences between the coordinates.
    dlat = lat2 - lat1
    dlon = lon2 - lon1

    # Apply the Haversine formula.
    a = (
        sin(dlat / 2) ** 2
        + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    )

    # Protect against tiny floating-point errors.
    a = max(0.0, min(1.0, a))

    central_angle = 2 * atan2(sqrt(a), sqrt(1 - a))

    return earth_radius_km * central_angle


class DonorMatchingView(APIView):
    """
    Return potential donor matches for a blood request.

    Only the hospital responsible for the request, or an administrator,
    can access its matching results.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, request_id):
        user = request.user

        # Only hospital accounts and administrators can view matches.
        if user.role not in [User.Role.HOSPITAL, User.Role.ADMIN]:
            return Response(
                {
                    "detail": (
                        "Only hospital accounts can view donor matches."
                    )
                },
                status=403,
            )

        # Safely retrieve the blood request.
        blood_request = get_object_or_404(
            BloodRequest.objects.select_related("hospital__user"),
            id=request_id,
        )

        # Verify that a hospital can only access its own requests.
        if user.role == User.Role.HOSPITAL:
            hospital_profile = getattr(user, "hospital_profile", None)

            if hospital_profile is None:
                return Response(
                    {"detail": "No hospital profile was found."},
                    status=403,
                )

            if not hospital_profile.is_verified:
                return Response(
                    {"detail": "Your hospital account is not verified."},
                    status=403,
                )

            if blood_request.hospital_id != hospital_profile.id:
                return Response(
                    {
                        "detail": (
                            "You can only view matches for your "
                            "own hospital's requests."
                        )
                    },
                    status=403,
                )

        # Work out which blood groups may be compatible with the request.
        compatible_groups = BLOOD_COMPATIBILITY.get(
            blood_request.blood_group,
            [],
        )

        if not compatible_groups:
            return Response(
                {
                    "blood_request": blood_request.id,
                    "matches": [],
                    "total_matches": 0,
                    "message": "No compatible blood groups were configured.",
                }
            )

        today = timezone.now().date()

        # Keep donors who are available and whose next eligibility date is either unknown or has already arrived.
        # The healthcare team must still confirm donor eligibility.
        matching_donors = (
            DonorProfile.objects.filter(
                blood_group__in=compatible_groups,
                is_available=True,
            )
            # Find donors whose next eligible date has not been recorded.
            .filter(
                Q(next_eligible_date__isnull=True)
                | Q(next_eligible_date__lte=today)
            )
            .select_related("user")
        )

        # The planned search radius depends on request urgency.
        # These are configurable product defaults
        search_radius_km = {
            BloodRequest.Urgency.NORMAL: 20,
            BloodRequest.Urgency.URGENT: 50,
            BloodRequest.Urgency.CRITICAL: 100,
        }.get(blood_request.urgency, 20)

        results = []

        for donor in matching_donors:
            distance = None

            # Calculate distance only when both parties have coordinates.
            if (
                donor.latitude is not None
                and donor.longitude is not None
                and blood_request.hospital.latitude is not None
                and blood_request.hospital.longitude is not None
            ):
                distance = calculate_distance(
                    donor.latitude,
                    donor.longitude,
                    blood_request.hospital.latitude,
                    blood_request.hospital.longitude,
                )

            # If we know a donor is outside the search radius, skip them.
            # Donors without coordinates remain visible but receive no
            # distance points until their location is available.
            if distance is not None and distance > search_radius_km:
                continue

            # Compatibility points: exact group gets the highest score.
            compatibility_score = (
                40
                if donor.blood_group == blood_request.blood_group
                else 30
            )

            # Availability points: only available donors reach this stage.
            availability_score = 15

            # Eligibility-date points: the date filter has passed.
            eligibility_score = 10

            # Distance points: closer donors rank higher.
            if distance is None:
                distance_score = 0
            elif distance <= search_radius_km * 0.25:
                distance_score = 25
            elif distance <= search_radius_km * 0.50:
                distance_score = 20
            else:
                distance_score = 10

            match_score = (
                compatibility_score
                + availability_score
                + eligibility_score
                + distance_score
            )

            results.append(
                {
                    "id": donor.id,
                    "username": donor.user.username,
                    "blood_group": donor.blood_group,
                    "phone": donor.phone,
                    "is_available": donor.is_available,
                    "match_score": match_score,
                    "distance_km": (
                        round(distance, 2)
                        if distance is not None
                        else None
                    ),
                }
            )

        # Sort by highest score first.
        # For equal scores, prefer donors with known, shorter distances.
        results.sort(
            key=lambda donor: (
                -donor["match_score"],
                donor["distance_km"] is None,
                (
                    donor["distance_km"]
                    if donor["distance_km"] is not None
                    else float("inf")
                ),
            )
        )

        return Response(
            {
                "blood_request": blood_request.id,
                "urgency": blood_request.urgency,
                "search_radius_km": search_radius_km,
                "matches": results,
                "total_matches": len(results),
            }
        )
