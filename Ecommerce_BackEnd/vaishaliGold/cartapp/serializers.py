
from rest_framework import serializers
from .models import *
from productsapp.serializers import ProductVariantSerializer

class CartItemSerializer(serializers.ModelSerializer):
    variant = ProductVariantSerializer(read_only=True)
    product = serializers.SerializerMethodField()
    subtotal = serializers.SerializerMethodField()
    final_price=serializers.SerializerMethodField()
    primary_image=serializers.SerializerMethodField()
    class Meta:
        model = CartItem
        fields = ['id', 'product','variant', 'quantity', 'subtotal','final_price','primary_image']

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
            "gold_color": product.gold_color,
            "images": images
        }

    def get_subtotal(self, cartitem:CartItem):
        return cartitem.quantity * cartitem.variant.calculate_total_price()
    
    def get_final_price(self, cartitem: CartItem):
        return cartitem.calculate_final_price()
    
    def get_primary_image(self, obj):
        # Get the primary image for the product
        primary_image = obj.variant.product.images.filter(is_primary=False).first()
        return primary_image.image.url if primary_image and primary_image.image else None
        


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.SerializerMethodField()
    total_items=serializers.SerializerMethodField()
    total_discount=serializers.SerializerMethodField()
    final_total=serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'user',  'items', 'total','total_items','total_discount','final_total']

    def get_total(self, obj):
        return sum(item.quantity * item.variant.calculate_total_price() for item in obj.items.all())
    
    def get_total_items(self,obj):
        return obj.items.count()
    
    def get_total_discount(self,obj):
        total_discount=0
        for item in obj.items.all():
            subtotal = item.variant.calculate_total_price() * item.quantity
            discount_percentage=item.get_discount_percentage()
            discount_amount=(subtotal * discount_percentage) / 100
            total_discount+=discount_amount
        return total_discount
        
    def get_final_total(self,obj):
        return self.get_total(obj) - self.get_total_discount(obj)

class OrderAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderAddress
        fields = ['id', 'name', 'house_no', 'city', 'state', 'pin_code', 'address_type', 'landmark', 'mobile_number', 'alternate_number']


class OrderItemSerializer(serializers.ModelSerializer):
    
    variant = ProductVariantSerializer(read_only=True)
    product = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['id', 'variant', 'product', 'quantity', 'price', 'subtotal', 'discount', 'final_price','status','cancel_reason','cancelled_at','returned_at','return_reason']

    def get_product(self, obj):
        product = obj.variant.product
        return {
            "id": product.id,
            "name": product.name,
            "description": product.description,
            "category": product.category.name if product.category else None,
            "gold_color": product.gold_color,
            "images": [image.image.url for image in product.images.all()]
        }


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user=serializers.SerializerMethodField()
    order_address = OrderAddressSerializer(read_only=True)
    address_id = serializers.PrimaryKeyRelatedField(
    queryset=Address.objects.all(), write_only=True
    )

    class Meta:
        model = Order
        fields = ['id','items', 'user', 'order_address', 'address_id', 'total_amount', 'total_discount', 'final_total', 'created_at','est_delivery', 'status','order_number','payment_method','payment_status','cancel_reason', 'cancelled_at','return_reason','returned_at','approve_status']
        read_only_fields = ['total_amount', 'total_discount', 'final_total', 'created_at', 'items', 'order_address']

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
    
    def validate_payment_methos(self,value):
        allowed_methods=['cod', 'card', 'wallet']
        if value not in allowed_methods:
            raise serializers.ValidationError("Invalid payment method.")
        return value

    

    def create(self, validated_data):
        user = self.context['request'].user
        address = validated_data.pop('address_id')  
        payment_method = validated_data.get('payment_method', 'cod') 

    
        cart, created = Cart.objects.get_or_create(user=user)

        if created or not cart.items.exists():
            raise serializers.ValidationError("No valid cart items found for this user.")

 
        total_amount = cart.get_total()
        total_discount = cart.get_total_discount()
        final_total = cart.get_final_total()


       
        order = Order.objects.create(
            user=user,
            total_amount=total_amount,
            total_discount=total_discount,
            final_total=final_total,
            status='pending',
            payment_method=payment_method,
        )

        # for the selected address 
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

        # Create order items from cart items
        for cart_item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                variant=cart_item.variant,
                quantity=cart_item.quantity,
                price=cart_item.variant.calculate_total_price(),
                subtotal=cart_item.get_subtotal(),
                discount=(cart_item.get_subtotal() - cart_item.calculate_final_price()),
                final_price=cart_item.calculate_final_price()
            )
        cart.clear()
      
        return order
    
# ==================================Order Cancellation ====================



class OrderCancelSerializer(serializers.ModelSerializer):

    cancel_reason = serializers.CharField(max_length=255, required=True)

    class Meta:
        model = Order
        fields = ['id', 'cancel_reason']

    def validate(self, data):
        order = self.instance
        
        if order.status == 'cancelled':
            raise serializers.ValidationError("Order is already cancelled.")
       
        if order.payment_method != 'cod':
            raise serializers.ValidationError("Only Cash on Delivery orders can be cancelled.")
        
        if order.payment_status != 'pending':
            raise serializers.ValidationError("Cannot cancel order with completed payment.")
        
        if order.status in ['shipped', 'delivered','return_requested','returned','return_denied']:
            raise serializers.ValidationError("Cannot cancel shipped or delivered orders.")
        return data

    def update(self, instance, validated_data):
        
        instance.cancel_reason = validated_data['cancel_reason']
        instance.cancelled_at = timezone.now()
        instance.save()
        instance.cancelorder()  
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
            raise serializers.ValidationError("Cannot cancel items after status shipped.")

        
        if order.payment_method != 'cod':
            raise serializers.ValidationError("Only Cash on Delivery order items can be cancelled.")
        if order.payment_status != 'pending':
            raise serializers.ValidationError("Cannot cancel items in an order with completed payment.")

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
        if order.items.filter(status='return_requested').exists():
            raise serializers.ValidationError("Order already has pending return requests for items.")
        return data

    def update(self, instance, validated_data):
        instance.request_return(validated_data['return_reason'])
        return instance
    

class AdminOrderReturnApprovalSerializer(serializers.ModelSerializer):
    approve = serializers.BooleanField(required=True,write_only=True)

    class Meta:
        model = Order
        fields = ['id', 'approve']

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
    
#============== Order item returned========================

class OrderItemReturnSerializer(serializers.ModelSerializer):
    return_reason = serializers.CharField(max_length=255, required=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'return_reason']

    def validate(self, data):
        item = self.instance
        if item.order.status != 'delivered':
            raise serializers.ValidationError("Only items in delivered orders can be returned.")
        if item.status != 'active':
            raise serializers.ValidationError("Item is already cancelled, returned, or has a pending return request.")
        return data

    def update(self, instance, validated_data):
        instance.request_item_return(validated_data['return_reason'])
        return instance
    
class AdminOrderItemReturnApprovalSerializer(serializers.ModelSerializer):
    approve = serializers.BooleanField(required=True,write_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'approve']

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
    

# =============== Wallet views=====================================

class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = ['user', 'balance', 'created_at', 'updated_at']
        read_only_fields = ['user', 'balance', 'created_at', 'updated_at']

class WalletTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WalletTransaction
        fields = ['wallet', 'amount', 'transaction_type', 'description', 'created_at','order_number',
                #   'transation_id'
                  ]
        read_only_fields = ['wallet', 'amount', 'transaction_type', 'description', 'created_at',
                            # 'transation_id'
                            ]
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
            "gold_color": product.gold_color,
            "images": images
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