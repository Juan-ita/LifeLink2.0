from django.db import models
from users.models import User

# Create your models here.
class DonorProfile(models.Model):
    # Connect each donor profile to a LifeLink user account
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="donor_profile",
    )

    # Blood group of the donor
    blood_group = models.CharField(max_length=5)

    # Donors data of birth
    date_of_birth = models.DateField()

    # Phone number
    phone = models.CharField(max_length=20)

    # Whether the donor is currently willing to recieve donation requests
    is_available = models.BooleanField(default = True)

    # Date of the donor's most recent donation
    last_donation_date = models.DateField(
        null=True,
        blank=True,
    )

    # Date from which the donor can next be considered to donate
    next_eligible_donation = models.DateField(
        null=True,
        blank=True,
    )

    # Automaticlly record when the donor profile is changed
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        # Display the donor's username and blood group in Django Admin
        return f"{self.user.username} - {self.blood_group}"
