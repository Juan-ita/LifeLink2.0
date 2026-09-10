from django.shortcuts import render
from .models import BloodRequest
from .serializers import BloodRequestSerializer
from rest_framework import viewsets

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