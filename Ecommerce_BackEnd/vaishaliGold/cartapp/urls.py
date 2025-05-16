from django.urls import path
from .views import*
from . import views

urlpatterns = [
    path('cart/', CartListCreateView.as_view(), name='cart-list-create'),
    path('cart/<int:id>/', CartDetailView.as_view(), name='cart-detail'),
    path('cart/add/', AddToCartView.as_view(), name='cart-add'),
    path('cart/update/', UpdateCartItemView.as_view(), name='cart-update'),
    path('cart/remove/', RemoveFromCartView.as_view(), name='cart-remove'),
    path('cart/clear/', ClearCartView.as_view(), name='cart-clear'),

    # order related views 
    path('orders/',OrderListView.as_view(),name='orders-list'),
    path('orders/<int:id>/', CurrentOrderListView.as_view(), name='order-list'),
    path('orders/create/', OrderCreateView.as_view(), name='order-create'),
    path('userorders/', OrderDetailView.as_view(), name='order-detail'),
    path('orderupdating/<int:id>/', views.OrderUpdateView.as_view(), name='order-update'),

    # order cancled
    path('orders/<int:id>/cancel/', OrderCancelView.as_view(), name='order-cancel'),
    path('orderitems/<int:id>/cancel/',OrderItemCancelView.as_view(),name='order-item-cancel'),
    path('orderitems/<int:id>/', views.OrderItemDetailView.as_view(), name='order-item-detail'),

    #user returned order
    path('orders/<int:pk>/return/', OrderReturnRequestView.as_view(), name='order-return-request'),
    path('orderitems/<int:id>/return/', OrderItemReturnRequestView.as_view(), name='order-item-return-request'),
     
    # admin aproval
    path('orders/<int:id>/return/approve/', AdminOrderReturnApprovalView.as_view(), name='admin-order-return-approval'),
    path('orderitems/<int:id>/return/approve/', AdminOrderItemReturnApprovalView.as_view(), name='admin-order-item-return-approval'),
    
    # Wallet endpoints
    path('wallet/', WalletView.as_view(), name='wallet'),
    path('wallet/transactions/', WalletTransactionHistoryView.as_view(), name='wallet-transactions'),

    # wishlist 

    path('wishlist/', WishlistView.as_view(), name='wishlist'),
    path('wishlist/add/', AddToWishlistView.as_view(), name='add-to-wishlist'),
    path('wishlist/remove/', RemoveFromWishlistView.as_view(), name='remove-from-wishlist'),


   # razorpay
   
    path('orders/razorpay/create/', RazorpayOrderCreateView.as_view(), name='razorpay-order-create'),
    path('orders/razorpay/verify/', RazorpayPaymentVerificationView.as_view(), name='razorpay-payment-verify'),
    path('orders/razorpay/retry/', RetryRazorpayPaymentView.as_view(), name='razorpay-payment-retry'),

    # coupon 

    path('apply-coupon/', CouponApplyView.as_view(), name='apply-offer'),
    path('remove-coupon/',RemoveCouponView.as_view(),name='remove-coupon'),
    # Salesreport

    path('sales-report/', SalesReportView.as_view(), name='sales-report'),
]