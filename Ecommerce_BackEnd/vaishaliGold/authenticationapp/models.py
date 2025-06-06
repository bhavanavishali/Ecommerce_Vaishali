


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
from django.core.validators import RegexValidator, MinLengthValidator
from django.db.models.signals import post_save
from django.dispatch import receiver

class MyAccountManager(BaseUserManager):  
    def create_user(self, username, email, first_name=None, last_name=None, phone_number=None, password=None, google_id=None, referral_code=None): 
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
            is_superadmin=False,
            referral_code=self._generate_referral_code() if not referral_code else referral_code,
            
        )
        user.set_password(password)  
        user.is_active = True if google_id else False 
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
       
        characters = string.ascii_uppercase + string.digits
        code = ''.join(random.choices(characters, k=8))
        while User.objects.filter(referral_code=code).exists():
            code = ''.join(random.choices(characters, k=8))
        return code



class User(AbstractBaseUser):  


    first_name = models.CharField(
        max_length=50,
        validators=[MinLengthValidator(2), RegexValidator(r'^[a-zA-Z\s]+$', 'Only letters and spaces allowed')]
    )
    last_name = models.CharField(
        max_length=50,
        validators=[MinLengthValidator(2), RegexValidator(r'^[a-zA-Z\s]+$', 'Only letters and spaces allowed')]
    )
    username = models.CharField(
        max_length=50,
        unique=True,
        validators=[MinLengthValidator(2), RegexValidator(r'^[a-zA-Z\s]+$', 'Only letters and spaces allowed')]
    )
    email = models.EmailField(max_length=100, unique=True)
    phone_number = models.CharField(
        max_length=10,
        validators=[RegexValidator(r'^\d{10}$', 'Phone number must be 10 digits')]
    )
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
    
from django.core.exceptions import ValidationError
class UserProfile(models.Model):  
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='user')  
    profile_picture = models.ImageField(upload_to='user/profile_pic/', null=True, blank=True) 
    
    def __str__(self):
        return str(self.user.first_name) 
    def clean(self):
        if self.profile_picture:
            if not self.profile_picture.name.lower().endswith(('.jpg', '.jpeg', '.png', '.gif')):
                raise ValidationError("Profile picture must be JPEG, PNG, or GIF")
            if self.profile_picture.size > 5 * 1024 * 1024:
                raise ValidationError("Profile picture must be less than 5MB")
    
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

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