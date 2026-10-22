from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import HospitalRegisterSerializer


class HospitalRegisterView(APIView):
    # Allow hospitals to register without logging in first.
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = HospitalRegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            # Generate JWT tokens for the new hospital account.
            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "message": (
                        "Hospital registered successfully. "
                        "Awaiting verification."
                    ),
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                        "role": user.role,
                    },
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )
