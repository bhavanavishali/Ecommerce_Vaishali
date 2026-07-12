from django.db import models
from django.utils import timezone
from decimal import Decimal, InvalidOperation
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError
import logging

logger = logging.getLogger(__name__)


class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)
    is_active = models.BooleanField(default=True)
    category_offer = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    category_offer_Isactive = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['name'], name='unique_category_name')
        ]


class Product(models.Model):
    CLOTHING = 'clothing'
    IMITATION_JEWELRY = 'imitation_jewelry'

    PRODUCT_TYPE_CHOICES = [
        (CLOTHING, 'Clothing'),
        (IMITATION_JEWELRY, 'Imitation Jewelry'),
    ]

    name = models.CharField(max_length=100)
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, blank=False, related_name="products"
    )
    product_type = models.CharField(
        max_length=30, choices=PRODUCT_TYPE_CHOICES, default=IMITATION_JEWELRY
    )
    description = models.TextField(blank=True, null=True)

    # Optional metadata (not variant options)
    gender = models.CharField(max_length=50, blank=True, default='')
    occasion = models.CharField(max_length=50, blank=True, default='')
    size = models.CharField(max_length=100, blank=True, default='')
    color = models.CharField(max_length=100, blank=True, default='')      # finish/color
    fabric = models.CharField(max_length=100, blank=True, default='')     # clothing
    material = models.CharField(max_length=100, blank=True, default='')   # imitation jewelry

    # Pricing source of truth
    fixed_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    stock = models.IntegerField(validators=[MinValueValidator(0)], default=0)
    tax = models.ForeignKey(
        'cartapp.Tax',
        on_delete=models.PROTECT,
        related_name='products',
        default=1
    )

    is_active = models.BooleanField(default=True)
    available = models.BooleanField(default=True)
    discount = models.DecimalField(max_digits=9, decimal_places=2, default=0.00)
    product_offer_Isactive = models.BooleanField(default=True)

    # Legacy field - optional now
    bis_hallmark = models.CharField(max_length=255, blank=True, null=True)
    gold_color = models.CharField(max_length=100, blank=True, default='')

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    def get_default_variant(self):
        return self.variants.filter(is_default=True).first()

    def sync_default_variant(self):
        """Create/update one hidden variant used by cart/orders."""
        variant, _ = ProductVariant.objects.get_or_create(
            product=self,
            is_default=True,
            defaults={
                'fixed_price': self.fixed_price,
                'stock': self.stock,
                'tax': self.tax,
                'available': self.available,
                'is_active': self.is_active,
            }
        )

        variant.fixed_price = self.fixed_price
        variant.stock = self.stock
        variant.tax = self.tax
        variant.available = self.available
        variant.is_active = self.is_active

        # Legacy gold fields kept at 0
        variant.gross_weight = Decimal('0.00')
        variant.gold_price = Decimal('0.00')
        variant.stone_rate = Decimal('0.00')
        variant.making_charge = Decimal('0.00')

        variant.save()

    def save(self, *args, **kwargs):
        if self.fixed_price is None or self.fixed_price <= 0:
            raise ValidationError("fixed_price must be greater than 0.")

        if self.stock is None or self.stock < 0:
            raise ValidationError("stock cannot be negative.")

        super().save(*args, **kwargs)
        self.sync_default_variant()


class ProductVariant(models.Model):
    product = models.ForeignKey(
        'Product', on_delete=models.CASCADE, related_name="variants"
    )
    is_default = models.BooleanField(default=False)

    tax = models.ForeignKey(
        'cartapp.Tax', on_delete=models.PROTECT, related_name='product_variant_tax', default=1
    )
    available = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    stock = models.IntegerField(validators=[MinValueValidator(0)], default=0)

    # New fixed pricing field
    fixed_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    # Legacy gold fields (kept for old data, not used in pricing)
    gross_weight = models.DecimalField(max_digits=9, decimal_places=2, default=0.00)
    gold_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    stone_rate = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    making_charge = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    base_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    applied_offer_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    applied_offer_type = models.CharField(max_length=50, default='none')

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['product'],
                condition=models.Q(is_default=True),
                name='unique_default_variant_per_product'
            )
        ]

    def get_total_price_before_discount(self):
        return Decimal(self.fixed_price)

    def calculate_base_price(self):
        self.base_price = self.get_total_price_before_discount()
        return self.base_price

    def calculate_discount_amount(self):
        try:
            total_price = self.get_total_price_before_discount()

            discount = Decimal(0)
            category_offer = Decimal(0)

            if self.product.product_offer_Isactive and self.product.is_active:
                discount = Decimal(self.product.discount)

            if (
                self.product.category
                and self.product.category.category_offer_Isactive
                and self.product.category.is_active
            ):
                category_offer = Decimal(self.product.category.category_offer)

            max_offer = max(discount, category_offer)
            discount_amount = (total_price * max_offer / 100) if max_offer > 0 else Decimal(0)

            self.discount_amount = discount_amount
            self.applied_offer_percentage = max_offer
            self.applied_offer_type = (
                'product' if discount >= category_offer
                else 'category' if category_offer > 0
                else 'none'
            )
            return self.discount_amount, self.applied_offer_percentage, self.applied_offer_type

        except (InvalidOperation, TypeError, AttributeError) as e:
            raise ValidationError(f"Error calculating discount amount: {e}")

    def calculate_tax_per_product(self):
        taxable_amount = self.get_total_price_before_discount() - self.discount_amount
        tax_amount = (
            taxable_amount * Decimal(self.tax.percentage) / 100
            if hasattr(self.tax, 'percentage')
            else Decimal(0)
        )
        self.tax_amount = tax_amount
        return tax_amount

    def calculate_total_price(self):
        total_price = self.base_price - self.discount_amount + self.tax_amount
        self.total_price = total_price.quantize(Decimal('0.01'))
        return self.total_price

    def save(self, *args, **kwargs):
        if self.fixed_price is None or self.fixed_price <= 0:
            raise ValueError("fixed_price must be greater than 0.")

        self.calculate_base_price()
        self.calculate_discount_amount()
        self.calculate_tax_per_product()
        self.calculate_total_price()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.product.name} - ₹{self.total_price}"


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='images/', default="", null=True, blank=True)
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"image for {self.product.name}"
    