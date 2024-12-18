from django.contrib import admin
from .models import (
    User,
    Student,
    Instructor,
    Post,
    Comments,
    Courses,
    CourseEnrollment,
    Community,
    CommunityJoin,
    Facilities,
    ActivityArea,
    ReservationArea,
    Likes,
    Share,
    Teach,
    CommunityAnnouncement,
)

# Modellerinizi admin paneline kaydedin
admin.site.register(User)
admin.site.register(Student)
admin.site.register(Instructor)
admin.site.register(Post)
admin.site.register(Comments)
admin.site.register(Courses)
admin.site.register(CourseEnrollment)
admin.site.register(Community)
admin.site.register(CommunityJoin)
admin.site.register(Facilities)
admin.site.register(ActivityArea)
admin.site.register(ReservationArea)
admin.site.register(Likes)
admin.site.register(Share)
admin.site.register(Teach)
admin.site.register(CommunityAnnouncement)
