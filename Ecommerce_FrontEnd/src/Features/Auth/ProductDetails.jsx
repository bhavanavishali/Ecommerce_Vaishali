
"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ShoppingCart,
  Heart,
  Check,
  AlertCircle,
  ZoomIn,
  ChevronRight,
  Truck,
  RefreshCcw,
  Shield,
  Share2,
  Minus,
  Plus,
} from "lucide-react"
import api from "../../api"
import { useCart } from "@/Context/CartContext"
import { useWishlist } from "@/Context/WishlistContext"

const BASE_URL = import.meta.env.VITE_BASE_URL

// const formatPrice = (price) =>
//   new Intl.NumberFormat("en-IN", {
//     style: "currency",
//     currency: "INR",
//     maximumFractionDigits: 0,
//   }).format(price || 0)
const formatPrice = (price) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price || 0);
const getImageUrl = (image) => {
  if (!image) return ""
  if (typeof image === "string") return image.startsWith("http") ? image : `${BASE_URL}${image}`
  const value = image.path || image.url || image.image || ""
  return value.startsWith("http") ? value : `${BASE_URL}${value}`
}

const showToast = (message, type = "success") => {
  const toast = document.createElement("div")
  toast.className =
    `fixed bottom-4 right-4 p-4 rounded-md shadow-lg z-50 text-sm ${
      type === "error"
        ? "bg-red-50 border-l-4 border-red-500 text-red-700"
        : "bg-green-50 border-l-4 border-green-500 text-green-700"
    }`
  toast.textContent = message
  document.body.appendChild(toast)
  setTimeout(() => {
    toast.remove()
  }, 2500)
}

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { addToWishlist } = useWishlist()
  const user = useSelector((state) => state.auth.user)
  const isAuthenticated = user && (user.username || user.email)

  const [product, setProduct] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const imageContainerRef = useRef(null)

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await api.get(`productapp/products/${id}/`)
        const transformedProduct = {
          ...response.data,
          image: Array.isArray(response.data.image) ? response.data.image.map(getImageUrl) : [],
        }
        const defaultVariant =
          transformedProduct.variants?.find((variant) => variant.is_default) ||
          transformedProduct.variants?.[0] ||
          null

        setProduct(transformedProduct)
        setSelectedVariant(defaultVariant)
      } catch (error) {
        console.error("Error fetching product details:", error)
      }
    }

    fetchProductDetails()
  }, [id])

  const handleMouseMove = (event) => {
    if (!imageContainerRef.current || !isZoomed) return
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect()
    const x = ((event.clientX - left) / width) * 100
    const y = ((event.clientY - top) / height) * 100
    setZoomPosition({ x, y })
  }

  useEffect(() => {
    setIsZoomed(false)
  }, [activeImage])

  const handleAddToCart = async () => {
    if (!product) return
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      showToast("Please login to add items to cart", "error")
      navigate("/login")
      return
    }
    
    try {
      setIsAddingToCart(true)
      await addToCart({ productId: product.id }, quantity)
      showToast("Item added to cart successfully!")
    } catch (error) {
      console.error("Add to cart failed:", error)
      showToast(error.response?.data?.error || "Failed to add item to cart.", "error")
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleWhatsAppOrder = () => {
    if (!product) return

    const price = formatPrice(product.price || selectedVariant?.total_price || product.fixed_price)
    const size = product.size || (selectedVariant?.size ?? null)
    const color = product.color || null

    const lines = [
      `Hi! I'd like to order the following product:`,
      ``,
      `📦 *Product:* ${product.name}`,
      `💰 *Price:* ${price}`,
      `🔢 *Quantity:* ${quantity}`,
      size ? `📐 *Size:* ${size}` : null,
      color ? `🎨 *Color:* ${color}` : null,
      product.fabric ? `🧵 *Fabric:* ${product.fabric}` : null,
      product.material ? `💎 *Material:* ${product.material}` : null,
      ``,
      `Please confirm availability and delivery details. Thank you!`,
    ]
      .filter((line) => line !== null)
      .join("\n")

    const encoded = encodeURIComponent(lines)
    window.open(`https://wa.me/447553387651?text=${encoded}`, "_blank", "noopener,noreferrer")
  }

  const handleAddToWishlist = async (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (!product) return
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      showToast("Please login to add items to wishlist", "error")
      navigate("/login")
      return
    }
    
    try {
      await addToWishlist({ productId: product.id })
      setIsWishlisted(true)
      showToast("Item added to wishlist successfully!")
    } catch (error) {
      console.error("Add to wishlist failed:", error)
      showToast(error.response?.data?.error || "Failed to add item to wishlist.", "error")
    }
  }

  const maxStock = product?.stock ?? selectedVariant?.stock ?? 0
  const isAvailable =
    Boolean(product?.available) &&
    Boolean(product?.is_active) &&
    Boolean(product?.category_Isactive) &&
    maxStock > 0

  const incrementQuantity = () => {
    if (quantity < maxStock) {
      setQuantity((prev) => prev + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-[#023d12]  border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-lg font-medium text-gray-700">Loading product details...</div>
        </div>
      </div>
    )
  }

  const productImages = Array.isArray(product.image) && product.image.length > 0 ? product.image : ["/placeholder.svg"]

  return (
    <div className="bg-gradient-to-b from-[#FCF8F1] to-white min-h-screen">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center text-sm text-[#4B4B4B] mb-6">
          <span className="hover:text-[#0B3D2E] cursor-pointer transition-colors" onClick={() => navigate("/user/home")}>Home</span>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span>{product.category_name}</span>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-[#0B3D2E] font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4">
            <div
              ref={imageContainerRef}
              className={`aspect-square overflow-hidden rounded-lg border border-[#E8DFC6] bg-white relative ${
                isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
              } shadow-md hover:shadow-lg transition-shadow duration-300`}
              onClick={() => setIsZoomed((prev) => !prev)}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => isZoomed && setIsZoomed(false)}
            >
              {isZoomed ? (
                <div
                  className="absolute inset-0 bg-no-repeat"
                  style={{
                    backgroundImage: `url(${productImages[activeImage]})`,
                    backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    backgroundSize: "250%",
                  }}
                />
              ) : (
                <>
                  <img
                    src={productImages[activeImage]}
                    alt={product.name}
                    className="h-full w-full object-cover object-center transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow-md opacity-70 hover:opacity-100 transition-opacity duration-300">
                    <ZoomIn className="h-5 w-5 text-[#0B3D2E]" />
                  </div>
                </>
              )}
            </div>

            <div className="flex space-x-3 overflow-auto pb-2 scrollbar-hide">
              {productImages.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  className={`relative h-20 w-20 overflow-hidden rounded-md border border-[#E8DFC6] transition-all duration-300 ${
                    activeImage === index
                      ? "ring-2 ring-[#0B3D2E] shadow-md scale-105"
                      : "hover:ring-1 hover:ring-[#0B3D2E]/50 hover:shadow-sm"
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <img src={image} alt={`${product.name} thumbnail ${index + 1}`} className="h-full w-full object-cover object-center" />
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="flex flex-col items-center bg-[#F7F3EB] p-3 rounded-lg border border-[#E8DFC6]">
                <Truck className="h-6 w-6 text-[#0B3D2E] mb-2" />
                <span className="text-xs text-center font-medium">Free Shipping Above 1000/-</span>
              </div>
              <div className="flex flex-col items-center bg-[#F7F3EB] p-3 rounded-lg border border-[#E8DFC6]">
                <RefreshCcw className="h-6 w-6 text-[#0B3D2E] mb-2" />
                <span className="text-xs text-center font-medium">14-Day Returns</span>
              </div>
              <div className="flex flex-col items-center bg-[#F7F3EB] p-3 rounded-lg border border-[#E8DFC6]">
                <Shield className="h-6 w-6 text-[#0B3D2E] mb-2" />
                <span className="text-xs text-center font-medium">Quality Assured</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-6">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline" className="bg-[#0B3D2E]/10 text-[#0B3D2E] border-[#0B3D2E]/20">
                      {product.product_type === "clothing" ? "Clothing" : "Imitation Jewelry"}
                    </Badge>
                    {product.color && (
                      <Badge variant="outline" className="bg-[#0B3D2E]/10 text-[#0B3D2E] border-[#0B3D2E]/20">
                        {product.color}
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold text-[#1E2C24] mb-1">{product.name}</h1>
                </div>

                <button
                  className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-all duration-300 group"
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    navigator.clipboard.writeText(window.location.href)
                    showToast("Link copied to clipboard!")
                  }}
                >
                  <Share2 className="h-5 w-5 text-[#4B4B4B] group-hover:text-[#0B3D2E] transition-colors" />
                </button>
              </div>

              <div className="mt-4">
                <p className="text-3xl font-bold text-[#0B3D2E]">
                  {formatPrice(product.price || selectedVariant?.total_price || product.fixed_price)}
                </p>
                <p className="mt-1 text-sm text-[#4B4B4B] flex items-center">
                  Including all taxes
                  <span className="inline-flex items-center ml-3 px-2 py-0.5 rounded text-xs font-medium bg-[#14532D]/10 text-[#14532D]">
                    <Check className="h-3 w-3 mr-1" />
                    Free shipping Above 1000/-
                  </span>
                </p>
              </div>
            </div>

            <Separator className="bg-[#E8DFC6]" />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="font-medium text-[#4B4B4B]">Type</p>
                <p>{product.product_type === "clothing" ? "Clothing" : "Imitation Jewelry"}</p>
              </div>
              {product.size && (
                <div className="space-y-1">
                  <p className="font-medium text-[#4B4B4B]">Size</p>
                  <p>{product.size}</p>
                </div>
              )}
              {product.color && (
                <div className="space-y-1">
                  <p className="font-medium text-[#4B4B4B]">Color</p>
                  <p>{product.color}</p>
                </div>
              )}
              {product.fabric && (
                <div className="space-y-1">
                  <p className="font-medium text-[#4B4B4B]">Fabric</p>
                  <p>{product.fabric}</p>
                </div>
              )}
              {product.material && (
                <div className="space-y-1">
                  <p className="font-medium text-[#4B4B4B]">Material</p>
                  <p>{product.material}</p>
                </div>
              )}
              {product.occasion && (
                <div className="space-y-1">
                  <p className="font-medium text-[#4B4B4B]">Occasion</p>
                  <p>{product.occasion}</p>
                </div>
              )}
              {product.gender && (
                <div className="space-y-1">
                  <p className="font-medium text-[#4B4B4B]">Gender</p>
                  <p>{product.gender}</p>
                </div>
              )}
            </div>

            <Separator className="bg-[#E8DFC6]" />

            <div className="space-y-4">
              <div>
                {isAvailable ? (
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm text-green-600">In Stock ({maxStock} available)</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-red-100">
                      <AlertCircle className="h-3 w-3 text-red-600" />
                    </div>
                    <span className="text-sm text-red-600">Out of Stock</span>
                  </div>
                )}
              </div>

              <div className="flex items-center border border-[#E8DFC6] rounded-md w-fit">
                <Button variant="ghost" size="sm" onClick={decrementQuantity} disabled={quantity <= 1}>
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="w-14 text-center font-medium">{quantity}</div>
                <Button variant="ghost" size="sm" onClick={incrementQuantity} disabled={!isAvailable || quantity >= maxStock}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                className={`flex-1 bg-gradient-to-r from-[#0B3D2E] to-[#14532D] hover:from-[#14532D] hover:to-[#0B3D2E] text-white transition-all duration-300 ${
                  isAddingToCart ? "opacity-90" : "hover:shadow-md"
                }`}
                size="lg"
                disabled={!isAvailable || isAddingToCart}
                onClick={handleAddToCart}
              >
                {isAddingToCart ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className={`border-[#E8DFC6] text-[#0B3D2E] hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-white transition-all duration-300 ${
                  isWishlisted ? "bg-[#D4AF37]/10" : ""
                }`}
                onClick={handleAddToWishlist}
              >
                <Heart className={`mr-2 h-5 w-5 ${isWishlisted ? "fill-[#D4AF37]" : ""}`} />
                {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
              </Button>
            </div>

            {/* WhatsApp DM for Order */}
            <button
              type="button"
              onClick={handleWhatsAppOrder}
              className="w-full flex items-center justify-center gap-3 rounded-lg bg-[#087d33] hover:bg-[#1ebe5d] active:bg-[#19a852] text-white font-semibold text-base py-3.5 px-6 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {/* WhatsApp SVG icon */}
              <svg
                viewBox="0 0 32 32"
                fill="currentColor"
                className="h-5 w-5 flex-shrink-0"
                aria-hidden="true"
              >
                <path d="M16.003 2.667C8.636 2.667 2.667 8.636 2.667 16c0 2.348.636 4.636 1.845 6.636L2.667 29.333l6.909-1.812A13.31 13.31 0 0 0 16.003 29.333c7.367 0 13.33-5.967 13.33-13.333 0-7.364-5.963-13.333-13.33-13.333zm0 24.4a11.08 11.08 0 0 1-5.636-1.536l-.403-.24-4.1 1.076 1.094-4.003-.263-.412A11.067 11.067 0 0 1 4.933 16c0-6.107 4.963-11.067 11.07-11.067S27.067 9.893 27.067 16c0 6.11-4.96 11.067-11.064 11.067zm6.073-8.294c-.332-.167-1.966-.97-2.27-1.08-.303-.112-.524-.168-.745.167-.22.335-.854 1.08-1.048 1.302-.193.22-.386.248-.718.083-.332-.167-1.4-.515-2.666-1.643-.984-.878-1.647-1.963-1.84-2.295-.193-.332-.021-.512.146-.677.15-.148.332-.387.498-.58.167-.193.222-.332.333-.553.112-.22.056-.415-.028-.58-.083-.167-.745-1.797-1.02-2.462-.27-.647-.545-.56-.745-.57l-.635-.012c-.22 0-.58.083-.883.415-.304.332-1.158 1.133-1.158 2.763s1.186 3.205 1.351 3.428c.166.22 2.333 3.56 5.653 4.994.79.34 1.406.543 1.887.695.793.251 1.515.216 2.085.131.636-.094 1.966-.804 2.243-1.581.277-.777.277-1.44.193-1.58-.083-.14-.304-.222-.636-.39z"/>
              </svg>
              DM for Order
            </button>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-sm p-6 border border-[#E8DFC6]">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start bg-[#F7F3EB] p-1">
              <TabsTrigger value="description" className="data-[state=active]:bg-white data-[state=active]:text-[#0B3D2E] data-[state=active]:shadow-sm">
                Description
              </TabsTrigger>
              <TabsTrigger value="details" className="data-[state=active]:bg-white data-[state=active]:text-[#0B3D2E] data-[state=active]:shadow-sm">
                Product Details
              </TabsTrigger>
              <TabsTrigger value="shipping" className="data-[state=active]:bg-white data-[state=active]:text-[#0B3D2E] data-[state=active]:shadow-sm">
                Shipping & Returns
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <div className="prose max-w-none">
                <p className="leading-relaxed text-[#4B4B4B]">{product.description || "No description available."}</p>
                <div className="mt-6 p-4 bg-[#F7F3EB] rounded-lg border border-[#E8DFC6]">
                  <h4 className="font-medium text-[#0B3D2E] mb-2">Care Instructions</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-[#4B4B4B]">
                    <li>Store in a cool, dry place away from direct sunlight</li>
                    <li>Clean with a soft, lint-free cloth</li>
                    <li>Avoid contact with perfumes, lotions, and chemicals</li>
                    <li>Handle with care to preserve finish and fabric quality</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="mt-6">
              <div className="bg-white rounded-lg border border-[#e6d2b3] overflow-hidden">
                {[
                  ["Type", product.product_type === "clothing" ? "Clothing" : "Imitation Jewelry"],
                  ["Category", product.category_name],
                  ["Size", product.size],
                  ["Color", product.color],
                  ["Fabric", product.fabric],
                  ["Material", product.material],
                  ["Occasion", product.occasion],
                  ["Gender", product.gender],
                ]
                  .filter(([, value]) => value)
                  .map(([label, value]) => (
                    <div key={label} className="grid grid-cols-2 text-sm border-b last:border-b-0 border-[#e6d2b3] hover:bg-[#fff8f0] transition-colors">
                      <div className="p-3 font-medium text-gray-600 border-r border-[#e6d2b3]">{label}</div>
                      <div className="p-3">{value}</div>
                    </div>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="mt-6">
              <div className="space-y-8">
                <div>
                  <h3 className="font-medium text-lg text-[#023d12]  mb-3 flex items-center">
                    <Truck className="h-5 w-5 mr-2" />
                    Shipping Information
                  </h3>
                  <div className="bg-[#fff8f0] rounded-lg p-4 border border-[#e6d2b3]">
                    <p className="mb-4 text-gray-700">
                      We offer free shipping on all orders above £1,000. Standard delivery takes 3-5 business days.
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-lg text-[#023d12]  mb-3 flex items-center">
                    <RefreshCcw className="h-5 w-5 mr-2" />
                    Returns & Exchanges
                  </h3>
                  <div className="bg-[#fff8f0] rounded-lg p-4 border border-[#e6d2b3]">
                    <p className="text-gray-700">
                      We accept returns within 14 days of delivery for eligible items in original condition.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails

