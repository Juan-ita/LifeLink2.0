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

    # Control which blood requests each role can see
    def get_queryset(self):

        user = self.request.user

        # Admin can see all blood requests
        if user.role == "ADMIN":
            return BloodRequest.objects.all().order_by("-created_at")

        # Requesters can only see requests they created
        if user.role == "REQUESTER":
            return BloodRequest.objects.filter(
                requester=user
            ).order_by("-created_at")

        # Hospitals can only see requests assigned to their hospital
        if user.role == "HOSPITAL":
            return BloodRequest.objects.filter(
                hospital__user=user
            ).order_by("-created_at")

        # Donors should not access blood requests here
        return BloodRequest.objects.none()



