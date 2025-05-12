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

    def is_valid(self):
        now = timezone.now().date()   
        return (
            self.is_active and
            self.valid_from <= now <= self.valid_to and
            (self.max_uses == 0 or self.used_count < self.max_uses)
        )
    def __str__(self):
        return self.coupon_code
