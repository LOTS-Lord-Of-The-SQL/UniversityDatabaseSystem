from django.utils import timezone
from django.forms import ValidationError
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from . models import *
from rest_framework.response import Response
from .serializers import *
from rest_framework import status
from rest_framework.exceptions import NotFound
from django.core.exceptions import ObjectDoesNotExist






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
        

class CoursePostsView(APIView):
    def get(self, request, course_id, *args, **kwargs):
        try:
            course = Courses.objects.get(course_id=course_id)  # Kursu al
        except Courses.DoesNotExist:
            raise NotFound("Bu ID'ye sahip bir kurs bulunamadı.")

        # Kursa ait tüm postları al
        posts = Post.objects.filter(owner_course=course)
        posts_data = [
            {
                "post_id": post.post_id,
                "owner": post.owner.username,
                "is_official": post.is_official,
                "post_description": post.post_description,
                "header": post.header,
                "created_at": post.created_at,
            }
            for post in posts
        ]

        return Response({
            "course_id": course_id,
            "course_name": course.course_name,
            "posts": posts_data
        }, status=status.HTTP_200_OK)

class EnrollCourseView(APIView):
    def post(self, request, *args, **kwargs):
        user_id = request.data.get('user_id')
        course_id = request.data.get('course_id')

        if not user_id or not course_id:
            raise ValidationError("Kullanıcı ID ve Kurs ID'si gerekli.")

        try:
            user = User.objects.get(id=user_id)
        except ObjectDoesNotExist:
            return Response({"error": "Kullanıcı bulunamadı."}, status=status.HTTP_404_NOT_FOUND)

        try:
            course = Courses.objects.get(course_id=course_id)
        except ObjectDoesNotExist:
            return Response({"error": "Kurs bulunamadı."}, status=status.HTTP_404_NOT_FOUND)

        # Kullanıcının kursa zaten kaydolup kaydolmadığını kontrol et
        if CourseEnrollment.objects.filter(course=course, user=user).exists():
            return Response({"message": "Kullanıcı bu kursa zaten kayıtlı."}, status=status.HTTP_400_BAD_REQUEST)

        # Yeni CourseEnrollment kaydı oluştur
        CourseEnrollment.objects.create(course=course, user=user)

        return Response({"message": f"{user.username} kursa başarıyla kaydedildi."}, status=status.HTTP_200_CREATED)


class PostDetailView(APIView):
    def get(self, request, post_id, *args, **kwargs):
        # Postu getir
        post = get_object_or_404(Post, post_id=post_id)
        
        # Yorumları getir
        comments = Comments.objects.filter(post=post)
        
        # Beğenileri getir
        likes = Likes.objects.filter(post=post)
        
        # Yorumları ve Beğenileri serileştir
        comments_serializer = CommentsSerializer(comments, many=True)
        likes_serializer = LikesSerializer(likes, many=True)

        # Postu serileştir
        post_serializer = PostSerializer(post)

        # Yanıt olarak post, yorumlar ve beğenileri gönder
        return Response({
            'post': post_serializer.data,
            'comments': comments_serializer.data,
            'likes': likes_serializer.data,
        }, status=status.HTTP_200_OK)


