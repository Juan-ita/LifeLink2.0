
from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import serializers

from Donors.models import DonorProfile

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    # Accept the password, but never return it in API responses.
    password = serializers.CharField(write_only=True, min_length=8)

    # Collect the donor's required profile information.
    blood_group = serializers.ChoiceField(
        choices=[
            ("A+", "A+"), ("A-", "A-"),
            ("B+", "B+"), ("B-", "B-"),
            ("AB+", "AB+"), ("AB-", "AB-"),
            ("O+", "O+"), ("O-", "O-"),
        ],
        write_only=True,
    )
    date_of_birth = serializers.DateField(write_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "password",
            "phone",
            "role",
            "blood_group",
            "date_of_birth",
        ]
        read_only_fields = ["id", "role"]

    @transaction.atomic
    def create(self, validated_data):
        # Remove donor-only fields before creating the user account.
        blood_group = validated_data.pop("blood_group")
        date_of_birth = validated_data.pop("date_of_birth")
        password = validated_data.pop("password")

        # Public registration always creates a donor, not an admin account.
        user = User.objects.create_user(
            password=password,
            role=User.Role.DONOR,
            **validated_data,
        )

        # Create the donor profile linked to the new account.
        DonorProfile.objects.create(
            user=user,
            blood_group=blood_group,
            date_of_birth=date_of_birth,
            phone=user.phone,
        )

        return user
