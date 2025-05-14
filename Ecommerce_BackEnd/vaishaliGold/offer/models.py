from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from decimal import Decimal


class Coupon(models.Model):
    COUPON_TYPE=(
        ('flat','Flat'),
        ('percentage','Percentage'),
    )
    coupon_name=models.CharField(max_length=100,default="speacial offer")
    coupon_code = models.CharField(max_length=50, default='VAISHALIGOLD')
    discount = models.DecimalField(max_digits=5,decimal_places=2,default=0.00)
    valid_from = models.DateField()
    valid_to = models.DateField()
    is_active = models.BooleanField(default=True)
    max_uses = models.PositiveIntegerField(default=0)  
    used_count = models.PositiveIntegerField(default=0)
    min_amount=models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now=True)
    updated_at = models.DateTimeField(auto_now=True)
    min_offer_amount=models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    coupon_type= models.CharField(max_length=20, choices=COUPON_TYPE, default='flat')
    user = models.ForeignKey('authenticationapp.User', on_delete=models.CASCADE, null=True, blank=True)
    
   
    max_uses_per_user = models.PositiveIntegerField(default=1) 
    def is_valid(self, user):
        from cartapp.models import Order
        # Check if coupon is expired
        

        # Check if max uses exceeded
        if self.max_uses > 0 and self.used_count >= self.max_uses:
            return False

        # Check if user has exceeded max uses
        if user and self.max_uses_per_user > 0:
            user_order_count = Order.objects.filter(
                user=user,
                coupon=self,
                payment_status='completed'
            ).count()
            if user_order_count >= self.max_uses_per_user:
                return False

        return True
    def __str__(self):
        return self.coupon_code
