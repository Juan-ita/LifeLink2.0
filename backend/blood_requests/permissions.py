from rest_framework.permissions import BasePermission

class IsHospitalUser(BasePermission):
    """
    Only users with the HOSPITAL role can access this endpoint.
    """

    def has_permission(self, request, view):
        return(
            request.user.is_authenticated
            and request.user.role == "HOSPITAL"
        )

class IsRequesterUser(BasePermission):
    # Allow access only to authenticated requester users
    def has_permission(self, request, view):
        return(
            request.user.is_authenticated
            and request.user.role == 'REQUESTER'
        )