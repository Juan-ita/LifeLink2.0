from django.db import models
from users.models import User

# Create your models here.
class Notification(models.Model):

    class NotificationType(models.TextChoices):
        APPOINTMENT = "APPOINTMENT", "Appointment"
        BLOOD_REQUEST = "BLOOD_REQUEST", "Blood Request"
        SYSTEM = "SYSTEM", "System"

    # User who receives the notification
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="notifications",
    )

    # Notification message
    message = models.TextField()

    # Type of notification
    notification_type = models.CharField(
        max_length=30,
        choices=NotificationType.choices,
        default=NotificationType.SYSTEM,
    )

    # Wheather the user has opened/read it
    is_read = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.message}"