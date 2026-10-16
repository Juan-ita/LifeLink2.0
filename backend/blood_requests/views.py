from django.shortcuts import render
from .models import BloodRequest
from .serializers import BloodRequestSerializer
from rest_framework import viewsets
from .permissions import IsHospitalUser, IsRequesterUser
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

from users.models import User

from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status


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
            self.permission_classes = [IsHospitalUser]

        # Hospitals can update requests, eg. approving them
        elif self.action in ["update", "partial_update"]:
            self.permission_classes = [IsHospitalUser]

        # Any logged in user can view blood requests
        else:
            self.permission_classes = [IsAuthenticated]

        # Create and return the permission objects
        return [permission() for permission in self.permission_classes]

    def perform_create(self, serializer):
     # Get the hospital profile belonging to the logged-in user.
     hospital = self.request.user.hospital_profile
 
     # Automatically attach this hospital to the blood request.
     serializer.save(hospital=hospital)

    # Control which blood requests each role can see
    def get_queryset(self):

        user = self.request.user

        if user.role == User.Role.DONOR:
          return BloodRequest.objects.filter(
              status=BloodRequest.Status.APPROVED
          ).order_by("-created_at")
      
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

        
    

    def get_permissions(self):
            """
            Only verified hospitals and administrators may manage requests.
            Other authenticated users may only perform read-only actions.
            """
            return [IsAuthenticated()]
    
    def check_hospital_permission(self):
            """
            Confirm that the current user is allowed to manage blood requests.
            """
            user = self.request.user
    
            if user.role == User.Role.ADMIN:
                return
    
            if user.role != User.Role.HOSPITAL:
                raise PermissionDenied(
                    "Only hospital accounts can manage blood requests."
                )
    
            hospital = getattr(user, "hospital_profile", None)
    
            if hospital is None or not hospital.is_verified:
                raise PermissionDenied(
                    "A verified hospital profile is required."
                )
    
    def create(self, request, *args, **kwargs):
            # Check permissions before creating a request.
            self.check_hospital_permission()
            return super().create(request, *args, **kwargs)
    
    def perform_create(self, serializer):
            user = self.request.user
    
            # Administrators must explicitly select a hospital through an
            # appropriate admin workflow. Hospital users use their own profile.
            if user.role == User.Role.ADMIN:
                serializer.save()
                return
    
            serializer.save(hospital=user.hospital_profile)
    
    def update(self, request, *args, **kwargs):
            # Check permissions before updating a request.
            self.check_hospital_permission()
            return super().update(request, *args, **kwargs)
    
    def partial_update(self, request, *args, **kwargs):
            # Check permissions before partially updating a request.
            self.check_hospital_permission()
            return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
     # Blood requests must be cancelled, never permanently deleted.
     raise PermissionDenied(
        "Blood requests cannot be deleted. Please cancel the request instead."
    )


    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        # Retrieve the request through the existing role-filtered queryset.
        blood_request = self.get_object()
    
        # Only verified hospitals that own the request or administrators
        # may cancel it.
        self.check_hospital_permission()
    
        if (
            request.user.role != User.Role.ADMIN
            and blood_request.hospital.user_id != request.user.id
        ):
            raise PermissionDenied(
                "You can only cancel your hospital's own blood requests."
            )
    
        # A fulfilled or already-cancelled request cannot be cancelled again.
        if blood_request.status in [
            BloodRequest.Status.FULFILLED,
            BloodRequest.Status.CANCELLED,
        ]:
            raise PermissionDenied(
                "This request has already been fulfilled or cancelled."
            )
    
        blood_request.status = BloodRequest.Status.CANCELLED
        blood_request.save(update_fields=["status", "update_at"])
    
        return Response(
            BloodRequestSerializer(blood_request).data,
            status=status.HTTP_200_OK,
        )
    
    
        
    
    
    
    