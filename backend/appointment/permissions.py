from rest_framework.permissions import BasePermission


class IsHospitalUser(BasePermission):
    """
    Allow only authenticated hospital users.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "HOSPITAL"
        )


class IsDonorUser(BasePermission):
    """
    Allow only authenticated donor users.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "DONOR"
        )