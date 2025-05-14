
from django.shortcuts import render
from .models import  *
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from productsapp.models import ProductVariant
from django.shortcuts import get_object_or_404
from rest_framework import status, permissions
from datetime import datetime

# ==========================  Cart related views   ============================


class CartListCreateView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)
    
    def post(self, request):
        
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class CartDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, id):
        cart = get_object_or_404(Cart, id=id, user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)


class AddToCartView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        variant_id = request.data.get('variant_id')
        if not variant_id or not str(variant_id).isdigit():
            return Response({'error': 'Valid variant_id is required'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        try:
            quantity = int(request.data.get('quantity', 1))
            if quantity <= 0:
                return Response({'error': 'Quantity must be positive'}, 
                              status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response({'error': 'Invalid quantity'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        try:
            variant = ProductVariant.objects.get(id=variant_id, available=True, is_active=True)
        except ProductVariant.DoesNotExist:
            return Response({'error': 'Variant not found or not available'}, status=status.HTTP_404_NOT_FOUND)
        
        cart_item, created = CartItem.objects.get_or_create(cart=cart,variant=variant,defaults={'quantity': quantity})
        
        if not created:
            cart_item.quantity += quantity
        
        if cart_item.quantity > variant.stock:
            return Response({'error': 'Insufficient stock'}, status=status.HTTP_400_BAD_REQUEST)
        
        cart_item.save() # Triggers cart.update_totals()
        serializer = CartSerializer(cart)
        return Response(serializer.data)
    

class UpdateCartItemView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        cart = get_object_or_404(Cart, user=request.user)
        item_id = request.data.get('item_id')
        quantity = int(request.data.get('quantity'))
        
        try:
            item = CartItem.objects.get(id=item_id, cart=cart)
        except CartItem.DoesNotExist:
            return Response({'error': 'Item not found'}, 
                          status=status.HTTP_404_NOT_FOUND)
        
        if quantity <= 0:
            item.delete()
        else:
            if quantity > item.variant.stock:
                return Response({'error': 'Insufficient stock'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            item.quantity = quantity
            item.save()  # Triggers cart.update_totals()
        
        serializer = CartSerializer(cart)
        return Response(serializer.data)
class RemoveFromCartView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        cart = get_object_or_404(Cart, user=request.user)
        item_id = request.data.get('item_id')
        
        try:
            item = CartItem.objects.get(id=item_id, cart=cart)
            item.delete()
        except CartItem.DoesNotExist:
            return Response({'error': 'Item not found'}, 
                          status=status.HTTP_404_NOT_FOUND)
        
        serializer = CartSerializer(cart)
        return Response(serializer.data)
    
#======================== Coupon apply==================================


class CouponApplyView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        code = request.data.get('code')
        logger.debug("Applying coupon code: %s for user: %s", code, request.user.username)
        if not code:
            return Response({'error': 'Coupon code is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart = get_object_or_404(Cart, user=request.user)
            discount = cart.apply_coupon(code)
            serializer = CartSerializer(cart)
            coupon = cart.coupon
            logger.info("Coupon %s applied successfully for user %s", code, request.user.username)
            return Response({
                'message': 'Coupon applied successfully',
                'coupon': CouponSerializer(coupon).data if coupon else None,
                'discount': float(discount),
                'cart': serializer.data
            }, status=status.HTTP_200_OK)
        except ValidationError as e:
            logger.warning("Validation error applying coupon %s: %s", code, str(e))
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error("Unexpected error applying coupon %s: %s", code, str(e), exc_info=True)
            return Response({'error': 'An unexpected error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class RemoveCouponView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            cart = get_object_or_404(Cart, user=request.user)
            cart.remove_coupon()
            serializer = CartSerializer(cart)
            return Response({
                'message': 'Coupon removed successfully',
                'cart': serializer.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
#  ==========================  Order Related Views   ===============================


class OrderCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data.copy()
        data['user'] = request.user.id

        serializer = OrderSerializer(data=data, context={'request': request})
        if not serializer.is_valid():
            logger.error(f"Validation errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            order = serializer.save()
            logger.info(f"Order {order.order_number} created successfully for user {request.user.username}")
            response_data = {
                "message": "Order created successfully",
                "order": OrderSerializer(order, context={'request': request}).data
            }
            if order.payment_method == 'wallet':
                response_data["wallet_balance"] = Wallet.objects.get(user=request.user).balance
            return Response(response_data, status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.error(f"Error in OrderCreateView for user {request.user.username}: {str(e)}")
            return Response(
                {"error": "An error occurred while processing your order.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
class CurrentOrderListView(APIView):

    def get(self, request,id):
        try:
            order = Order.objects.get(id=id)
            print("order details",order)
            serializer = OrderSerializer(order)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found or doesn't belong to you"}, 
                status=status.HTTP_404_NOT_FOUND
            )


class OrderDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request,  *args, **kwargs):
        orders = Order.objects.filter(user=request.user).order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

		
# ============================ Cancle order views =========================

class OrderCancelView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        try:
            
            order = Order.objects.get(id=id, user=request.user)
        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found or you don't have permission to cancel it."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = OrderCancelSerializer(order, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "message": "Order cancelled successfully.",
                    "data": {
                        "id": order.id,
                        "cancel_reason": order.cancel_reason,
                        "status": order.status,
                        "cancelled_at": order.cancelled_at,
                    }
                },
                status=status.HTTP_200_OK
            )
        return Response({"errorss": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    

#====================== Cancel order item view  ========================



class OrderItemDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, id):
        try:
            order_item = OrderItem.objects.get(id=id, order__user=request.user)
            serializer = OrderItemSerializer(order_item)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except OrderItem.DoesNotExist:
            return Response(
                {"error": "Order item not found or you don't have permission to view it."},
                status=status.HTTP_404_NOT_FOUND
            )

class OrderItemCancelView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        try:
            order_item = OrderItem.objects.get(id=id,order__user=request.user)
        except OrderItem.DoesNotExist:
            return Response({"error": "Order item not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = OrderItemCancelSerializer(
            instance=order_item,
            data=request.data,
            context={'request': request}
        )

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Order item cancelled successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
#============================= Order return view============================

class OrderReturnRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            order = Order.objects.get(pk=pk, user=request.user)
        except Order.DoesNotExist:
            return Response({
                "error": "Order not found or you do not have permission to access it"
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = OrderReturnSerializer(order, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Return request submitted successfully",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    



class AdminOrderReturnApprovalView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, id):
        try:
            order = Order.objects.get(id=id)
        except Order.DoesNotExist:
            return Response({
                "error": "Order not found"
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = AdminOrderReturnApprovalSerializer(order, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            action = "approved" if request.data.get("approve") else "denied"
            response_data = {
                "message": f"Order return request {action} successfully",
                "data": {
                    "id": order.id,
                    "status": order.status,
                    "approve_status": order.approve_status,
                    "wallet_transaction": serializer.data.get('wallet_transaction')
                }
            }
            return Response(response_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#================== OrderItem Return views=======================


class OrderItemReturnRequestView(APIView):

    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        try:
            order_item = OrderItem.objects.get(id=id, order__user=request.user)
        except OrderItem.DoesNotExist:
            return Response({
                "error": "Order item not found or you do not have permission to access it"
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = OrderItemReturnSerializer(order_item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Return request for item submitted successfully",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





class AdminOrderItemReturnApprovalView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, id):
        try:
            order_item = OrderItem.objects.get(id=id)
        except OrderItem.DoesNotExist:
            return Response({
                "error": "Order item not found"
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = AdminOrderItemReturnApprovalSerializer(order_item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            action = "approved" if request.data.get("approve") else "denied"
            response_data = {
                "message": f"Order item return request {action} successfully",
                "data": {
                    "id": order_item.id,
                    "status": order_item.status,
                    "wallet_transaction": serializer.data.get('wallet_transaction')
                }
            }
            return Response(response_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# ===================Listing the all order in admin side===================


class OrderListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self,request):
        order=Order.objects.all().order_by('-created_at')
        serializer=OrderSerializer(order,many=True)
        return Response(serializer.data)


class OrderUpdateView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, id, *args, **kwargs):
        try:
            order = Order.objects.get(id=id)
            order_status = request.data.get('status')
            if order_status not in ['pending', 'processing', 'shipped', 'delivered', 'cancelled']:
                return Response(
                    {"error": "Invalid status"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Update order status
            order.status = order_status
            
            # If the order status is 'delivered', update all active OrderItems to 'delivered'
            if order_status == 'delivered':
                with transaction.atomic():
                    for item in order.items.filter(status='active'):
                        item.status = 'delivered'
                        item.save()

            order.save()
            serializer = OrderSerializer(order)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found or doesn't belong to you"},
                status=status.HTTP_404_NOT_FOUND
            )
        
#================ Wallet ========================


class WalletView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            wallet, _ = Wallet.objects.get_or_create(user=request.user)
            serializer = WalletSerializer(wallet)
            return Response(
                {
                    "message": "Wallet balance retrieved successfully",
                    "data": serializer.data
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            logger.exception("Error retrieving wallet: %s", str(e))
            return Response(
                {"error": f"Failed to retrieve wallet: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class WalletTransactionHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        wallet, _ = Wallet.objects.get_or_create(user=request.user)
        transactions = wallet.transactions.all().order_by('-created_at')
        serializer = WalletTransactionSerializer(transactions, many=True)
        return Response({
            "message": "Wallet transaction history retrieved successfully",
            "data": serializer.data
        }, status=status.HTTP_200_OK)


#================= Wishlist ==========================


class WishlistView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        wishlist, _ = Wishlist.objects.prefetch_related('items__variant__product').get_or_create(user=request.user)
        serializer = WishlistSerializer(wishlist)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AddToWishlistView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        variant_id = request.data.get('variant')
        
        if not variant_id or not str(variant_id).isdigit():
            return Response({'error': 'Valid variant_id is required'}, 
                           status=status.HTTP_400_BAD_REQUEST)

        if wishlist.items.count() >= 50:  # Maximum wishlist size
            return Response({'error': 'Wishlist cannot exceed 50 items'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        try:
            variant = ProductVariant.objects.select_related('product').get(
                id=variant_id, available=True, is_active=True
            )
        except ProductVariant.DoesNotExist:
            return Response({'error': 'Variant not found or not available'}, 
                           status=status.HTTP_404_NOT_FOUND)

        if WishlistItem.objects.filter(wishlist=wishlist, variant=variant).exists():
            return Response({'message': 'Product already in wishlist'}, 
                           status=status.HTTP_200_OK)

        WishlistItem.objects.create(wishlist=wishlist, variant=variant)
        serializer = WishlistSerializer(wishlist)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class RemoveFromWishlistView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        wishlist = get_object_or_404(Wishlist, user=request.user)
        item_id = request.data.get('item_id')

        if not item_id or not str(item_id).isdigit():
            return Response({'error': 'Valid item_id is required'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        try:
            item = WishlistItem.objects.get(id=item_id, wishlist=wishlist)
            item.delete()
        except WishlistItem.DoesNotExist:
            return Response({'error': 'Item not found'}, 
                           status=status.HTTP_404_NOT_FOUND)

        serializer = WishlistSerializer(wishlist)
        return Response(serializer.data, status=status.HTTP_200_OK)


# ======================RazorPay setting for order=======================


import razorpay
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Cart, Order, OrderAddress, OrderItem
from .serializers import OrderSerializer
from decimal import Decimal



import logging
logger = logging.getLogger(__name__)

# Utility function to create OrderAddress
def create_order_address(order, address):
    return OrderAddress.objects.create(
        order=order,
        name=address.name,
        house_no=address.house_no,
        city=address.city,
        state=address.state,
        pin_code=address.pin_code,
        address_type=address.address_type,
        landmark=address.landmark,
        mobile_number=address.mobile_number,
        alternate_number=address.alternate_number         
    )
# class RazorpayOrderCreateView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         try:
#             cart = get_object_or_404(Cart, user=request.user)
#             if not cart.items.exists():
#                 return Response({"error": "Your cart is empty."}, status=status.HTTP_400_BAD_REQUEST)

#             address_id = request.data.get('address_id')
#             coupon_code = request.data.get('coupon_code')
#             if not address_id or not str(address_id).isdigit():
#                 return Response({"error": "Valid address_id is required."},
#                                status=status.HTTP_400_BAD_REQUEST)

#             address = get_object_or_404(Address, id=address_id, user=request.user)
#             coupon = None
#             coupon_discount = Decimal('0.00')
#             if coupon_code:
#                 try:
#                     coupon = Coupon.objects.get(coupon_code=coupon_code)
#                     if not coupon.is_valid():
#                         return Response({"error": "Coupon is not valid or has expired."},
#                                         status=status.HTTP_400_BAD_REQUEST)
#                     total_amount = cart.get_final_subtotal()
#                     if total_amount < coupon.min_amount:
#                         return Response(
#                             {"error": f"Order total must be at least {coupon.min_amount} to use this coupon"},
#                             status=status.HTTP_400_BAD_REQUEST
#                         )
#                     coupon_discount = coupon.discount if coupon.coupon_type == 'flat' else (coupon.discount / 100) * total_amount
#                     if coupon_discount > total_amount:
#                         coupon_discount = total_amount
#                     coupon.used_count += 1
#                     coupon.save()
#                 except Coupon.DoesNotExist:
#                     return Response({"error": "Invalid coupon code."}, status=status.HTTP_400_BAD_REQUEST)

#             total_amount = cart.get_final_subtotal()
#             total_discount = cart.get_final_discount()
#             total_tax = cart.get_final_tax()
#             final_total = total_amount - total_discount - coupon_discount + total_tax
#             if final_total <= 0:
#                 return Response({"error": "Order amount must be positive"},
#                                status=status.HTTP_400_BAD_REQUEST)
#             amount_in_paisa = int(final_total * 100)

#             client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
#             razorpay_order = client.order.create({
#                 'amount': amount_in_paisa,
#                 'currency': 'INR',
#                 'payment_capture': 1
#             })

#             order = Order.objects.create(
#                 user=request.user,
#                 cart=cart,
#                 address=address,
#                 total_amount=total_amount,
#                 total_discount=total_discount,
#                 coupon_discount=coupon_discount,
#                 total_tax=total_tax,
#                 final_total=final_total,
#                 payment_method='card',
#                 status='pending',
              
#                 coupon=coupon
#             )

#             create_order_address(order, address)

#             for cart_item in cart.items.all():
#                 if cart_item.quantity > cart_item.variant.stock:
#                     order.delete()
#                     return Response(
#                         {"error": f"Not enough stock for {cart_item.variant.product.name}"},
#                         status=status.HTTP_400_BAD_REQUEST
#                     )

#                 subtotal = cart_item.get_subtotal()
#                 item_discount = cart_item.get_discount_amount()
#                 tax = cart_item.get_tax_amount()
#                 item_coupon_discount = Decimal('0.00')
#                 if coupon and total_amount > 0:
#                     proportion = subtotal / total_amount
#                     item_coupon_discount = coupon_discount * proportion
#                 final_price = subtotal - item_discount - item_coupon_discount + tax

#                 OrderItem.objects.create(
#                     order=order,
#                     variant=cart_item.variant,
#                     quantity=cart_item.quantity,
#                     price=cart_item.variant.total_price,
#                     subtotal=subtotal,
#                     discount=item_discount,
#                     coupon_discount=item_coupon_discount,
#                     tax=tax,
#                     final_price=final_price
                    
#                 )

#                 cart_item.variant.stock -= cart_item.quantity
#                 cart_item.variant.save()

#             order.razorpay_order_id = razorpay_order["id"]
#             order.save()

#             cart.clear()

#             return Response({
#                 'order_id': razorpay_order['id'],
#                 'amount': amount_in_paisa,
#                 'currency': 'INR',
#                 'key': settings.RAZORPAY_KEY_ID,
#                 'order': OrderSerializer(order).data
#             }, status=status.HTTP_200_OK)

#         except Exception as e:
#             logger.exception("Error creating Razorpay order: %s", str(e))
#             return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



# class RazorpayOrderCreateView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         try:
#             cart = get_object_or_404(Cart, user=request.user)
#             if not cart.items.exists():
#                 return Response({"error": "Your cart is Issues empty."}, status=status.HTTP_400_BAD_REQUEST)

#             address_id = request.data.get('address_id')
#             coupon_code = request.data.get('coupon_code')
#             if coupon_code and cart.coupon and cart.coupon.coupon_code != coupon_code:
#                 return Response({"error": "Coupon code does not match the applied coupon in cart."}, status=status.HTTP_400_BAD_REQUEST)
#             if not address_id or not str(address_id).isdigit():
#                 return Response({"error": "Valid address_id is required."},
#                                status=status.HTTP_400_BAD_REQUEST)

#             address = get_object_or_404(Address, id=address_id, user=request.user)
#             coupon = None
#             coupon_discount = Decimal('0.00')
#             if coupon_code:
#                 try:
#                     coupon = Coupon.objects.get(coupon_code=coupon_code)
#                     if not coupon.is_valid():
#                         return Response({"error": "Coupon is not valid or has expired."},
#                                         status=status.HTTP_400_BAD_REQUEST)
#                     total_amount = cart.get_final_subtotal()
#                     if total_amount < coupon.min_amount:
#                         return Response(
#                             {"error": f"Order total must be at least {coupon.min_amount} to use this coupon"},
#                             status=status.HTTP_400_BAD_REQUEST
#                         )
#                     coupon_discount = coupon.discount if coupon.coupon_type == 'flat' else (coupon.discount / 100) * total_amount
#                     if coupon_discount > total_amount:
#                         coupon_discount = total_amount
#                     coupon.used_count += 1
#                     coupon.save()
#                 except Coupon.DoesNotExist:
#                     return Response({"error": "Invalid coupon ID."}, status=status.HTTP_400_BAD_REQUEST)

#             total_amount = cart.get_final_subtotal()
#             total_discount = cart.get_final_discount()
#             total_tax = cart.get_final_tax()
#             final_total = total_amount - total_discount - coupon_discount + total_tax
#             if final_total <= 0:
#                 return Response({"error": "Order amount must be positive"},
#                                status=status.HTTP_400_BAD_REQUEST)
#             amount_in_paisa = int(final_total * 100)

#             client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
#             razorpay_order = client.order.create({
#                 'amount': amount_in_paisa,
#                 'currency': 'INR',
#                 'payment_capture': 1
#             })

#             order = Order.objects.create(
#                 user=request.user,
#                 cart=cart,
#                 address=address,
#                 total_amount=total_amount,
#                 total_discount=total_discount,
#                 coupon=coupon,
#                 coupon_discount=coupon_discount,
#                 total_tax=total_tax,
#                 final_total=final_total,
#                 payment_method='card',
#                 status='pending',
                
#             )

#             create_order_address(order, address)

#             for cart_item in cart.items.all():
#                 if cart_item.quantity > cart_item.variant.stock:
#                     order.delete()
#                     return Response(
#                         {"error": f"Not enough stock for {cart_item.variant.product.name}"},
#                         status=status.HTTP_400_BAD_REQUEST
#                     )

#                 subtotal = cart_item.get_subtotal()
#                 item_discount = cart_item.get_discount_amount()
#                 tax = cart_item.get_tax_amount()
#                 item_coupon_discount = Decimal('0.00')
#                 if coupon and total_amount > 0:
#                     proportion = subtotal / total_amount
#                     item_coupon_discount = coupon_discount * proportion
#                 final_price = subtotal - item_discount - item_coupon_discount + tax

#                 OrderItem.objects.create(
#                     order=order,
#                     variant=cart_item.variant,
#                     quantity=cart_item.quantity,
#                     price=cart_item.variant.total_price,
#                     subtotal=subtotal,
#                     discount=item_discount,
#                     coupon_discount=item_coupon_discount,
#                     tax=tax,
#                     final_price=final_price
#                 )

#                 cart_item.variant.stock -= cart_item.quantity
#                 cart_item.variant.save()

#             order.razorpay_order_id = razorpay_order["id"]
#             order.save()

#             cart.clear()

#             return Response({
#                 'order_id': razorpay_order['id'],
#                 'amount': amount_in_paisa,
#                 'currency': 'INR',
#                 'key': settings.RAZORPAY_KEY_ID,
#                 'order': OrderSerializer(order).data
#             }, status=status.HTTP_200_OK)

#         except Exception as e:
#             logger.exception("Error creating Razorpay order: %s", str(e))
#             return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# class RazorpayPaymentVerificationView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         try:
#             required_fields = ['razorpay_payment_id', 'razorpay_order_id', 'razorpay_signature']
#             for field in required_fields:
#                 if not request.data.get(field):
#                     return Response({"error": f"Missing required field: {field}"}, 
#                                    status=status.HTTP_400_BAD_REQUEST)

#             razorpay_payment_id = request.data.get('razorpay_payment_id')
#             razorpay_order_id = request.data.get('razorpay_order_id')
#             razorpay_signature = request.data.get('razorpay_signature')
#             logger.debug("Request data: %s", request.data)

#             client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
#             client.utility.verify_payment_signature({
#                 'razorpay_order_id': razorpay_order_id,
#                 'razorpay_payment_id': razorpay_payment_id,
#                 'razorpay_signature': razorpay_signature
#             })

#             try:
#                 with transaction.atomic():
#                     order = get_object_or_404(Order, razorpay_order_id=razorpay_order_id, user=request.user)
#                     if order.payment_status == 'completed':
#                         return Response({"error": "Payment already verified"}, 
#                                        status=status.HTTP_400_BAD_REQUEST)
#                     order.razorpay_payment_id = razorpay_payment_id
#                     order.razorpay_signature = razorpay_signature
#                     order.payment_status = 'completed'
#                     order.status = 'processing'
#                     if hasattr(order, 'items') and order.items.exists():  # Check if items relation exists
#                         order.items.update(payment_status='complete')  # Bulk update
#                     else:
#                         logger.warning("No items found for order %s", order.id)
#                     order.save()
#                     logger.info("Order %s updated successfully", order.id)
#             except Exception as e:
#                 logger.error("Database error for order %s: %s", razorpay_order_id, str(e))
#                 return Response({"error": f"Failed to update order: {str(e)}"}, 
#                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#             return Response({
#                 'message': 'Payment verified successfully',
#                 'order_id': order.id
#             }, status=status.HTTP_200_OK)

#         except razorpay.errors.SignatureVerificationError as e:
#             logger.error("Signature verification failed: %s", str(e))
#             return Response({"error": "Payment verification failed"}, 
#                            status=status.HTTP_400_BAD_REQUEST)
#         except Exception as e:
#             logger.exception("Unexpected error during payment verification: %s", str(e))
#             return Response({"error": f"Internal server error: {str(e)}"}, 
#                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class RazorpayOrderCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            cart = get_object_or_404(Cart, user=request.user)
            if not cart.items.exists():
                return Response({"error": "Your cart is empty."}, status=status.HTTP_400_BAD_REQUEST)

            address_id = request.data.get('address_id')
            coupon_code = request.data.get('coupon_code')
            if coupon_code and cart.coupon and cart.coupon.coupon_code != coupon_code:
                return Response({"error": "Coupon code does not match the applied coupon in cart."}, status=status.HTTP_400_BAD_REQUEST)
            if not address_id or not str(address_id).isdigit():
                return Response({"error": "Valid address_id is required."}, status=status.HTTP_400_BAD_REQUEST)

            address = get_object_or_404(Address, id=address_id, user=request.user)
            coupon = None
            coupon_discount = Decimal('0.00')
            if coupon_code:
                try:
                    coupon = Coupon.objects.get(coupon_code=coupon_code)
                    if not coupon.is_valid(request.user):
                        return Response({"error": "Coupon is not valid or has expired."}, status=status.HTTP_400_BAD_REQUEST)
                    total_amount = cart.get_final_subtotal()
                    if total_amount < coupon.min_amount:
                        return Response(
                            {"error": f"Order total must be at least {coupon.min_amount} to use this coupon"},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    coupon_discount = coupon.discount if coupon.coupon_type == 'flat' else (coupon.discount / 100) * total_amount
                    if coupon_discount > total_amount:
                        coupon_discount = total_amount
                    coupon.used_count += 1
                    coupon.save()
                except Coupon.DoesNotExist:
                    return Response({"error": "Invalid coupon code."}, status=status.HTTP_400_BAD_REQUEST)

            total_amount = cart.get_final_subtotal()
            total_discount = cart.get_final_discount()
            total_tax = cart.get_final_tax()
            cart.update_shipping()  # Update shipping cost
            shipping = cart.shipping
            final_total = total_amount - total_discount - coupon_discount + total_tax + shipping
            if final_total <= 0:
                return Response({"error": "Order amount must be positive"}, status=status.HTTP_400_BAD_REQUEST)
            amount_in_paisa = int(final_total * 100)

            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
            razorpay_order = client.order.create({
                'amount': amount_in_paisa,
                'currency': 'INR',
                'payment_capture': 1
            })

            order = Order.objects.create(
                user=request.user,
                cart=cart,
                address=address,
                total_amount=total_amount,
                total_discount=total_discount,
                coupon=coupon,
                coupon_discount=coupon_discount,
                total_tax=total_tax,
                final_total=final_total,
                payment_method='card',
                status='pending',
                shipping=shipping
            )

            OrderAddress.objects.create(
                order=order,
                name=address.name,
                house_no=address.house_no,
                city=address.city,
                state=address.state,
                pin_code=address.pin_code,
                address_type=address.address_type,
                landmark=address.landmark,
                mobile_number=address.mobile_number,
                alternate_number=address.alternate_number
            )

            for cart_item in cart.items.all():
                if cart_item.quantity > cart_item.variant.stock:
                    order.delete()
                    return Response(
                        {"error": f"Not enough stock for {cart_item.variant.product.name}"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                subtotal = cart_item.get_subtotal()
                item_discount = cart_item.get_discount_amount()
                tax = cart_item.get_tax_amount()

                item_coupon_discount = Decimal('0.00')
                if coupon and total_amount > 0:
                    proportion = subtotal / total_amount
                    item_coupon_discount = coupon_discount * proportion
                final_price = subtotal - item_discount - item_coupon_discount + tax
                

                OrderItem.objects.create(
                    order=order,
                    variant=cart_item.variant,
                    quantity=cart_item.quantity,
                    price='0.00',
                    subtotal=subtotal,
                    discount=item_discount,
                    coupon_discount=item_coupon_discount,
                    tax=tax,
                    final_price=final_price
                )

                cart_item.variant.stock -= cart_item.quantity
                cart_item.variant.save()

            order.razorpay_order_id = razorpay_order["id"]
            order.save()

            cart.clear()

            return Response({
                'order_id': razorpay_order['id'],
                'amount': amount_in_paisa,
                'currency': 'INR',
                'key': settings.RAZORPAY_KEY_ID,
                'order': OrderSerializer(order).data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.exception("Error creating Razorpay order: %s", str(e))
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class RazorpayPaymentVerificationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            required_fields = ['razorpay_payment_id', 'razorpay_order_id', 'razorpay_signature']
            for field in required_fields:
                if not request.data.get(field):
                    return Response({"error": f"Missing required field: {field}"}, 
                                   status=status.HTTP_400_BAD_REQUEST)

            razorpay_payment_id = request.data.get('razorpay_payment_id')
            razorpay_order_id = request.data.get('razorpay_order_id')
            razorpay_signature = request.data.get('razorpay_signature')
            logger.debug("Request data: %s", request.data)

            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
            client.utility.verify_payment_signature({
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature
            })

            try:
                with transaction.atomic():
                    order = get_object_or_404(Order, razorpay_order_id=razorpay_order_id, user=request.user)
                    if order.payment_status == 'completed':
                        return Response({"error": "Payment already verified"}, 
                                       status=status.HTTP_400_BAD_REQUEST)
                    order.razorpay_payment_id = razorpay_payment_id
                    order.razorpay_signature = razorpay_signature
                    order.payment_status = 'completed'
                    order.status = 'processing'
                    if hasattr(order, 'items') and order.items.exists():
                        order.items.update(payment_status='complete')
                    else:
                        logger.warning("No items found for order %s", order.id)
                    order.save()
                    logger.info("Order %s updated successfully", order.id)
            except Exception as e:
                logger.error("Database error for order %s: %s", razorpay_order_id, str(e))
                return Response({"error": f"Failed to update order: {str(e)}"}, 
                               status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response({
                'message': 'Payment verified successfully',
                'order_id': order.id
            }, status=status.HTTP_200_OK)

        except razorpay.errors.SignatureVerificationError as e:
            logger.error("Signature verification failed: %s", str(e))
            return Response({"error": "Payment verification failed"}, 
                           status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.exception("Unexpected error during payment verification: %s", str(e))
            return Response({"error": f"Internal server error: {str(e)}"}, 
                           status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        
class RetryRazorpayPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            order_id = request.data.get("order_id")
            if not order_id or not str(order_id).isdigit():
                return Response({"error": "Valid order_id is required"}, 
                               status=status.HTTP_400_BAD_REQUEST)

            order = Order.objects.get(id=order_id, user=request.user)
            if order.payment_method != "card" or order.payment_status == "completed":
                return Response({"error": "Cannot retry payment for this order"}, 
                               status=status.HTTP_400_BAD_REQUEST)

            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
            razorpay_order = client.order.create({
                "amount": int(order.final_total * 100),
                "currency": "INR",
                "payment_capture": 1,
            })

            order.razorpay_order_id = razorpay_order["id"]
            order.status = "pending"

            order.save()

            return Response({
                "order_id": razorpay_order["id"],
                "amount": razorpay_order["amount"],
                "currency": razorpay_order["currency"],
                "key": settings.RAZORPAY_KEY_ID,
                "order": {"id": order.id},
            }, status=status.HTTP_200_OK)

        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.exception("Error retrying Razorpay payment: %s", str(e))
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#========================= Sales Report=======================================
from django.db.models import Sum, Value, DecimalField
from django.db.models.functions import Coalesce
from decimal import Decimal



class SalesReportView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        try:
            # Get filter parameters
            filter_type = request.query_params.get('filter_type', 'thisYear')
            from_date = request.query_params.get('from_date')
            to_date = request.query_params.get('to_date')

            # Initialize date range
            today = timezone.now().date()
            if filter_type == 'today':
                from_date = to_date = today
            elif filter_type == 'thisWeek':
                from_date = today - timezone.timedelta(days=today.weekday())
                to_date = today
            elif filter_type == 'thisMonth':
                from_date = today.replace(day=1)
                to_date = today
            elif filter_type == 'thisYear':
                from_date = today.replace(month=1, day=1)
                to_date = today
            elif filter_type == 'custom':
                if not (from_date and to_date):
                    return Response(
                        {"error": "Both from_date and to_date are required for custom filter"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            else:
                return Response(
                    {"error": f"Invalid filter_type: {filter_type}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

           
            if filter_type == 'custom':
                try:
                    if from_date and not isinstance(from_date, datetime.date):
                        from_date = datetime.strptime(from_date, '%Y-%m-%d').date()
                    if to_date and not isinstance(to_date, datetime.date):
                        to_date = datetime.strptime(to_date, '%Y-%m-%d').date()
                except ValueError:
                    return Response(
                        {"error": "Invalid date format. Use YYYY-MM-DD"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # Ensure to_date is not before from_date
                if from_date and to_date and to_date < from_date:
                    return Response(
                        {"error": "To date cannot be before from date"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            # Query orders
            queryset = Order.objects.all()
            if from_date:
                queryset = queryset.filter(created_at__date__gte=from_date)
            if to_date:
                queryset = queryset.filter(created_at__date__lte=to_date)

            # Calculate summary using database aggregations
            summary = queryset.aggregate(
                total_sales=Coalesce(Sum('total_amount'), Value(0.00, output_field=DecimalField())),
                total_discount=Coalesce(Sum('total_discount'), Value(0.00, output_field=DecimalField())),
                coupon_discount=Coalesce(Sum('coupon_discount'), Value(0.00, output_field=DecimalField())),
            )

            # Serialize data
            serializer = SalesReportSerializer(queryset, many=True)

            return Response({
                'salesData': serializer.data,
                'summary': {
                    'totalSales': float(summary['total_sales']),
                    'totalDiscount': float(summary['total_discount']),
                }
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error generating sales report: {str(e)}", exc_info=True)
            return Response(
                {"error": f"Failed to generate sales report: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )