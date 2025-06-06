from rest_framework import serializers
from .models import *
from productsapp.serializers import ProductVariantSerializer
logger = logging.getLogger(__name__)
from django.db.models import F
from django.shortcuts import get_object_or_404
from offer.serializers import *


class CartItemSerializer(serializers.ModelSerializer):
    variant = ProductVariantSerializer(read_only=True)
    product = serializers.SerializerMethodField()
    subtotal = serializers.SerializerMethodField()
    discount_amount = serializers.SerializerMethodField()
    tax_amount = serializers.SerializerMethodField()
    final_price = serializers.SerializerMethodField()
    primary_image = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'variant', 'quantity', 'subtotal', 'discount_amount', 'tax_amount', 'final_price', 'primary_image']

    def get_product(self, obj):
        product = obj.variant.product
        images = [
            {"id": image.id, "url": image.image.url, "is_primary": image.is_primary}
            for image in product.images.all() if image.image
        ]
        return {
            "id": product.id,
            "name": product.name,
            "description": product.description,
            "category": product.category.name if product.category else None,
            "category_IsActive":product.category.is_active,
            "gold_color": product.gold_color,
            "images": images,
            "is_active":product.is_active
        }

    def get_subtotal(self, obj):
        return obj.get_subtotal()

    def get_discount_amount(self, obj):
        return obj.get_discount_amount()

    def get_tax_amount(self, obj):
        return obj.get_tax_amount()

    def get_final_price(self, obj):
        return obj.calculate_total_price()

    def get_primary_image(self, obj):
        primary_image = obj.variant.product.images.filter(is_primary=False).first()
        if not primary_image:  
            primary_image = obj.variant.product.images.first()
        return primary_image.image.url if primary_image and primary_image.image else None




class CartSerializer(serializers.ModelSerializer):
    coupon = CouponSerializer(read_only=True)
    items = CartItemSerializer(many=True, read_only=True)
    coupon_code = serializers.CharField(max_length=50, required=False, allow_null=True, allow_blank=True, write_only=True)

    class Meta:
        model = Cart
        fields = [
            'id', 'user', 'items', 'coupon', 'coupon_code', 'final_subtotal', 'final_discount',
            'final_tax', 'final_coupon_discount', 'final_total', 'shipping'
        ]
        read_only_fields = [
            'final_subtotal', 'final_discount', 'final_tax', 'final_coupon_discount', 'final_total', 'shipping'
        ]
        
    
    
    def validate_coupon_code(self, value):
        if not value:
            return None
        try:
            coupon = Coupon.objects.get(coupon_code=value)
            if not coupon.is_valid(self.context['request'].user):  
                raise serializers.ValidationError("Coupon is not valid or has expired.")
            cart = self.instance
            if cart and cart.final_subtotal < coupon.min_amount:
                raise serializers.ValidationError(
                    f"Order total must be at least {coupon.min_amount} to use this coupon."
                )
            return coupon
        except Coupon.DoesNotExist:
            raise serializers.ValidationError("Invalid coupon code.")

    def update(self, instance, validated_data):
        coupon = validated_data.pop('coupon_code', None)
        if coupon:
            instance.coupon = coupon
            if coupon.coupon_type == 'flat':
                instance.final_coupon_discount = coupon.discount
            else:
                instance.final_coupon_discount = (coupon.discount / 100) * instance.get_final_subtotal()
            if instance.final_coupon_discount > instance.get_final_subtotal():
                instance.final_coupon_discount = instance.get_final_subtotal()
        else: 
            instance.coupon = None
            instance.final_coupon_discount = Decimal('0.00')
        instance.save()
        return instance
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        print("DEBUG | Final Total before sending to UI:", data.get('final_total'))
        return data

class OrderAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderAddress
        fields = ['id', 'name', 'house_no', 'city', 'state', 'pin_code', 'address_type', 'landmark', 'mobile_number', 'alternate_number']

    def validate(self, data):
        import re
        if not re.match(r'^\d{6}$', data['pin_code']):
            raise serializers.ValidationError({"pin_code": "Pin code must be a 6-digit number"})
        if not re.match(r'^\d{10}$', data['mobile_number']):
            raise serializers.ValidationError({"mobile_number": "Mobile number must be a 10-digit number"})
        if data.get('alternate_number') and not re.match(r'^\d{10}$', data['alternate_number']):
            raise serializers.ValidationError({"alternate_number": "Alternate number must be a 10-digit number"})
        return data
    

