from django.db import models
from users.models import User

# Create your models here.
class HospitalProfile(models.Model):
    # connect the hospital profile to a user acc
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE,
        related_name="hospital_profile",
    )

    # Official name of the hospital
    hospital_name = models.CharField(max_length=200)

    # Hospital registration/ license number
    registration_number = models.CharField(max_length=20)

    # Hospital email
    email  = models.EmailField()

    # Physical address
    address = models.CharField(max_length=255)

    # Wheter an administrator has verified the hospital
    is_verified = models.BooleanField(default=False)

    # Record when the hospital profile was created
    created_at = models.DateTimeField(auto_now_add=True)

    # Record when the hospital profile was last updated
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        # Display the hospital name in Django admin

        return self.hospital_name