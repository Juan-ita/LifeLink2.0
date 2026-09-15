from django.db import models

from Donors.models import DonorProfile
from hospitals.models import HospitalProfile
from blood_requests.models import BloodRequest


class Appointment(models.Model):

    class Status(models.TextChoices):
        SCHEDULED = "SCHEDULED", "Scheduled"
        COMPLETED = "COMPLETED", "Completed"
        CANCELLED = "CANCELLED", "Cancelled"
        MISSED = "MISSED", "Missed"

    # Donor attending the appointment
    donor = models.ForeignKey(
        DonorProfile,
        on_delete=models.CASCADE, # If donor profile is deleted the appointment is also deleted
        related_name="appointments",
    )

    # Blood request this appointment is helping
    blood_request = models.ForeignKey(
        BloodRequest,
        on_delete=models.CASCADE,
        related_name="appointments",
    )

    # Hospital where the donation will take place
    hospital = models.ForeignKey(
        HospitalProfile,
        on_delete=models.CASCADE,
        related_name="appointments",
    )

    # Date and time of the appointment
    appointment_date = models.DateTimeField()

    # Current appointment status
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.SCHEDULED,
    )

    # Optional notes from the hospital   Adding additional information
    notes = models.TextField(
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return (
            f"{self.donor.user.username} - "
            f"{self.appointment_date}"
        )