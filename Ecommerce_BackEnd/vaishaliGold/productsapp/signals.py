from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Product, Category, ProductVariant


@receiver(post_save, sender=Product)
@receiver(post_save, sender=Category)
def update_variant_discounts(sender, instance, **kwargs):
    if sender == Product:
        variants = instance.variants.filter(is_default=True)
    else:
        variants = ProductVariant.objects.filter(
            is_default=True,
            product__category=instance
        )

    for variant in variants:
        variant.fixed_price = variant.product.fixed_price
        variant.stock = variant.product.stock
        variant.tax = variant.product.tax
        variant.calculate_base_price()
        variant.calculate_discount_amount()
        variant.calculate_tax_per_product()
        variant.calculate_total_price()
        variant.save(update_fields=[
            'fixed_price', 'stock', 'tax',
            'base_price', 'discount_amount', 'tax_amount', 'total_price',
            'applied_offer_percentage', 'applied_offer_type'
        ])