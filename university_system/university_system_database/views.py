from rest_framework.views import APIView
from . models import *
from rest_framework.response import Response
from .serializers import *
from rest_framework import status
from rest_framework.exceptions import NotFound





class LoginPageView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            user_serializer = UserSerializer(user)
            return Response({
                "user": user_serializer.data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListCoursesView(APIView):
    def post(self, request, *args, **kwargs):
        user_id = request.data.get('id')  # Frontend'den gelen kullanıcı ID'si
        if not user_id:
            return Response({"error": "ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=user_id)  # Kullanıcıyı al
        except User.DoesNotExist:
            raise NotFound("Bu ID'ye sahip bir kullanıcı bulunamadı.")

        # Kullanıcının kayıtlı olduğu kursları al
        enrolled_courses = CourseEnrollment.objects.filter(user=user).select_related('course')
        courses = [
            {
                "course_id": enrollment.course.course_id,
                "course_name": enrollment.course.course_name,
                "course_code": enrollment.course.course_code
            }
            for enrollment in enrolled_courses
        ]

        return Response({"user_id": user_id, "courses": courses}, status=status.HTTP_200_OK)
        