class OrderItemSerializer(serializers.ModelSerializer):
    
    variant = ProductVariantSerializer(read_only=True)
    product = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['id', 'variant', 'product', 'quantity', 'price', 'subtotal', 'discount','coupon_discount','tax','final_price', 'status', 'cancel_reason', 'cancelled_at', 'returned_at', 'return_reason']

    def get_product(self, obj):
        return {
            "id": obj.variant.product.id,
            "name": obj.product_name or obj.variant.product.name,  
            "description": obj.product_description or obj.variant.product.description,  
            "category": obj.variant.product.category.name if obj.variant.product.category else None,
            "gold_color": obj.variant.product.gold_color,
            "images": [obj.product_image] if obj.product_image else []  
        }
    def validate(self, data):
        if data.get('cancel_reason') and not data['cancel_reason'].strip():
            raise serializers.ValidationError({"cancel_reason": "Cancel reason cannot be empty"})
        if data.get('return_reason') and not data['return_reason'].strip():
            raise serializers.ValidationError({"return_reason": "Return reason cannot be empty"})
        return data


        
class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user = serializers.SerializerMethodField()
    order_address = OrderAddressSerializer(read_only=True)
    address_id = serializers.PrimaryKeyRelatedField(queryset=Address.objects.all(), write_only=True)
    coupon = serializers.PrimaryKeyRelatedField(read_only=True) 
    coupon_code = serializers.CharField(max_length=50, required=False, allow_null=True, allow_blank=True, write_only=True)

    class Meta:
        model = Order

        fields = [
            'id', 'items', 'user', 'order_address', 'address_id', 'total_amount', 'total_tax',
            'total_discount', 'final_total', 'coupon', 'coupon_code', 'coupon_discount', 'created_at',
            'est_delivery', 'status', 'order_number', 'payment_method', 'payment_status',
            'cancel_reason', 'cancelled_at', 'return_reason', 'returned_at', 'approve_status',
            'razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature','shipping'
        ]
        
        read_only_fields = [
            'total_amount', 'total_tax', 'total_discount', 'coupon', 'coupon_discount', 'final_total',
            'created_at', 'items', 'order_address', 'order_number', 'est_delivery'
        ]

    def get_user(self, obj):
        return {
            'id': obj.user.id,
            'first_name': obj.user.first_name,
            'last_name': obj.user.last_name,
            'email': obj.user.email,
            'phone_number': obj.user.phone_number
        }
 
    def validate_address_id(self, value):
        if value.user != self.context['request'].user:
            raise serializers.ValidationError("Selected address does not belong to you.")
        return value

    def validate_payment_method(self, value):
        allowed_methods = ['cod', 'wallet']
        if value not in allowed_methods:
            raise serializers.ValidationError("Invalid payment method.")
        return value

    def validate_coupon_code(self, value):
        if not value:
            return None
        try:
            coupon = Coupon.objects.get(coupon_code=value)
            if not coupon.is_valid(self.context['request'].user):  # Now works
                raise serializers.ValidationError("Coupon is not valid or has expired.")
            cart = self.instance
            if cart and cart.final_subtotal < coupon.min_amount:
                raise serializers.ValidationError(
                    f"Order total must be at least {coupon.min_amount} to use this coupon."
                )
            return coupon
        except Coupon.DoesNotExist:
            raise serializers.ValidationError("Invalid coupon code.")
        
    def create(self, validated_data):
        user = self.context['request'].user
        address = validated_data.pop('address_id')
        payment_method = validated_data.get('payment_method', 'cod')
        coupon = validated_data.pop('coupon_code', None)  

        cart = Cart.objects.filter(user=user).first()
        if not cart or not cart.items.exists():
            raise serializers.ValidationError("No valid cart items found for this user.")

        try:
            with transaction.atomic():
                variants = ProductVariant.objects.select_for_update().filter(
                    id__in=[cart_item.variant.id for cart_item in cart.items.all()]
                )
                variant_map = {v.id: v for v in variants}

                for cart_item in cart.items.all():
                    variant = variant_map.get(cart_item.variant.id)
                    if not variant:
                        raise serializers.ValidationError(
                            f"Variant {cart_item.variant.product.name} is no longer available."
                        )
                    if not variant.available or not variant.is_active:
                        raise serializers.ValidationError(
                            f"Variant {variant.product.name} is not available."
                        )
                    if variant.stock < cart_item.quantity:
                        raise serializers.ValidationError(
                            f"Insufficient stock for {variant.product.name}. "
                            f"Available: {variant.stock}, Requested: {cart_item.quantity}"
                        )
                    if not variant.product.is_active:
                        raise serializers.ValidationError(
                            f"Product {variant.product.name} is not active."
                        )
                
                    if not variant.product.category.is_active:
                        raise serializers.ValidationError(
                            f"Category for product {variant.product.name} is not active."
                        )
                    

                total_amount = cart.get_final_subtotal()
                total_discount = cart.get_final_discount()
                total_tax = cart.get_final_tax()
                coupon_discount = Decimal('0.00')
                cart.update_shipping()  
                shipping = cart.shipping

                if coupon:
                    if coupon.coupon_type == 'flat':
                        coupon_discount = coupon.discount
                    else:
                        coupon_discount = (coupon.discount / 100) * total_amount
                    if coupon_discount > total_amount:
                        coupon_discount = total_amount
                    coupon.used_count += 1
                    coupon.save()

                final_total = total_amount - total_discount - coupon_discount + total_tax + shipping
                payment_status = 'pending'
                if payment_method == 'wallet':
                    wallet, _ = Wallet.objects.get_or_create(user=user)
                    wallet.deduct_funds(final_total, order_number=None)
                    payment_status = 'completed'

                order = Order.objects.create(
                    user=user,
                    cart=cart,
                    address=address,
                    total_amount=total_amount,
                    total_discount=total_discount,
                    coupon=coupon,
                    coupon_discount=coupon_discount,
                    total_tax=total_tax,
                    final_total=final_total,
                    status='pending',
                    payment_method=payment_method,
                    payment_status=payment_status,
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
                    variant = variant_map[cart_item.variant.id]
                    subtotal = cart_item.get_subtotal()
                    item_discount = cart_item.get_discount_amount()
                    tax = cart_item.get_tax_amount()
                    item_coupon_discount = Decimal('0.00')
                    if coupon and total_amount > 0:
                        proportion = subtotal / total_amount
                        item_coupon_discount = coupon_discount * proportion
                    final_price = subtotal - item_discount - item_coupon_discount + tax

                    primary_image = variant.product.images.filter(is_primary=True).first()
                    image_url = primary_image.image.url if primary_image else (
                    variant.product.images.first().image.url if variant.product.images.exists() else None
                )

                    OrderItem.objects.create(
                        order=order,
                        variant=variant,
                        quantity=cart_item.quantity,
                        price=cart_item.variant.total_price,
                        subtotal=subtotal,
                        discount=item_discount,
                        coupon_discount=item_coupon_discount,
                        tax=tax,
                        final_price=final_price,
                        payment_status=payment_status,
                        product_name=variant.product.name,
                        product_description=variant.product.description,  
                        product_image=image_url
                    )
                    
                    

                    # ProductVariant.objects.filter(id=variant.id).update(
                    #     stock=F('stock') - cart_item.quantity
                    # )
                    # variant.refresh_from_db()
                    # if variant.stock < 0:
                    #     raise serializers.ValidationError(
                    #         f"Stock for {variant.product.name} cannot go negative."
                    #     )

                    original_stock = variant.stock
                    expected_stock = original_stock - cart_item.quantity
                    if expected_stock < 0:
                        raise serializers.ValidationError(
                            f"Stock for {variant.product.name} cannot go negative."
                        )
                    variant.stock = expected_stock
                    variant.save()
                variant.refresh_from_db()
                if payment_method == 'wallet':
                    WalletTransaction.objects.filter(
                        wallet__user=user,
                        order_number=None,
                        transaction_type='debit',
                        created_at__gte=order.created_at
                    ).update(order_number=order.order_number, description=f"Payment for order {order.order_number}")
                cart.clear()
                logger.info(f"Order {order.order_number} created successfully for user {user.username}")

                return order
        except Exception as e:
            logger.error(f"Error creating order for user {user.username}: {str(e)}")
            raise serializers.ValidationError(f"Failed to create order: {str(e)}")

# ==================================  Order Cancellation ====================



class OrderCancelSerializer(serializers.ModelSerializer):
    cancel_reason = serializers.CharField(max_length=255, required=True)

    class Meta:
        model = Order
        fields = ['id', 'cancel_reason']

    def validate(self, data):
        order = self.instance
        if order.status == 'cancelled':
            raise serializers.ValidationError("Order is already cancelled.")
        if order.status in ['shipped', 'delivered', 'return_requested', 'returned', 'return_denied']:
            raise serializers.ValidationError("Cannot cancel shipped or delivered orders.")
        return data

    def update(self, instance, validated_data):
        cancel_reason = validated_data['cancel_reason']
        instance.cancelorder(cancel_reason)  # Pass cancel_reason to cancelorder
        return instance
    


# ============== Oder items cancel==========================

class OrderItemCancelSerializer(serializers.ModelSerializer):
    cancel_reason = serializers.CharField(max_length=255, required=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'cancel_reason']

    def validate(self, data):
        item = self.instance
        order = item.order
        if item.status != 'active':
            raise serializers.ValidationError("Item is already cancelled or returned.")
        if order.status in ['shipped', 'delivered', 'cancelled', 'return_requested', 'returned', 'return_denied']:
            raise serializers.ValidationError("Cannot cancel items in shipped or delivered orders.")
        return data

    def update(self, instance, validated_data):
        instance.cancel_item(validated_data['cancel_reason'])
        return instance
    

#================ Order return ========================

class OrderReturnSerializer(serializers.ModelSerializer):
    return_reason = serializers.CharField(max_length=255, required=True)

    class Meta:
        model = Order
        fields = ['id', 'return_reason']

    def validate(self, data):
        order = self.instance
        if order.status != 'delivered':
            raise serializers.ValidationError("Only delivered orders can be returned.")
        # if any(item.status != 'delivered' for item in order.items.all()):
        #     raise serializers.ValidationError("All items must be active to request a return for the entire order.")
        return data

    def update(self, instance, validated_data):
        instance.request_return(validated_data['return_reason'])
        return instance



class AdminOrderReturnApprovalSerializer(serializers.ModelSerializer):
    approve = serializers.BooleanField(required=True, write_only=True)
    wallet_transaction = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'approve', 'wallet_transaction']

    def validate(self, data):
        order = self.instance
        if order.status != 'return_requested':
            raise serializers.ValidationError("Only return requested orders can be approved or denied.")
        return data

    def update(self, instance, validated_data):
        if validated_data['approve']:
            instance.approve_return()
        else:
            instance.deny_return()
        return instance

    def get_wallet_transaction(self, obj):
        if obj.status == 'returned' and obj.approve_status:
            transaction = WalletTransaction.objects.filter(
                wallet__user=obj.user,
                order_number=obj.order_number,
                transaction_type='credit'
            ).order_by('-created_at').first()
            if transaction:
                return {
                    'transaction_id': transaction.id,
                    'amount': transaction.amount,
                    'created_at': transaction.created_at
                }
        return None
    
