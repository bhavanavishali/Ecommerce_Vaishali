
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.core.cache import cache
from authenticationapp.models import User  # Custom User model
from django.utils import timezone
from datetime import timedelta
import random
import logging
from offer.models import Coupon
from .models import Referral

logger = logging.getLogger(__name__)


@receiver(post_save, sender=User)
def send_otp_email(sender, instance, created, **kwargs):
    if created:
        print(f"Signal triggered for user: {instance.email}")
        otp = str(random.randint(100000, 999999))
        print(f"Generated OTP: {otp}")
        cache_key = f"otp_{instance.email}"
        cache_data = {
            'otp_code': otp,
            'created_at': timezone.now().isoformat(),
            'expires_at': (timezone.now() + timedelta(minutes=5)).isoformat(),
            'is_verified': False
        }
        cache.set(cache_key, cache_data, timeout=120)
        print(f"Cache set with key: {cache_key}, data: {cache_data}")
        try:
            send_mail(
                'Your OTP for Sign Up',
                f'Your OTP is {otp}. It expires in 5 minutes.',
                'bhavana.vayshali@gmail.com',
                [instance.email],
                fail_silently=False,
            )
            print(f"Email sent to {instance.email} with OTP: {otp}")
        except Exception as e:
            print(f"Email sending failed: {str(e)}")


@receiver(post_save, sender=User)
def create_referral(sender, instance, created, **kwargs):
    if created and instance.is_email_verified:
        referral_code = instance.referral_code
        if referral_code:
            try:
                referrer = User.objects.get(referral_code=referral_code)
                if referrer != instance:  # Ensure user can't refer themselves
                    # Create referral record
                    referral = Referral.objects.create(
                        referrer=referrer,
                        referred_user=instance,
                        rewarded=False
                    )
                    
                    # Create coupon for referrer (User A)
                    referrer_coupon = Coupon.objects.create(
                        coupon_name=f"Referral Reward for {referrer.email}",
                        coupon_code=f"REF{referrer.id}{instance.id}",
                        discount=10.00,  # $10 discount
                        valid_from=timezone.now().date(),
                        valid_to=(timezone.now() + timedelta(days=30)).date(),
                        is_active=True,
                        max_uses=1,
                        min_amount=50.00,
                        coupon_type='flat',
                        user=referrer
                    )
                    
                    # Create coupon for referred user (User B)
                    referred_coupon = Coupon.objects.create(
                        coupon_name=f"Welcome Coupon for {instance.email}",
                        coupon_code=f"WELCOME{instance.id}",
                        discount=5.00,  # $5 welcome discount
                        valid_from=timezone.now().date(),
                        valid_to=(timezone.now() + timedelta(days=30)).date(),
                        is_active=True,
                        max_uses=1,
                        min_amount=50.00,
                        coupon_type='flat',
                        user=instance
                    )
                    
                    # Link both coupons to the referral and mark as rewarded
                    referral.referrer_coupon = referrer_coupon
                    referral.referred_coupon = referred_coupon
                    referral.rewarded = True
                    referral.save()
                    
                    logger.info(f"Referral created: {referrer.email} referred {instance.email}")
                    logger.info(f"Created $10 coupon {referrer_coupon.coupon_code} for referrer {referrer.email}")
                    logger.info(f"Created $5 coupon {referred_coupon.coupon_code} for referred user {instance.email}")
            except User.DoesNotExist:
                logger.warning(f"No referrer found for referral_code: {referral_code}")
            except Exception as e:
                logger.error(f"Error creating referral for {instance.email}: {str(e)}")
