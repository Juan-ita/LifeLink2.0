from rest_framework import serializers
from .models import BloodInventory

class BloodInventorySerializer(serializers.ModelSerializer):

    class Meta:
        model = BloodInventory

        fields = (
            "id",
            "hospital",
            "blood_group",
            "units_available",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "updated_at",
        )