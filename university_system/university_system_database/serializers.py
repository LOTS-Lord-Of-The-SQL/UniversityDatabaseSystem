from rest_framework import serializers
from . models import *


from django.contrib.auth import authenticate

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            raise serializers.ValidationError("Email and password are required.")

        user = authenticate(username=username, password=password)
        print(username, password)
        if not user:
            raise serializers.ValidationError("Invalid login information.")

        if not user.is_active:
            raise serializers.ValidationError("This account is inactive.")

        data['user'] = user
        return data

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

# Student Serializer
class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

# Instructor Serializer
class InstructorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instructor
        fields = '__all__'

# Courses Serializer
class CoursesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Courses
        fields = '__all__'

# Post Serializer
class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'

# Comments Serializer
class CommentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comments
        fields = '__all__'

# Course Enrollment Serializer
class CourseEnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseEnrollment
        fields = '__all__'

# Community Serializer
class CommunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Community
        fields = '__all__'

# Community Join Serializer
class CommunityJoinSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommunityJoin
        fields = '__all__'

# Facilities Serializer
class FacilitiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Facilities
        fields = '__all__'

# Activity Area Serializer
class ActivityAreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityArea
        fields = '__all__'

# Reservation Serializer
class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = '__all__'

# Likes Serializer
class LikesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Likes
        fields = '__all__'

# Share Serializer
class ShareSerializer(serializers.ModelSerializer):
    class Meta:
        model = Share
        fields = '__all__'

# Teaches Serializer
class TeachesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teaches
        fields = '__all__'
        
class CommunityAnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommunityAnnouncement
        fields = '_all_'