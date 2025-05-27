from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import *

@receiver(post_save, sender=Product)
@receiver(post_save, sender=Category)
def update_variant_discounts(sender, instance, **kwargs):
    if sender == Product:
        variants = instance.variants.all()
    elif sender == Category:
        variants = ProductVariant.objects.filter(product__category=instance)
    
    for variant in variants:
        variant.calculate_discount_amount()
        variant.calculate_tax_per_product()
        variant.calculate_total_price()
        variant.save()