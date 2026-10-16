from datetime import date, timedelta

from django.test import TestCase
from django.urls import reverse
from django.utils import timezone

from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from users.models import User
from Donors.models import DonorProfile
from hospitals.models import HospitalProfile
from blood_requests.models import BloodRequest

from matching.views import calculate_distance


class DonorMatchingTests(TestCase):
    def setUp(self):
        # Create a verified hospital account.
        self.hospital_user = User.objects.create_user(
            username="test_hospital",
            email="hospital@example.com",
            password="TestPassword123!",
            role=User.Role.HOSPITAL,
        )

        self.hospital = HospitalProfile.objects.create(
            user=self.hospital_user,
            hospital_name="Test Hospital",
            registration_number="TEST-001",
            email="hospital@example.com",
            address="Nairobi",
            latitude=-1.2864,
            longitude=36.8172,
            is_verified=True,
        )

        # Create a second hospital to test request ownership.
        self.other_hospital_user = User.objects.create_user(
            username="other_hospital",
            email="otherhospital@example.com",
            password="TestPassword123!",
            role=User.Role.HOSPITAL,
        )

        self.other_hospital = HospitalProfile.objects.create(
            user=self.other_hospital_user,
            hospital_name="Other Hospital",
            registration_number="TEST-002",
            email="otherhospital@example.com",
            address="Nairobi",
            latitude=-1.2921,
            longitude=36.8219,
            is_verified=True,
        )

        # Create a blood request owned by the first hospital.
        self.blood_request = BloodRequest.objects.create(
            hospital=self.hospital,
            blood_group="A+",
            units_required=2,
            urgency=BloodRequest.Urgency.NORMAL,
            status=BloodRequest.Status.PENDING,
            reason="Emergency blood requirement",
        )

        # Create the donor API client.
        self.client = APIClient()

    def create_donor(
        self,
        username,
        blood_group,
        is_available=True,
        next_eligible_date=None,
        latitude=-1.2870,
        longitude=36.8180,
    ):
        # Create the user account associated with a donor.
        user = User.objects.create_user(
            username=username,
            email=f"{username}@example.com",
            password="TestPassword123!",
            role=User.Role.DONOR,
            phone="0712345678",
        )

        # Create the donor's profile.
        return DonorProfile.objects.create(
            user=user,
            blood_group=blood_group,
            date_of_birth=date(1998, 1, 1),
            phone="0712345678",
            latitude=latitude,
            longitude=longitude,
            is_available=is_available,
            next_eligible_date=next_eligible_date,
        )

    def authenticate_as_hospital(self, user=None):
        # Authenticate using a JWT access token.
        user = user or self.hospital_user
        token = RefreshToken.for_user(user).access_token
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {token}"
        )

    def matching_url(self):
        # Use the URL name configured in matching/urls.py.
        return reverse(
            "donor-matches",
            kwargs={"request_id": self.blood_request.id},
        )

    def test_matching_returns_compatible_available_donors(self):
        # A+ recipients can potentially match with A+, A-, O+, and O- donors.
        compatible_donor = self.create_donor(
            "compatible_donor",
            "O+",
        )

        # B+ is not in the configured compatibility list for A+.
        self.create_donor("incompatible_donor", "B+")

        self.authenticate_as_hospital()
        response = self.client.get(self.matching_url())

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["total_matches"], 1)
        self.assertEqual(
            response.data["matches"][0]["id"],
            compatible_donor.id,
        )

    def test_unavailable_donors_are_excluded(self):
        self.create_donor(
            "unavailable_donor",
            "A+",
            is_available=False,
        )

        self.authenticate_as_hospital()
        response = self.client.get(self.matching_url())

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["total_matches"], 0)

    def test_donors_with_future_eligibility_dates_are_excluded(self):
        self.create_donor(
            "not_yet_eligible",
            "A+",
            next_eligible_date=timezone.now().date() + timedelta(days=30),
        )

        self.authenticate_as_hospital()
        response = self.client.get(self.matching_url())

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["total_matches"], 0)

    def test_donors_whose_eligibility_date_has_arrived_are_included(self):
        eligible_donor = self.create_donor(
            "eligible_donor",
            "A+",
            next_eligible_date=timezone.now().date(),
        )

        self.authenticate_as_hospital()
        response = self.client.get(self.matching_url())

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["total_matches"], 1)
        self.assertEqual(
            response.data["matches"][0]["id"],
            eligible_donor.id,
        )

    def test_unverified_hospital_cannot_view_matches(self):
        self.hospital.is_verified = False
        self.hospital.save()

        self.authenticate_as_hospital()
        response = self.client.get(self.matching_url())

        self.assertEqual(response.status_code, 403)

    def test_hospital_cannot_view_another_hospitals_matches(self):
        other_request = BloodRequest.objects.create(
            hospital=self.other_hospital,
            blood_group="A+",
            units_required=1,
            urgency=BloodRequest.Urgency.NORMAL,
            status=BloodRequest.Status.PENDING,
            reason="Another hospital's request",
        )

        self.authenticate_as_hospital()

        response = self.client.get(
            reverse(
                "donor-matches",
                kwargs={"request_id": other_request.id},
            )
        )

        self.assertEqual(response.status_code, 403)

    def test_donor_account_cannot_view_matching_results(self):
        donor_user = User.objects.create_user(
            username="ordinary_donor",
            email="ordinarydonor@example.com",
            password="TestPassword123!",
            role=User.Role.DONOR,
        )

        self.authenticate_as_hospital(user=donor_user)
        response = self.client.get(self.matching_url())

        self.assertEqual(response.status_code, 403)

    def test_distance_calculation_returns_zero_for_same_coordinates(self):
        distance = calculate_distance(
            -1.2864,
            36.8172,
            -1.2864,
            36.8172,
        )

        self.assertAlmostEqual(distance, 0.0, places=5)

    def test_distant_donors_outside_search_radius_are_excluded(self):
        # These coordinates are far from the test hospital.
        self.create_donor(
            "distant_donor",
            "A+",
            latitude=-4.0435,
            longitude=39.6682,
        )

        self.authenticate_as_hospital()
        response = self.client.get(self.matching_url())

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["total_matches"], 0)
