from django.db import models
from users.models import User
from hospitals.models import HospitalProfile

# Create your models here.
class BloodRequest(models.Model):
    class Urgency(models.TextChoices):
     NORMAL = "NORMAL", "Normal"
     URGENT = "URGENT", "Urgent"
     CRITICAL = "CRITICAL", "Critical"

    class Status(models.TextChoices):
        PENDING = "PENDING" , "Pending"
        APPROVED = "APPROVED" , "Approved"
        FULFILLED = "FULFILLED" , "Fulfilled"
        CANCELLED = "CANCELLED" , "Cancelled"
    
    # Person who created the blood request
    requester = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name = "blood_requests"
    )
    
    # Hospital associated with the blood request
    hospital = models.ForeignKey(
        HospitalProfile,
        on_delete = models.CASCADE,
        related_name="blood_requests"
    )
    
    # Blod group required
    blood_group = models.CharField(max_length=5)
    
    # Number of blood units required
    units_required = models.PositiveBigIntegerField()
    
    # How urgent the request is
    urgency = models.CharField(
        max_length=20,
        choices=Urgency.choices,
        default=Urgency.NORMAL,
    )
    
    #current status of the request
    status = models.CharField(
       max_length=20,
       choices=Status.choices,
       default=Status.PENDING
    )

    # Optional reason for the request
    reason = models.TextField(blank=True)

    # When request was created
    created_at = models.DateTimeField(auto_now_add=True)

    # When request was last updated
    update_at = models.DateTimeField(auto_now=True)

    def __str__(self):
       return f"{self.blood_group} - {self.units_required} units - {self.status}"