from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsHospitalOrDonor(BasePermission):
  """
  Allow hospitals to manage appointments.
  Allow donors to view appointments and create their own.
  """


def has_permission(self, request, view):
    # Reject unauthenticated users.
    if not request.user.is_authenticated:
        return False

    # Hospitals can access appointment actions.
    if request.user.role == "HOSPITAL":
        return True

    # Donors can view appointments and submit bookings.
    if request.user.role == "DONOR":
        return (
            request.method in SAFE_METHODS
            or request.method == "POST"
        )

    return False