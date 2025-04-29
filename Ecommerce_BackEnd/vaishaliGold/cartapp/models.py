from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from productsapp.models import ProductVariant
from authenticationapp.models import Address
from datetime import timedelta
from django.db import  transaction

# Create your models here.

User=get_user_model()

class Cart(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE,related_name='cart')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def get_total(self):
        
        return sum(item.get_subtotal() for item in self.items.all())
    
    def get_total_discount(self):
        total_discount=0
        for item in self.items.all():
            subtotal = item.variant.calculate_total_price() * item.quantity
            discount_percentage=item.get_discount_percentage()
            discount_amount=(subtotal * discount_percentage) / 100
            total_discount+=discount_amount
        return total_discount
        
    def get_final_total(self):
        return self.get_total() - self.get_total_discount()

    def __str__(self):
        return f"cart for {self.user.username}"
    
    
    def clear(self):
        self.items.all().delete()

    
   

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(default=timezone.now)
    def __str__(self):
        return f"{self.quantity} x {self.variant.product.name}"

    def get_subtotal(self):
        return self.variant.calculate_total_price() * self.quantity
    
    def get_discount_percentage(self):

        return self.variant.product.discount
    
    def calculate_final_price(self):
        subtotal=self.variant.calculate_total_price() * self.quantity
        discount_percentage=self.get_discount_percentage()
        discount_amount=(subtotal * discount_percentage)/100
        return subtotal -discount_amount
    
    def save(self, *args, **kwargs):
        super(CartItem, self).save(*args, **kwargs)
        # Remove from wishlist if exists
        wishlist = Wishlist.objects.filter(user=self.cart.user).first()
        if wishlist:
            WishlistItem.objects.filter(wishlist=wishlist, variant=self.variant).delete()



class Order(models.Model):

    STATUS_CHOICES = (
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
        ('partially_refunded', 'Partially Refunded'),
    )

    PAYMENT_METHOD_CHOICES = (
        ('card', 'Credit/Debit Card'),
        ('wallet', 'Wallet'),
        ('cod', 'Cash on Delivery'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True)
    cart = models.ForeignKey(Cart, on_delete=models.SET_NULL, null=True)
    order_number=models.CharField(max_length=20, unique=True,null=False,default=False)
    total_amount= models.DecimalField(max_digits=10, decimal_places=2)
    total_discount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    final_total = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    est_delivery = models.DateField(null=True,blank=True,editable=False)


    status = models.CharField(max_length=50,choices=STATUS_CHOICES,default='pending')
    payment_status = models.CharField(max_length=50, choices=PAYMENT_STATUS_CHOICES, default='pending')
    payment_method = models.CharField(max_length=50, choices=PAYMENT_METHOD_CHOICES)

    cancelled_at = models.DateTimeField(null=True, blank=True)
    cancel_reason = models.TextField(blank=True, null=True)
    returned_at = models.DateTimeField(null=True, blank=True)
    return_reason = models.TextField(blank=True, null=True)
    approve_status = models.BooleanField(default=False)

    razorpay_order_id = models.CharField(max_length=100, null=True, blank=True)
    razorpay_payment_id = models.CharField(max_length=100, null=True, blank=True)
    razorpay_signature = models.CharField(max_length=100, null=True, blank=True)

    # ========= Cancel order ============

    def cancelorder(self):
        with transaction.atomic():
            print(f"Order cancel_reason: {self.cancel_reason}, cancelled_at: {self.cancelled_at}")
            if self.status != 'cancelled':
                self.status = 'cancelled'
                self.payment_status = 'refunded' if self.payment_status == 'completed' else 'cancelled'
                
                for item in self.items.all():
                    print(f"Item status: {item.status}, variant: {item.variant}")
                    if item.status == 'active':
                        item.variant.stock += item.quantity
                        item.status = 'cancelled'
                        item.cancelled_at = self.cancelled_at or timezone.now()
                        item.cancel_reason = self.cancel_reason
                        item.variant.save()
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
            self.save()

    def approve_return(self):
        with transaction.atomic():
            if self.status != 'return_requested':
                raise ValueError("Only return requested orders can be approved")
            self.status = 'returned'
            self.approve_status = True
            self.returned_at = timezone.now()
            self.payment_status = 'refunded' if self.payment_status == 'completed' else 'cancelled'
            
            for item in self.items.all():
                if item.status == 'active':
                    item.variant.stock += item.quantity
                    item.status = 'returned'
                    item.returned_at = timezone.now()
                    item.return_reason = self.return_reason
                    item.variant.save()
                    item.save()
            
            if self.payment_method == 'cod':
                wallet, _ = Wallet.objects.get_or_create(user=self.user)
                wallet.add_funds(self.final_total,order_number=self.order_number)
            
            self.save()

    def deny_return(self):
        with transaction.atomic():
            if self.status != 'return_requested':
                raise ValueError("Only return requested orders can be denied")
            self.status = 'return_denied'
            self.approve_status = False
            self.save()

    
    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = f"ORD{timezone.now().strftime('%Y%m%d%H%M%S')}"
        if not self.est_delivery:
            created_time = self.created_at or timezone.now()
            self.est_delivery = (created_time + timedelta(days=3)).date()
        super(Order, self).save(*args, **kwargs)

class OrderItem(models.Model):
    
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('cancelled', 'Cancelled'),
        ('returned', 'Returned'),
        ('return_requested', 'Return Requested'),
    )
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    final_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')

   

    cancelled_at = models.DateTimeField(null=True, blank=True)
    cancel_reason = models.TextField(blank=True, null=True)
    returned_at = models.DateTimeField(null=True, blank=True)
    return_reason = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.quantity} x {self.variant.product.name} in Order {self.order.id}"
    
    def get_primary_image(self):
        return self.variant.product.images.filter(is_primary=True).first()
    

    def cancel_item(self,cancel_reason):
        with transaction.atomic():
            if self.status != 'active':
                raise ValueError("Only active items can be cancelled")
            
            self.status ='cancelled'
            self.cancelled_at=timezone.now()
            self.cancel_reason=cancel_reason

            self.variant.stock +=self.quantity
            self.variant.save()
            self.save()


            order= self.order
            active_items=order.items.filter(status='active')

            if active_items.exists():
                order.total_amount = sum(item.subtotal for item in active_items)
                order.total_discount = sum(item.discount for item in active_items)
                order.final_total = order.total_amount - order.total_discount

            else:

                order.status='cancelled'
                order.payment_status='refunded' if order.payment_status == 'completed' else 'cancelled'
                order.total_amount = 0
                order.total_discount = 0
                order.final_total = 0
                order.cancelled_at = timezone.now()
                order.cancel_reason = cancel_reason

            order.save()
    def request_item_return(self, return_reason):
        with transaction.atomic():
            if self.order.status != 'delivered':
                raise ValueError("Only items in delivered orders can be returned")
            if self.status != 'active':
                raise ValueError("Only active items can be returned")
            self.status = 'return_requested'
            self.return_reason = return_reason
            self.save()
            # Update order status if this is the first return request
            all_items = self.order.items.all()
            if all(item.status == 'return_requested' for item in all_items):
                self.order.status = 'return_requested'
                self.order.return_reason = "All items requested for return"
                self.order.save()

    def approve_item_return(self):
        with transaction.atomic():
            if self.status != 'return_requested':
                raise ValueError("Only return requested items can be approved")
            self.status = 'returned'
            self.returned_at = timezone.now()
            self.variant.stock += self.quantity
            self.variant.save()
            
            if self.order.payment_method == 'cod':
                wallet, _ = Wallet.objects.get_or_create(user=self.order.user)
                wallet.add_funds(self.final_price,order_number=self.order.order_number)
            
            self.save()

            order = self.order
            active_or_requested_items = order.items.exclude(status__in=['cancelled', 'returned'])
            if not active_or_requested_items.exists():
                order.status = 'returned'
                order.returned_at = timezone.now()
                order.payment_status = 'refunded' if order.payment_status == 'completed' else 'cancelled'
                order.total_amount = 0
                order.total_discount = 0
                order.final_total = 0
            else:
                order.total_amount = sum(item.subtotal for item in active_or_requested_items)
                order.total_discount = sum(item.discount for item in active_or_requested_items)
                order.final_total = order.total_amount - order.total_discount
            order.save()

    def deny_item_return(self):
        with transaction.atomic():
            if self.status != 'return_requested':
                raise ValueError("Only return requested items can be denied")
            self.status = 'active'
            self.return_reason = None
            self.save()
            # Update order status if no other items are return_requested
            if not self.order.items.filter(status='return_requested').exists():
                self.order.status = 'delivered'
                self.order.return_reason = None
                self.order.save()
    
