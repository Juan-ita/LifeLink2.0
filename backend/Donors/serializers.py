from rest_framework import serializers
from .models import DonorProfile

class DonorProfileSerializer(serializers.ModelSerializer):
  # Display the username from the linked user account.
  username = serializers.CharField(
  source="user.username",
  read_only=True,
  )


class Meta:
    model = DonorProfile
    fields = [
        "id",
        "username",
        "blood_group",
        "date_of_birth",
        "phone",
        "latitude",
        "longitude",
        "is_available",
        "last_donation_date",
        "next_eligible_date",
        "updated_at",
    ]

    read_only_fields = [
        "id",
        "username",
        "updated_at",
    ]

class HospitalDonorSerializer(serializers.ModelSerializer):
 # Include the username and email from the linked user account.
 username = serializers.CharField(
 source="user.username",
 read_only=True,
 )
 
 
 email = serializers.EmailField(
     source="user.email",
     read_only=True,
 )
 
class Meta:
    model = DonorProfile
    fields = [
        "id",
        "username",
        "email",
        "blood_group",
        "phone",
        "latitude",
        "longitude",
        "is_available",
        "last_donation_date",
        "next_eligible_date",
    ]

 