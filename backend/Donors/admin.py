from django.contrib import admin
from .models import DonorProfile

# Register your models here.
@admin.register(DonorProfile)
class DonorProfileAdmin(admin.ModelAdmin):

    # Display these fields in the donor list
    list_display = (
        "user",
        "blood_group",
        "phone",
        'is_available',
        "last_donation_date",
        "next_eligible_donation",
    )

    # Allow admin users to filter donors by these fields
    list_filter = (
        "blood_group",
        "is_available",
    )

    # Allow admin users to search by username, phone, and blood group
    search_fields = (
        "user_username",
        "phone",
        "blood_group",
    )