from rest_framework import serializers
from .models import Appointment

class AppointmentSerializer(serializers.ModelSerializer):
    # Donor details from the linked donor profile and user account.
    donor_name = serializers.SerializerMethodField()
    donor_email = serializers.EmailField(
      source="donor.user.email",
      read_only=True
    )
    donor_phone = serializers.CharField(
       source="donor.phone",
        read_only=True
    )
    donor_blood_group = serializers.CharField(
       source="donor.blood_group",
       read_only=True
    )
    
    
    # Hospital name for easier display.
    hospital_name = serializers.CharField(
        source="hospital.hospital_name",
        read_only=True
    )

    # Blood request details, including the recipient's name. 
    blood_request_details = serializers.SerializerMethodField()
    
    class Meta:
        model = Appointment
        fields = (
            "id",
            "donor",
            "donor_name",
            "donor_email",
            "donor_phone",
            "donor_blood_group",
            "blood_request",
            "blood_request_details",
            "hospital",
            "hospital_name",
            "appointment_date",
            "status",
            "notes",
            "created_at",
            "updated_at",
        )
    
        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
        )
    
    def get_donor_name(self, obj):
        # Prefer the donor's full name, falling back to their username.
        user = obj.donor.user
        return user.get_full_name() or user.username
    def get_blood_request_details(self, obj): 
        # Safely handle an appointment without a linked blood request.
         request = obj.blood_request 
         
         if not request: 
            return None
         
         return {
             "recipient_name": request.recipient_name, 
             "blood_group": request.blood_group, 
             "units_required": request.units_required, 
             "urgency": request.urgency, 
             "status": request.status, 
             }