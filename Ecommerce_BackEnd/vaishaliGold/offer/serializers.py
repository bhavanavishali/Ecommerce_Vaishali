from .models import *
from rest_framework import serializers


class CouponSerializer(serializers.ModelSerializer):
    remaining_uses = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    
    class Meta:
        model = Coupon
        fields = ['id', 'coupon_name', 'coupon_code', 'discount', 'valid_from', 'valid_to', 
                 'is_active', 'max_uses', 'used_count', 'min_amount', 'remaining_uses', 
                 'status', 'created_at', 'updated_at','min_offer_amount','coupon_type','user']
        read_only_fields = ['used_count', 'created_at', 'updated_at']

    def get_remaining_uses(self, obj):
        if obj.max_uses == 0:
            return "Unlimited"
        return obj.max_uses - obj.used_count
    
    def get_status(self, obj):
        now = timezone.now().date()
        
        if not obj.is_active:
            return "Inactive"
        elif now < obj.valid_from:
            return "Pending"
        elif now > obj.valid_to:
            return "Expired"
        elif obj.max_uses > 0 and obj.used_count >= obj.max_uses:
            return "Fully Used"
        else:
            return "Active"

    def validate(self, data):
        if data.get('valid_from') and data.get('valid_to'):
            if data['valid_from'] > data['valid_to']:
                raise serializers.ValidationError("End date must be after start date")
        
        if data.get('discount'):
            if data['discount'] <= 0:
                raise serializers.ValidationError("Discount must be greater than 0")
                
        return data