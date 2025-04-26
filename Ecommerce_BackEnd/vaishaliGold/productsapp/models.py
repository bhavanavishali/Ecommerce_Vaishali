from django.db import models
from django.utils import timezone
from cloudinary.models import CloudinaryField

class Category(models.Model):
    name = models.CharField(max_length=255,unique=True)
    is_active = models.BooleanField(default=True)  

    def __str__(self):
        return self.name
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['name'], name='unique_category_name')
        ]

class Product(models.Model):
   

    name = models.CharField(max_length=100)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name="products")
    description = models.TextField(blank=True, null=True)
    gender = models.CharField(max_length=50)  
    occasion = models.CharField(max_length=50)
    size = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    bis_hallmark =models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    gold_color = models.CharField(max_length=100, default="yellow")  # New Field
    available = models.BooleanField(default=True) 
    discount= models.DecimalField(max_digits=9, decimal_places=2,default=0.00)

    def __str__(self):
        return self.name

class ProductVariant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="variants")
    available = models.BooleanField(default=True) 
    is_active = models.BooleanField(default=True)
    gross_weight = models.DecimalField(max_digits=9, decimal_places=2)
    gold_price = models.DecimalField(max_digits=10, decimal_places=2)  # New Field
    stone_rate = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # New Field
    making_charge = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # New Field
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0.00) 
    stock = models.IntegerField()
    
    def calculate_total_price(self):
        
        base_price = self.gold_price * self.gross_weight
        
       
        total_price = base_price + self.stone_rate
        
        
        total_price += self.making_charge
        
        
        tax_amount = (total_price * self.tax) / 100
        
        
        final_price = total_price + tax_amount
        
        return round(final_price, 2)

    def __str__(self):
        return f"{self.product.name}  - {self.gross_weight}g "
    

class  ProductImage(models.Model):
    product=models.ForeignKey(Product,on_delete=models.CASCADE,related_name='images')
    image=models.ImageField(upload_to='images/',default="",null=True,blank=True)
    is_primary=models.BooleanField(default=False)
    created_at=models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"image for {self.product.name}"