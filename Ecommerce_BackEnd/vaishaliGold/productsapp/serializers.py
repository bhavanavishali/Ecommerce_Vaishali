
    
from rest_framework import serializers
from .models import Category,Product,ProductVariant,ProductImage
from rest_framework.serializers import ModelSerializer, ValidationError
import json

class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = ['id', 'name', 'is_active','category_offer', 'category_offer_Isactive']

    def validate_name(self, value):
    # Check for case-insensitive duplicates
        if Category.objects.filter(name__iexact=value).exists():
            if self.instance and self.instance.name.lower() == value.lower():
                return value 
            raise ValidationError("A category with this name already exists (case-insensitive).")
        return value
    

    def validate_category_offer(self, value):
        if not (0 <= value <= 100):
            raise ValidationError("Category offer must be between 0 and 100.")
        return value



class ProductVariantSerializer(serializers.ModelSerializer):
    
    applied_offer = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductVariant
        fields = [
            'id', 'available', 'is_active', 'gross_weight', 'gold_price', 
            'stone_rate', 'making_charge', 'tax', 'stock', 'applied_offer',
            'base_price', 'tax_amount', 'discount_amount', 'total_price'
        ]
        read_only_fields = ['base_price', 'tax_amount', 'discount_amount', 'total_price']
    def get_applied_offer(self, obj):

        discount = obj.product.discount  if (obj.product.product_offer_Isactive and obj.product.is_active) else 0
        category_offer = (obj.product.category.category_offer if (obj.product.category and 
                        obj.product.category.category_offer_Isactive and obj.product.category.is_active) else 0)
        max_offer = max(discount , category_offer)
        return {
            'offer_percentage': max_offer,
            'offer_type': 'product' if discount  >= category_offer else 'category' if category_offer > 0 else 'none'


        }
    def validate_tax(self, value):
       
        if value is None:
            raise serializers.ValidationError("Tax field is required.")
        return value
    
class  ProductImageSerializer(serializers.ModelSerializer):

    class Meta:
        model=ProductImage
        fields=['id','product','image','is_primary' ]

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
                 'gold_color', 'price','image','uploaded_images','discount', 'product_offer_Isactive']
        
    def validate_discount(self, value):
        if not (0 <= value <= 100):
            raise ValidationError("Product offer must be between 0 and 100.")
        return value
    def validate_variants(self, value):
        if not value:
            raise ValidationError("At least one variant is required.")
        return value

    def to_internal_value(self, data):
        if isinstance(data, dict) and 'variants' in data and isinstance(data['variants'], str):
            try:
                if data['variants'].strip():  # Check if the string is non-empty
                    data['variants'] = json.loads(data['variants'])
                else:
                    data['variants'] = []  # Handle empty string as empty list
            except json.JSONDecodeError:
                raise ValidationError({"variants": "Invalid JSON format for variants."})
        return super().to_internal_value(data)

    def create(self, validated_data):
         
        variants_data = validated_data.pop('variants', [])
        uploaded_images=validated_data.pop('uploaded_images',[])
        
        product = Product.objects.create(**validated_data)
        
        for image in uploaded_images:
            ProductImage.objects.create(product=product,image=image)
             
        variants = ProductVariant.objects.bulk_create([ProductVariant(product=product, **variant) for variant in variants_data])
        for variant in variants:
            variant.save()
        return product
     
    
    def update(self, instance, validated_data):
        variants_data = validated_data.pop('variants', None)
        uploaded_images = validated_data.pop('uploaded_images', [])

        # Update product fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update variants
        if variants_data is not None:
            # Get existing variant IDs
            existing_variant_ids = set(instance.variants.values_list('id', flat=True))
            incoming_variant_ids = set(variant.get('id') for variant in variants_data if variant.get('id'))

            # Delete variants that are no longer present
            variants_to_delete = existing_variant_ids - incoming_variant_ids
            instance.variants.filter(id__in=variants_to_delete).delete()

            # Update or create variants
            for variant_data in variants_data:
                variant_id = variant_data.pop('id', None)
                if variant_id:
                    # Update existing variant
                    variant = instance.variants.get(id=variant_id)
                    for attr, value in variant_data.items():
                        setattr(variant, attr, value)
                    variant.save()  # Triggers save method for calculations
                else:
                    # Create new variant
                    ProductVariant.objects.create(product=instance, **variant_data)

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
    
        prices = [variant.total_price for variant in available_variants]  # Use stored total_price
        return min(prices) if prices else None


from rest_framework.serializers import Serializer, CharField, DecimalField

class TaxSerializer(Serializer):
    id = CharField()
    name = CharField()
    percentage = DecimalField(max_digits=10, decimal_places=2)