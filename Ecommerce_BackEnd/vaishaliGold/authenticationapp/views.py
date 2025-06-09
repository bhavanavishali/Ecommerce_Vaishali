from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.cache import cache
from rest_framework.permissions import AllowAny, IsAuthenticated,IsAdminUser
from rest_framework import status
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import *
from django.utils import timezone
from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
from jwt import decode
import logging
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework_simplejwt.views import TokenObtainPairView
from django.shortcuts import get_object_or_404
from .models import Address
from django.http import JsonResponse

from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from django.db import transaction

logger = logging.getLogger(__name__)
# Use Redis client from settings
# redis_client = settings.REDIS_CLIENT

from .models import *
from offer.models import *

from django.core.mail import send_mail
from datetime import timedelta
import random

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.core.mail import send_mail

from django.db.models import Q
from .pagination import CustomPagination

User = get_user_model()




class SignupView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        logger.info(f"Received signup request: {request.data}")
        referral_token = request.data.get('referral_token')
        referral_code = request.data.get('referral_code')
        serializer_data = request.data.copy()

        if referral_token:
            try:
                referrer = User.objects.get(referral_code=referral_token)
                serializer_data['referral_code'] = referral_token
            except User.DoesNotExist:
                return Response({'error': 'Invalid referral token'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = UserSerializer(data=serializer_data)
        if serializer.is_valid():
            user = serializer.save()
            # UserProfile.objects.create(user=user)
            return Response({
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        logger.error(f"Validation errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(ensure_csrf_cookie, name='dispatch')
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        

        if not email or not password:
            return Response({'error': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

        if not user.check_password(password):
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not user.is_active:
            return Response({'error': 'Account not verified or blocked.'}, status=status.HTTP_403_FORBIDDEN)

        # Generate token
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)
        
        response = Response({
            'user': {
                'id': user.id,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'username': user.username,
                'email': user.email,
                'is_superadmin': user.is_superadmin,
            },
            'message': 'Login successful'
        }, status=status.HTTP_200_OK)

        
        response.set_cookie(
            key='access_token',
            value=access_token,
            httponly=True,  
            secure=False,  
            samesite='lax', 
            max_age=86400,  
            
        )
        
       
        response.set_cookie(
            key='refresh_token',
            value=refresh_token,
            httponly=True,  
            secure=False,  
            samesite='lax',  
            max_age=86400,  
             
        )
        return response


from rest_framework_simplejwt.exceptions import TokenError
@method_decorator(csrf_exempt, name='dispatch')
class LogoutView(APIView):
    def post(self, request):  
       
        print("Logout request received")

        
        refresh_token = request.COOKIES.get('refresh_token')
        print("Refresh token:", refresh_token)
        print("userrrrr",request.user)
        response = Response({'message': 'Logged out successfully.'})

        
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist() 
            except TokenError:
                return Response({'error': 'Invalid refresh token'}, status=400)

       
        response.delete_cookie('refresh_token')
        response.delete_cookie('access_token')  
        return response

class AdminLogoutView(APIView):
    
    permission_classes = [IsAdminUser]

    def post(self, request):  
       
        print("Logout request received")

        
        refresh_token = request.COOKIES.get('refresh_token')
        print("Refresh token:",refresh_token)
        
        response = Response({'message': 'Logged out successfully.'})

        
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist() 
            except TokenError:
                return Response({'error': 'Invalid refresh token'}, status=400)

       
        response.delete_cookie('refresh_token')
        response.delete_cookie('access_token')  
        return response

class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        try:
            user = User.objects.get(email=email)
            cache_key = f"otp_{email}"
            stored_data = cache.get(cache_key)
            if stored_data and stored_data['otp_code'] == otp and not stored_data['is_verified']:
                user.is_active = True
                user.is_email_verified = True
                user.save()
                stored_data['is_verified'] = True
                cache.set(cache_key, stored_data, timeout=120)
                cache.delete(cache_key)

                
                referral = Referral.objects.filter(referred_user=user).first()
                if referral and not referral.rewarded:
                    with transaction.atomic():
                        
                        coupon_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
                        while Coupon.objects.filter(coupon_code=coupon_code).exists():
                            coupon_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
                        referrer_coupon = Coupon.objects.create(
                            coupon_name=f"Referral Reward for {referral.referrer.email}",
                            coupon_code=coupon_code,
                            discount=10.00,
                            valid_from=timezone.now().date(),
                            valid_to=(timezone.now() + timedelta(days=30)).date(),
                            is_active=True,
                            max_uses=1,
                            min_amount=50.00,
                            coupon_type='flat',
                            user=referral.referrer
                        )
                        
                        welcome_coupon_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
                        while Coupon.objects.filter(coupon_code=welcome_coupon_code).exists():
                            welcome_coupon_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
                        referred_coupon = Coupon.objects.create(
                            coupon_name=f"Welcome Coupon for {user.email}",
                            coupon_code=welcome_coupon_code,
                            discount=5.00,
                            valid_from=timezone.now().date(),
                            valid_to=(timezone.now() + timedelta(days=30)).date(),
                            is_active=True,
                            max_uses=1,
                            min_amount=50.00,
                            coupon_type='referral',
                            user=user
                        )
                        referral.referrer_coupon = referrer_coupon
                        referral.referred_coupon = referred_coupon
                        referral.rewarded = True
                        referral.save()
                        logger.info(f"Referral coupon {coupon_code} created for {referral.referrer.email}")
                        logger.info(f"Welcome coupon {welcome_coupon_code} created for {user.email}")
                return Response({'message': 'Account verified successfully'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid or expired OTP'}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_400_BAD_REQUEST)


        
class ResendOTPView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            user = User.objects.get(email=email)
            
            
            if user.is_active:
                return Response({'error': 'User is already verified'}, status=status.HTTP_400_BAD_REQUEST)
                
            
            otp = str(random.randint(100000, 999999))
            
            
            cache_key = f"otp_{email}"
            cache_data = {
                'otp_code': otp,
                'created_at': timezone.now().isoformat(),
                'expires_at': (timezone.now() + timedelta(minutes=5)).isoformat(),
                'is_verified': False
            }
            cache.set(cache_key, cache_data, timeout=300)  
            
            try:
                send_mail(
                    'Your New OTP for Sign Up',
                    f'Your new OTP is {otp}. It expires in 5 minutes.',
                    'bhavana.vayshali@gmail.com',
                    [email],
                    fail_silently=False,
                )
                return Response({'message': 'New OTP sent successfully'}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'error': f'Failed to send email: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_400_BAD_REQUEST)
      


class ReferralLinkView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        referral_link = f"{settings.BASE_URL[0].rstrip('/')}/signup?referral_token={user.referral_code}"
        print("dddd",referral_link)
        return Response({
            'referral_code': user.referral_code,
            'referral_link': referral_link
        }, status=status.HTTP_200_OK)
           
@method_decorator(ensure_csrf_cookie, name='dispatch')
class AdminLoginview(APIView):
    

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        

        if not email or not password:
            return Response({'error': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user =User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
        print(f"User: {user}, is_admin: {user.is_admin}, is_active: {user.is_active}")

        if not user.check_password(password):
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not user.is_active:
            return Response({'error': 'Account not verified or blocked.'}, status=status.HTTP_403_FORBIDDEN)
        if not user.is_admin:
            return Response({'error': 'This is not an admin'}, status=status.HTTP_401_UNAUTHORIZED)

        # Generate token
        print(user)
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)
        print(access_token)
        print(refresh_token)


        response = Response({
            'user': {
                'id': user.id,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'username': user.username,
                'email': user.email,
                'is_superadmin': user.is_superadmin,
            },
            'message': 'Admin Login successful'
        }, status=status.HTTP_200_OK)

        
        response.set_cookie(
            key='access_token',
            value=access_token,
            httponly=True,  
            secure=False,  
            samesite='lax',  
            max_age=604800, 
        )
        
       
        response.set_cookie(
            key='refresh_token',
            value=refresh_token,
            httponly=True,  
            secure=False, 
            samesite='lax',  
            max_age=604800,  
             
        )
        return response


from django.http import JsonResponse
from django.middleware.csrf import get_token

@ensure_csrf_cookie
def get_csrf_token(request):
    print("REquest for cser")
    return JsonResponse({'detail': 'CSRF cookie set'})



        

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        logger.info(f"Fetching profile for user: {request.user.email}")
        try:
            profile = UserProfile.objects.select_related('user').get(user=request.user)
            serializer = UserProfileSerializer(profile)
            return Response({
                'status': 'success',
                'user': serializer.data
            }, status=status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            logger.error(f"Profile not found for user: {request.user.email}")
            return Response({
                'status': 'error',
                'message': 'Profile not found'
            }, status=status.HTTP_404_NOT_FOUND)
        


    def patch(self, request):
        logger.info(f"Updating profile for  data: {request.data}")
        try:
            user_profile = UserProfile.objects.get(user=request.user)
            serializer = UserProfileSerializer(user_profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'status': 'success',
                    'user': serializer.data
                }, status=status.HTTP_200_OK)
            logger.error(f"Validation errors: {serializer.errors}")
            return Response({
                'status': 'error',
                'message': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        except UserProfile.DoesNotExist:
            logger.error(f"Profile not found for user: {request.user.email}")
            return Response({
                'status': 'error',
                'message': 'Profile not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return Response({
                'status': 'error',
                'message': f"An error occurred: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        
class GoogleLoginView(APIView):
    @csrf_exempt
    def post(self, request):
        serializer = GoogleAuthSerializer(data=request.data)
        
        if serializer.is_valid():
            id_token_str = serializer.validated_data['id_token']
            
            try:
                idinfo = id_token.verify_oauth2_token(
                    id_token_str,
                    requests.Request(),
                    settings.GOOGLE_CLIENT_ID
                )
                
                if idinfo['aud'] != settings.GOOGLE_CLIENT_ID:
                    return Response(
                        {'error': 'Invalid token audience'},
                        status=status.HTTP_401_UNAUTHORIZED
                    )
                
                google_id = idinfo['sub']
                email = idinfo['email']
                first_name = idinfo.get('given_name', '')
                last_name = idinfo.get('family_name', '')
                
                try:
                    user = User.objects.get(email=email)
                    if not user.google_id:
                        user.google_id = google_id
                        user.save()
                        
                        if not hasattr(user, 'user') or not user.user:
                            UserProfile.objects.create(user=user)
                except User.DoesNotExist:
                    username = email.split('@')[0]
                    if User.objects.filter(username=username).exists():
                        username = f"{username}_{google_id[:6]}"
                    
                    user = User.objects.create_user(
                        username=username,
                        email=email,
                        google_id=google_id,
                        first_name=first_name,
                        
                        
                        last_name=last_name,
                        
                        phone_number=''  
                    )
                    
                
                refresh_token = RefreshToken.for_user(user)
                access_token = refresh_token.access_token

                response = Response({
                    'user': UserSerializer(user).data
                })
                
                response.set_cookie(
                    key='access_token',
                    value=access_token,
                    httponly=True,
                    secure=False,  # Set to True in production
                    samesite='lax',
                    max_age=86400,
                )
                
                response.set_cookie(
                    key='refresh_token',
                    value=refresh_token,
                    httponly=True,
                    secure=False,  # Set to True in production
                    samesite='lax',
                    max_age=86400,
                )
                
                return response
                
            except ValueError:
                return Response(
                    {'error': 'Invalid token'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



#================ User management=================================

from rest_framework.exceptions import NotAuthenticated

class UserListCreate(APIView):
    permission_classes = [IsAuthenticated]

    

    def get(self, request):
        search_query = request.query_params.get('search', '')
        users = User.objects.filter(
            is_superadmin=False
        ).filter(
            Q(first_name__icontains=search_query) |
            Q(last_name__icontains=search_query) |
            Q(email__icontains=search_query) |
            Q(phone_number__icontains=search_query)
        ).order_by('-date_joined')

        
        paginator = CustomPagination()
        paginated_users = paginator.paginate_queryset(users, request)
        serializer = UserSerializer(paginated_users, many=True)
        return paginator.get_paginated_response(serializer.data)
    
    def post(self,request):
        data=request.data
        serializer=UserSerializer(data=data)
        if serializer.is_valid():
            user=serializer.save()
            UserProfile.objects.create(user=user)
            return Response(UserSerializer(user).data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
class UserUpdate(APIView):
    def patch(self, request, id):
        user = get_object_or_404(User, id=id)
        serializer = UserSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#=============== Address============================= 

class AddressCreateView(APIView):
    def get(self, request):
        if not request.user.is_authenticated:
            raise NotAuthenticated("User must be authenticated")

        addresses = Address.objects.filter(user__email=request.user.email)
        serializer = AddressSerializer(addresses, many=True)
        return Response(serializer.data)
    
    def post(self,request):
        serializer=AddressSerializer(data=request.data)
        print("it is address",request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    

class AddressDetailsView(APIView):
    def get_object(self,id):
        return get_object_or_404(Address,id=id)
    
    def get(self,request,id):
        address=self.get_object(id)
        serializer=AddressSerializer(address)
        return Response(serializer.data)
    def patch(self,request,id):
        address=self.get_object(id)
        serializer=AddressSerializer(address,data=request.data,partial=True,context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

    def delete(self,request,id):
        address=self.get_object(id)
        address.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

#================== password reset ==================================

from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import force_str, force_bytes
class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):

       
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = User.objects.get(email=email)
            
            
            token_generator = PasswordResetTokenGenerator()
            token = token_generator.make_token(user)
            uidb64 = urlsafe_base64_encode(force_bytes(user.id))
            
            
            # reset_link = f"http://localhost:5173/reset-password/{uidb64}/{token}/"
            reset_link = f"{settings.BASE_URL[0].rstrip('/')}/reset-password/{uidb64}/{token}/"
            # Send email
            send_mail(
                'Password Reset Request',
                f'Click this link to reset your password: {reset_link}',
                'from@example.com',
                [email],
                fail_silently=False,
            )
            
            return Response(
                {"message": "Password reset link has been sent to your email."},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetConfirmView(APIView):
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            token = serializer.validated_data['token']
            uidb64 = serializer.validated_data['uidb64']
            new_password = serializer.validated_data['new_password']
            
            try:
                user_id = force_str(urlsafe_base64_decode(uidb64))
                user = User.objects.get(pk=user_id)
                
                token_generator = PasswordResetTokenGenerator()
                if token_generator.check_token(user, token):
                    user.set_password(new_password)
                    user.save()
                    return Response(
                        {"message": "Password has been reset successfully."},
                        status=status.HTTP_200_OK
                    )
                else:
                    return Response(
                        {"error": "Invalid or expired token."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            except (User.DoesNotExist, ValueError):
                return Response(
                    {"error": "Invalid user."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class PasswordChangeView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            current_password = serializer.validated_data['current_password']
            new_password = serializer.validated_data['new_password']
            
            # Verify current password
            if not user.check_password(current_password):
                return Response(
                    {"error": "Current password is incorrect."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Set new password
            user.set_password(new_password)
            user.save()
            
            return Response(
                {"message": "Password has been changed successfully."},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    



class TokenRefreshFromCookieView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    def post(self, request):
        # Extract the refresh token from cookies
        refresh_token = request.COOKIES.get('refresh_token')
        
        

        if not refresh_token:
            return Response(
                {"detail": "Refresh token not provided."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
           
            refresh = RefreshToken(refresh_token)
            print(refresh)
            access_token = str(refresh.access_token)
           
            # Decode refresh token
            token_payload = refresh.payload
            user_id = token_payload['user_id']
        
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

            
            response = Response({
                'detail': 'Token refreshed successfully'
            }, status=status.HTTP_200_OK)
            
            # Set the token in HttpOnly cookie
            response.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,  
                secure=False,  
                samesite='lax', 
                max_age=86400,  
            )
            
            # Set the refresh token in HttpOnly cookie
            response.set_cookie(
                key='refresh_token',
                value=refresh_token,
                httponly=True,  
                secure=False,  # Set to False for development/localhost
                samesite='lax',  
                max_age=86400,  
            )
            return response
            
        except TokenError as e:
            print(f"Token Error: {str(e)}") 
            return Response(
                {"detail": f"Invalid or expired refresh token: {str(e)}"},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        except Exception as e:
            print(f"Unexpected error: {str(e)}, {type(e)}")  # Log any other exception
            return Response(
                {"detail": f"Error processing token: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
 

