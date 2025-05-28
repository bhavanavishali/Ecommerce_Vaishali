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
                coupon_type='flat',
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
        


#==================== Dashboard ===========================

from rest_framework.permissions import IsAdminUser
from django.db.models import Sum, Count, F
from django.db.models.functions import TruncYear, TruncMonth, TruncWeek, TruncDay, TruncHour
from datetime import datetime, timedelta


class SalesDataView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        time_filter = request.query_params.get('filter', 'year')
        valid_filters = ['year', 'month', 'week', 'today']
        if time_filter not in valid_filters:
            return Response({"error": "Invalid filter. Use 'year', 'month', 'week', or 'today'."}, status=400)

        # Define the time range and truncation function
        now = timezone.now()
        if time_filter == 'year':
            trunc_func = TruncMonth
            start_date = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
            date_field = 'order__created_at'
            format_str = '%b'
        elif time_filter == 'month':
            trunc_func = TruncWeek
            start_date = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            date_field = 'order__created_at'
            format_str = 'Week %W'
        elif time_filter == 'week':
            trunc_func = TruncDay
            start_date = now - timedelta(days=now.weekday())
            start_date = start_date.replace(hour=0, minute=0, second=0, microsecond=0)
            date_field = 'order__created_at'
            format_str = '%a'
        else:  # today
            trunc_func = TruncHour
            start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
            date_field = 'order__created_at'
            format_str = '%I%p'

        # Query sales data
        sales_queryset = OrderItem.objects.filter(
            order__status__in=['pending', 'processing', 'shipped', 'delivered'],
            order__created_at__gte=start_date
        ).annotate(
            period=trunc_func(date_field)
        ).values('period').annotate(
            sales=Sum(F('final_price') * F('quantity'))
        ).order_by('period')

        # Format the data
        sales_data = [
            {
                'month' if time_filter == 'year' else
                'week' if time_filter == 'month' else
                'day' if time_filter == 'week' else
                'hour': item['period'].strftime(format_str),
                'sales': float(item['sales'] or 0)
            }
            for item in sales_queryset
        ]

        serializer = SalesDataSerializer(sales_data, many=True)
        return Response(serializer.data)

class TopProductsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        top_products = OrderItem.objects.filter(
            order__status__in=['pending', 'processing', 'shipped', 'delivered']
        ).values('product_name').annotate(
            sales=Sum('quantity')
        ).order_by('-sales')[:10]

        # Map to the frontend's expected format
        top_products_data = [
            {
                'name': item['product_name'],
                'sales': item['sales']
            }
            for item in top_products
        ]

        serializer = TopProductSerializer(top_products_data, many=True)
        return Response(serializer.data)

class TopCategoriesView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        top_categories = OrderItem.objects.filter(
            order__status__in=['pending', 'processing', 'shipped', 'delivered'],
            variant__product__category__is_active=True
        ).values('variant__product__category__name').annotate(
            sales=Sum('quantity')
        ).order_by('-sales')[:10]

        # Map to the frontend's expected format
        top_categories_data = [
            {
                'name': item['variant__product__category__name'],
                'sales': item['sales']
            }
            for item in top_categories
        ]

        serializer = TopCategorySerializer(top_categories_data, many=True)
        return Response(serializer.data)