from django.contrib import admin
from .models import HospitalProfile

# Register your models here.
@admin.register(HospitalProfile)
class HospitalProfileAdmin(admin.ModelAdmin):
    # Display important hospital information in the hospital list
    list_display = (
        "hospital_name",
        "registration_number",
        "phone",
        "email",
        "is_verified",
        "created_at",
    )

    # Allow administrators to filter hospitals by verification status
    list_filter = (
        "is_verified",
    )

    # Allow administrators to search for hospitals
    search_fields = (
        "hospital_name",
        "registration_number",
        "email",
    )

    # Allow administrators to change verification directly from the list
    list_editable = (
        "is_verified",
    )