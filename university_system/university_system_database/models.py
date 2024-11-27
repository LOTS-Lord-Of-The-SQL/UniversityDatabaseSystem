
from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('instructor', 'Instructor'),
        ('admin', 'Admin'),
    ]
    role = models.CharField(max_length=50, choices=ROLE_CHOICES)
    department = models.CharField(max_length=100, blank=True, null=True)
    cafeteria_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    profile_photo_path = models.CharField(max_length=255, blank=True, null=True)
    birthday = models.DateField(blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    phone_number = models.CharField(max_length=11, blank=True, null=True)
    scholarship_rate = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}" 
    


# Student Model
class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, limit_choices_to={'role': 'student'})
    gpa = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    burs = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)


# Instructor Model
class Instructor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, limit_choices_to={'role': 'instructor'})
    room = models.CharField(max_length=8, blank=True, null=True)
    room_phone_num = models.CharField(max_length=11, blank=True, null=True)


# Courses Model
class Courses(models.Model):
    course_id = models.AutoField(primary_key=True)
    course_name = models.CharField(max_length=255)
    course_code = models.CharField(max_length=10)

    def __str__(self):
        return self.course_name


# Post Model
class Post(models.Model):
    post_id = models.AutoField(primary_key=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    owner_course = models.ForeignKey(Courses, on_delete=models.SET_NULL, null=True, blank=True)
    is_official = models.BooleanField(default=False)
    post_description = models.TextField()
    header = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)


# Comments Model
class Comments(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    context = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('owner', 'post')


# Course Enrollment Model
class CourseEnrollment(models.Model):
    course = models.ForeignKey(Courses, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('course', 'user')


# Community Model
class Community(models.Model):
    community_id = models.AutoField(primary_key=True)
    community_name = models.CharField(max_length=255)


# Community Join Model
class CommunityJoin(models.Model):
    community = models.ForeignKey(Community, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    position = models.CharField(max_length=50)

    class Meta:
        unique_together = ('community', 'user')


# Facilities Model
class Facilities(models.Model):
    facilities_id = models.AutoField(primary_key=True)
    type = models.CharField(max_length=50)
    occupancy_rate = models.IntegerField()


# Activity Area Model
class ActivityArea(models.Model):
    room_id = models.AutoField(primary_key=True)
    capacity = models.IntegerField()
    facilities = models.ForeignKey(Facilities, on_delete=models.CASCADE)
    is_empty = models.BooleanField(default=True)


# Reservation Model
class Reservation(models.Model):
    facility = models.ForeignKey(Facilities, on_delete=models.CASCADE)
    reserve_user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateTimeField()

    class Meta:
        unique_together = ('facility', 'reserve_user', 'date')


# Likes Model
class Likes(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('post', 'owner')


# Share Model
class Share(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('post', 'owner')


# Teaches Model
class Teaches(models.Model):
    course = models.ForeignKey(Courses, on_delete=models.CASCADE)
    instructor = models.ForeignKey(Instructor, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('course', 'instructor')
