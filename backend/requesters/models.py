from django.db import models
from users.models import User

# Create your models here.
class RequesterProfile(models.Model):
    #connect each requester profile to a LifeLink user acc
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='requester_profile',
    )

    # Phone no. 
    phone = models.CharField(max_length=20)

    # Relationship btw requester and patient
    relationship_to_patient = models.CharField(
        max_length=100,
        blank=True,
    )

    # Automatically record when the requester profile was created
    created_at = models.DateTimeField(auto_now_add=True)

    # Automatically update this whenever the profile changes
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        # Display the requester's username in Django Admin
        return f'{self.user.username} - Requester'