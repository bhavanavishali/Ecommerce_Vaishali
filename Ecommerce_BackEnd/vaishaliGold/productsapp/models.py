
from django.db import models
from django.utils import timezone
from cloudinary.models import CloudinaryField

from django.core.validators import MinValueValidator



class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)
    is_active = models.BooleanField(default=True)
    category_offer = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    category_offer_Isactive = models.BooleanField(default=True)

    def __str__(self):
        return self.name
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['name'], name='unique_category_name')
        ]

class Product(models.Model):
    name = models.CharField(max_length=100)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=False, related_name="products")
    description = models.TextField(blank=True, null=True)
    gender = models.CharField(max_length=50)  
    occasion = models.CharField(max_length=50)
    size = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    bis_hallmark = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    gold_color = models.CharField(max_length=100, default="yellow")
    available = models.BooleanField(default=True) 
    discount = models.DecimalField(max_digits=9, decimal_places=2, default=0.00)
    product_offer_Isactive = models.BooleanField(default=True)

    def __str__(self):
        return self.name
    
    
from decimal import Decimal
class ProductVariant(models.Model):
    product = models.ForeignKey('Product', on_delete=models.CASCADE, related_name="variants")
    tax = models.ForeignKey('cartapp.Tax', on_delete=models.CASCADE, related_name='product_variant_tax', default=1)
    available = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    stock = models.IntegerField(validators=[MinValueValidator(0)])

    gross_weight = models.DecimalField(max_digits=9, decimal_places=2)
    gold_price = models.DecimalField(max_digits=10, decimal_places=2)
    stone_rate = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    making_charge = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    base_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    applied_offer_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    applied_offer_type = models.CharField(max_length=50, default='none')

    def get_total_price_before_discount(self):
        return (Decimal(self.gold_price) * Decimal(self.gross_weight)) + Decimal(self.stone_rate) + Decimal(self.making_charge)
    

    def calculate_base_price(self):
        self.base_price = self.get_total_price_before_discount()
        return self.base_price

    def calculate_discount_amount(self):
        total_price = self.get_total_price_before_discount()
        discount = self.product.discount if (self.product.product_offer_Isactive and self.product.is_active) else 0
        category_offer = (self.product.category.category_offer if (self.product.category and
                          self.product.category.category_offer_Isactive and self.product.category.is_active) else 0)

        max_offer = max(discount, category_offer)
        discount_amount = (total_price * Decimal(max_offer) / 100) if max_offer > 0 else Decimal(0)

        self.discount_amount = discount_amount
        self.applied_offer_percentage = max_offer
        self.applied_offer_type = 'product' if discount >= category_offer else 'category' if category_offer > 0 else 'none'
        return discount_amount

    def calculate_tax_per_product(self):
        total_price = self.get_total_price_before_discount() - self.discount_amount
        tax_amount = (total_price * Decimal(self.tax.percentage) / 100) if hasattr(self.tax, 'percentage') else Decimal(0)
        self.tax_amount = tax_amount
        return tax_amount

    def calculate_total_price(self):
        total_price = self.base_price - self.discount_amount + self.tax_amount
        self.total_price = total_price.quantize(Decimal('0.01'))  # Round to 2 decimal places
        return self.total_price

    def save(self, *args, **kwargs):
        self.calculate_base_price()
        self.calculate_discount_amount()
        self.calculate_tax_per_product()  # Tax after discount
        self.calculate_total_price()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.product.name} - {self.gross_weight}g - ₹{self.total_price}"
    
class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='images/', default="", null=True, blank=True)
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"image for {self.product.name}"