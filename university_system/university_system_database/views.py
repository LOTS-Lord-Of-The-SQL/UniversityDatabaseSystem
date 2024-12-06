from django.utils import timezone
from django.forms import ValidationError
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from .models import *
from rest_framework.response import Response
from .serializers import *
from rest_framework import status
from rest_framework.exceptions import NotFound
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.decorators import api_view


class LoginPageView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            user_serializer = UserSerializer(user)
            return Response({"user": user_serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListNonEnrolledCoursesView(APIView):
    def post(self, request, *args, **kwargs):
        user_id = request.data.get("id")  
        if not user_id:
            return Response(
                {"error": "ID is required."}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(id=user_id) 
        except User.DoesNotExist:
            return Response(
                {"error": "User not found."}, status=status.HTTP_404_NOT_FOUND
            )
        enrolled_courses = CourseEnrollment.objects.filter(user=user).values_list(
            "course_id", flat=True
        )
        non_enrolled_courses = Courses.objects.exclude(course_id__in=enrolled_courses)
        courses = [
            {
                "course_id": course.course_id,
                "course_name": course.course_name,
                "course_code": course.course_code,
            }
            for course in non_enrolled_courses
        ]

        return Response(
            {"user_id": user_id, "non_enrolled_courses": courses},
            status=status.HTTP_200_OK,
        )


class ListCoursesView(APIView):
    def post(self, request, *args, **kwargs):
        user_id = request.data.get("id")  
        if not user_id:
            return Response(
                {"error": "ID is required."}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(id=user_id)  
        except User.DoesNotExist:
            raise NotFound("Bu ID'ye sahip bir kullanıcı bulunamadı.")
        enrolled_courses = CourseEnrollment.objects.filter(user=user).select_related(
            "course"
        )
        courses = [
            {
                "course_id": enrollment.course.course_id,
                "course_name": enrollment.course.course_name,
                "course_code": enrollment.course.course_code,
            }
            for enrollment in enrolled_courses
        ]

        return Response(
            {"user_id": user_id, "courses": courses}, status=status.HTTP_200_OK
        )


class CoursePostsView(APIView):
    def post(self, request, *args, **kwargs):
        course_id = request.data.get("course_id")
        if not course_id:
            return Response(
                {"error": "course_id is required."}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            course = Courses.objects.get(course_id=course_id)
        except Courses.DoesNotExist:
            return Response(
                {"error": "Bu ID'ye sahip bir kurs bulunamadı."},
                status=status.HTTP_404_NOT_FOUND,
            )
        posts = Post.objects.filter(owner_course=course)
        posts_data = [
            {
                "post_id": post.post_id,
                "owner_username": post.owner.username,
                "owner_id": post.owner.id,
                "is_official": post.is_official,
                "post_description": post.post_description,
                "header": post.header,
                "created_at": post.created_at,
            }
            for post in posts
        ]

        return Response(
            {
                "course_id": course_id,
                "course_name": course.course_name,
                "posts": posts_data,
            },
            status=status.HTTP_200_OK,
        )


class EnrollCourseView(APIView):
    def post(self, request, *args, **kwargs):
        user_id = request.data.get("user_id")
        course_id = request.data.get("course_id")

        if not user_id or not course_id:
            raise ValidationError("Kullanıcı ID ve Kurs ID'si gerekli.")

        try:
            user = User.objects.get(id=user_id)
        except ObjectDoesNotExist:
            return Response(
                {"error": "Kullanıcı bulunamadı."}, status=status.HTTP_404_NOT_FOUND
            )

        try:
            course = Courses.objects.get(course_id=course_id)
        except ObjectDoesNotExist:
            return Response(
                {"error": "Kurs bulunamadı."}, status=status.HTTP_404_NOT_FOUND
            )
        if CourseEnrollment.objects.filter(course=course, user=user).exists():
            return Response(
                {"message": "Kullanıcı bu kursa zaten kayıtlı."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        CourseEnrollment.objects.create(course=course, user=user)

        return Response(
            {"message": f"{user.username} kursa başarıyla kaydedildi."},
            status=status.HTTP_201_CREATED,
        )


class PostDetailView(APIView):
    def post(self, request, *args, **kwargs):
        post_id = request.data.get("post_id")
        if not post_id:
            return Response(
                {"error": "Post ID is required."}, status=status.HTTP_400_BAD_REQUEST
            )
        post = get_object_or_404(Post, post_id=post_id)
        comments = Comments.objects.filter(post=post)
        likes = Likes.objects.filter(post=post)
        comments_data = []
        for comment in comments:
            comments_data.append(
                {
                    "comment_id": comment.id,
                    "content": comment.context, 
                    "created_at": comment.created_at,
                    "owner": {
                        "user_id": comment.owner.id,
                        "user_name": comment.owner.username,
                    },
                }
            )

        likes_serializer = LikesSerializer(likes, many=True)
        post_serializer = PostSerializer(post)
        post_owner_data = {"user_id": post.owner.id, "user_name": post.owner.username}
        return Response(
            {
                "post": post_serializer.data,
                "comments": comments_data,  
                "likes": likes_serializer.data,
                "post_owner": post_owner_data, 
            },
            status=status.HTTP_200_OK,
        )


class CreatePostView(APIView):
    def post(self, request, *args, **kwargs):
        user_id = request.data.get("user_id")
        course_id = request.data.get("course_id")
        header = request.data.get("header")
        post_description = request.data.get("post_description")
        is_official = request.data.get("is_official", False)  
        user = User.objects.filter(id=user_id).first()
        course = Courses.objects.filter(course_id=course_id).first()
        if not user:
            return Response(
                {"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )

        if not course:
            return Response(
                {"detail": "Course not found"}, status=status.HTTP_404_NOT_FOUND
            )
        post = Post.objects.create(
            owner=user,
            owner_course=course,
            is_official=is_official,
            post_description=post_description,
            header=header,
        )
        post_serializer = PostSerializer(post)

        return Response(post_serializer.data, status=status.HTTP_201_CREATED)


class CreateCommentView(APIView):
    def post(self, request, *args, **kwargs):
        user_id = request.data.get("user_id")
        post_id = request.data.get("post_id")
        context = request.data.get("context")
        user = User.objects.filter(id=user_id).first()
        post = Post.objects.filter(post_id=post_id).first()
        if not user:
            return Response(
                {"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )

        if not post:
            return Response(
                {"detail": "Post not found"}, status=status.HTTP_404_NOT_FOUND
            )
        comment = Comments.objects.create(owner=user, post=post, context=context)
        return Response(
            {
                "owner": user.id,
                "post": post.post_id,
                "context": comment.context,
                "created_at": comment.created_at,
            },
            status=status.HTTP_201_CREATED,
        )


class JoinCommunityView(APIView):
    def post(self, request, *args, **kwargs):
        community_id = request.data.get("community_id")
        user_id = request.data.get("user_id")
        position = request.data.get("position", "Member")  
        try:
            community = Community.objects.get(community_id=community_id)
        except Community.DoesNotExist:
            return Response(
                {"error": "Community does not exist."},
                status=status.HTTP_404_NOT_FOUND,
            )
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "User does not exist."},
                status=status.HTTP_404_NOT_FOUND,
            )
        if CommunityJoin.objects.filter(community=community, user=user).exists():
            return Response(
                {"error": "User already joined this community."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        join_entry = CommunityJoin.objects.create(
            community=community,
            user=user,
            position=position,
        )
        return Response(
            {
                "message": "User successfully joined the community.",
                "join_id": join_entry.id,
            },
            status=status.HTTP_201_CREATED,
        )


class ListNonJoinedCommunitiesView(APIView):
    def post(self, request, *args, **kwargs):
        user_id = request.data.get("user_id")
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "User does not exist."},
                status=status.HTTP_404_NOT_FOUND,
            )
        joined_communities = CommunityJoin.objects.filter(user=user).values_list(
            "community_id", flat=True
        )
        non_joined_communities = Community.objects.exclude(
            community_id__in=joined_communities
        )
        communities_data = [
            {
                "community_id": community.community_id,
                "community_name": community.community_name,
            }
            for community in non_joined_communities
        ]

        return Response(
            {"non_joined_communities": communities_data},
            status=status.HTTP_200_OK,
        )


class ListJoinedCommunitiesView(APIView):
    def post(self, request, *args, **kwargs):
        user_id = request.data.get("user_id")
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "User does not exist."},
                status=status.HTTP_404_NOT_FOUND,
            )
        joined_communities = CommunityJoin.objects.filter(user=user)
        communities_data = [
            {
                "community_id": join.community.community_id,
                "community_name": join.community.community_name,
                "user_role": join.position,  
            }
            for join in joined_communities
        ]

        return Response(
            {"joined_communities": communities_data},
            status=status.HTTP_200_OK,
        )


class ReserveActivityAreaView(APIView):
    def post(self, request, *args, **kwargs):
        user_id = request.data.get("user_id")
        activity_area_id = request.data.get("activity_area_id")
        date = request.data.get("date", timezone.now())

        if not user_id or not activity_area_id:
            return Response(
                {"error": "user_id and activity_area_id are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(id=user_id)
            activity_area = ActivityArea.objects.get(room_id=activity_area_id)
            if not activity_area.is_empty:
                return Response(
                    {"error": "The selected activity area is not available."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            reservation = ReservationArea.objects.create(
                activity_area=activity_area, reserve_user=user, date=date
            )
            activity_area.is_empty = False
            activity_area.save()
            serializer = ReservationAreaSerializer(reservation)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except User.DoesNotExist:
            return Response(
                {"error": "User not found."}, status=status.HTTP_404_NOT_FOUND
            )

        except ActivityArea.DoesNotExist:
            return Response(
                {"error": "Activity area not found."}, status=status.HTTP_404_NOT_FOUND
            )

        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ListFacilitiesView(APIView):
    def get(self, request, *args, **kwargs):
        facilities = Facilities.objects.all()
        serializer = FacilitiesSerializer(facilities, many=True)
        return Response({"data": serializer.data}, status=status.HTTP_200_OK)


class LikePostView(APIView):
    def post(self, request, *args, **kwargs):
        post_id = request.data.get("post_id")
        user_id = request.data.get("user_id")
        try:
            post = Post.objects.get(post_id=post_id)
            user = User.objects.get(id=user_id)

            if Likes.objects.filter(post=post, owner=user).exists():
                return Response(
                    {"error": "This user has already liked the post."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            like = Likes.objects.create(post=post, owner=user)
            return Response(
                {"message": "Post liked successfully.", "like_id": like.id},
                status=status.HTTP_201_CREATED,
            )

        except User.DoesNotExist:
            return Response(
                {"error": "User does not exist."},
                status=status.HTTP_404_NOT_FOUND,
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class ListLikesView(APIView):
    def post(self, request, *args, **kwargs):
        post_id = request.data.get("post_id")

        if not post_id:
            return Response(
                {"error": "post_id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            post = Post.objects.get(post_id=post_id)
            likes = Likes.objects.filter(post=post)

            likes_list = [
                {"user_id": like.owner.id, "user_name": like.owner.username}
                for like in likes
            ]

            return Response(
                {
                    "post_id": post.post_id,
                    "likes": likes_list,
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


@api_view(["GET"])
def OfficialPostsView(request):
    admin_users = User.objects.filter(role="admin")
    posts = Post.objects.filter(
        owner__in=admin_users,  
        owner_course__isnull=True,  
        is_official=True,  
    )
    response_data = []
    for post in posts:
        post_data = PostSerializer(post).data
        post_data["owner"] = {"id": post.owner.id, "username": post.owner.username}
        response_data.append(post_data)

    return Response(response_data)


class RemoveLikeView(APIView):
    def post(self, request, *args, **kwargs):
        user_id = request.data.get("user_id")
        post_id = request.data.get("post_id")

        if not user_id or not post_id:
            return Response(
                {"error": "user_id and post_id are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found."}, status=status.HTTP_404_NOT_FOUND
            )
        try:
            post = Post.objects.get(post_id=post_id)
        except Post.DoesNotExist:
            return Response(
                {"error": "Post not found."}, status=status.HTTP_404_NOT_FOUND
            )
        try:
            like = Likes.objects.get(post=post, owner=user)
            like.delete()  
            return Response(
                {"message": "Like removed successfully."}, status=status.HTTP_200_OK
            )
        except Likes.DoesNotExist:
            return Response(
                {"error": "You have not liked this post."},
                status=status.HTTP_400_BAD_REQUEST,
            )


class RemovePostView(APIView):
    def post(self, request, *args, **kwargs):
        post_id = request.data.get("post_id") 

        try:
            post = Post.objects.get(post_id=post_id)
            Likes.objects.filter(post=post).delete()
            Comments.objects.filter(post=post).delete()
            post.delete()
            return Response(
                {"message": "Post and related data deleted successfully."},
                status=status.HTTP_200_OK,
            )

        except Post.DoesNotExist:
            return Response(
                {"error": "Post not found."}, status=status.HTTP_404_NOT_FOUND
            )

        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ListEmptyActivityAreas(APIView):
    def post(self, request, *args, **kwargs):
        facilities_id = request.data.get(
            "facilities_id"
        ) 
        if not facilities_id:
            return Response(
                {"error": "facilities_id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        empty_areas = ActivityArea.objects.filter(
            facilities_id=facilities_id, is_empty=True
        )

        if not empty_areas.exists():
            return Response([], status=status.HTTP_200_OK)
        serializer = ActivityAreaSerializer(empty_areas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ListAllActivityAreas(APIView):
    def post(self, request, *args, **kwargs):
        facilities_id = request.data.get("facilities_id")
        user_id = request.data.get("user_id")

        if not facilities_id:
            return Response(
                {"error": "facilities_id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not user_id:
            return Response(
                {"error": "user_id is required."}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "User does not exist."}, status=status.HTTP_404_NOT_FOUND
            )
        all_activity_areas = ActivityArea.objects.filter(facilities_id=facilities_id)
        reserved_areas = ReservationArea.objects.filter(
            activity_area_id__in=all_activity_areas.values_list(
                "facilities_id", flat=True
            ),
            reserve_user=user,
        ).values_list("activity_area_id", flat=True)
        non_reserved_areas = all_activity_areas.exclude(
            facilities_id__in=reserved_areas
        )
        reserved_serializer = ActivityAreaSerializer(
            all_activity_areas.filter(facilities_id__in=reserved_areas), many=True
        )
        non_reserved_serializer = ActivityAreaSerializer(non_reserved_areas, many=True)

        return Response(
            {
                "reserved_areas": reserved_serializer.data,
                "non_reserved_areas": non_reserved_serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class WithdrawCourseView(APIView):
    def post(self, request):
        user_id = request.data.get("user_id")
        course_id = request.data.get("course_id")
        if not user_id or not course_id:
            return Response(
                {"error": "Both user_id and course_id are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            enrollment = CourseEnrollment.objects.get(
                course_id=course_id, user_id=user_id
            )
            enrollment.delete()

            return Response(
                {"message": "User successfully withdrew from the course."},
                status=status.HTTP_200_OK,
            )

        except CourseEnrollment.DoesNotExist:
            return Response(
                {"error": "Enrollment not found for the given user and course."},
                status=status.HTTP_404_NOT_FOUND,
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class WithdrawCommunityView(APIView):
    def post(self, request):
        user_id = request.data.get("user_id")
        community_id = request.data.get("community_id")
        try:
            join_entry = CommunityJoin.objects.get(
                community_id=community_id, user_id=user_id
            )
            if join_entry.position.lower() == "head":
                return Response(
                    {"error": "Community headers cannot withdraw from the community."},
                    status=status.HTTP_200_OK,
                )
            join_entry.delete()
            return Response(
                {"message": "Successfully withdrawn from the community."},
                status=status.HTTP_200_OK,
            )

        except CommunityJoin.DoesNotExist:
            return Response(
                {"error": "You are not a member of this community."},
                status=status.HTTP_404_NOT_FOUND,
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class CommunityAnnouncementsView(APIView):
    def post(self, request, *args, **kwargs):
        community_id = request.data.get("community_id")

        if not community_id:
            return Response(
                {"error": "Community ID is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            community = Community.objects.get(community_id=community_id)
            announcements = CommunityAnnouncement.objects.filter(
                owner_community=community
            )
            community_head = CommunityJoin.objects.filter(
                community=community, position="head"
            ).first()
            head_username = None
            if community_head:
                head_username = (
                    community_head.user.username
                ) 
            serializer = CommunityAnnouncemenSerializer(announcements, many=True)
            return Response(
                {
                    "announcements": serializer.data,
                    "community_head": head_username,  
                },
                status=status.HTTP_200_OK,
            )

        except Community.DoesNotExist:
            return Response(
                {"error": "Community with the provided ID does not exist."},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class InstructorDetailsView(APIView):
    def post(self, request):
        course_id = request.data.get("course_id")
        if not course_id:
            return Response(
                {"error": "course_id is required."}, status=status.HTTP_400_BAD_REQUEST
            )
        teach = get_object_or_404(Teach, course_id=course_id)
        user = teach.user
        if user and user.role == "instructor":  
            data = {
                "department": user.department,
                "room": user.room,
                "room_phone_number": user.room_phone_num,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": user.role,
                "email": user.email,
            }
            return Response(data, status=status.HTTP_200_OK)
        else:
            return Response(
                {
                    "error": "This course does not have an assigned instructor or the user is not an instructor."
                },
                status=status.HTTP_404_NOT_FOUND,
            )


class ListCommunityMembersView(APIView):
    def post(self, request, *args, **kwargs):
        community_id = request.data.get("community_id")
        if not community_id:
            return Response(
                {"error": "Community ID is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            members = CommunityJoin.objects.filter(
                community_id=community_id
            ).select_related("user")

            if not members.exists():
                return Response(
                    {"message": "No members found for this community."},
                    status=status.HTTP_404_NOT_FOUND,
                )
            user_data = [
                {
                    "id": member.user.id,
                    "username": member.user.username,
                    "email": member.user.email,
                }
                for member in members
            ]

            return Response(
                {"members": user_data},
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return Response(
                {"error": f"An unexpected error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class CreateCommunityAnnouncementView(APIView):
    def post(self, request):
        owner_community_id = request.data.get("owner_community_id")
        announcement_description = request.data.get("announcement_description")
        header = request.data.get("header")
        if not header or not announcement_description:
            return Response(
                {"error": "Header ve description alanları zorunludur."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            owner_community = None
            if owner_community_id:
                owner_community = Community.objects.get(community_id=owner_community_id)
        except Community.DoesNotExist:
            return Response(
                {"error": "Belirtilen community bulunamadı."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        new_announcement = CommunityAnnouncement.objects.create(
            owner_community=owner_community,
            annoucement_description=announcement_description,
            header=header,
        )

        return Response(
            {
                "success": f"Announcement '{new_announcement.header}' created successfully!"
            },
            status=status.HTTP_201_CREATED,
        )
    
class DeleteCommunityAnnouncementView(APIView):
    def post(self, request):
        announcement_id = request.data.get("announcement_id")
        if not announcement_id:
            return Response(
                {"error": "announcement_id is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            announcement = CommunityAnnouncement.objects.get(announcement_id=announcement_id)
            announcement.delete()  
            return Response(
                {"success": f"Announcement with ID {announcement_id} deleted successfully!"},
                status=status.HTTP_200_OK
            )
        except CommunityAnnouncement.DoesNotExist:
            return Response(
                {"error": f"Announcement with ID {announcement_id} not found."},
                status=status.HTTP_404_NOT_FOUND
            )
