from django.contrib import admin
from .models import BloodInventory

# Register your models here.
@admin.register(BloodInventory)
class BloodInventoryAdmin(admin.ModelAdmin):

    list_display = (
        "hospital",
        "blood_group",
        "units_available",
        "updated_at",
    )

    list_filter = (
        "blood_group",
        "hospital",
    )

    search_fields = (
        "hospital__hospital_name",
        "blood_group",
    )