#============== Order item returned========================

class OrderItemReturnSerializer(serializers.ModelSerializer):
    return_reason = serializers.CharField(max_length=255, required=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'return_reason']

    def validate(self, data):
        item = self.instance
        order = item.order
        if order.status != 'delivered':
            raise serializers.ValidationError("Only items in delivered orders can be returned.")
        
        return data

    def update(self, instance, validated_data):
        instance.request_item_return(validated_data['return_reason'])
        return instance
    


class AdminOrderItemReturnApprovalSerializer(serializers.ModelSerializer):
    approve = serializers.BooleanField(required=True, write_only=True)
    wallet_transaction = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'approve', 'wallet_transaction']

    def validate(self, data):
        item = self.instance
        if item.status != 'return_requested':
            raise serializers.ValidationError("Only return requested items can be approved or denied.")
        return data

    def update(self, instance, validated_data):
        if validated_data['approve']:
            instance.approve_item_return()
        else:
            instance.deny_item_return()
        return instance

    def get_wallet_transaction(self, obj):
        if obj.status == 'returned':
            transaction = WalletTransaction.objects.filter(
                wallet__user=obj.order.user,
                order_number=obj.order.order_number,
                transaction_type='credit'
            ).order_by('-created_at').first()
            if transaction:
                return {
                    'transaction_id': transaction.id,
                    'amount': transaction.amount,
                    'created_at': transaction.created_at
                }
        return None

