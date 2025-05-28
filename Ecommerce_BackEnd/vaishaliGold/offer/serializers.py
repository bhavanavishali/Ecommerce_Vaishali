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
    
# ==================== Dashboard =====================================

class SalesDataSerializer(serializers.Serializer):
    period = serializers.CharField(source='month', allow_null=True)
    week = serializers.CharField(required=False)
    day = serializers.CharField(required=False)
    hour = serializers.CharField(required=False)
    sales = serializers.FloatField()

    class Meta:
        fields = ['month', 'week', 'day', 'hour', 'sales']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
       
        if 'month' in instance:
            representation['month'] = instance['month']
        elif 'week' in instance:
            representation['week'] = instance['week']
        elif 'day' in instance:
            representation['day'] = instance['day']
        elif 'hour' in instance:
            representation['hour'] = instance['hour']
        return representation

class TopProductSerializer(serializers.Serializer):
    name = serializers.CharField()
    sales = serializers.IntegerField()

class TopCategorySerializer(serializers.Serializer):
    name = serializers.CharField()
    sales = serializers.IntegerField()
