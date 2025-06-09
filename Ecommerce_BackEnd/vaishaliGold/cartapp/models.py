

from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from productsapp.models import ProductVariant
from authenticationapp.models import Address
from datetime import timedelta
from django.db import  transaction
# from offer.models import Coupon
from productsapp.models import Product, ProductVariant

from django.core.exceptions import ValidationError
import logging
logger = logging.getLogger(__name__)
# Create your models here.

User=get_user_model()

class Tax(models.Model):
    name = models.CharField(max_length=100)
    percentage =models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"tax % {self.name}"


class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    coupon = models.ForeignKey('offer.Coupon', on_delete=models.SET_NULL, null=True, blank=True, related_name='carts')
    final_subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    final_discount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    final_tax = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    final_total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    final_coupon_discount=models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    shipping=models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    def get_final_subtotal(self):
        
        return sum(item.get_subtotal() for item in self.items.all())

    def get_final_discount(self):
       
        return sum(item.get_discount_amount() for item in self.items.all())

    def get_final_tax(self):
        
        return sum(item.get_tax_amount() for item in self.items.all())
    
    def update_shipping(self):
        subtotal = self.get_final_subtotal()
        discount = self.get_final_discount()
        tax = self.get_final_tax()
        total = subtotal - discount + tax
        if total < 1000:
            self.shipping = Decimal('100.00')
        else:
            self.shipping = Decimal('0.00')
        

    def get_final_total(self):
        """Calculate the final total including subtotal, discount, tax, and coupon discount."""
        subtotal = self.get_final_subtotal()
        discount = self.get_final_discount()
        tax = self.get_final_tax()
        self.update_shipping()
        coupon_discount = Decimal(str(self.final_coupon_discount))
        total=subtotal-discount+tax
        if total < 1000:
            return (total + self.shipping - coupon_discount).quantize(Decimal('0.01'))
        return (subtotal - discount + tax - coupon_discount).quantize(Decimal('0.01'))

    def update_totals(self):
        """Update the stored totals in the Cart model."""
        print("Checking the update funcitn called or not wehn updating")
        self.final_subtotal = self.get_final_subtotal()
        self.final_discount = self.get_final_discount()
        self.final_tax = self.get_final_tax()
        self.update_shipping() 
        self.final_total = self.get_final_total()
        self.save()

    def apply_coupon(self, coupon_code):
        """Apply a coupon to the cart."""
        from offer.models import Coupon
        if not self.items.exists():
            raise ValidationError("Cart is empty")
        
        try:
            coupon = Coupon.objects.get(coupon_code=coupon_code,is_active=True)
            if not coupon.is_valid(self.user):
                raise ValidationError("Coupon is not valid or has expired")
            
            total_amount = self.get_final_subtotal()
            if total_amount < coupon.min_amount:
                raise ValidationError(
                    f"Order total must be at least {coupon.min_amount} to use this coupon"
                )

            self.coupon = coupon
            # Calculate coupon discount
            discount = (
                coupon.discount
                if coupon.coupon_type == 'flat'
                else (coupon.discount / Decimal('100')) * total_amount
            )
            if discount > total_amount:
                discount = total_amount
            self.final_coupon_discount = discount
            self.update_totals()
            return discount
        except Coupon.DoesNotExist:
            self.coupon = None
            self.final_coupon_discount = Decimal('0.00')
            self.update_totals()
            raise ValidationError("Invalid coupon code")

    def remove_coupon(self):
        """Remove the coupon from the cart."""
        self.coupon = None
        self.final_coupon_discount = Decimal('0.00')
        self.update_totals()

    def __str__(self):
        return f"cart for {self.user.username}"

    def clear(self):
        """Clear all items from the cart and update totals."""
        self.items.all().delete()
        self.coupon = None
        self.final_coupon_discount = Decimal('0.00')
        self.update_totals()

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.quantity} x {self.variant.product.name}"

    def get_subtotal(self):
        return self.variant.base_price * self.quantity

    def get_discount_amount(self):
        return self.variant.discount_amount * self.quantity

    def get_tax_amount(self):
        return self.variant.tax_amount * self.quantity

    def calculate_total_price(self):
        subtotal = self.get_subtotal()
        discount_amount = self.get_discount_amount()
        tax_amount = self.get_tax_amount()
        total = subtotal - discount_amount + tax_amount
        return total

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        
        wishlist = Wishlist.objects.filter(user=self.cart.user).first()
        if wishlist:
            WishlistItem.objects.filter(wishlist=wishlist, variant=self.variant).delete()
       
        self.cart.update_totals()


