from django.urls import path
from .views import *

urlpatterns = [
    
    # Admin Side

    path('categories/', CategoryListCreateView.as_view(), name='category-list-create'),
    path('categories/<int:pk>/', CategoryDetailView.as_view(), name='category-detail'),

    # Product endpoints
    path('products/', ProductListCreateView.as_view(), name='product-list-create'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    
    # Variant endpoints
    path('products/<int:product_id>/variants/', ProductVariantListCreateView.as_view(), name='product-variant-list-create'),
    path('variants/<int:pk>/', ProductVariantDetailView.as_view(), name='product-variant-detail'),

    #user listing
    path('user/categories/', UserCategoryList.as_view(), name='user-category-list'),
    path('user/products/', UserProductList.as_view(), name='user-product-list'),
    path('productfilter/',ProductFilter.as_view(),name='product-filter'),

    # Images

    # for a specific product
    path('products/<int:id>/images/', ProductImageUploadView.as_view(),name='product-image-upload'),
    
    
    path('products/<int:id>/images/list/', 
         ProductImageListView.as_view(),name='product-image-list'),
    
    #  delete a specific image
    path('product-images/<int:id>/', ProductImageDetailView.as_view(),name='product-image-detail'),

    path('taxes/', TaxListView.as_view(), name='tax-list'),
]


