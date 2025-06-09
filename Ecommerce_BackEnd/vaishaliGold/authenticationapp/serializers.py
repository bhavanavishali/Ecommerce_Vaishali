
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import *
import re
import logging


logger = logging.getLogger(__name__)

User = get_user_model()


    

class UserProfileSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    phone_number = serializers.CharField(source='user.phone_number', required=False)
    username = serializers.CharField(source='user.username', required=False)
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = UserProfile
        fields = ['username', 'profile_picture', 'first_name', 'last_name', 'phone_number', 'email']

    def validate_first_name(self, value):
        if value and (len(value) < 2 or not re.match(r'^[a-zA-Z\s]+$', value)):
            raise serializers.ValidationError("First name must be at least 2 characters and contain only letters and spaces")
        return value

    def validate_last_name(self, value):
        if value and (len(value) < 2 or not re.match(r'^[a-zA-Z\s]+$', value)):
            raise serializers.ValidationError("Last name must be at least 2 characters and contain only letters and spaces")
        return value

    def validate_username(self, value):
        if value and (len(value) < 2 or not re.match(r'^[a-zA-Z\s]+$', value)):
            raise serializers.ValidationError("Username must be at least 2 characters and contain only letters and spaces")
        if value and User.objects.filter(username=value).exclude(email=self.instance.user.email if self.instance else None).exists():
            raise serializers.ValidationError("Username is already taken")
        return value

    def validate_phone_number(self, value):
        if value and not re.match(r'^\d{10}$', value):
            raise serializers.ValidationError("Phone number must be exactly 10 digits")
        return value

    def validate_profile_picture(self, value):
        if value and (not value.name.lower().endswith(('.jpg', '.jpeg', '.png', '.gif')) or value.size > 5 * 1024 * 1024):
            raise serializers.ValidationError("Profile picture must be JPEG, PNG, or GIF and less than 5MB")
        return value

    def update(self, instance, validated_data):
        logger.info(f"Updating profile for user: {instance.user.email}, data: {validated_data}")

        # Extract nested user fields
        user_data = validated_data.pop('user', {})

        user = instance.user
        for field, value in user_data.items():
            if value is not None:
                setattr(user, field, value)

        try:
            user.full_clean()
            user.save()
            logger.info(f"User {user.email} updated successfully")
        except Exception as e:
            logger.error(f"Failed to update user {user.email}: {str(e)}")
            raise serializers.ValidationError(f"Failed to update user: {str(e)}")

        # Handle profile fields (e.g., profile_picture)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        try:
            instance.full_clean()
            instance.save()
            logger.info(f"UserProfile for {user.email} updated successfully")
        except Exception as e:
            logger.error(f"Failed to update UserProfile for {user.email}: {str(e)}")
            raise serializers.ValidationError(f"Failed to update profile: {str(e)}")

        return instance


    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['profile_picture'] = instance.profile_picture.url if instance.profile_picture else None
        return representation
    
    
class UserSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(source='users.profile_picture', read_only=True)
    referral_code = serializers.CharField(max_length=8, required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'username', 'email', 'phone_number', 'password', 'is_active', 'profile_picture','referral_code')
        extra_kwargs = {'password': {'write_only': True}}

        def validate_referral_code(self, value):
            if value:
                try:
                    User.objects.get(referral_code=value)
                except User.DoesNotExist:
                    raise serializers.ValidationError("Invalid referral code.")
            return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        referral_code = validated_data.pop('referral_code', None)
        user = User.objects.create_user(**validated_data, password=password)
        if referral_code:
            try:
                referrer = User.objects.get(referral_code=referral_code)
                Referral.objects.create(referrer=referrer, referred_user=user)
            except User.DoesNotExist:
                pass  
        return user
    
    def update(self, instance, validated_data):
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.is_admin = validated_data.get('is_admin', instance.is_admin)
        instance.is_staff = validated_data.get('is_staff', instance.is_staff)
        instance.is_active = validated_data.get('is_active', instance.is_active)
        instance.is_superadmin = validated_data.get('is_superadmin', instance.is_superadmin)

        if 'password' in validated_data:
            instance.set_password(validated_data['password'])
        instance.save()
        print("User successfully updated")
        return instance

class GoogleAuthSerializer(serializers.Serializer):
    id_token = serializers.CharField()
    
    def validate_id_token(self, id_token):
        return id_token
    

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model=Address
        fields=[
            'id','name','house_no','city','state','pin_code','address_type','landmark','mobile_number','alternate_number'  ,'isDefault'   ]
    def validate_name(self, value):
        if not re.match(r'^[A-Za-z0-9 ]+$', value):
            raise serializers.ValidationError("Name must contain only letters, digits, and spaces.")
        return value

    def validate_landmark(self, value):
        if not re.match(r'^[A-Za-z0-9 ]+$', value):
            raise serializers.ValidationError("Landmark must contain only letters, digits, and spaces.")
        return value
    def validate_isDefault(self, value):
        if value:
                
            request = self.context.get('request')
            user = request.user
            existing_default = Address.objects.filter(user=user, isDefault=True).exclude(id=self.instance.id if self.instance else None)
            if existing_default.exists():
                existing_default.update(isDefault=False)
        return value


    
class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

class PasswordResetConfirmSerializer(serializers.Serializer):
    uidb64 = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(min_length=8)

class PasswordChangeSerializer(serializers.Serializer):
    current_password = serializers.CharField(min_length=8, write_only=True)
    new_password = serializers.CharField(min_length=8, write_only=True)