from django.shortcuts import render

# Create your views here.

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from .serializers import *
from django.shortcuts import get_object_or_404
from .models import *
from cartapp.serializers import *

class CouponListCreateView(APIView):
    def get(self, request):
        coupons = Coupon.objects.all()
        serializer = CouponSerializer(coupons, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CouponSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CouponDetailView(APIView):
    def get(self, request, pk):
        coupon = get_object_or_404(Coupon, pk=pk)
        serializer = CouponSerializer(coupon)
        return Response(serializer.data)

    def patch(self, request, pk):
        coupon = get_object_or_404(Coupon, pk=pk)
        serializer = CouponSerializer(coupon, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        coupon = get_object_or_404(Coupon, pk=pk)
        coupon.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class CouponView(APIView):
       permission_classes = [IsAuthenticated]

       def get(self, request):
           
           try:
               coupons = Coupon.objects.filter(user=request.user, is_active=True)
               serializer = CouponSerializer(coupons, many=True)
               logger.info(f"Fetched {coupons.count()} coupons for user {request.user.email}")
               return Response(serializer.data, status=status.HTTP_200_OK)
           except Exception as e:
               logger.error(f"Error fetching coupons for {request.user.email}: {str(e)}")
               return Response({"error": "Failed to fetch coupons"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
           



# Available couponse 


class ActiveCoupon(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            coupons = Coupon.objects.filter(user=request.user, is_active=True)
            serializer = CouponSerializer(coupons, many=True)
            logger.info(f"Fetched {coupons.count()} coupons for user {request.user.email}")
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error fetching coupons for {request.user.email}: {str(e)}")
            return Response({"error": "Failed to fetch coupons"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AvailableCouponsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
           
            now = timezone.now().date()
            coupons = Coupon.objects.filter(
                
                is_active=True,
                valid_from__lte=now,
                valid_to__gte=now
            ).exclude(used_count__gte=models.F('max_uses')).filter(max_uses__gt=0)
            
            
            valid_coupons = [coupon for coupon in coupons if coupon.is_valid(request.user)]
            
            serializer = CouponSerializer(valid_coupons, many=True)
            logger.info(f"Fetched {len(valid_coupons)} available coupons for user {request.user.email}")
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error fetching available coupons for {request.user.email}: {str(e)}")
            return Response({"error": "Failed to fetch available coupons"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)