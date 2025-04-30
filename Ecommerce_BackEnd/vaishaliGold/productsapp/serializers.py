from rest_framework import serializers
from .models import Category,Product,ProductVariant,ProductImage
from rest_framework.serializers import ModelSerializer, ValidationError


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = ['id', 'name', 'is_active','category_offer', 'category_offer_Isactive']

    def validate_name(self, value):
                                                        
    # Check for case-sensitive duplicates
        if Category.objects.filter(name=value).exists():
            if self.instance and self.instance.name == value:
                return value  #
            raise ValidationError("A category with this name already exists.")
        return value
    

    def validate_category_offer(self, value):
        if not (0 <= value <= 100):
            raise ValidationError("Category offer must be between 0 and 100.")
        return value



class ProductVariantSerializer(serializers.ModelSerializer):
    total_price = serializers.SerializerMethodField()
    applied_offer = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductVariant
        fields = ['id', 'available', 'is_active', 'gross_weight', 'gold_price', 
                  'stone_rate', 'making_charge', 'tax', 'stock', 'total_price','applied_offer']
    
    def get_total_price(self, obj):
        return obj.calculate_total_price()
    
    def get_applied_offer(self, obj):

        product_offer = obj.product.product_offer if (obj.product.product_offer_Isactive and obj.product.is_active) else 0
        category_offer = (obj.product.category.category_offer if (obj.product.category and 
                        obj.product.category.category_offer_Isactive and obj.product.category.is_active) else 0)
        max_offer = max(product_offer, category_offer)
        return {
            'offer_percentage': max_offer,
            'offer_type': 'product' if product_offer >= category_offer else 'category' if category_offer > 0 else 'none'
        }
    def get_base_price(self,obj):
        return obj.obj.calculate_base_price()
    
class  ProductImageSerializer(serializers.ModelSerializer):

    class Meta:
        model=ProductImage
        fields=['id','product','image' ]
import json
class ProductSerializer(serializers.ModelSerializer):
    image = ProductImageSerializer(many=True, read_only=True, source='images')
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=True),
        write_only=True, required=False  
    )
    variants = ProductVariantSerializer(many=True)
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    category_name = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'category', 'category_name', 'description', 
                 'occasion', 'gender', 'is_active', 'bis_hallmark', 'size',
                 'created_at', 'updated_at', 'variants', 'available', 
                 'gold_color', 'price','image','uploaded_images','product_offer', 'product_offer_Isactive']
        
    def validate_product_offer(self, value):
        if not (0 <= value <= 100):
            raise ValidationError("Product offer must be between 0 and 100.")
        return value
    def validate_variants(self, value):
        if not value:
            raise ValidationError("At least one variant is required.")
        return value

    def to_internal_value(self, data):
        # Handle variants as JSON string from FormData
        if isinstance(data, dict) and 'variants' in data and isinstance(data['variants'], str):
            try:
                data['variants'] = json.loads(data['variants'])
            except json.JSONDecodeError:
                raise ValidationError({"variants": "Invalid JSON format for variants."})
        return super().to_internal_value(data)

    def create(self, validated_data):
         
        variants_data = validated_data.pop('variants', [])
        uploaded_images=validated_data.pop('uploaded_images',[])
        
        product = Product.objects.create(**validated_data)
        
        for image in uploaded_images:
            ProductImage.objects.create(product=product,image=image)
             
        ProductVariant.objects.bulk_create([ProductVariant(product=product, **variant) for variant in variants_data])
        return product
     
    
    def update(self, instance, validated_data):
        
        variants_data = validated_data.pop('variants', None)
        uploaded_images = validated_data.pop('uploaded_images', [])

        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        
        if variants_data is not None:
            
            instance.variants.all().delete()
            
            ProductVariant.objects.bulk_create([
                ProductVariant(product=instance, **variant) for variant in variants_data
            ])

        # Update images
        if uploaded_images:
            
            instance.images.all().delete()
            
            ProductImage.objects.bulk_create([
                ProductImage(product=instance, image=image) for image in uploaded_images
            ])

        return instance
    
    def get_category_name(self, obj):
        if obj.category:
            return obj.category.name
        return None
    
    def get_price(self, obj):
        
        available_variants = [variant for variant in obj.variants.all() if variant.available]
        if not available_variants:
            return None
        
        prices = [variant.calculate_total_price() for variant in available_variants]
        return min(prices) if prices else None
    
