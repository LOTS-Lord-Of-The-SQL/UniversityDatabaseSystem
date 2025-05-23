from django.urls import path
from . import views

urlpatterns = [
    path("login", views.LoginPageView.as_view(), name="login"),
    path("list-courses", views.ListCoursesView.as_view(), name="list-courses"),
    path("course", views.CoursePostsView.as_view(), name="course_posts"),
    path("enroll-course", views.EnrollCourseView.as_view(), name="enroll-course"),
    path("post-detail", views.PostDetailView.as_view(), name="post-detail"),
    path("create-post", views.CreatePostView.as_view(), name="create-post"),
    path("create-comment", views.CreateCommentView.as_view(), name="create-comment"),
    path("join-community", views.JoinCommunityView.as_view(), name="join-community"),
    path(
        "list-communities",
        views.ListNonJoinedCommunitiesView.as_view(),
        name="list-communities",
    ),
    path(
        "list-joined-communities",
        views.ListJoinedCommunitiesView.as_view(),
        name="list-joined-communities",
    ),
    path(
        "reserve-activity-area",
        views.ReserveActivityAreaView.as_view(),
        name="reserve-activity-area",
    ),
    path("list-facilities", views.ListFacilitiesView.as_view(), name="list-facilities"),
    path(
        "list-courses-to-enroll",
        views.ListNonEnrolledCoursesView.as_view(),
        name="list-courses-to-enroll",
    ),
    path("like-post", views.LikePostView.as_view(), name="like-post"),
    path("list-likes", views.ListLikesView.as_view(), name="list-likes"),
    path("official-posts", views.OfficialPostsView, name="official-posts"),
    path("remove-like", views.RemoveLikeView.as_view(), name="remove-like"),
    path("remove-post", views.RemovePostView.as_view(), name="remove-post"),
    path(
        "list-activity-areas",
        views.ListEmptyActivityAreas.as_view(),
        name="list-activity-areas",
    ),
    path(
        "list-all-activity-areas",
        views.ListAllActivityAreas.as_view(),
        name="list-all-activity-areas",
    ),
    path("withdraw-course", views.WithdrawCourseView.as_view(), name="withdraw-course"),
    path(
        "withdraw-community",
        views.WithdrawCommunityView.as_view(),
        name="withdraw-community",
    ),
    path(
        "community-announcements",
        views.CommunityAnnouncementsView.as_view(),
        name="community-announcements",
    ),
    path(
        "instructor-details",
        views.InstructorDetailsView.as_view(),
        name="instructor-details",
    ),
    path(
        "list-community-members",
        views.ListCommunityMembersView.as_view(),
        name="list-community-members",
    ),
    path(
        "create-announcement",
        views.CreateCommunityAnnouncementView.as_view(),
        name="create-announcement",
    ),
    path(
        "delete-announcement",
        views.DeleteCommunityAnnouncementView.as_view(),
        name="delete-announcement",
    ),
]
