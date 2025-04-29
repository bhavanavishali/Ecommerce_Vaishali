
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


# ==========================Cart related views============================


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
        
        cart_item.save()
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
            item.save()
        
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
    

#=======================================  Order related views   ============================================================



#
class OrderCreateView(APIView):
    def post(self, request):
        address_id = request.data.get('address_id')
        payment_method = request.data.get('payment_method', 'cod')  # Default to 'cod'
        
        # Validate inputs
        if not address_id:
            return Response({"error": "Address ID is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Get cart
            cart = Cart.objects.get(user=request.user)
            if not cart.items.exists():
                return Response({"error": "Your cart is empty."}, status=status.HTTP_400_BAD_REQUEST)
                
            # Calculate totals
            total = cart.get_total()
            total_discount = cart.get_total_discount()  # Ensure this method exists
            final_total = cart.get_final_total()  # Ensure this method exists
            
            # Get address
            try:
                address = Address.objects.get(id=address_id, user=request.user)
            except Address.DoesNotExist:
                return Response({"error": "Invalid or unauthorized address."}, status=status.HTTP_400_BAD_REQUEST)
            
            # Validate payment method
            allowed_methods = [choice[0] for choice in Order.PAYMENT_METHOD_CHOICES]
            if payment_method not in allowed_methods:
                return Response({"error": "Invalid payment method."}, status=status.HTTP_400_BAD_REQUEST)
            
            # Create order
            order = Order.objects.create(
                user=request.user,
                cart=cart,
                address=address,  
                total_amount=total,
                total_discount=total_discount,
                final_total=final_total,
                payment_method=payment_method,
                status='pending',
                payment_status='pending'
            )
            
            # Create OrderAddress instance
            try:
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
            except Exception as e:
                order.delete()  # Rollback order if OrderAddress creation fails
                return Response(
                    {"error": "Failed to create order address.", "details": str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Check stock availability
            for cart_item in cart.items.all():
                if cart_item.quantity > cart_item.variant.stock:
                    order.delete()
                    return Response(
                        {"error": f"Not enough stock for {cart_item.variant.product.name} - {cart_item.variant.name}. Available: {cart_item.variant.stock}"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # Create order items and update stock
            for cart_item in cart.items.all():
                subtotal = cart_item.get_subtotal()
                final_price = cart_item.calculate_final_price()
                discount = subtotal - final_price
                
                OrderItem.objects.create(
                    order=order,
                    variant=cart_item.variant,
                    quantity=cart_item.quantity,
                    price=cart_item.variant.calculate_total_price(),
                    subtotal=subtotal,
                    discount=discount,
                    final_price=final_price
                )
                
                variant = cart_item.variant
                variant.stock -= cart_item.quantity
                variant.save()
            
            cart.items.all().delete()  # Clear cart
            
            # Serialize response
            serializer = OrderSerializer(order, context={'request': request})
            return Response(
                {"message": "Order created successfully", "order": serializer.data},
                status=status.HTTP_201_CREATED
            )
            
        except Cart.DoesNotExist:
            return Response({"error": "Cart not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            import traceback
            traceback.print_exc()  # Log full traceback
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
		
		
		
# ================ Cancle order views =========================

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
    
#============== Order return view============================

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

    permission_classes = [IsAdminUser]

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
            return Response({
                "message": f"Order return request {action} successfully",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
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
    permission_classes = [IsAdminUser]

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
            return Response({
                "message": f"Order item return request {action} successfully",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# ===================Listing the all order in admin side===================


class OrderListView(APIView):
    def get(self,request):
        order=Order.objects.all().order_by('-created_at')
        serializer=OrderSerializer(order,many=True)
        return Response(serializer.data)


class OrderUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, id, *args, **kwargs):
        try:
            order = Order.objects.get(id=id)
            order_status = request.data.get('status')
            if order_status not in ['pending', 'processing', 'shipped', 'delivered', 'cancelled']:
                return Response(
                    {"error": "Invalid status"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            order.status = order_status
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
        wallet, _ = Wallet.objects.get_or_create(user=request.user)
        serializer = WalletSerializer(wallet)
        return Response({
            "message": "Wallet balance retrieved successfully",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

# View to retrieve user's wallet transaction history
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
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        serializer = WishlistSerializer(wishlist)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AddToWishlistView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        variant = request.data.get('variant')
        print(variant)
        if not variant or not str(variant).isdigit():
            return Response({'error': 'Valid variant_id is required'}, 
                           status=status.HTTP_400_BAD_REQUEST)

        try:
            variant = ProductVariant.objects.get(id=variant, available=True, is_active=True)
        except ProductVariant.DoesNotExist:
            return Response({'error': 'Variant not found or not available'}, 
                           status=status.HTTP_404_NOT_FOUND)

        # Check if already in wishlist
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

class RazorpayOrderCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            
            cart = get_object_or_404(Cart, user=request.user)
            if not cart.items.exists():
                return Response({"error": "Your cart is empty."}, status=400)

            
            address_id = request.data.get('address_id')
            if not address_id:
                return Response({"error": "Address ID is required."}, status=400)
            
            address = get_object_or_404(Address, id=address_id, user=request.user)

            total_amount = Decimal(cart.get_final_total())
            amount_in_paisa = int(total_amount * 100)  # Razorpay expects amount in paisa

            # Initialize Razorpay client
            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

            # Create Razorpay order
            razorpay_order = client.order.create({
                'amount': amount_in_paisa,
                'currency': 'INR',
                'payment_capture': 1  
            })
            print("razorpay id",razorpay_order)

            # Create Django order
            order = Order.objects.create(
                user=request.user,
                cart=cart,
                address=address,
                total_amount=cart.get_total(),
                total_discount=cart.get_total_discount(),
                final_total=total_amount,
                payment_method='card',
                status='pending',
                payment_status='pending',
                order_number=f"ORD{timezone.now().strftime('%Y%m%d%H%M%S')}",

            )

            # Create OrderAddress
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

            # Create order items and update stock
            for cart_item in cart.items.all():
                if cart_item.quantity > cart_item.variant.stock:
                    order.delete()
                    return Response({
                        "error": f"Not enough stock for {cart_item.variant.product.name}"
                    }, status=400)

                subtotal = cart_item.get_subtotal()
                final_price = cart_item.calculate_final_price()
                discount = subtotal - final_price

                OrderItem.objects.create(
                    order=order,
                    variant=cart_item.variant,
                    quantity=cart_item.quantity,
                    price=cart_item.variant.calculate_total_price(),
                    subtotal=subtotal,
                    discount=discount,
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
            }, status=200)

        except Exception as e:
            return Response({"error": str(e)}, status=500)
        
import logging      
logger = logging.getLogger(__name__)

class RazorpayPaymentVerificationView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):  
        try:
            # Validate request data
            required_fields = ['razorpay_payment_id', 'razorpay_order_id', 'razorpay_signature']
            for field in required_fields:
                if not request.data.get(field):
                    return Response({"error": f"Missing required field: {field}"}, status=400)

            razorpay_payment_id = request.data.get('razorpay_payment_id')
            razorpay_order_id = request.data.get('razorpay_order_id')
            razorpay_signature = request.data.get('razorpay_signature')
            logger.debug("Request data: %s", request.data)

            # Verify payment signature
            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
            client.utility.verify_payment_signature({
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature
            })

            # Update order
            try:
                with transaction.atomic():
                    order = get_object_or_404(Order, razorpay_order_id=razorpay_order_id, user=request.user)
                    order.razorpay_payment_id = razorpay_payment_id
                    order.razorpay_signature = razorpay_signature
                    order.payment_status = 'completed'
                    order.status = 'processing'
                    order.save()
                    logger.info("Order %s updated successfully", order.id)
            except Exception as e:
                logger.error("Database error for order %s: %s", razorpay_order_id, str(e))
                return Response({"error": f"Failed to update order: {str(e)}"}, status=500)

            return Response({
                'message': 'Payment verified successfully',
                'order_id': order.id
            }, status=200)

        except razorpay.errors.SignatureVerificationError as e:
            logger.error("Signature verification failed: %s", str(e))
            return Response({"error": "Payment verification failed"}, status=400)
        except Exception as e:
            logger.exception("Unexpected error during payment verification: %s", str(e))
            return Response({"error": f"Internal server error: {str(e)}"}, status=500)

class RetryRazorpayPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            order_id = request.data.get("order_id")
            if not order_id:
                return Response({"error": "Order ID is required"}, status=status.HTTP_400_BAD_REQUEST)

            # Fetch order
            order = Order.objects.get(id=order_id, user=request.user)
            if order.payment_method != "card" or order.status == "completed":
                return Response({"error": "Cannot retry payment for this order"}, status=status.HTTP_400_BAD_REQUEST)

            # Create new Razorpay order
            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
            razorpay_order = client.order.create({
                "amount": int(order.total_amount * 100),  # Convert to paise
                "currency": "INR",
                "payment_capture": 1,
            })

            # Update order with new Razorpay order ID
            order.razorpay_order_id = razorpay_order["id"]
            order.status = "pending"
            order.save()

            return Response({
                "order_id": razorpay_order["id"],
                "amount": razorpay_order["amount"],
                "currency": razorpay_order["currency"],
                "key": settings.RAZORPAY_KEY_ID,
                "order": {"id": order.id},
            })
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)