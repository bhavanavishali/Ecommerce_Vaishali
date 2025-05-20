from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Category ,Product,ProductVariant,ProductImage
from .serializers import CategorySerializer,ProductImageSerializer,ProductVariantSerializer,ProductSerializer,TaxSerializer
import json
from rest_framework.permissions import AllowAny, IsAuthenticated
from cartapp.models import *

#Admin side

class CategoryListCreateView(APIView):
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CategoryDetailView(APIView):
    def get_object(self, pk):
        return get_object_or_404(Category, pk=pk)

    def get(self, request, pk):
        category = self.get_object(pk)
        serializer = CategorySerializer(category)
        return Response(serializer.data)

    def patch(self, request, pk):
        category = self.get_object(pk)
        serializer = CategorySerializer(category, data=request.data , partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        category = self.get_object(pk)
        category.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProductFilter(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        products = Product.objects.filter(is_active=True, category__is_active=True)
        
        print(f"All query params: {request.query_params}")
        
        
        gender = request.query_params.get('gender')
        if gender:
            print(f"Attempting to filter by gender: {gender}")
            all_genders = list(Product.objects.values_list('gender', flat=True).distinct())
            print(f"Available gender values in database: {all_genders}")
            products = products.filter(gender__iexact=gender)
            print(f"After gender filter, count: {products.count()}")

        
        occasion = request.query_params.get('occasion')
        if occasion:
            print(f"Attempting to filter by occasion: {occasion}")
            products = products.filter(occasion__iexact=occasion)
            print(f"After occasion filter, count: {products.count()}")

        
        category_name = request.query_params.get('category_name')
        if category_name:
            print(f"Attempting to filter by category_name: {category_name}")

            matching_categories = Category.objects.filter(name__iexact=category_name)
            print(f"Matching categories: {list(matching_categories.values('id', 'name'))}")

            if matching_categories.exists():
                products = products.filter(category__in=matching_categories)
            else:
                
                matching_categories = Category.objects.filter(name__icontains=category_name)
                print(f"Partial matching categories: {list(matching_categories.values('id', 'name'))}")
                if matching_categories.exists():
                    products = products.filter(category__in=matching_categories)
                else:
                   
                    products = products.none()

            print(f"After category_name filter, count: {products.count()}")    

        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)



class UserCategoryList(APIView):
    
    def get(self, request):
        categories = Category.objects.filter(is_active=True)
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

    
class UserProductList(APIView):
    
    def get(self, request):
        product = Product.objects.filter(is_active=True)
        serializer = ProductSerializer(product, many=True)
        return Response(serializer.data)


    
class ProductListCreateView(APIView):
    def get(self, request):
       
        product = Product.objects.all().order_by('-created_at')
        print("it is my product",product)
        serializer = ProductSerializer(product, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data.copy()
        
        uploaded_images = request.FILES.getlist('uploaded_images')
        if uploaded_images:
            data.setlist('uploaded_images', uploaded_images)
        
        serializer = ProductSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        return get_object_or_404(Product, pk=pk)

    def get(self, request, pk):
        product = self.get_object(pk)
        serializer = ProductSerializer(product)
        return Response(serializer.data)

    def patch(self, request, pk):
        product = self.get_object(pk)
        if product is None:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

        data = request.data.copy()
        
        uploaded_images = request.FILES.getlist('uploaded_images')
        if uploaded_images:
            data.setlist('uploaded_images', uploaded_images)
        
        serializer = ProductSerializer(product, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        product = self.get_object(pk)
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class ProductVariantListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, product_id):
        product = get_object_or_404(Product, id=product_id)
        variants = ProductVariant.objects.filter(product=product)
        serializer = ProductVariantSerializer(variants, many=True)
        return Response(serializer.data)

    def post(self, request, product_id):
        product = get_object_or_404(Product, id=product_id)
        print("Request data type:", type(request.data))  
        print("Request data content:", request.data)  
        data = request.data

     
        if isinstance(data, str):
            try:
                data = json.loads(data)
            except json.JSONDecodeError:
                return Response(
                    {"error": "Invalid JSON data provided"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Ensure data is a list
        if not isinstance(data, list):
            return Response(
                {"error": "Data must be a list of variant objects"},
                status=status.HTTP_400_BAD_REQUEST
            )

        
        for item in data:
            if not isinstance(item, dict):
                return Response(
                    {"error": f"Invalid data format: {item} is not a dictionary"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        serializer = ProductVariantSerializer(data=data, many=True, context={'view': self})
        if serializer.is_valid():
            print("Validated data:", serializer.validated_data)  
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print("Serializer errors:", serializer.errors)  # Debug
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProductVariantDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        return get_object_or_404(ProductVariant, pk=pk)

    def get(self, request, pk):
        variant = self.get_object(pk)
        serializer = ProductVariantSerializer(variant)
        return Response(serializer.data)

    def patch(self, request, pk):
        print('dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd ')
        variant = self.get_object(pk)
        serializer = ProductVariantSerializer(variant, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        variant = self.get_object(pk)
        variant.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# ========================Image based =======================================================

class ProductImageUploadView(APIView):
    def post(self,request,id):
        product=get_object_or_404(Product,id=id)

        if 'images' not in request.FILES:
            return Response({'eror':"image not uploaded"},status=status.HTTP_400_BAD_REQUEST)
        
        uploaded_images=request.FILES.getlist('images')

        if not uploaded_images:
            return Response(
                {"error": "No images uploaded"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        product_images = []
        for image in uploaded_images:
            product_image = ProductImage.objects.create(
                product=product, 
                image=image
            )
            product_images.append(product_image)

       
        serializer = ProductImageSerializer(product_images, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
class ProductImageListView(APIView):
   
    def get(self, request, id):
        
        product = get_object_or_404(Product, id=id)
        images = ProductImage.objects.filter(product=product)
        serializer = ProductImageSerializer(images, many=True)
        return Response(serializer.data)

class ProductImageDetailView(APIView):
    
    def get(self, request, id):
        
        image = get_object_or_404(ProductImage, id=id)
     
        serializer = ProductImageSerializer(image)
        return Response(serializer.data)

    def delete(self, request, id):
       
        image = get_object_or_404(ProductImage, id=id)
        
        image.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

class TaxListView(APIView):
    def get(self, request):
        taxes = Tax.objects.all()
        serializer = TaxSerializer(taxes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)