class OrderAddress(models.Model):
    ADDRESS_TYPES = (
        ('home', 'Home'),
        ('work', 'Work'),
    )

    order = models.OneToOneField('Order', on_delete=models.CASCADE, related_name='order_address')
    name = models.CharField(max_length=100)
    house_no = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pin_code = models.CharField(max_length=6)
    address_type = models.CharField(max_length=15, choices=ADDRESS_TYPES)
    landmark = models.CharField(max_length=200, blank=True, null=True)
    mobile_number = models.CharField(max_length=10)
    alternate_number = models.CharField(max_length=10, blank=True, null=True)

    def __str__(self):
        return f"{self.name}'s {self.address_type} address for Order {self.order.id}"
    

# =============== Wallet creating for user ====================
from decimal import Decimal
class Wallet(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='wallet')
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Wallet for {self.user.username} - Balance: {self.balance}"

    def add_funds(self, amount,order_number=None):
        
        with transaction.atomic():
            amount = Decimal(str(amount))
            self.balance = Decimal(str(self.balance))
            self.balance += amount
            self.save()
            WalletTransaction.objects.create(
                wallet=self,
                amount=amount,
                transaction_type='credit',
                description='Refund from order return',
                order_number=order_number
            )

# ================== for tracking wallet changes =====================


class WalletTransaction(models.Model):
    TRANSACTION_TYPES = (

        ('credit', 'Credit'),
        ('debit', 'Debit'),
    )
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name='transactions')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    order_number = models.CharField(max_length=20, null=True, blank=True)
    description = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    # transaction_id = models.CharField(max_length=20, unique=True, null=False)

    def __str__(self):
        return f"{self.transaction_type} of {self.amount} for {self.wallet.user.username}"
    
    # def save(self, *args, **kwargs):
    #     if not self.transaction_id:
    #         self.transaction_id = f"TXN{timezone.now().strftime('%Y%m%d%H%M%S')}"
    #     super(WalletTransaction, self).save(*args, **kwargs)
    


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

    

