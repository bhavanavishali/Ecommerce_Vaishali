
from django.urls import path,include
from .views import *
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import HttpResponse
from django.middleware.csrf import get_token
from django.http import JsonResponse




urlpatterns = [
    # user authentication 

    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/',LogoutView.as_view(),name='logout'),

    # admin authenctication

    path('refresh_token/',TokenRefreshFromCookieView.as_view(),name='refresh_token'),
    path('adminlogin/', AdminLoginview.as_view(), name='admin-login'),
    path('admin/logout/', AdminLogoutView.as_view(), name='admin-logout'),

    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('resend-otp/', ResendOTPView.as_view(), name='resend-otp'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    
    path('google/', GoogleLoginView.as_view(), name='google_login'),
    path('get-csrf-token/', get_csrf_token, name='get-csrf-token'),
    
    path('user/',UserListCreate.as_view(),name='user-create'),
    path('user/<int:id>/',UserUpdate.as_view(),name='user-update'),
    
    # for reset passsword
   path('password/reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password/reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    

    # address

    path('address/',AddressCreateView.as_view(),name='address-create'),
    path('address/<int:id>/',AddressDetailsView.as_view(),name='address-details'),

    # Referal link

    path('referral-link/', ReferralLinkView.as_view(), name='referral-link'),

]