class Order(models.Model):

    ORDER_STATUS_CHOICES = (
            ('pending', 'Pending'),
            ('processing', 'Processing'),
            ('shipped', 'Shipped'),
            ('delivered', 'Delivered'),
            ('cancelled', 'Cancelled'),
            ('return_requested', 'Return Requested'),
            ('returned', 'Returned'),
            ('return_denied', 'Return Denied'),
        )

    PAYMENT_STATUS_CHOICES = (
            ('pending', 'Pending'),
            ('completed', 'Completed'),
            ('failed', 'Failed'),
            ('refunded', 'Refunded'),
            ('cancelled', 'Cancelled'), 
            ('partially_refunded', 'Partially Refunded'),
        )

    PAYMENT_METHOD_CHOICES = (
            ('card', 'Credit/Debit Card'),
            ('wallet', 'Wallet'),
            ('cod', 'Cash on Delivery'),
        )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True)
    cart = models.ForeignKey('Cart', on_delete=models.SET_NULL,null=True,related_name='orders')  
    order_number = models.CharField(max_length=20, unique=True)

    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    total_discount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_tax = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    final_total = models.DecimalField(max_digits=10, decimal_places=2)
    

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    est_delivery = models.DateField(null=True, blank=True)

    coupon = models.ForeignKey('offer.Coupon', on_delete=models.SET_NULL, null=True, blank=True)
    coupon_discount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00) 

    status = models.CharField(max_length=50, choices=ORDER_STATUS_CHOICES, default='pending')
    payment_status = models.CharField(max_length=50, choices=PAYMENT_STATUS_CHOICES, default='pending')
    payment_method = models.CharField(max_length=50, choices=PAYMENT_METHOD_CHOICES)

    cancelled_at = models.DateTimeField(null=True, blank=True)
    cancel_reason = models.TextField(blank=True, null=True)
    returned_at = models.DateTimeField(null=True, blank=True)
    return_reason = models.TextField(blank=True, null=True)
    approve_status = models.BooleanField(default=False)
    shipping=models.DecimalField(max_digits=10, decimal_places=2, default=100)
    razorpay_order_id = models.CharField(max_length=100, null=True, blank=True)
    razorpay_payment_id = models.CharField(max_length=100, null=True, blank=True)
    razorpay_signature = models.CharField(max_length=100, null=True, blank=True)

    def apply_coupon(self, coupon):
        
        if not coupon:
            self.coupon = None
            self.coupon_discount = 0.00
            self.recalculate_totals()
            self.save()
            return


        if not coupon.is_valid(self.user, self):
            raise ValueError("Invalid or inapplicable coupon")

        self.coupon = coupon
        
        if coupon.discount_type == 'percentage':
            self.coupon_discount = (coupon.discount_value / 100) * self.total_amount
        else: 
            self.coupon_discount = min(coupon.discount_value, self.total_amount)  
        self.recalculate_totals()
        self.save()

    def cancelorder(self, cancel_reason):
        with transaction.atomic():
            if self.status == 'cancelled':
                raise ValueError("Order is already cancelled")
            self.status = 'cancelled'
            self.cancel_reason = cancel_reason
            self.cancelled_at = timezone.now()
            
            
            if self.payment_status == 'completed':
                self.payment_status = 'refunded'
                if self.payment_method in ['card', 'wallet']:
                    wallet, _ = Wallet.objects.get_or_create(user=self.user)
                    refund_amount = sum(item.final_price for item in self.items.filter(status='active'))
                    wallet.add_funds(refund_amount, order_number=self.order_number)

            else:
                self.payment_status = 'cancelled'

            for item in self.items.filter(status='active'):
                item.status = 'cancelled'
                item.cancel_reason = cancel_reason
                item.cancelled_at = timezone.now()
                # Set item payment_status to match order
                item.payment_status = 'refunded' if self.payment_method in ['card', 'wallet'] else 'cancelled'
                item.save()
            
            self.save()
            if self.cart:
                self.cart.clear()



    def request_return(self, return_reason):
       with transaction.atomic():
            if self.status != 'delivered':
                raise ValueError("Only delivered orders can be returned")
            self.status = 'return_requested'
            self.return_reason = return_reason
            
            for item in self.items.filter(status='delivered'):
                item.status = 'return_requested'
                item.return_reason = return_reason
                item.save()
            self.save()

    def approve_return(self):
        with transaction.atomic():
            if self.status != 'return_requested':
                raise ValueError("Only return requested orders can be approved")
            self.status = 'returned'
            self.approve_status = True
            self.returned_at = timezone.now()
            self.payment_status = 'refunded' if self.payment_status == 'completed' else 'cancelled'
            for item in self.items.filter(status='return_requested'):
                item.approve_item_return()
            
            final_total = sum(item.final_price for item in self.items.filter(status='delivered'))
            if final_total > 0:
                logger.info(f"Processing wallet credit for user {self.user}, amount: {final_total}")
                wallet, _ = Wallet.objects.get_or_create(user=self.user)
                wallet.add_funds(final_total, order_number=self.order_number)
            print("successfull refunderd")
            self.save()

    def deny_return(self):
       with transaction.atomic():
            if self.status != 'return_requested':
                raise ValueError("Only return requested orders can be denied")
            self.status = 'delivered'
            self.approve_status = False
            self.return_reason = None
            for item in self.items.filter(status='return_requested'):
                item.status = 'active'
                item.return_reason = None
                item.save()
            self.save()

    def recalculate_totals(self):
        active_items = self.items.filter(status='active')
        self.total_amount = sum(item.subtotal for item in active_items)
        
        self.total_discount = sum(item.discount  for item in active_items)
        self.total_tax = sum(item.variant.tax_amount * item.quantity for item in active_items)
        
        self.final_total = self.total_amount - self.total_discount + self.total_tax + self.shipping -self.coupon_discount

    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = f"ORD{timezone.now().strftime('%Y%m%d%H%M%S')}"
        if not self.est_delivery:
            self.est_delivery = (self.created_at or timezone.now()).date() + timedelta(days=3)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Order {self.order_number}"

