from django.shortcuts import render
from .models import BloodRequest
from .serializers import BloodRequestSerializer
from rest_framework import viewsets
from .permissions import IsHospitalUser, IsRequesterUser
from rest_framework.permissions import IsAuthenticated


# Create your views here.
class BloodRequestViewSet(viewsets.ModelViewSet):

    # Get all blood requests
    queryset = BloodRequest.objects.all().order_by("-created_at")

    # Convert requests to and from JSON
    serializer_class = BloodRequestSerializer

    # This gives us the basic CRUD operations:

    # GET → view blood requests
    # POST → create a blood request
    # PUT/PATCH → update a request
    # DELETE → delete a request

    # Choose permissions based on the action being performed
    def get_permissions(self):

        # Requesters can create new blood requests
        if self.action == "create":
            self.permission_classes = [IsRequesterUser]

        # Hospitals can update requests, eg. approving them
        elif self.action in ["update", "partial_update"]:
            self.permission_classes = [IsHospitalUser]

        # Any logged in user can view blood requests
        else:
            self.permission_classes = [IsAuthenticated]

        # Create and return the permission objects
        return [permission() for permission in self.permission_classes]


