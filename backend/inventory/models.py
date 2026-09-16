from django.db import models
from hospitals.models import HospitalProfile

# Create your models here.
class BloodInventory(models.Model):

    hospital = models.ForeignKey(
        HospitalProfile,
        on_delete=models.CASCADE,
        related_name="blood_inventory",
    )

    blood_group = models.CharField(max_length=5)

    units_available = models.PositiveIntegerField(default=0)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return(
            f"{self.self.hospital.self.hospital_name} -"
            f"{self.self.blood_group} -"
            f"{self.units_available} units"
        )
