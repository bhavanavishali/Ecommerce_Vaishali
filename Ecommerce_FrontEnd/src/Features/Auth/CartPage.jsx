


"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/Context/CartContext"
import { useNavigate } from "react-router-dom"
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Package,
  CreditCard,
  Tag,
  Truck,
  Receipt,
  ShoppingBag,
  Weight,
} from "lucide-react"
import Swal from "sweetalert2"

export default function ShoppingCartComponent() {
  const { cart, fetchCart, updateQuantity, removeFromCart, loading, error } = useCart()
  const navigate = useNavigate()
  console.log("Cart Data:", cart)

  const BASE_URL = import.meta.env.VITE_BASE_URL
  const MAX_QUANTITY_PER_PRODUCT = 10 

  useEffect(() => {
    if (!cart) {
      fetchCart()
    }
  }, [cart, fetchCart])

  // Check if any item is unavailable
  const isAnyItemUnavailable = cart?.items?.some(
    (item) => !item.product.is_active || !item.variant.available || !item.variant.is_active || !item.product.category_IsActive || item.variant.stock <= 0
  )

  // Loading state with skeleton
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="w-full lg:w-32 h-32 bg-gray-200 rounded-lg"></div>
                      <div className="flex-grow space-y-3">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-32"></div>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex justify-between">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <ShoppingCart className="w-8 h-8 text-red-500" />
          </div>
          <div className="text-red-500 text-xl font-medium mb-4">Oops! Something went wrong</div>
          <p className="text-gray-500 mb-6">{error}</p>
          <Button onClick={() => fetchCart()} variant="outline" className="rounded-lg">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  // Empty cart state
  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-16">
          <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
            <ShoppingCart className="w-16 h-16 text-gray-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
            Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
          </p>
          <Button
            className="bg-[#8c2a2a] hover:bg-[#7a2424] text-white px-8 py-4 rounded-xl font-medium text-lg transition-all duration-200 transform hover:scale-105"
            onClick={() => navigate("/user/home")}
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            Shop Now
          </Button>
        </div>
      </div>
    )
  }

  const totalItems = cart.items.length || 0

  const handleIncreaseQuantity = (itemId, currentQuantity, stock, productName) => {
    console.log(`Attempting to increase quantity for item ${itemId}: current=${currentQuantity}, stock=${stock}, max=${MAX_QUANTITY_PER_PRODUCT}`);
    
    if (currentQuantity >= MAX_QUANTITY_PER_PRODUCT) {
      console.log("Max quantity reached");
      Swal.fire({
        icon: "warning",
        title: "Maximum Quantity Reached!",
        text: `You can only add up to ${MAX_QUANTITY_PER_PRODUCT} units of ${productName} to your cart.`,
        confirmButtonText: "OK",
        confirmButtonColor: "#8c2a2a",
        customClass: {
          popup: "rounded-xl",
          confirmButton: "rounded-lg",
        },
      })
      return;
    }
    
    if (currentQuantity >= stock) {
      console.log("Out of stock");
      Swal.fire({
        icon: "warning",
        title: "Out of Stock!",
        text: `Sorry, ${productName} is out of stock. You cannot add more.`,
        confirmButtonText: "OK",
        confirmButtonColor: "#8c2a2a",
        customClass: {
          popup: "rounded-xl",
          confirmButton: "rounded-lg",
        },
      })
      return;
    }
    
    console.log("Increasing quantity");
    updateQuantity(itemId, currentQuantity + 1)
  }

  const handleRemoveItem = (itemId, productName) => {
    Swal.fire({
      title: "Remove Item",
      text: `Are you sure you want to remove ${productName} from your cart?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#8c2a2a",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "rounded-xl",
        confirmButton: "rounded-lg",
        cancelButton: "rounded-lg",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        removeFromCart(itemId)
        Swal.fire({
          title: "Removed!",
          text: `${productName} has been removed from your cart.`,
          icon: "success",
          confirmButtonColor: "#8c2a2a",
          timer: 1500,
          showConfirmButton: false,
          customClass: {
            popup: "rounded-xl",
          },
        })
      }
    })
  }

  console.log("222222222222222222222222", cart)
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <ShoppingCart className="w-8 h-8 text-[#8c2a2a]" />
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-[#8c2a2a]/10 text-[#8c2a2a] px-3 py-1 text-sm">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </Badge>
            <span className="text-xl font-semibold text-gray-900">₹{cart.final_total.toLocaleString("en-IN")}</span>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/user/home")}
            className="hidden sm:flex items-center gap-2 hover:bg-gray-50 rounded-lg border-[#8c2a2a]/20 text-[#8c2a2a] hover:text-[#7a2424]"
          >
            <Package className="w-4 h-4" />
            Continue Shopping
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cart.items.map((item) => {
            const isItemUnavailable = !item.product.is_active || !item.variant.available || !item.product.category_IsActive || !item.variant.is_active || item.variant.stock <= 0
            return (
              <Card
                key={item.id}
                className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white rounded-2xl"
              >
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">
                    {/* Product Image */}
                    <div className="w-full lg:w-48 h-48 lg:h-auto bg-gray-50 flex items-center justify-center p-4">
                      <img
                        src={
                          item.primary_image
                            ? `${BASE_URL}${item.primary_image}`
                            : "/placeholder.svg?height=200&width=200"
                        }
                        alt={item.product.name}
                        className="w-full h-full object-contain rounded-lg hover:scale-105 transition-transform duration-300"
                        onError={(e) => (e.target.src = "/placeholder.svg?height=200&width=200")}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-grow p-6">
                      <div className="flex flex-col h-full">
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-3">
                            <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">{item.product.name}</h3>
                            {isItemUnavailable && (
                              <Badge variant="destructive" className="bg-red-600 text-white px-2 py-1 text-xs">
                                Unavailable
                              </Badge>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Weight className="w-4 h-4" />
                              <span>Weight: {item.variant.gross_weight}g</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Tag className="w-4 h-4" />
                              <span>Gold: {item.product.gold_color}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 sm:col-span-2">
                              <Package className="w-4 h-4" />
                              <span>Category: {item.product.category || "N/A"}</span>
                            </div>
                          </div>

                          {/* Quantity Control */}
                          <div className="mb-4">
                            <span className="text-sm text-gray-600 mb-2 block">Quantity:</span>
                            <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden bg-white w-fit">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-10 w-10 rounded-none hover:bg-gray-100 disabled:opacity-50"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={loading || item.quantity <= 1 || isItemUnavailable}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <div className="h-10 w-16 flex items-center justify-center border-x border-gray-200 font-medium bg-gray-50">
                                {item.quantity}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-10 w-10 rounded-none hover:bg-gray-100 disabled:opacity-50"
                                onClick={() => handleIncreaseQuantity(item.id, item.quantity, item.variant.stock, item.product.name)}
                                disabled={loading || item.quantity >= Math.min(item.variant.stock, MAX_QUANTITY_PER_PRODUCT) || isItemUnavailable}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {item.variant.stock} items available (Max {MAX_QUANTITY_PER_PRODUCT} per product)
                            </p>
                          </div>

                          {/* Price Breakdown */}
                          <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal:</span>
                                <span className="font-medium">₹{item.variant.base_price.toLocaleString("en-IN")}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Discount:</span>
                                <span className="font-medium text-green-600">
                                  -₹{item.variant.discount_amount.toLocaleString("en-IN")}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Tax:</span>
                                <span className="font-medium">₹{item.variant.tax_amount.toLocaleString("en-IN")}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Price and Remove Button */}
                        <div className="flex justify-between items-center">
                          <div className="text-2xl font-bold text-green-600">
                            ₹{item.variant.total_price.toLocaleString("en-IN")}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-red-600 text-white border border-red-600 hover:bg-red-700 hover:text-white rounded-lg transition-all duration-200"
                            onClick={() => handleRemoveItem(item.id, item.product.name)}
                            disabled={loading}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                Order Summary
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">₹{cart.final_subtotal.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    Discount:
                  </span>
                  <span className="font-medium text-green-600">-₹{cart.final_discount.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    Shipping:
                  </span>
                  <span className="font-medium">₹{cart.shipping.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium">₹{cart.final_tax.toLocaleString("en-IN")}</span>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-[#8c2a2a]">₹{cart.final_total.toLocaleString("en-IN")}</span>
                </div>

                <p className="text-xs text-gray-500 text-center">(Inclusive of all taxes)</p>

                <Button
                  className="w-full mt-6 bg-[#8c2a2a] hover:bg-[#7a2424] text-white font-medium py-3 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
                  onClick={() => navigate("/checkoutpage")}
                  disabled={loading || cart.items.length === 0 || isAnyItemUnavailable}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  {isAnyItemUnavailable ? "Can't place order" : "Place Order"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Badge */}
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-green-50 to-blue-50">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Secure Checkout</h4>
              <p className="text-sm text-gray-600">Your payment information is protected</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile Continue Shopping Button */}
      <div className="mt-8 sm:hidden">
        <Button
          onClick={() => navigate("/user/home")}
          className="w-full bg-[#8c2a2a] hover:bg-[#7a2424] text-white font-medium py-3 rounded-xl"
        >
          <Package className="w-4 h-4 mr-2" />
          Continue Shopping
        </Button>
      </div>
    </div>
  )
}