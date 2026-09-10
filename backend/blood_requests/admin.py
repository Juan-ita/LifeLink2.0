from django.contrib import admin
from .models import BloodRequest

# Register your models here.
@admin.register(BloodRequest)
class BloodRequestAdmin(admin.ModelAdmin):

    # Display important blood request information
    list_display = (
        "blood_group",
        "units_required",
        'urgency',
        'status',
        'hospital',
        'requester',
        'created_at',
    )

    # Allow administrators to filter blood requests
    list_filter=(
        'blood_group',
        'urgency',
        'status',
    )

    # Allow admin to search blood requests
    search_fields = (
        'blood_group',
        'hospital_name',
        'request_username',
    )

    # Display newest requests first
    ordering = (
        'created_at',
    )