from .views import *
from django.urls import path

urlpatterns = [
    
    # coupons creation

   path('coupons/', CouponListCreateView.as_view(), name='coupon-list-create'),
    path('coupons/<int:pk>/', CouponDetailView.as_view(), name='coupon-detail'),
    path('user/coupons/',CouponView.as_view(),name='user-coupons'),

   
]