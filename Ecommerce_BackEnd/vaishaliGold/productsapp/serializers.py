
from rest_framework import serializers
from .models import Category, Product, ProductVariant, ProductImage
from rest_framework.serializers import ModelSerializer, ValidationError, ListSerializer
from django.shortcuts import get_object_or_404
from cartapp.models import Tax
from decimal import Decimal

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'is_active', 'category_offer', 'category_offer_Isactive','created_at']

    def validate_name(self, value):
        if Category.objects.filter(name__iexact=value).exists():
            if self.instance and self.instance.name.lower() == value.lower():
                return value
            raise ValidationError("A category with this name already exists (case-insensitive).")
        return value

    def validate_category_offer(self, value):
        if not (0 <= value <= 100):
            raise ValidationError("Category offer must be between 0 and 100.")
        return value

class ProductVariantListSerializer(ListSerializer):
   

    def create(self, validated_data):
        product_id = self.context['view'].kwargs.get('product_id')
        product = get_object_or_404(Product, id=product_id)
        variants = []
        for item in validated_data:
            item = item.copy()  
       
            item['gold_price'] = Decimal(str(item['gold_price']))
            item['gross_weight'] = Decimal(str(item['gross_weight']))
            item['stone_rate'] = Decimal(str(item['stone_rate']))
            item['making_charge'] = Decimal(str(item['making_charge']))
            
            variant = ProductVariant.objects.create(product=product, **item)
            variants.append(variant)
        return variants

class ProductVariantSerializer(serializers.ModelSerializer):
    applied_offer = serializers.SerializerMethodField()

    class Meta:
        model = ProductVariant
        list_serializer_class = ProductVariantListSerializer
        fields = [
            'id', 'available', 'is_active', 'gross_weight', 'gold_price',
            'stone_rate', 'making_charge', 'tax', 'stock', 'applied_offer',
            'base_price', 'tax_amount', 'discount_amount', 'total_price'
        ]
        read_only_fields = ['id', 'base_price', 'tax_amount', 'discount_amount', 'total_price','applied_offer_percentage', 'applied_offer_type']

    def get_applied_offer(self, obj):
        discount = obj.product.discount if (obj.product.product_offer_Isactive and obj.product.is_active) else 0
        category_offer = (obj.product.category.category_offer if (obj.product.category and
                        obj.product.category.category_offer_Isactive and obj.product.category.is_active) else 0)
        max_offer = max(discount, category_offer)
        return {
            'offer_percentage': max_offer,
            'offer_type': 'product' if discount >= category_offer else 'category' if category_offer > 0 else 'none'
        }

    def validate_tax(self, value):
        if value is None:
            raise serializers.ValidationError("Tax field is required.")
        if not isinstance(value, Tax):
            try:
                value = Tax.objects.get(id=value)
            except Tax.DoesNotExist:
                raise serializers.ValidationError(f"Tax with id {value} does not exist.")
        return value

    def validate(self, data):
        required_fields = ['gross_weight', 'gold_price', 'stone_rate', 'making_charge', 'tax', 'stock']
        for field in required_fields:
            if field not in data:
                raise serializers.ValidationError(f"{field} is required.")
      
        if float(data['gross_weight']) <= 0:
            raise serializers.ValidationError("Gross weight must be greater than 0.")
        if float(data['gold_price']) <= 0:
            raise serializers.ValidationError("Gold price must be greater than 0.")
        if float(data['stone_rate']) < 0:
            raise serializers.ValidationError("Stone rate cannot be negative.")
        if float(data['making_charge']) < 0:
            raise serializers.ValidationError("Making charge cannot be negative.")
        if int(data['stock']) < 0:
            raise serializers.ValidationError("Stock cannot be negative.")
        return data



    
class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'product', 'image', 'is_primary']

class ProductSerializer(serializers.ModelSerializer):
    image = ProductImageSerializer(many=True, read_only=True, source='images')
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=True),
        write_only=True, required=False
    )
    variants = ProductVariantSerializer(many=True, read_only=True)
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    category_name = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'category', 'category_name', 'description',
                  'occasion', 'gender', 'is_active', 'bis_hallmark', 'size',
                  'created_at', 'updated_at', 'variants', 'available',
                  'gold_color', 'price', 'image', 'uploaded_images', 'discount', 'product_offer_Isactive']

    def validate_name(self, value):
        if Product.objects.filter(name__iexact=value).exists():
            if self.instance and self.instance.name.lower() == value.lower():
                return value
            raise ValidationError("A product with this name already exists (case-insensitive).")
        return value

    def validate_discount(self, value):
        if not (0 <= value <= 100):
            raise ValidationError("Product offer must be between 0 and 100.")
        return value

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        product = Product.objects.create(**validated_data)
        for image in uploaded_images:
            ProductImage.objects.create(product=product, image=image)
        return product

    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
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
        prices = [variant.total_price for variant in available_variants]
        return min(prices) if prices else None

class TaxSerializer(serializers.Serializer):
    id = serializers.CharField()
    name = serializers.CharField()
    percentage = serializers.DecimalField(max_digits=10, decimal_places=2)