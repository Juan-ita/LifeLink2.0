from datetime import date

from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status

from .models import DonorProfile

User = get_user_model()

class DonorProfileAPITests(APITestCase):

    def setUp(self):
        # Create a donor account for testing.
        self.donor_user = User.objects.create_user(
            username='testdonor',
            password='TestPassword123!',
            role='DONOR',

        )

        # Create the Donor's profile.
        self.donor_profile  = DonorProfile.objects.create(
            user=self.donor_user,
            blood_group='O+',
            date_of_birth=date(2000,1,1),
            phone='0798765432',
            is_available=True,
        )

        # Uthenticated requests as this donor
        self.client.force_authenticate(user=self.donor_user)
        
        self.profile_url = "/api/donors/me/"
        self.availability_url = "/api/donors/me/availability/"

    def test_donor_can_retrieve_own_profile(self):
        # A donor should be able to retrieve their own profile.
        response = self.client.get(self.profile_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "testdonor")
        self.assertEqual(response.data["blood_group"], "O+")

    def test_donor_can_update_phone_number(self):
        # Donors should be able to update permitted profile fields.
        response = self.client.patch(
            self.profile_url,
            {"phone": "0798765432"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.donor_profile.refresh_from_db()
        self.assertEqual(self.donor_profile.phone, "0798765432")

    def test_donor_can_change_availability(self):
        # A donor should be able to mark themselves unavailable.
        response = self.client.patch(
            self.availability_url,
            {"is_available": False},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.donor_profile.refresh_from_db()
        self.assertFalse(self.donor_profile.is_available)

    def test_availability_requires_boolean(self):
        # Invalid availability values should be rejected.
        response = self.client.patch(
            self.availability_url,
            {"is_available": "sometimes"},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_non_donor_cannot_access_donor_profile(self):
        # A requester must not access the donor-profile endpoint.
        requester = User.objects.create_user(
            username="testrequester",
            password="TestPassword123!",
            role="REQUESTER",
        )

        self.client.force_authenticate(user=requester)

        response = self.client.get(self.profile_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )

    def test_unauthenticated_user_cannot_access_profile(self):
        # Requests without authentication must be rejected.
        self.client.force_authenticate(user=None)

        response = self.client.get(self.profile_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_donor_without_profile_gets_not_found(self):
        # A donor account without a profile should get a clear response.
        donor_without_profile = User.objects.create_user(
            username="profilemissing",
            password="TestPassword123!",
            role="DONOR",
        )

        self.client.force_authenticate(user=donor_without_profile)

        response = self.client.get(self.profile_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )