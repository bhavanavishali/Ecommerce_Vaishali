from .views import *
from django.urls import path

urlpatterns = [
    
    # coupons creation

    path('coupons/', CouponListCreateView.as_view(), name='coupon-list-create'),
    path('coupons/<int:pk>/', CouponDetailView.as_view(), name='coupon-detail'),
    path('user/coupons/',CouponView.as_view(),name='user-coupons'),
    path('user/available-coupons/', AvailableCouponsView.as_view(), name='available-coupons'),

   # Dashboard 

    path('api/sales-data/', SalesDataView.as_view(), name='sales-data'),
    path('api/top-products/', TopProductsView.as_view(), name='top-products'),
    path('api/top-categories/', TopCategoriesView.as_view(), name='top-categories'),
]