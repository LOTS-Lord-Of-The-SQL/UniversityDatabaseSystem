from django.urls import path
from . import views

urlpatterns = [
    path('login',views.LoginPageView.as_view(), name='login'),
    path('list-courses',views.ListCoursesView.as_view(), name='list-courses'),
    path('course-<int:course_id>/', views.CoursePostsView.as_view(), name='course_posts'),

]