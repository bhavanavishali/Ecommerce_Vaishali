
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.core.cache import cache
from authenticationapp.models import User  # Custom User model
from django.utils import timezone
from datetime import timedelta
import random

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

