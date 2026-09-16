from rest_framework.permissions import BasePermission

class IsHospitalUser(BasePermission):

    """
    Only hospital users can manage blood inventory.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "HOSPITAL"
        )