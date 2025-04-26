from django.urls import path
from .views import get_products, add_product,get_gold_price_inr

urlpatterns = [

    path("get_products/<int:id>/<str:gold_price_gram>/", get_products, name="get-products"),

    path('products/add/', add_product, name='add_product'),
    path("gold-price-inr/", get_gold_price_inr, name="gold-price-inr"),
]
