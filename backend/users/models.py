from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    class Role(models.TextChoices):
        DONOR = 'DONOR', 'Donor'
        REQUESTER = 'REQUESTER' , 'Requester'
        HOSPITAL = 'HOSPITAL' , 'Hospital'
        ADMIN = 'ADMIN' , 'Administrator'

    role = models.CharField(
        max_length=20,
        choices = Role.choices,
        default = Role.REQUESTER,
    )

    phone = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return f'{self.username} ({self.role})'