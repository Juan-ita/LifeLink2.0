from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import serializers

from .models import HospitalProfile

User = get_user_model()


class HospitalRegisterSerializer(serializers.Serializer):
    # Hospital details
    hospital_name = serializers.CharField(max_length=200)
    registration_number = serializers.CharField(max_length=20)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    address = serializers.CharField(max_length=255)

    # Administrator account details
    username = serializers.CharField(max_length=150)
    full_name = serializers.CharField(max_length=150)
    admin_email = serializers.EmailField()
    admin_phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, min_length=8)

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value.strip()).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value.strip()

    def validate_admin_email(self, value):
        value = value.strip().lower()
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value

    def validate_registration_number(self, value):
        value = value.strip()
        if HospitalProfile.objects.filter(registration_number__iexact=value).exists():
            raise serializers.ValidationError("This registration number is already registered.")
        return value

    @transaction.atomic
    def create(self, validated_data):
        full_name = " ".join(validated_data.pop("full_name").split())
        hospital_name = validated_data.pop("hospital_name")
        registration_number = validated_data.pop("registration_number")
        hospital_email = validated_data.pop("email")
        hospital_phone = validated_data.pop("phone", "")
        address = validated_data.pop("address")

        admin_email = validated_data.pop("admin_email")
        admin_phone = validated_data.pop("admin_phone", "")
        password = validated_data.pop("password")

        name_parts = full_name.split(" ", 1)

        user = User.objects.create_user(
            username=validated_data["username"],
            email=admin_email,
            password=password,
            first_name=name_parts[0],
            last_name=name_parts[1] if len(name_parts) > 1 else "",
            phone=admin_phone,
            role=User.Role.HOSPITAL,
        )

        # New hospitals must be verified before being trusted.
        HospitalProfile.objects.create(
            user=user,
            hospital_name=hospital_name,
            registration_number=registration_number,
            email=hospital_email,
            phone=hospital_phone,
            address=address,
            is_verified=False,
        )

        return user
