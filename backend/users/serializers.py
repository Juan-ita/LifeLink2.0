
from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import serializers

from Donors.models import DonorProfile

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    # Accept a password without ever returning it in API responses.
    password = serializers.CharField(
        write_only=True,
        min_length=8,
    )

    # Collect the donor's full legal name separately from their username.
    full_name = serializers.CharField(
        write_only=True,
        max_length=150,
    )

    # Collect the donor's blood group during registration.
    blood_group = serializers.ChoiceField(
        choices=[
            ("A+", "A+"),
            ("A-", "A-"),
            ("B+", "B+"),
            ("B-", "B-"),
            ("AB+", "AB+"),
            ("AB-", "AB-"),
            ("O+", "O+"),
            ("O-", "O-"),
        ],
        write_only=True,
    )

    # Collect the donor's date of birth.
    date_of_birth = serializers.DateField(write_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "full_name",
            "email",
            "password",
            "phone",
            "blood_group",
            "date_of_birth",
        ]
        read_only_fields = ["id"]

    def validate_username(self, value):
        # Prevent duplicate usernames, ignoring capitalization.
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError(
                "This username is already taken. Please choose another."
            )

        return value.strip()

    def validate_email(self, value):
        # Prevent multiple accounts from using the same email address.
        value = value.strip().lower()

        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                "An account with this email already exists."
            )

        return value

    def validate_full_name(self, value):
        # Remove accidental spaces around the donor's full name.
        value = " ".join(value.split())

        if not value:
            raise serializers.ValidationError(
                "Full name is required."
            )

        return value

    @transaction.atomic
    def create(self, validated_data):
        # Remove fields that belong to the donor profile or user name fields.
        full_name = validated_data.pop("full_name")
        blood_group = validated_data.pop("blood_group")
        date_of_birth = validated_data.pop("date_of_birth")
        password = validated_data.pop("password")

        # Split the full name into Django's first-name and last-name fields.
        name_parts = full_name.split(" ", 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ""

        # Create the user with a securely hashed password.
        user = User.objects.create_user(
            password=password,
            first_name=first_name,
            last_name=last_name,
            role=User.Role.DONOR,
            **validated_data,
        )

        # Create the donor profile linked to the newly created user.
        DonorProfile.objects.create(
            user=user,
            blood_group=blood_group,
            date_of_birth=date_of_birth,
            phone=user.phone,
        )

        return user
