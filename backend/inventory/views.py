from django.shortcuts import render
from rest_framework import viewsets

from .models import BloodInventory
from .serializers import BloodInventorySerializer
from .permissions import IsHospitalUser

# Create your views here.
class BloodInventoryViewset(viewsets.ModelViewSet):

    queryset = BloodInventory.objects.all().order_by("-updated_at")

    serializer_class = BloodInventorySerializer

    permission_classes = [IsHospitalUser]

    def get_queryset(self):
        user = self.request.user

        # Hospitala can only see their own inventory
        if user.role == "HOSPITAL":
            return BloodInventory.objects.filter(
                hospital__user = user
            ).order_by("-updated_at")

        return BloodInventory.objects.none()