class OrderItem(models.Model):


    ORDER_ITEM_STATUS_CHOICES = (
        ('active', 'Active'),
        ('cancelled', 'Cancelled'),
        ('returned', 'Returned'),
        ('delivered', 'Delivered'),
        ('return_requested', 'Return Requested'),
        ('return_denied', 'Return Denied'),

    )
    ITEM_PAYMENT_STATUS_CHOICES = (
            ('pending', 'Pending'),
            ('completed', 'Completed'),
            ('failed', 'Failed'),
            ('refunded', 'Refunded'),
            ('cancelled', 'Cancelled'), 
            ('partially_refunded', 'Partially Refunded'),
        )

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)  
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    coupon_discount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00) 
    tax= models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    final_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=ORDER_ITEM_STATUS_CHOICES, default='active')
    payment_status=models.CharField(max_length=50, choices=ITEM_PAYMENT_STATUS_CHOICES, default='pending')
    cancelled_at = models.DateTimeField(null=True, blank=True)
    cancel_reason = models.TextField(blank=True, null=True)
    returned_at = models.DateTimeField(null=True, blank=True)
    return_reason = models.TextField(blank=True, null=True)

    product_name = models.CharField(max_length=100, null=True, blank=True)
    product_description = models.TextField(blank=True, null=True)
    product_image = models.CharField(max_length=255, null=True, blank=True)


    def cancel_item(self, cancel_reason):
        with transaction.atomic():
            if self.status != 'active':
                raise ValueError("Only active items can be cancelled")
            
            if not self.variant or not self.variant.is_active or not self.variant.available:
                logger.error(f"Cannot cancel item {self.id}: Variant {self.variant.id} is invalid or unavailable")
                raise ValueError(f"Variant {self.variant.product.name} is not available for stock update")
            
            # Update stock
            original_stock = self.variant.stock
            expected_stock = original_stock + self.quantity
            self.variant.stock += self.quantity
            self.variant.save()
            
            self.variant.refresh_from_db()
            if self.variant.stock != expected_stock:
                logger.error(
                    f"Stock update failed for variant {self.variant.id}. "
                    f"Expected: {expected_stock}, Actual: {self.variant.stock}, Original: {original_stock}"
                )
                raise ValueError(f"Failed to update stock for {self.variant.product.name}")
            
            logger.info(
                f"Stock updated for variant {self.variant.id}: "
                f"Added {self.quantity}, New stock: {self.variant.stock}"
            )
            
            # Update item status
            self.status = 'cancelled'
            self.cancelled_at = timezone.now()
            self.cancel_reason = cancel_reason
            self.save()

            order = self.order
            refund_amount = self.final_price
            shipping_refunded = False

            
            active_items = order.items.filter(status='active').exclude(id=self.id)
            print("*********************")
            if not active_items.exists():
                
                refund_amount += order.shipping  
                print("bbbbbbbbbbbbbbbb",refund_amount)
                shipping_refunded = True
                order.status = 'cancelled'
                order.payment_status = 'refunded' if order.payment_status == 'completed' else 'cancelled'
                order.cancelled_at = timezone.now()
                order.cancel_reason = cancel_reason
                order.save()

            
            if order.payment_status in ['completed','refunded'] and order.payment_method in ['card', 'wallet']:
                if refund_amount <= 0:
                    logger.error(f"Cannot refund item {self.id}: refund_amount is {refund_amount}")
                    raise ValueError(f"Cannot refund item {self.variant.product.name}: Invalid refund amount")
                
                logger.info(f"Processing wallet credit for user {order.user}, amount: {refund_amount}")
                wallet, _ = Wallet.objects.get_or_create(user=order.user)
                wallet.add_funds(refund_amount, order_number=order.order_number)
                
                
                self.payment_status = 'refunded' if not active_items.exists() else 'partially_refunded'
                self.save()
                
                logger.info(f"Refunded {refund_amount} for item {self.id}, shipping_refunded: {shipping_refunded}")


    def request_item_return(self, return_reason):
        with transaction.atomic():
            if self.order.status != 'delivered':
                raise ValueError("Only items in delivered orders can be returned")
            if self.status != 'delivered':
                raise ValueError("Only delivered items can be returned")
            self.status = 'return_requested'
            self.return_reason = return_reason
            self.save()
            all_items = self.order.items.all()
            if all(item.status == 'return_requested' for item in all_items):
                
                self.order.return_reason = "All items requested for return"
                self.order.save()

    
    def approve_item_return(self):
        with transaction.atomic():
            if self.status != 'return_requested':
                raise ValueError("Only return requested items can be approved")
            self.status = 'returned'
            if self.order.payment_method in['card','wallet']:
                self.payment_status='refunded'
            else:
                self.payment_status='faild'

            all_items = self.order.items.all()
            if all(item.status == 'returned' for item in all_items):
                self.order.status = 'returned'

            self.returned_at = timezone.now()
            self.variant.stock += self.quantity
            self.variant.save()
            refund_amount = self.final_price - self.coupon_discount
            logger.info(f"Processing wallet credit for user {self.order.user}, amount: {refund_amount}")
            wallet, _ = Wallet.objects.get_or_create(user=self.order.user)
            wallet.add_funds(self.final_price, order_number=self.order.order_number)
            self.save()
            # self.order.recalculate_totals()
            self.order.save()

    def deny_item_return(self):
        with transaction.atomic():
            if self.status != 'return_requested':
                raise ValueError("Only return requested items can be denied")
            self.status = 'return_denied'
            self.return_reason = None
            self.save()
            if not self.order.items.filter(status='return_requested').exists():
                self.order.status = 'return_denied'
                self.order.return_reason = None
                self.order.save()

    def get_primary_image(self):
        primary_image = self.variant.product.images.filter(is_primary=True).first()
        return primary_image or self.variant.product.images.first()

    def __str__(self):
        return f"{self.quantity} x {self.variant.product.name} in Order {self.order.order_number}"

