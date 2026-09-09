from django.contrib import admin
from .models import RequesterProfile

# Register your models here.
@admin.register(RequesterProfile)
class RequesterProfileAdmin(admin.ModelAdmin):

    # Display important requester info
    list_display = (
        "user",
        "phone",
        "relationship_to_patient",
        "created_at",
    )

    # Allow administrators to search for requesters
    search_fields=(
        "user_username",
        "phone",
    )
