from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsHospitalOrDonor(BasePermission):
    """
    Allow hospitals to manage appointments.
    Allow donors to view appointments.
    """

    def has_permission(self, request, view):

        # Hospital users can perform all appointment actions
        if (
            request.user.is_authenticated
            and request.user.role == "HOSPITAL"
        ):
            return True

        # Donor users can only view appointments
        if (
            request.user.is_authenticated
            and request.user.role == "DONOR"
            and request.method in SAFE_METHODS
        ):
            return True

        return False