class OrderAddress(models.Model):
    ADDRESS_TYPES = (
        ('home', 'Home'),
        ('work', 'Work'),
    )

    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='order_address')
    name = models.CharField(max_length=100)
    house_no = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pin_code = models.CharField(max_length=6)
    address_type = models.CharField(max_length=15, choices=ADDRESS_TYPES)
    landmark = models.CharField(max_length=200, blank=True, null=True)
    mobile_number = models.CharField(max_length=10)
    alternate_number = models.CharField(max_length=10, blank=True, null=True)

    def clean(self):
        import re
        if not re.match(r'^\d{6}$', self.pin_code):
            raise ValidationError("Pin code must be a 6-digit number")
        if not re.match(r'^\d{10}$', self.mobile_number):
            raise ValidationError("Mobile number must be a 10-digit number")
        if self.alternate_number and not re.match(r'^\d{10}$', self.alternate_number):
            raise ValidationError("Alternate number must be a 10-digit number")

    def __str__(self):
        return f"{self.name}'s {self.address_type} address for Order {self.order.order_number}"


import random
import string
from decimal import Decimal
from django.db import IntegrityError
def generate_transaction_id():
    """Generate a unique transaction ID based on timestamp and random suffix."""
    timestamp = timezone.now().strftime('%Y%m%d%H%M%S')
    random_suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"TXN{timestamp}{random_suffix}"