# =============== Wallet views=====================================

class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = ['user', 'balance', 'created_at', 'updated_at']
        read_only_fields = ['user', 'balance', 'created_at', 'updated_at']

class WalletTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WalletTransaction
        fields = ['wallet', 'amount', 'transaction_type', 'description', 'created_at', 'order_number', 'transaction_id']
        read_only_fields = ['wallet', 'amount', 'transaction_type', 'description', 'created_at']


#======================== wishlist =========================================

class WishlistItemSerializer(serializers.ModelSerializer):
    
    variant = ProductVariantSerializer(read_only=True)
    product = serializers.SerializerMethodField()
    primary_image = serializers.SerializerMethodField()

    class Meta:
        model = WishlistItem
        fields = ['id', 'variant', 'product', 'added_at', 'primary_image']

    def get_product(self, obj):
        product = obj.variant.product
        images = [
            {"id": image.id, "url": image.image.url, "is_primary": image.is_primary}
            for image in product.images.all() if image.image
        ]
        return {
            "id": product.id,
            "name": product.name,
            "description": product.description,
            "category": product.category.name if product.category else None,
            "category_IsActive":product.category.is_active,
            "gold_color": product.gold_color,
            "images": images,
            'is_active':product.is_active,
            'available':product.available
        }

    def get_primary_image(self, obj):
        primary_image = obj.variant.product.images.filter(is_primary=True).first()
        return primary_image.image.url if primary_image and primary_image.image else None

