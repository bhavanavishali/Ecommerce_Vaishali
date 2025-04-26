from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Product
from .serializers import ProductSerializer
from decimal import Decimal
from django.http import JsonResponse
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
import requests
from .models import Product  # Import Product model
from .serializers import ProductSerializer  # Import serializer

import requests
from decimal import Decimal
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Product
from .serializers import ProductSerializer

def get_gold_price_inr(request):
    api_key = "goldapi-ptgwcsm7lq4ll8-io"  # Replace with your actual API Key
    url = "https://www.goldapi.io/api/XAU/INR"
    
    headers = {
        "x-access-token": api_key,
        "Content-Type": "application/json"
    }

    try:
        response = requests.get(url, headers=headers)
        data = response.json()

        if "price" in data:
            gold_price_ounce = Decimal(data["price"])  # Convert to Decimal
            gold_price_gram = (gold_price_ounce / Decimal("31.1035")).quantize(Decimal("0.01"))  # Rounded to 2 decimal places
            
            return JsonResponse({
                "gold_price_per_ounce_inr": str(gold_price_ounce),  # Convert Decimal to string for JSON
                "gold_price_per_gram_inr": str(gold_price_gram)
            })
        else:
            return JsonResponse({"error": "Price not available"}, status=500)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@api_view(['GET'])
def get_products(request, id, gold_price_gram):
    try:
        gold_price_gram = Decimal(gold_price_gram)  # Ensure it's a Decimal
        
        product = get_object_or_404(Product, id=id)  # Get product safely
        serializer = ProductSerializer(product)  # Serialize product

        total_price = (product.gold_weight * gold_price_gram).quantize(Decimal("0.01"))  # Precision-safe multiplication

        return Response({
            "product": serializer.data,
            "gold_price_per_gram": str(gold_price_gram),
            "total_price_inr": str(total_price)  # Convert Decimal to string for JSON response
        })

    except ValueError:
        return Response({"error": "Invalid gold price format"}, status=400)

@api_view(['POST'])
def add_product(request):
    serializer = ProductSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)

