from decimal import Decimal
from django.shortcuts import get_object_or_404
from rest_framework import serializers
from rest_framework.serializers import ValidationError

from cartapp.models import Tax
from .models import Category, Product, ProductVariant, ProductImage


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'is_active', 'category_offer', 'category_offer_Isactive', 'created_at']

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


class ProductVariantSerializer(serializers.ModelSerializer):
    applied_offer = serializers.SerializerMethodField()

    class Meta:
        model = ProductVariant
        fields = [
            'id', 'is_default', 'available', 'is_active',
            'fixed_price', 'tax', 'stock', 'applied_offer',
            'base_price', 'tax_amount', 'discount_amount', 'total_price'
        ]
        read_only_fields = [
            'id', 'is_default', 'base_price', 'tax_amount',
            'discount_amount', 'total_price'
        ]

    def get_applied_offer(self, obj):
        discount = obj.product.discount if (obj.product.product_offer_Isactive and obj.product.is_active) else 0
        category_offer = (
            obj.product.category.category_offer
            if (
                obj.product.category
                and obj.product.category.category_offer_Isactive
                and obj.product.category.is_active
            )
            else 0
        )
        max_offer = max(discount, category_offer)
        return {
            'offer_percentage': max_offer,
            'offer_type': (
                'product' if discount >= category_offer
                else 'category' if category_offer > 0
                else 'none'
            )
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


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'product', 'image', 'is_primary']


class ProductSerializer(serializers.ModelSerializer):
    image = ProductImageSerializer(many=True, read_only=True, source='images')
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=True),
        write_only=True,
        required=False
    )
    variants = ProductVariantSerializer(many=True, read_only=True)
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    category_name = serializers.SerializerMethodField()
    category_Isactive = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()
    default_variant_id = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'category', 'category_name', 'category_Isactive',
            'product_type', 'description',
            'gender', 'occasion', 'size', 'color', 'fabric', 'material',
            'fixed_price', 'stock', 'tax',
            'is_active', 'available', 'discount', 'product_offer_Isactive',
            'bis_hallmark', 'gold_color',
            'created_at', 'updated_at',
            'variants', 'default_variant_id', 'price',
            'image', 'uploaded_images'
        ]

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

    def validate_fixed_price(self, value):
        if value <= 0:
            raise ValidationError("Fixed price must be greater than 0.")
        return value

    def validate_stock(self, value):
        if value < 0:
            raise ValidationError("Stock cannot be negative.")
        return value

    def validate_tax(self, value):
        if value is None:
            raise ValidationError("Tax is required.")
        return value

    def validate(self, data):
        product_type = data.get('product_type') or getattr(self.instance, 'product_type', None)

        if product_type == Product.CLOTHING:
            # No extra required fields for now
            pass
        elif product_type == Product.IMITATION_JEWELRY:
            # BIS not required
            pass

        return data

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        product = Product.objects.create(**validated_data)

        for image in uploaded_images:
            ProductImage.objects.create(product=product, image=image)

        return product

    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if uploaded_images is not None:
            instance.images.all().delete()
            ProductImage.objects.bulk_create([
                ProductImage(product=instance, image=image) for image in uploaded_images
            ])

        return instance

    def get_category_name(self, obj):
        return obj.category.name if obj.category else None

    def get_category_Isactive(self, obj):
        return obj.category.is_active if obj.category else None

    def get_default_variant(self, obj):
        return obj.variants.filter(is_default=True).first()

    def get_default_variant_id(self, obj):
        variant = self.get_default_variant(obj)
        return variant.id if variant else None

    def get_price(self, obj):
        variant = self.get_default_variant(obj)
        return variant.total_price if variant else None


class TaxSerializer(serializers.Serializer):
    id = serializers.CharField()
    name = serializers.CharField()
    percentage = serializers.DecimalField(max_digits=10, decimal_places=2)