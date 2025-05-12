# authenticationapp/models.py
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils import timezone
from django.core.validators import RegexValidator
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils import timezone
import uuid
import random
import string

class MyAccountManager(BaseUserManager):  
    def create_user(self, first_name, last_name, username, email, phone_number, password=None,referral_code=None):  
        if not email:
            raise ValueError('User must have an email address')  
        if not username:
            raise ValueError('User must have a username')  
        user = self.model(
            email=self.normalize_email(email),  
            username=username,
            first_name=first_name,
            last_name=last_name,
            phone_number=phone_number,
            referral_code=self._generate_referral_code() if not referral_code else referral_code,
        )
        user.set_password(password)  
        user.is_active = False  
        user.save(using=self._db) 
        return user  
    
    def create_superuser(self, first_name, last_name, email, username, password, phone_number=None): 
        user = self.create_user(
            email=self.normalize_email(email),  
            username=username,
            password=password,  
            first_name=first_name,
            last_name=last_name,
            phone_number=phone_number or "0000000000",  
        )
        user.is_admin = True  
        user.is_active = True  
        user.is_staff = True  
        user.is_superadmin = True 
        user.save(using=self._db)  
        return user  
    def _generate_referral_code(self):
        """Generate a unique 8-character referral code."""
        characters = string.ascii_uppercase + string.digits
        code = ''.join(random.choices(characters, k=8))
        while User.objects.filter(referral_code=code).exists():
            code = ''.join(random.choices(characters, k=8))
        return code



class User(AbstractBaseUser):  


    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(max_length=100, unique=True)
    phone_number = models.CharField(max_length=50, blank=True)
    google_id = models.CharField(max_length=100, blank=True, null=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)  
    is_admin = models.BooleanField(default=False)
    is_email_verified = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False) 
    is_superadmin = models.BooleanField(default=False)
    referral_code = models.CharField(max_length=8,blank=True)

    USERNAME_FIELD = 'email'  
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']  

    objects = MyAccountManager()  

    def __str__(self):
        return self.email  
    def has_perm(self, perm, obj=None):
        return self.is_admin  
    
    def has_module_perms(self, app_label):
        return True  

class UserProfile(models.Model):  
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='user')  
    profile_picture = models.ImageField(upload_to='user/profile_pic/', null=True, blank=True) 
    
    def __str__(self):
        return str(self.user.first_name) 
    


class Address (models.Model):
    ADDRESS_TYPES =(
         ('home', 'Home'),
        ('work', 'Work'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    name = models.CharField(max_length=100)
    house_no = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pin_code = models.CharField(max_length=6,validators=[RegexValidator(r'^\d{6}$',message="enter 6 digits")])
    address_type = models.CharField(max_length=15, choices=ADDRESS_TYPES)
    landmark = models.CharField(max_length=200, blank=True,null=True)
    mobile_number = models.CharField(max_length=10,validators=[RegexValidator(r'^\d{10}$',message="enter the 10 digits")])
    alternate_number = models.CharField(max_length=10, blank=True,null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    isDefault=models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']


    def save(self, *args, **kwargs):
        # Ensure only one address is default for the user
        if self.isDefault:
            Address.objects.filter(user=self.user, isDefault=True).exclude(id=self.id).update(isDefault=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name}'s {self.address_type} address"

class Referral(models.Model):
    referrer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='referrals_made')
    referred_user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='referral')
    referrer_coupon = models.ForeignKey('offer.Coupon', on_delete=models.SET_NULL, null=True, blank=True, related_name='referrer_coupons')
    referred_coupon = models.ForeignKey('offer.Coupon', on_delete=models.SET_NULL, null=True, blank=True, related_name='referred_coupons')
    created_at = models.DateTimeField(default=timezone.now)
    rewarded = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.referrer.email} referred {self.referred_user.email}"

    class Meta:
        unique_together = ('referrer', 'referred_user')