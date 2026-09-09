from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

# Register your models here.
@admin.register(User)
class CustomUserAdmin(UserAdmin):
    # Add LifeLink-specific fields to the normal User edit page
    fieldsets = UserAdmin.fieldsets + (
        ("LifeLink Information", {"fields" : ("role", "phone")}),
    )
    
    # Add LifeLink-specific fields when creating Users
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('LifeLink Information', {'fields': ('role', 'phone')}),
    )