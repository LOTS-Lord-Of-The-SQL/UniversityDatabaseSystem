from django.urls import path
from . import views

urlpatterns = [
    path('login',views.LoginPageView.as_view(), name='login'),
    path('list-courses',views.ListCoursesView.as_view(), name='list-courses'),
    path('course-<int:course_id>/', views.CoursePostsView.as_view(), name='course_posts'),
    path('enroll-course',views.EnrollCourseView.as_view(), name='enroll-course'),
    path('post-detail-<int:post_id>/', views.PostDetailView.as_view(), name='post-detail'),
    path('create-post', views.CreatePostView.as_view(), name='create-post'),
    path('create-comment', views.CreateCommentView.as_view(), name='create-comment'),
    path('join-community', views.JoinCommunityView.as_view(), name='join-community'),
    path('list-communities', views.ListCommunitiesView.as_view(), name='list-communities'),
    path('reserve-facility', views.ReserveFacilityView.as_view(), name='reserve-facility'),
    path('list-facilities', views.ListFacilitiesView.as_view(), name='list-facilities')
]