class WishlistSerializer(serializers.ModelSerializer):
    items = WishlistItemSerializer(many=True, read_only=True)
    total_items = serializers.SerializerMethodField()

    class Meta:
        model = Wishlist
        fields = ['id', 'user', 'items', 'total_items', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']

    def get_total_items(self, obj):
        return obj.items.count()
    
class CouponSerializer(serializers.ModelSerializer):
    remaining_uses = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    class Meta:
        model = Coupon
        fields = ['id', 'coupon_name', 'coupon_code', 'discount', 'valid_from', 'valid_to',
                  'is_active', 'max_uses', 'used_count', 'min_amount', 'remaining_uses',
                  'status', 'created_at', 'updated_at', 'min_offer_amount', 'coupon_type']
        read_only_fields = ['used_count', 'created_at', 'updated_at']

    def get_remaining_uses(self, obj):
        if obj.max_uses == 0:
            return "Unlimited"
        return obj.max_uses - obj.used_count

    def get_status(self, obj):
        now = timezone.now().date()
        if not obj.is_active:
            return "Inactive"
        elif now < obj.valid_from:
            return "Pending"
        elif now > obj.valid_to:
            return "Expired"
        elif obj.max_uses > 0 and obj.used_count >= obj.max_uses:
            return "Fully Used"
        else:
            return "Active"

    def validate(self, data):
        if data.get('valid_from') and data.get('valid_to'):
            if data['valid_from'] > data['valid_to']:
                raise serializers.ValidationError("End date must be after start date")
        if data.get('discount'):
            if data['discount'] <= 0:
                raise serializers.ValidationError("Discount must be greater than 0")
        return data
    


#================ SALES REPORT =====================

from decimal import Decimal, InvalidOperation

logger = logging.getLogger(__name__)


class SalesReportSerializer(serializers.ModelSerializer):
    orderId = serializers.CharField(source='order_number')
    date = serializers.SerializerMethodField()
    orderMrp = serializers.SerializerMethodField()
    itemDiscount = serializers.SerializerMethodField()
    itemTax = serializers.SerializerMethodField()
    orderSubtotal = serializers.SerializerMethodField()
    refund_amount= serializers.SerializerMethodField()
    couponDiscount = serializers.DecimalField(source='coupon_discount', max_digits=10, decimal_places=2)
    shippingCharge = serializers.DecimalField(source='shipping', max_digits=10, decimal_places=2)

    totalAmount = serializers.DecimalField(source='total_amount', max_digits=10, decimal_places=2)
    paymentMethod = serializers.CharField(source='payment_method')
    user = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'orderId', 'date', 'user', 'orderMrp', 'itemDiscount', 'itemTax',
            'orderSubtotal', 'couponDiscount', 'shippingCharge', 'refund_amount','totalAmount', 'paymentMethod'
        ]

    def get_date(self, obj):
        return obj.created_at.date()

    def get_orderMrp(self, obj):
        return obj.total_amount  

    def get_itemDiscount(self, obj):
        return obj.total_discount  

    def get_itemTax(self, obj):
        return obj.total_tax  

    def get_orderSubtotal(self, obj):
        return obj.final_total 

    def get_user(self, obj):
        
        return obj.user.email if obj.user else 'N/A'
    
    def get_refund_amount(self, obj):
        return sum((item.final_price for item in obj.items.filter(payment_status__in=['refunded', 'partially_refunded'])), 0)
    
# Tax

class TaxSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tax
        fields = ['id', 'name', 'percentage']