class Wallet(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='wallet')
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def add_funds(self, amount, order_number=None):
        with transaction.atomic():
            

            self.balance = Decimal(str(self.balance)) + amount
            self.save()
            transaction_id = generate_transaction_id()

            max_attempts = 5
            attempt = 0
            while attempt < max_attempts:
                try:
                    WalletTransaction.objects.create(
                        wallet=self,
                        transaction_id=transaction_id,
                        amount=amount,
                        transaction_type='credit',
                        order_number=order_number,
                        description=f"Refund for order {order_number}" if order_number else "Manual credit"
                    )
                    break
                except IntegrityError:
                    # Duplicate transaction_id detected, generate a new one
                    attempt += 1
                    transaction_id = generate_transaction_id()
                    if attempt == max_attempts:
                        raise ValueError("Failed to generate a unique transaction ID after multiple attempts")
            else:
                raise ValueError("Failed to generate a unique transaction ID")
    def deduct_funds(self, amount, order_number=None):
        with transaction.atomic():
            if self.balance < amount:
                raise ValueError("Insufficient wallet balance")
            self.balance = Decimal(str(self.balance)) - amount
            self.save()
            transaction_id = generate_transaction_id()
            max_attempts = 5
            attempt = 0
            while attempt < max_attempts:
                try:
                    WalletTransaction.objects.create(
                        wallet=self,
                        transaction_id=transaction_id,
                        amount=amount,
                        transaction_type='debit',
                        order_number=order_number,
                        description=f"Payment for order {order_number}" if order_number else "Manual debit"
                    )
                    break
                except IntegrityError:
                    attempt += 1
                    transaction_id = generate_transaction_id()
                    if attempt == max_attempts:
                        raise ValueError("Failed to generate a unique transaction ID after multiple attempts")
            else:
                raise ValueError("Failed to generate a unique transaction ID")
    def __str__(self):
        return f"Wallet of {self.user.username} - Balance: {self.balance}"

class WalletTransaction(models.Model):
    TRANSACTION_TYPES = (
        ('credit', 'Credit'),
        ('debit', 'Debit'),
    )
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name='transactions')
    transaction_id = models.CharField(max_length=30, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    order_number = models.CharField(max_length=20, null=True, blank=True)
    description = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.transaction_type} of {self.amount} for {self.wallet.user.username} (ID: {self.transaction_id})"
    
    # ==================== wish list========================

class Wishlist(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='wishlist')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Wishlist for {self.user.username}"

    def clear(self):
        self.items.all().delete()

class WishlistItem(models.Model):
    wishlist = models.ForeignKey(Wishlist, on_delete=models.CASCADE, related_name='items')
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE)
    added_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.variant.product.name} in {self.wishlist.user.username}'s wishlist"

    class Meta:
        unique_together = ('wishlist', 'variant')  # Prevent duplicate variants in wishlist

    