class CreatePostView(APIView):
    def post(self, request, *args, **kwargs):
        # İstekten gelen verileri al
        user_id = request.data.get('user_id')
        course_id = request.data.get('course_id')
        header = request.data.get('header')
        post_description = request.data.get('post_description')
        is_official = request.data.get('is_official', False)  # Varsayılan olarak False

        # User ve Course nesnelerini veritabanından al
        user = User.objects.filter(id=user_id).first()
        course = Courses.objects.filter(course_id=course_id).first()

        # Kullanıcı ve kurs bulunamazsa hata döndür
        if not user:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if not course:
            return Response({"detail": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

        # Yeni post oluştur
        post = Post.objects.create(
            owner=user,
            owner_course=course,
            is_official=is_official,
            post_description=post_description,
            header=header
        )

        # Post oluşturulduktan sonra döndürülecek veriyi hazırlayalım
        post_serializer = PostSerializer(post)

        return Response(post_serializer.data, status=status.HTTP_201_CREATED)
    
class CreateCommentView(APIView):
    def post(self, request, *args, **kwargs):
        # İstekten gelen verileri al
        user_id = request.data.get('user_id')
        post_id = request.data.get('post_id')
        context = request.data.get('context')

        # Kullanıcı ve post nesnelerini al
        user = User.objects.filter(id=user_id).first()
        post = Post.objects.filter(post_id=post_id).first()

        # Kullanıcı ve post bulunamazsa hata döndür
        if not user:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if not post:
            return Response({"detail": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

        # Yeni yorum oluştur
        comment = Comments.objects.create(
            owner=user,
            post=post,
            context=context
        )

        # Yorum oluşturulduktan sonra döndürülecek veriyi hazırlayalım
        return Response({
            "owner": user.id,
            "post": post.post_id,
            "context": comment.context,
            "created_at": comment.created_at
        }, status=status.HTTP_201_CREATED)
    

class JoinCommunityView(APIView):
    def post(self, request, *args, **kwargs):
        # Extract data from request
        community_id = request.data.get('community_id')
        user_id = request.data.get('user_id')
        position = request.data.get('position', 'Member')  # Default position: Member
        breakpoint()
        # Validate if the community exists
        try:
            community = Community.objects.get(community_id=community_id)
        except Community.DoesNotExist:
            return Response(
                {"error": "Community does not exist."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Validate if the user exists
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "User does not exist."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Check if the user has already joined the community
        if CommunityJoin.objects.filter(community=community, user=user).exists():
            return Response(
                {"error": "User already joined this community."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Create a new CommunityJoin record
        join_entry = CommunityJoin.objects.create(
            community=community,
            user=user,
            position=position,
        )

        # Return success response with the new join entry ID
        return Response(
            {
                "message": "User successfully joined the community.",
                "join_id": join_entry.id,
            },
            status=status.HTTP_201_CREATED,
        )
    
class ListCommunitiesView(APIView):
    def post(self, request, *args, **kwargs):
        # Extract the user ID from the request
        user_id = request.data.get('user_id')

        # Validate if the user exists
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "User does not exist."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Get the list of communities the user has joined
        joined_communities = CommunityJoin.objects.filter(user=user).select_related('community')

        # Check if the user is enrolled in any communities
        if not joined_communities.exists():
            return Response(
                {"message": "User has not joined any communities."},
                status=status.HTTP_200_OK,
            )

        # Prepare the list of community names
        communities_data = [
            {"community_id": join.community.community_id, "community_name": join.community.community_name}
            for join in joined_communities
        ]

        return Response(
            {"communities": communities_data},
            status=status.HTTP_200_OK,)
    
class ReserveFacilityView(APIView):
    def post(self, request, *args, **kwargs):
        # Extract data from the request
        facility_id = request.data.get('facility_id')
        user_id = request.data.get('user_id')

        try:
            # Fetch the facility and user instances
            facility = Facilities.objects.get(facilities_id=facility_id)
            user = User.objects.get(id=user_id)

            # Get the current date (only the date, without time)
            current_date = timezone.now().date()

            # Check if the facility is already reserved by the user on the specified date
            if Reservation.objects.filter(facility=facility, reserve_user=user, date__date=current_date).exists():
                return Response(
                    {"error": "You have already reserved this facility on this date."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Check if the facility is already reserved by another user on the specified date
            if Reservation.objects.filter(facility=facility, date__date=current_date).exists():
                return Response(
                    {"error": "This facility is already reserved on the specified date."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Create the reservation
            reservation = Reservation.objects.create(
                facility=facility,
                reserve_user=user,
                date=timezone.now(),  # Save the full datetime, but compare only by date
            )

            # Return success response
            return Response(
                {"message": "Facility successfully reserved.", "reservation_id": reservation.id},
                status=status.HTTP_201_CREATED,
            )

        except Facilities.DoesNotExist:
            return Response(
                {"error": "Facility does not exist."},
                status=status.HTTP_404_NOT_FOUND,
            )

        except User.DoesNotExist:
            return Response(
                {"error": "User does not exist."},
                status=status.HTTP_404_NOT_FOUND,
            )

        except Exception as e:
            # General error handling
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class ListFacilitiesView(APIView):
    def get(self, request, *args, **kwargs):
        # Retrieve all facilities
        facilities = Facilities.objects.all()

        # Serialize the facilities
        serializer = FacilitiesSerializer(facilities, many=True)

        # Return the serialized data in the response
        return Response(serializer.data, status=status.HTTP_200_OK)