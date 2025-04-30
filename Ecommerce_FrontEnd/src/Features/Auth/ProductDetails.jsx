// "use client"

// import { useState, useEffect, useRef } from "react"
// import { useParams } from "react-router-dom"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { ShoppingCart, Heart, Check, AlertCircle, ZoomIn } from "lucide-react"
// import api from "../../api"
// import { useCart } from "@/Context/CartContext"
// import { useNavigate } from "react-router-dom"

// const BASE_URL = "http://127.0.0.1:8000"

// const ProductDetails = () => {
//   const { id } = useParams()
//   const [product, setProduct] = useState(null)
//   const [selectedVariant, setSelectedVariant] = useState(null)
//   const [quantity, setQuantity] = useState(1)
//   const [activeImage, setActiveImage] = useState(0)
//   const { addToCart } = useCart()
//   const navigate = useNavigate()

//   // Image zoom functionality
//   const [isZoomed, setIsZoomed] = useState(false)
//   const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
//   const imageContainerRef = useRef(null)

//   useEffect(() => {
//     const fetchProductDetails = async () => {
//       try {
//         const response = await api.get(`productapp/products/${id}/`)
//         console.log("Original image data:", response.data.image)
//         const transformedProduct = {
//           ...response.data,
//           image: Array.isArray(response.data.image)
//             ? response.data.image.map((img) => {
               
//                 if (typeof img === "object" && img !== null) {
                  
//                   return `${BASE_URL}${img.path || img.url || img.image || ""}`
//                 }
               
//                 else if (typeof img === "string") {
//                   return `${BASE_URL}${img}`
//                 }
//                 return ""
//               })
//             : response.data.image
//               ? typeof response.data.image === "object" && response.data.image !== null
//                 ? [
//                     `${BASE_URL}${response.data.image.path || response.data.image.url || response.data.image.image || ""}`,
//                   ]
//                 : [`${BASE_URL}${response.data.image}`]
//               : [],
//         }
//         console.log("Transformed product:", transformedProduct)
//         setProduct(transformedProduct)
//         setSelectedVariant(transformedProduct.variants[0])
//       } catch (error) {
//         console.error("Error fetching product details:", error)
//       }
//     }

//     fetchProductDetails()
//   }, [id])

//   const handleAddToCart = async () => {
//     try {
//       await addToCart(selectedVariant.id, quantity)
//       console.log("Item added to cart!")
//       navigate("/cart")
      
//     } catch (error) {
//       console.error("Add to cart failed:", error)
//     }
//   };

//   // Handle mouse move for zoom effect
//   const handleMouseMove = (e) => {
//     if (!imageContainerRef.current || !isZoomed) return

//     const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect()
//     const x = ((e.clientX - left) / width) * 100
//     const y = ((e.clientY - top) / height) * 100

//     setZoomPosition({ x, y })
//   }

//   // Toggle zoom state
//   const toggleZoom = () => {
//     setIsZoomed(!isZoomed)
//   }

//   // Reset zoom when changing images
//   useEffect(() => {
//     setIsZoomed(false)
//   }, [activeImage])

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(price)
//   }

//   if (!product) {
//     return (
//       <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]">
//         <div className="animate-pulse text-lg font-medium">Loading product details...</div>
//       </div>
//     )
//   }
//   const productImages = Array.isArray(product.image) ? product.image : []
//   return (
//     <div className="container mx-auto px-4 py-8 max-w-7xl">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
//         {/* Product Images Section */}
//         <div className="space-y-4">
//           <div
//             ref={imageContainerRef}
//             className={`aspect-square overflow-hidden rounded-lg border bg-white relative cursor-zoom-in ${isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"}`}
//             onClick={toggleZoom}
//             onMouseMove={handleMouseMove}
//             onMouseLeave={() => isZoomed && setIsZoomed(false)}
//           >
//             {isZoomed ? (
//               <div
//                 className="absolute inset-0 bg-no-repeat"
//                 style={{
//                   backgroundImage: `url(${productImages[activeImage] || "/placeholder.svg"})`,
//                   backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
//                   backgroundSize: "200%",
//                 }}
//               />
//             ) : (
//               <>
//                 <img
//                   src={productImages[activeImage] || "/placeholder.svg"}
//                   alt={product.name}
//                   className="h-full w-full object-cover object-center"
//                 />
//                 <div className="absolute top-2 right-2 bg-white/80 p-1 rounded-full">
//                   <ZoomIn className="h-5 w-5 text-gray-700" />
//                 </div>
//               </>
//             )}
//           </div>

//           <div className="flex space-x-2 overflow-auto pb-2">
//             {productImages.map((image, index) => (
//               <button
//                 key={index}
//                 className={`relative h-20 w-20 overflow-hidden rounded-md border ${
//                   activeImage === index ? "ring-2 ring-primary" : ""
//                 }`}
//                 onClick={() => setActiveImage(index)}
//               >
//                 <img
//                   src={image || "/placeholder.svg"}
//                   alt={`${product.name} thumbnail ${index + 1}`}
//                   className="h-full w-full object-cover object-center"
//                 />
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Product Details Section */}
//         <div className="flex flex-col space-y-6">
//           <div>
//             <div className="flex items-start justify-between">
//               <div>
//                 <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
//                 <p className="mt-1 text-sm text-gray-500">{product.category_name}</p>
//               </div>
//               <Badge variant="outline" className="text-sm font-medium">
//                 {product.gold_color}
//               </Badge>
//             </div>

//             <div className="mt-4">
//               <p className="text-2xl font-bold text-gray-900">
//                 {selectedVariant ? formatPrice(selectedVariant.total_price) : formatPrice(product.price)}
//               </p>
//               <p className="mt-1 text-sm text-gray-500">Including all taxes</p>
//             </div>
//           </div>

//           <Separator />

//           {/* Product Specifications */}
//           <div className="grid grid-cols-2 gap-4 text-sm">
//             <div className="space-y-1">
//               <p className="font-medium text-gray-500">BIS Hallmark</p>
//               <p>{product.bis_hallmark}</p>
//             </div>
//             <div className="space-y-1">
//               <p className="font-medium text-gray-500">Size</p>
//               <p>{product.size}</p>
//             </div>
//             <div className="space-y-1">
//               <p className="font-medium text-gray-500">Occasion</p>
//               <p>{product.occasion}</p>
//             </div>
//             <div className="space-y-1">
//               <p className="font-medium text-gray-500">Gender</p>
//               <p>{product.gender}</p>
//             </div>
//           </div>

//           <Separator />

//           {/* Variant Selection */}
//           <div className="space-y-4">
//             <div>
//               <label className="text-sm font-medium">Select Gross Weight:</label>
//               <Select
//                 defaultValue={selectedVariant?.gross_weight}
//                 onValueChange={(value) => {
//                   const variant = product.variants.find((v) => v.gross_weight === value)
//                   setSelectedVariant(variant)
//                   setQuantity(1) 
//                 }}
//               >
//                 <SelectTrigger className="mt-1 w-full">
//                   <SelectValue placeholder="Select Gross Weight" />
//                 </SelectTrigger>
//                 <SelectContent className="bg-white">
//                   {product.variants.map((variant) => (
//                     <SelectItem key={variant.id} value={variant.gross_weight}>
//                       {variant.gross_weight} gm
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {selectedVariant && (
//               <Card>
//                 <CardContent className="p-4 space-y-3">
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm font-medium">Gold Price (per gram)</span>
//                     <span>{formatPrice(selectedVariant.gold_price)}</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm font-medium">Making Charge</span>
//                     <span>{formatPrice(selectedVariant.making_charge)}</span>
//                   </div>
//                   {Number.parseFloat(selectedVariant.stone_rate) > 0 && (
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm font-medium">Stone Rate</span>
//                       <span>{formatPrice(selectedVariant.stone_rate)}</span>
//                     </div>
//                   )}
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm font-medium">Tax ({selectedVariant.tax}%)</span>
//                     <span>{formatPrice(selectedVariant.total_price * (selectedVariant.tax / 100))}</span>
//                   </div>
//                   <Separator />
//                   <div className="flex justify-between items-center font-bold">
//                     <span>Total Price</span>
//                     <span>{formatPrice(selectedVariant.total_price)}</span>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             {/* Stock Status */}
//             <div className="flex items-center space-x-2">
//               {selectedVariant && selectedVariant.stock > 0 ? (
//                 <>
//                   <Check className="h-5 w-5 text-green-500" />
//                   <span className="text-sm text-green-600">In Stock ({selectedVariant.stock} available)</span>
//                 </>
//               ) : (
//                 <>
//                   <AlertCircle className="h-5 w-5 text-red-500" />
//                   <span className="text-sm text-red-600">Out of Stock</span>
//                 </>
//               )}
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-col sm:flex-row gap-3 pt-2">
//             <Button
//               className="flex-1 bg-[#8c2a2a] hover:bg-[#7a2424] text-white"
//               size="lg"
//               disabled={!selectedVariant || selectedVariant.stock === 0}
//               onClick={handleAddToCart}
//             >
//               <ShoppingCart className="mr-2 h-5 w-5" />
//               Add to Cart
//             </Button>
//             <Button variant="outline" size="lg" className="bg-[#8c2a2a] hover:bg-[#7a2424] text-white">
//               <Heart className="mr-2 h-5 w-5" />
//               Add to Wishlist
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Product Description */}
//       <div className="mt-12">
//         <Tabs defaultValue="description">
//           <TabsList className="w-full justify-start bg-gray ">
//             <TabsTrigger value="description">Description</TabsTrigger>
//             <TabsTrigger value="details">Product Details</TabsTrigger>
//             <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
//           </TabsList>
//           <TabsContent value="description" className="mt-4">
//             <div className="prose max-w-none">
//               <p>{product.description}</p>
//               <p className="mt-4">
//                 This exquisite piece is crafted with the finest materials and expert craftsmanship, ensuring both beauty
//                 and durability. The {product.gold_color} finish adds a timeless elegance that complements any outfit or
//                 occasion.
//               </p>
//             </div>
//           </TabsContent>
//           <TabsContent value="details" className="mt-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-4">
//                 <div>
//                   <h3 className="font-medium">Product Specifications</h3>
//                   <ul className="mt-2 space-y-2 text-sm">
//                     <li className="flex justify-between">
//                       <span className="text-gray-500">Gold Color</span>
//                       <span>{product.gold_color}</span>
//                     </li>
//                     <li className="flex justify-between">
//                       <span className="text-gray-500">BIS Hallmark</span>
//                       <span>{product.bis_hallmark}</span>
//                     </li>
//                     <li className="flex justify-between">
//                       <span className="text-gray-500">Size</span>
//                       <span>{product.size}</span>
//                     </li>
//                     <li className="flex justify-between">
//                       <span className="text-gray-500">Occasion</span>
//                       <span>{product.occasion}</span>
//                     </li>
//                     <li className="flex justify-between">
//                       <span className="text-gray-500">Gender</span>
//                       <span>{product.gender}</span>
//                     </li>
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           </TabsContent>
//           <TabsContent value="shipping" className="mt-4">
//             <div className="space-y-4">
//               <div>
//                 <h3 className="font-medium">Shipping Information</h3>
//                 <p className="mt-2 text-sm">
//                   We offer free shipping on all orders above ₹10,000. Standard delivery takes 3-5 business days. Express
//                   shipping options are available at checkout.
//                 </p>
//               </div>
//               <div>
//                 <h3 className="font-medium">Returns & Exchanges</h3>
//                 <p className="mt-2 text-sm">
//                   We accept returns within 14 days of delivery. Items must be in original condition with all tags
//                   attached. Please note that customized items cannot be returned unless there is a manufacturing defect.
//                 </p>
//               </div>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   )
// }

// export default ProductDetails

// "use client"

// import { useState, useEffect, useRef } from "react"
// import { useParams } from "react-router-dom"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import {
//   ShoppingCart,
//   Heart,
//   Check,
//   AlertCircle,
//   ZoomIn,
//   ChevronRight,
//   Star,
//   Truck,
//   RefreshCcw,
//   Shield,
//   Share2,
//   Minus,
//   Plus,
//   Info,
// } from "lucide-react"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import api from "../../api"
// import { useCart } from "@/Context/CartContext"
// import { useNavigate } from "react-router-dom"

// const BASE_URL = "http://127.0.0.1:8000"

// const ProductDetails = () => {
//   const { id } = useParams()
//   const [product, setProduct] = useState(null)
//   const [selectedVariant, setSelectedVariant] = useState(null)
//   const [quantity, setQuantity] = useState(1)
//   const [activeImage, setActiveImage] = useState(0)
//   const [isWishlisted, setIsWishlisted] = useState(false)
//   const { addToCart } = useCart()
//   const navigate = useNavigate()

//   // Image zoom functionality
//   const [isZoomed, setIsZoomed] = useState(false)
//   const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
//   const imageContainerRef = useRef(null)
//   const [showPriceBreakdown, setShowPriceBreakdown] = useState(false)
//   const [isAddingToCart, setIsAddingToCart] = useState(false)

//   useEffect(() => {
//     const fetchProductDetails = async () => {
//       try {
//         const response = await api.get(`productapp/products/${id}/`)
//         console.log("Original image data:", response.data.image)
//         const transformedProduct = {
//           ...response.data,
//           image: Array.isArray(response.data.image)
//             ? response.data.image.map((img) => {
//                 if (typeof img === "object" && img !== null) {
//                   return `${BASE_URL}${img.path || img.url || img.image || ""}`
//                 } else if (typeof img === "string") {
//                   return `${BASE_URL}${img}`
//                 }
//                 return ""
//               })
//             : response.data.image
//               ? typeof response.data.image === "object" && response.data.image !== null
//                 ? [
//                     `${BASE_URL}${response.data.image.path || response.data.image.url || response.data.image.image || ""}`,
//                   ]
//                 : [`${BASE_URL}${response.data.image}`]
//               : [],
//         }
//         console.log("Transformed product:", transformedProduct)
//         setProduct(transformedProduct)
//         setSelectedVariant(transformedProduct.variants[0])
//       } catch (error) {
//         console.error("Error fetching product details:", error)
//       }
//     }

//     fetchProductDetails()
//   }, [id])

//   const handleAddToCart = async () => {
//     try {
//       setIsAddingToCart(true)
//       await addToCart(selectedVariant.id, quantity)

//       // Show success notification
//       const toast = document.createElement("div")
//       toast.className =
//         "fixed bottom-4 right-4 bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-lg transform transition-all duration-500 z-50 flex items-center"
//       toast.innerHTML = `
//         <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
//         </svg>
//         <span>Item added to cart successfully!</span>
//       `
//       document.body.appendChild(toast)

//       setTimeout(() => {
//         toast.classList.add("opacity-0", "translate-y-2")
//         setTimeout(() => document.body.removeChild(toast), 500)
//       }, 3000)

//       setIsAddingToCart(false)
//     } catch (error) {
//       console.error("Add to cart failed:", error)
//       setIsAddingToCart(false)
//     }
//   }

//   const toggleWishlist = () => {
//     setIsWishlisted(!isWishlisted)

//     // Show notification
//     const toast = document.createElement("div")
//     toast.className =
//       "fixed bottom-4 right-4 bg-pink-50 border-l-4 border-pink-500 text-pink-700 p-4 rounded-md shadow-lg transform transition-all duration-500 z-50 flex items-center"
//     toast.innerHTML = `
//       <svg class="w-5 h-5 mr-2" fill="${isWishlisted ? "none" : "currentColor"}" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
//       </svg>
//       <span>${isWishlisted ? "Removed from" : "Added to"} wishlist!</span>
//     `
//     document.body.appendChild(toast)

//     setTimeout(() => {
//       toast.classList.add("opacity-0", "translate-y-2")
//       setTimeout(() => document.body.removeChild(toast), 500)
//     }, 3000)
//   }

//   // Handle mouse move for zoom effect
//   const handleMouseMove = (e) => {
//     if (!imageContainerRef.current || !isZoomed) return

//     const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect()
//     const x = ((e.clientX - left) / width) * 100
//     const y = ((e.clientY - top) / height) * 100

//     setZoomPosition({ x, y })
//   }

//   // Toggle zoom state
//   const toggleZoom = () => {
//     setIsZoomed(!isZoomed)
//   }

//   // Reset zoom when changing images
//   useEffect(() => {
//     setIsZoomed(false)
//   }, [activeImage])

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(price)
//   }

//   const incrementQuantity = () => {
//     if (selectedVariant && quantity < selectedVariant.stock) {
//       setQuantity(quantity + 1)
//     }
//   }

//   const decrementQuantity = () => {
//     if (quantity > 1) {
//       setQuantity(quantity - 1)
//     }
//   }

//   if (!product) {
//     return (
//       <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]">
//         <div className="flex flex-col items-center">
//           <div className="w-16 h-16 border-4 border-[#7a2828] border-t-transparent rounded-full animate-spin mb-4"></div>
//           <div className="text-lg font-medium text-gray-700">Loading product details...</div>
//         </div>
//       </div>
//     )
//   }

//   const productImages = Array.isArray(product.image) ? product.image : []

//   return (
//     <div className="bg-gradient-to-b from-[#fff8f0] to-white min-h-screen">
//       {/* Breadcrumb */}
//       <div className="container mx-auto px-4 py-4 max-w-7xl">
//         <div className="flex items-center text-sm text-gray-500 mb-6">
//           <span className="hover:text-[#7a2828] cursor-pointer transition-colors">Home</span>
//           <ChevronRight className="h-4 w-4 mx-2" />
//           <span className="hover:text-[#7a2828] cursor-pointer transition-colors">{product.category_name}</span>
//           <ChevronRight className="h-4 w-4 mx-2" />
//           <span className="text-[#7a2828] font-medium">{product.name}</span>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
//           {/* Product Images Section */}
//           <div className="space-y-4">
//             <div
//               ref={imageContainerRef}
//               className={`aspect-square overflow-hidden rounded-lg border bg-white relative ${
//                 isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
//               } shadow-md hover:shadow-lg transition-shadow duration-300`}
//               onClick={toggleZoom}
//               onMouseMove={handleMouseMove}
//               onMouseLeave={() => isZoomed && setIsZoomed(false)}
//             >
//               {isZoomed ? (
//                 <div
//                   className="absolute inset-0 bg-no-repeat"
//                   style={{
//                     backgroundImage: `url(${productImages[activeImage] || "/placeholder.svg"})`,
//                     backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
//                     backgroundSize: "250%",
//                   }}
//                 />
//               ) : (
//                 <>
//                   <img
//                     src={productImages[activeImage] || "/placeholder.svg"}
//                     alt={product.name}
//                     className="h-full w-full object-cover object-center transition-transform duration-500"
//                   />
//                   <div className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow-md opacity-70 hover:opacity-100 transition-opacity duration-300">
//                     <ZoomIn className="h-5 w-5 text-[#7a2828]" />
//                   </div>
//                 </>
//               )}
//             </div>

//             <div className="flex space-x-3 overflow-auto pb-2 scrollbar-hide">
//               {productImages.map((image, index) => (
//                 <button
//                   key={index}
//                   className={`relative h-20 w-20 overflow-hidden rounded-md border transition-all duration-300 ${
//                     activeImage === index
//                       ? "ring-2 ring-[#7a2828] shadow-md scale-105"
//                       : "hover:ring-1 hover:ring-[#7a2828]/50 hover:shadow-sm"
//                   }`}
//                   onClick={() => setActiveImage(index)}
//                 >
//                   <img
//                     src={image || "/placeholder.svg"}
//                     alt={`${product.name} thumbnail ${index + 1}`}
//                     className="h-full w-full object-cover object-center"
//                   />
//                 </button>
//               ))}
//             </div>

//             {/* Product Benefits */}
//             <div className="grid grid-cols-3 gap-3 mt-6">
//               <div className="flex flex-col items-center bg-[#fff8f0] p-3 rounded-lg border border-[#f0e6d6] hover:border-[#e6d2b3] transition-colors">
//                 <Truck className="h-6 w-6 text-[#7a2828] mb-2" />
//                 <span className="text-xs text-center font-medium">Free Shipping</span>
//               </div>
//               <div className="flex flex-col items-center bg-[#fff8f0] p-3 rounded-lg border border-[#f0e6d6] hover:border-[#e6d2b3] transition-colors">
//                 <RefreshCcw className="h-6 w-6 text-[#7a2828] mb-2" />
//                 <span className="text-xs text-center font-medium">14-Day Returns</span>
//               </div>
//               <div className="flex flex-col items-center bg-[#fff8f0] p-3 rounded-lg border border-[#f0e6d6] hover:border-[#e6d2b3] transition-colors">
//                 <Shield className="h-6 w-6 text-[#7a2828] mb-2" />
//                 <span className="text-xs text-center font-medium">Lifetime Warranty</span>
//               </div>
//             </div>
//           </div>

//           {/* Product Details Section */}
//           <div className="flex flex-col space-y-6">
//             <div>
//               <div className="flex items-start justify-between">
//                 <div>
//                   <div className="flex items-center space-x-2 mb-1">
//                     <Badge
//                       variant="outline"
//                       className="bg-[#7a2828]/10 text-[#7a2828] border-[#7a2828]/20 hover:bg-[#7a2828]/20"
//                     >
//                       {product.gold_color}
//                     </Badge>
//                     <Badge
//                       variant="outline"
//                       className="bg-[#7a2828]/10 text-[#7a2828] border-[#7a2828]/20 hover:bg-[#7a2828]/20"
//                     >
//                       {product.bis_hallmark}
//                     </Badge>
//                   </div>
//                   <h1 className="text-3xl font-bold text-gray-900 mb-1">{product.name}</h1>
//                   <div className="flex items-center mt-2">
//                     <div className="flex">
//                       {[...Array(5)].map((_, i) => (
//                         <Star
//                           key={i}
//                           className={`h-4 w-4 ${i < 4 ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
//                         />
//                       ))}
//                     </div>
//                     <span className="ml-2 text-sm text-gray-500">4.0 (24 reviews)</span>
//                   </div>
//                 </div>
//                 <button
//                   className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-all duration-300 group"
//                   onClick={(e) => {
//                     e.preventDefault()
//                     e.stopPropagation()
//                     navigator.clipboard.writeText(window.location.href)

//                     // Show notification
//                     const toast = document.createElement("div")
//                     toast.className =
//                       "fixed bottom-4 right-4 bg-gray-50 border-l-4 border-gray-500 text-gray-700 p-4 rounded-md shadow-lg transform transition-all duration-500 z-50 flex items-center"
//                     toast.innerHTML = `
//                       <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
//                       </svg>
//                       <span>Link copied to clipboard!</span>
//                     `
//                     document.body.appendChild(toast)

//                     setTimeout(() => {
//                       toast.classList.add("opacity-0", "translate-y-2")
//                       setTimeout(() => document.body.removeChild(toast), 500)
//                     }, 3000)
//                   }}
//                 >
//                   <Share2 className="h-5 w-5 text-gray-500 group-hover:text-[#7a2828] transition-colors" />
//                 </button>
//               </div>

//               <div className="mt-4 relative">
//                 <div className="flex items-end">
//                   <p className="text-3xl font-bold text-[#7a2828]">
//                     {selectedVariant ? formatPrice(selectedVariant.total_price) : formatPrice(product.price)}
//                   </p>
//                   <TooltipProvider>
//                     <Tooltip>
//                       <TooltipTrigger asChild>
//                         <button
//                           className="ml-2 text-gray-400 hover:text-[#7a2828] transition-colors"
//                           onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
//                         >
//                           <Info className="h-4 w-4" />
//                         </button>
//                       </TooltipTrigger>
//                       <TooltipContent>
//                         <p>Click to see price breakdown</p>
//                       </TooltipContent>
//                     </Tooltip>
//                   </TooltipProvider>
//                 </div>
//                 <p className="mt-1 text-sm text-gray-500 flex items-center">
//                   Including all taxes
//                   <span className="inline-flex items-center ml-3 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
//                     <Check className="h-3 w-3 mr-1" />
//                     Free shipping
//                   </span>
//                 </p>
//               </div>
//             </div>

//             <Separator className="bg-[#e6d2b3]" />

//             {/* Product Specifications */}
//             <div className="grid grid-cols-2 gap-4 text-sm">
//               <div className="space-y-1 group cursor-default">
//                 <p className="font-medium text-gray-500 group-hover:text-[#7a2828] transition-colors">Gold Color</p>
//                 <p className="group-hover:translate-x-1 transition-transform">{product.gold_color}</p>
//               </div>
//               <div className="space-y-1 group cursor-default">
//                 <p className="font-medium text-gray-500 group-hover:text-[#7a2828] transition-colors">Size</p>
//                 <p className="group-hover:translate-x-1 transition-transform">{product.size}</p>
//               </div>
//               <div className="space-y-1 group cursor-default">
//                 <p className="font-medium text-gray-500 group-hover:text-[#7a2828] transition-colors">Occasion</p>
//                 <p className="group-hover:translate-x-1 transition-transform">{product.occasion}</p>
//               </div>
//               <div className="space-y-1 group cursor-default">
//                 <p className="font-medium text-gray-500 group-hover:text-[#7a2828] transition-colors">Gender</p>
//                 <p className="group-hover:translate-x-1 transition-transform">{product.gender}</p>
//               </div>
//             </div>

//             <Separator className="bg-[#e6d2b3]" />

//             {/* Variant Selection */}
//             <div className="space-y-4">
//               <div>
//                 <label className="text-sm font-medium flex items-center">
//                   Select Gross Weight
//                   <span className="ml-1 text-xs text-gray-500">(affects price)</span>
//                 </label>
//                 <Select
//                   defaultValue={selectedVariant?.gross_weight}
//                   onValueChange={(value) => {
//                     const variant = product.variants.find((v) => v.gross_weight === value)
//                     setSelectedVariant(variant)
//                     setQuantity(1)
//                   }}
//                 >
//                   <SelectTrigger className="mt-1 w-full border-[#e6d2b3] focus:ring-[#7a2828] focus:border-[#7a2828]">
//                     <SelectValue placeholder="Select Gross Weight" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-white">
//                     {product.variants.map((variant) => (
//                       <SelectItem key={variant.id} value={variant.gross_weight}>
//                         {variant.gross_weight} gm {variant.stock === 0 && "(Out of Stock)"}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* Price Breakdown Card */}
//               {selectedVariant && (
//                 <Card
//                   className={`border-[#e6d2b3] overflow-hidden transition-all duration-500 ${showPriceBreakdown ? "opacity-100 max-h-96" : "opacity-0 max-h-0"}`}
//                 >
//                   <CardContent className="p-4 space-y-3">
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm font-medium">Gold Price (per gram)</span>
//                       <span>{formatPrice(selectedVariant.gold_price)}</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm font-medium">Gross Weight</span>
//                       <span>{selectedVariant.gross_weight} gm</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm font-medium">Gold Value</span>
//                       <span>{formatPrice(selectedVariant.gold_price * selectedVariant.gross_weight)}</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm font-medium">Making Charge</span>
//                       <span>{formatPrice(selectedVariant.making_charge)}</span>
//                     </div>
//                     {Number.parseFloat(selectedVariant.stone_rate) > 0 && (
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm font-medium">Stone Rate</span>
//                         <span>{formatPrice(selectedVariant.stone_rate)}</span>
//                       </div>
//                     )}
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm font-medium">Offer %</span>
//                       <span>{formatPrice(selectedVariant.making_charge)}</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm font-medium">Tax ({selectedVariant.tax}%)</span>
//                       <span>{formatPrice(selectedVariant.total_price * (selectedVariant.tax / 100))}</span>
//                     </div>
//                     <Separator className="bg-[#e6d2b3]" />
//                     <div className="flex justify-between items-center font-bold text-[#7a2828]">
//                       <span>Total Price</span>
//                       <span>{formatPrice(selectedVariant.total_price)}</span>
//                     </div>
//                   </CardContent>
//                 </Card>
//               )}

//               {/* Quantity Selector */}
//               {selectedVariant && selectedVariant.stock > 0 && (
//                 <div className="flex flex-col space-y-2">
//                   <label className="text-sm font-medium">Quantity</label>
//                   <div className="flex items-center">
//                     <button
//                       onClick={decrementQuantity}
//                       className="p-2 border border-[#e6d2b3] rounded-l-md bg-white hover:bg-[#fff8f0] transition-colors"
//                       disabled={quantity <= 1}
//                     >
//                       <Minus className="h-4 w-4 text-gray-600" />
//                     </button>
//                     <div className="px-4 py-2 border-t border-b border-[#e6d2b3] bg-white text-center min-w-[3rem]">
//                       {quantity}
//                     </div>
//                     <button
//                       onClick={incrementQuantity}
//                       className="p-2 border border-[#e6d2b3] rounded-r-md bg-white hover:bg-[#fff8f0] transition-colors"
//                       disabled={quantity >= selectedVariant.stock}
//                     >
//                       <Plus className="h-4 w-4 text-gray-600" />
//                     </button>
//                     <span className="ml-3 text-sm text-gray-500">{selectedVariant.stock} available</span>
//                   </div>
//                 </div>
//               )}

//               {/* Stock Status */}
//               <div className="flex items-center space-x-2">
//                 {selectedVariant && selectedVariant.stock > 0 ? (
//                   <>
//                     <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100">
//                       <Check className="h-3 w-3 text-green-600" />
//                     </div>
//                     <span className="text-sm text-green-600">In Stock ({selectedVariant.stock} available)</span>
//                   </>
//                 ) : (
//                   <>
//                     <div className="flex items-center justify-center w-5 h-5 rounded-full bg-red-100">
//                       <AlertCircle className="h-3 w-3 text-red-600" />
//                     </div>
//                     <span className="text-sm text-red-600">Out of Stock</span>
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex flex-col sm:flex-row gap-3 pt-2">
//               <Button
//                 className={`flex-1 bg-[#7a2828] hover:bg-[#5a1d1d] text-white transition-all duration-300 ${
//                   isAddingToCart ? "opacity-90" : "hover:shadow-md"
//                 }`}
//                 size="lg"
//                 disabled={!selectedVariant || selectedVariant.stock === 0 || isAddingToCart}
//                 onClick={handleAddToCart}
//               >
//                 {isAddingToCart ? (
//                   <>
//                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                     Adding...
//                   </>
//                 ) : (
//                   <>
//                     <ShoppingCart className="mr-2 h-5 w-5" />
//                     Add to Cart
//                   </>
//                 )}
//               </Button>
//               <Button
//                 variant="outline"
//                 size="lg"
//                 className={`border-[#7a2828] text-[#7a2828] hover:bg-[#7a2828]/10 transition-all duration-300 ${
//                   isWishlisted ? "bg-[#7a2828]/10" : ""
//                 }`}
//                 onClick={toggleWishlist}
//               >
//                 <Heart className={`mr-2 h-5 w-5 transition-all duration-300 ${isWishlisted ? "fill-[#7a2828]" : ""}`} />
//                 {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
//               </Button>
//             </div>
//           </div>
//         </div>

//         {/* Product Description */}
//         <div className="mt-12 bg-white rounded-lg shadow-sm p-6 border border-[#e6d2b3]">
//           <Tabs defaultValue="description">
//             <TabsList className="w-full justify-start bg-[#fff8f0] p-1">
//               <TabsTrigger
//                 value="description"
//                 className="data-[state=active]:bg-white data-[state=active]:text-[#7a2828] data-[state=active]:shadow-sm"
//               >
//                 Description
//               </TabsTrigger>
//               <TabsTrigger
//                 value="details"
//                 className="data-[state=active]:bg-white data-[state=active]:text-[#7a2828] data-[state=active]:shadow-sm"
//               >
//                 Product Details
//               </TabsTrigger>
//               <TabsTrigger
//                 value="shipping"
//                 className="data-[state=active]:bg-white data-[state=active]:text-[#7a2828] data-[state=active]:shadow-sm"
//               >
//                 Shipping & Returns
//               </TabsTrigger>
//             </TabsList>
//             <TabsContent value="description" className="mt-6">
//               <div className="prose max-w-none">
//                 <p className="leading-relaxed text-gray-700">{product.description || "No description available."}</p>
//                 <p className="mt-4 leading-relaxed text-gray-700">
//                   This exquisite piece is crafted with the finest materials and expert craftsmanship, ensuring both
//                   beauty and durability. The {product.gold_color} finish adds a timeless elegance that complements any
//                   outfit or occasion.
//                 </p>
//                 <div className="mt-6 p-4 bg-[#fff8f0] rounded-lg border border-[#e6d2b3]">
//                   <h4 className="font-medium text-[#7a2828] mb-2">Care Instructions</h4>
//                   <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
//                     <li>Store in a cool, dry place away from direct sunlight</li>
//                     <li>Clean with a soft, lint-free cloth</li>
//                     <li>Avoid contact with perfumes, lotions, and chemicals</li>
//                     <li>Remove before swimming or bathing</li>

//                     <li>Remove before swimming or bathing</li>
//                     <li>Have your jewelry professionally cleaned once a year</li>
//                   </ul>
//                 </div>
//               </div>
//             </TabsContent>
//             <TabsContent value="details" className="mt-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 <div className="space-y-6">
//                   <div>
//                     <h3 className="font-medium text-lg text-[#7a2828] mb-3">Product Specifications</h3>
//                     <div className="bg-white rounded-lg border border-[#e6d2b3] overflow-hidden">
//                       <div className="grid grid-cols-2 text-sm border-b border-[#e6d2b3] hover:bg-[#fff8f0] transition-colors">
//                         <div className="p-3 font-medium text-gray-600 border-r border-[#e6d2b3]">Gold Color</div>
//                         <div className="p-3">{product.gold_color}</div>
//                       </div>
//                       <div className="grid grid-cols-2 text-sm border-b border-[#e6d2b3] hover:bg-[#fff8f0] transition-colors">
//                         <div className="p-3 font-medium text-gray-600 border-r border-[#e6d2b3]">BIS Hallmark</div>
//                         <div className="p-3">{product.bis_hallmark}</div>
//                       </div>
//                       <div className="grid grid-cols-2 text-sm border-b border-[#e6d2b3] hover:bg-[#fff8f0] transition-colors">
//                         <div className="p-3 font-medium text-gray-600 border-r border-[#e6d2b3]">Size</div>
//                         <div className="p-3">{product.size}</div>
//                       </div>
//                       <div className="grid grid-cols-2 text-sm border-b border-[#e6d2b3] hover:bg-[#fff8f0] transition-colors">
//                         <div className="p-3 font-medium text-gray-600 border-r border-[#e6d2b3]">Occasion</div>
//                         <div className="p-3">{product.occasion}</div>
//                       </div>
//                       <div className="grid grid-cols-2 text-sm hover:bg-[#fff8f0] transition-colors">
//                         <div className="p-3 font-medium text-gray-600 border-r border-[#e6d2b3]">Gender</div>
//                         <div className="p-3">{product.gender}</div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-6">
//                   <div>
//                     <h3 className="font-medium text-lg text-[#7a2828] mb-3">Materials & Craftsmanship</h3>
//                     <p className="text-gray-700 mb-4">
//                       Each piece is meticulously crafted by our skilled artisans with decades of experience in
//                       traditional jewelry making techniques.
//                     </p>
//                     <div className="space-y-3">
//                       <div className="flex items-start">
//                         <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#7a2828]/10 flex items-center justify-center mr-3">
//                           <Check className="h-4 w-4 text-[#7a2828]" />
//                         </div>
//                         <div>
//                           <h4 className="font-medium">Premium Materials</h4>
//                           <p className="text-sm text-gray-600">Only the finest quality gold and gemstones are used</p>
//                         </div>
//                       </div>
//                       <div className="flex items-start">
//                         <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#7a2828]/10 flex items-center justify-center mr-3">
//                           <Check className="h-4 w-4 text-[#7a2828]" />
//                         </div>
//                         <div>
//                           <h4 className="font-medium">Certified Quality</h4>
//                           <p className="text-sm text-gray-600">BIS hallmarked for authenticity and quality assurance</p>
//                         </div>
//                       </div>
//                       <div className="flex items-start">
//                         <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#7a2828]/10 flex items-center justify-center mr-3">
//                           <Check className="h-4 w-4 text-[#7a2828]" />
//                         </div>
//                         <div>
//                           <h4 className="font-medium">Handcrafted Excellence</h4>
//                           <p className="text-sm text-gray-600">Each piece is handcrafted with attention to detail</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </TabsContent>
//             <TabsContent value="shipping" className="mt-6">
//               <div className="space-y-8">
//                 <div>
//                   <h3 className="font-medium text-lg text-[#7a2828] mb-3 flex items-center">
//                     <Truck className="h-5 w-5 mr-2" />
//                     Shipping Information
//                   </h3>
//                   <div className="bg-[#fff8f0] rounded-lg p-4 border border-[#e6d2b3]">
//                     <p className="mb-4 text-gray-700">
//                       We offer free shipping on all orders above ₹10,000. Standard delivery takes 3-5 business days.
//                       Express shipping options are available at checkout.
//                     </p>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                       <div className="flex items-start p-3 bg-white rounded-md border border-[#e6d2b3] hover:shadow-sm transition-all">
//                         <div className="font-medium mr-2">Standard Shipping:</div>
//                         <div className="text-gray-600">3-5 business days</div>
//                       </div>
//                       <div className="flex items-start p-3 bg-white rounded-md border border-[#e6d2b3] hover:shadow-sm transition-all">
//                         <div className="font-medium mr-2">Express Shipping:</div>
//                         <div className="text-gray-600">1-2 business days</div>
//                       </div>
//                       <div className="flex items-start p-3 bg-white rounded-md border border-[#e6d2b3] hover:shadow-sm transition-all">
//                         <div className="font-medium mr-2">International:</div>
//                         <div className="text-gray-600">7-14 business days</div>
//                       </div>
//                       <div className="flex items-start p-3 bg-white rounded-md border border-[#e6d2b3] hover:shadow-sm transition-all">
//                         <div className="font-medium mr-2">Free Shipping:</div>
//                         <div className="text-gray-600">Orders above ₹10,000</div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="font-medium text-lg text-[#7a2828] mb-3 flex items-center">
//                     <RefreshCcw className="h-5 w-5 mr-2" />
//                     Returns & Exchanges
//                   </h3>
//                   <div className="bg-[#fff8f0] rounded-lg p-4 border border-[#e6d2b3]">
//                     <p className="mb-4 text-gray-700">
//                       We accept returns within 14 days of delivery. Items must be in original condition with all tags
//                       attached. Please note that customized items cannot be returned unless there is a manufacturing
//                       defect.
//                     </p>
//                     <div className="space-y-3">
//                       <div className="flex items-start">
//                         <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#7a2828]/10 flex items-center justify-center mr-3">
//                           <Check className="h-3 w-3 text-[#7a2828]" />
//                         </div>
//                         <div className="text-sm text-gray-700">Easy returns within 14 days of delivery</div>
//                       </div>
//                       <div className="flex items-start">
//                         <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#7a2828]/10 flex items-center justify-center mr-3">
//                           <Check className="h-3 w-3 text-[#7a2828]" />
//                         </div>
//                         <div className="text-sm text-gray-700">Full refund or exchange options available</div>
//                       </div>
//                       <div className="flex items-start">
//                         <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#7a2828]/10 flex items-center justify-center mr-3">
//                           <Check className="h-3 w-3 text-[#7a2828]" />
//                         </div>
//                         <div className="text-sm text-gray-700">Lifetime warranty against manufacturing defects</div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </TabsContent>
//           </Tabs>
//         </div>

//         {/* You May Also Like Section */}
//         <div className="mt-16 mb-8">
//           <h2 className="text-2xl font-semibold mb-6">You May Also Like</h2>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {[1, 2, 3, 4].map((item) => (
//               <div
//                 key={item}
//                 className="bg-white rounded-lg shadow-sm overflow-hidden border border-[#e6d2b3] hover:shadow-md hover:border-[#7a2828]/30 transition-all duration-300 group"
//               >
//                 <div className="aspect-square relative overflow-hidden">
//                   <img
//                     src="/placeholder.svg"
//                     alt="Related product"
//                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                   />
//                   <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="bg-white/80 hover:bg-white border-none text-[#7a2828]"
//                     >
//                       Quick View
//                     </Button>
//                   </div>
//                 </div>
//                 <div className="p-3">
//                   <h3 className="font-medium text-sm truncate group-hover:text-[#7a2828] transition-colors">
//                     Similar Gold Jewelry
//                   </h3>
//                   <p className="text-[#7a2828] font-bold mt-1">₹24,999</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProductDetails

"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
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
  Star,
  Truck,
  RefreshCcw,
  Shield,
  Share2,
  Minus,
  Plus,
  Info,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import api from "../../api"
import { useCart } from "@/Context/CartContext"
import { useNavigate } from "react-router-dom"

const BASE_URL = "http://127.0.0.1:8000"

const ProductDetails = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addToCart } = useCart()
  const navigate = useNavigate()

  // Image zoom functionality
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const imageContainerRef = useRef(null)
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await api.get(`productapp/products/${id}/`)
        console.log("Original image data:", response.data.image)
        const transformedProduct = {
          ...response.data,
          image: Array.isArray(response.data.image)
            ? response.data.image.map((img) => {
                if (typeof img === "object" && img !== null) {
                  return `${BASE_URL}${img.path || img.url || img.image || ""}`
                } else if (typeof img === "string") {
                  return `${BASE_URL}${img}`
                }
                return ""
              })
            : response.data.image
              ? typeof response.data.image === "object" && response.data.image !== null
                ? [
                    `${BASE_URL}${response.data.image.path || response.data.image.url || response.data.image.image || ""}`,
                  ]
                : [`${BASE_URL}${response.data.image}`]
              : [],
        }
        console.log("Transformed product:", transformedProduct)
        setProduct(transformedProduct)
        setSelectedVariant(transformedProduct.variants[0])
      } catch (error) {
        console.error("Error fetching product details:", error)
      }
    }

    fetchProductDetails()
  }, [id])

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true)
      await addToCart(selectedVariant.id, quantity)

      // Show success notification
      const toast = document.createElement("div")
      toast.className =
        "fixed bottom-4 right-4 bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-lg transform transition-all duration-500 z-50 flex items-center"
      toast.innerHTML = `
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span>Item added to cart successfully!</span>
      `
      document.body.appendChild(toast)

      setTimeout(() => {
        toast.classList.add("opacity-0", "translate-y-2")
        setTimeout(() => document.body.removeChild(toast), 500)
      }, 3000)

      setIsAddingToCart(false)
    } catch (error) {
      console.error("Add to cart failed:", error)
      setIsAddingToCart(false)
    }
  }

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted)

    // Show notification
    const toast = document.createElement("div")
    toast.className =
      "fixed bottom-4 right-4 bg-pink-50 border-l-4 border-pink-500 text-pink-700 p-4 rounded-md shadow-lg transform transition-all duration-500 z-50 flex items-center"
    toast.innerHTML = `
      <svg class="w-5 h-5 mr-2" fill="${isWishlisted ? "none" : "currentColor"}" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
      </svg>
      <span>${isWishlisted ? "Removed from" : "Added to"} wishlist!</span>
    `
    document.body.appendChild(toast)

    setTimeout(() => {
      toast.classList.add("opacity-0", "translate-y-2")
      setTimeout(() => document.body.removeChild(toast), 500)
    }, 3000)
  }

  // Handle mouse move for zoom effect
  const handleMouseMove = (e) => {
    if (!imageContainerRef.current || !isZoomed) return

    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100

    setZoomPosition({ x, y })
  }

  // Toggle zoom state
  const toggleZoom = () => {
    setIsZoomed(!isZoomed)
  }

  // Reset zoom when changing images
  useEffect(() => {
    setIsZoomed(false)
  }, [activeImage])

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const incrementQuantity = () => {
    if (selectedVariant && quantity < selectedVariant.stock) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-[#7a2828] border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-lg font-medium text-gray-700">Loading product details...</div>
        </div>
      </div>
    )
  }

  const productImages = Array.isArray(product.image) ? product.image : []

  return (
    <div className="bg-gradient-to-b from-[#fff8f0] to-white min-h-screen">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <span className="hover:text-[#7a2828] cursor-pointer transition-colors">Home</span>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="hover:text-[#7a2828] cursor-pointer transition-colors">{product.category_name}</span>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-[#7a2828] font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images Section */}
          <div className="space-y-4">
            <div
              ref={imageContainerRef}
              className={`aspect-square overflow-hidden rounded-lg border bg-white relative ${
                isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
              } shadow-md hover:shadow-lg transition-shadow duration-300`}
              onClick={toggleZoom}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => isZoomed && setIsZoomed(false)}
            >
              {isZoomed ? (
                <div
                  className="absolute inset-0 bg-no-repeat"
                  style={{
                    backgroundImage: `url(${productImages[activeImage] || "/placeholder.svg"})`,
                    backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    backgroundSize: "250%",
                  }}
                />
              ) : (
                <>
                  <img
                    src={productImages[activeImage] || "/placeholder.svg"}
                    alt={product.name}
                    className="h-full w-full object-cover object-center transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow-md opacity-70 hover:opacity-100 transition-opacity duration-300">
                    <ZoomIn className="h-5 w-5 text-[#7a2828]" />
                  </div>
                </>
              )}
            </div>

            <div className="flex space-x-3 overflow-auto pb-2 scrollbar-hide">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  className={`relative h-20 w-20 overflow-hidden rounded-md border transition-all duration-300 ${
                    activeImage === index
                      ? "ring-2 ring-[#7a2828] shadow-md scale-105"
                      : "hover:ring-1 hover:ring-[#7a2828]/50 hover:shadow-sm"
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="h-full w-full object-cover object-center"
                  />
                </button>
              ))}
            </div>

            {/* Product Benefits */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="flex flex-col items-center bg-[#fff8f0] p-3 rounded-lg border border-[#f0e6d6] hover:border-[#e6d2b3] transition-colors">
                <Truck className="h-6 w-6 text-[#7a2828] mb-2" />
                <span className="text-xs text-center font-medium">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center bg-[#fff8f0] p-3 rounded-lg border border-[#f0e6d6] hover:border-[#e6d2b3] transition-colors">
                <RefreshCcw className="h-6 w-6 text-[#7a2828] mb-2" />
                <span className="text-xs text-center font-medium">14-Day Returns</span>
              </div>
              <div className="flex flex-col items-center bg-[#fff8f0] p-3 rounded-lg border border-[#f0e6d6] hover:border-[#e6d2b3] transition-colors">
                <Shield className="h-6 w-6 text-[#7a2828] mb-2" />
                <span className="text-xs text-center font-medium">Lifetime Warranty</span>
              </div>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="flex flex-col space-y-6">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge
                      variant="outline"
                      className="bg-[#7a2828]/10 text-[#7a2828] border-[#7a2828]/20 hover:bg-[#7a2828]/20"
                    >
                      {product.gold_color}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-[#7a2828]/10 text-[#7a2828] border-[#7a2828]/20 hover:bg-[#7a2828]/20"
                    >
                      {product.bis_hallmark}
                    </Badge>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">{product.name}</h1>
                  <div className="flex items-center mt-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < 4 ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">4.0 (24 reviews)</span>
                  </div>
                </div>
                <button
                  className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-all duration-300 group"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    navigator.clipboard.writeText(window.location.href)

                    // Show notification
                    const toast = document.createElement("div")
                    toast.className =
                      "fixed bottom-4 right-4 bg-gray-50 border-l-4 border-gray-500 text-gray-700 p-4 rounded-md shadow-lg transform transition-all duration-500 z-50 flex items-center"
                    toast.innerHTML = `
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                      </svg>
                      <span>Link copied to clipboard!</span>
                    `
                    document.body.appendChild(toast)

                    setTimeout(() => {
                      toast.classList.add("opacity-0", "translate-y-2")
                      setTimeout(() => document.body.removeChild(toast), 500)
                    }, 3000)
                  }}
                >
                  <Share2 className="h-5 w-5 text-gray-500 group-hover:text-[#7a2828] transition-colors" />
                </button>
              </div>

              <div className="mt-4 relative">
                <div className="flex items-end">
                  <p className="text-3xl font-bold text-[#7a2828]">
                    {selectedVariant ? formatPrice(selectedVariant.total_price) : formatPrice(product.price)}
                  </p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className="ml-2 text-gray-400 hover:text-[#7a2828] transition-colors"
                          onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
                        >
                          <Info className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Click to see price breakdown</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="mt-1 text-sm text-gray-500 flex items-center">
                  Including all taxes
                  <span className="inline-flex items-center ml-3 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    <Check className="h-3 w-3 mr-1" />
                    Free shipping
                  </span>
                </p>
              </div>
            </div>

            <Separator className="bg-[#e6d2b3]" />

            {/* Product Specifications */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1 group cursor-default">
                <p className="font-medium text-gray-500 group-hover:text-[#7a2828] transition-colors">Gold Color</p>
                <p className="group-hover:translate-x-1 transition-transform">{product.gold_color}</p>
              </div>
              <div className="space-y-1 group cursor-default">
                <p className="font-medium text-gray-500 group-hover:text-[#7a2828] transition-colors">Size</p>
                <p className="group-hover:translate-x-1 transition-transform">{product.size}</p>
              </div>
              <div className="space-y-1 group cursor-default">
                <p className="font-medium text-gray-500 group-hover:text-[#7a2828] transition-colors">Occasion</p>
                <p className="group-hover:translate-x-1 transition-transform">{product.occasion}</p>
              </div>
              <div className="space-y-1 group cursor-default">
                <p className="font-medium text-gray-500 group-hover:text-[#7a2828] transition-colors">Gender</p>
                <p className="group-hover:translate-x-1 transition-transform">{product.gender}</p>
              </div>
            </div>

            <Separator className="bg-[#e6d2b3]" />

            {/* Variant Selection */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium flex items-center">
                  Select Gross Weight
                  <span className="ml-1 text-xs text-gray-500">(affects price)</span>
                </label>
                <Select
                  defaultValue={selectedVariant?.gross_weight}
                  onValueChange={(value) => {
                    const variant = product.variants.find((v) => v.gross_weight === value)
                    setSelectedVariant(variant)
                    setQuantity(1)
                  }}
                >
                  <SelectTrigger className="mt-1 w-full border-[#e6d2b3] focus:ring-[#7a2828] focus:border-[#7a2828]">
                    <SelectValue placeholder="Select Gross Weight" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {product.variants.map((variant) => (
                      <SelectItem key={variant.id} value={variant.gross_weight}>
                        {variant.gross_weight} gm {variant.stock === 0 && "(Out of Stock)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Breakdown Card */}
              {selectedVariant && (
                <Card
                  className={`border-[#e6d2b3] overflow-hidden transition-all duration-500 ${
                    showPriceBreakdown ? "opacity-100 max-h-96" : "opacity-0 max-h-0"
                  }`}
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Gold Price (per gram)</span>
                      <span className="text-green-600">+ {formatPrice(selectedVariant.gold_price)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Gross Weight</span>
                      <span>{selectedVariant.gross_weight} gm</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Gold Value</span>
                      <span className="text-green-600">
                        + {formatPrice(selectedVariant.gold_price * selectedVariant.gross_weight)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Making Charge</span>
                      <span className="text-green-600">+ {formatPrice(selectedVariant.making_charge)}</span>
                    </div>
                    {Number.parseFloat(selectedVariant.stone_rate) > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Stone Rate</span>
                        <span className="text-green-600">+ {formatPrice(selectedVariant.stone_rate)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Subtotal</span>
                      <span>
                        {formatPrice(
                          selectedVariant.gold_price * selectedVariant.gross_weight +
                            selectedVariant.making_charge +
                            selectedVariant.stone_rate
                        )}
                      </span>
                    </div>
                    {selectedVariant.applied_offer.offer_percentage > 0 && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            Offer ({selectedVariant.applied_offer.offer_percentage}% -{" "}
                            {selectedVariant.applied_offer.offer_type})
                          </span>
                          <span className="text-red-600">
                            -{" "}
                            {formatPrice(
                              ((selectedVariant.gold_price * selectedVariant.gross_weight +
                                selectedVariant.making_charge +
                                selectedVariant.stone_rate) *
                                selectedVariant.applied_offer.offer_percentage) /
                                100
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Discounted Price</span>
                          <span>
                            {formatPrice(
                              (selectedVariant.gold_price * selectedVariant.gross_weight +
                                selectedVariant.making_charge +
                                selectedVariant.stone_rate) *
                                (1 - selectedVariant.applied_offer.offer_percentage / 100)
                            )}
                          </span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Tax ({selectedVariant.tax}%)</span>
                      <span className="text-green-600">
                        + {formatPrice(selectedVariant.total_price * (selectedVariant.tax / 100))}
                      </span>
                    </div>
                    {Number.parseFloat(selectedVariant.shipping) > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Shipping</span>
                        <span className="text-green-600">+ {formatPrice(selectedVariant.shipping)}</span>
                      </div>
                    )}
                    <Separator className="bg-[#e6d2b3]" />
                    <div className="flex justify-between items-center font-bold text-[#7a2828]">
                      <span>Total Price</span>
                      <span>{formatPrice(selectedVariant.total_price)}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quantity Selector */}
              {selectedVariant && selectedVariant.stock > 0 && (
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium">Quantity</label>
                  <div className="flex items-center">
                    <button
                      onClick={decrementQuantity}
                      className="p-2 border border-[#e6d2b3] rounded-l-md bg-white hover:bg-[#fff8f0] transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4 text-gray-600" />
                    </button>
                    <div className="px-4 py-2 border-t border-b border-[#e6d2b3] bg-white text-center min-w-[3rem]">
                      {quantity}
                    </div>
                    <button
                      onClick={incrementQuantity}
                      className="p-2 border border-[#e6d2b3] rounded-r-md bg-white hover:bg-[#fff8f0] transition-colors"
                      disabled={quantity >= selectedVariant.stock}
                    >
                      <Plus className="h-4 w-4 text-gray-600" />
                    </button>
                    <span className="ml-3 text-sm text-gray-500">{selectedVariant.stock} available</span>
                  </div>
                </div>
              )}

              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                {selectedVariant && selectedVariant.stock > 0 ? (
                  <>
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm text-green-600">In Stock ({selectedVariant.stock} available)</span>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-red-100">
                      <AlertCircle className="h-3 w-3 text-red-600" />
                    </div>
                    <span className="text-sm text-red-600">Out of Stock</span>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                className={`flex-1 bg-[#7a2828] hover:bg-[#5a1d1d] text-white transition-all duration-300 ${
                  isAddingToCart ? "opacity-90" : "hover:shadow-md"
                }`}
                size="lg"
                disabled={!selectedVariant || selectedVariant.stock === 0 || isAddingToCart}
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
                className={`border-[#7a2828] text-[#7a2828] hover:bg-[#7a2828]/10 transition-all duration-300 ${
                  isWishlisted ? "bg-[#7a2828]/10" : ""
                }`}
                onClick={toggleWishlist}
              >
                <Heart className={`mr-2 h-5 w-5 transition-all duration-300 ${isWishlisted ? "fill-[#7a2828]" : ""}`} />
                {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
              </Button>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6 border border-[#e6d2b3]">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start bg-[#fff8f0] p-1">
              <TabsTrigger
                value="description"
                className="data-[state=active]:bg-white data-[state=active]:text-[#7a2828] data-[state=active]:shadow-sm"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="data-[state=active]:bg-white data-[state=active]:text-[#7a2828] data-[state=active]:shadow-sm"
              >
                Product Details
              </TabsTrigger>
              <TabsTrigger
                value="shipping"
                className="data-[state=active]:bg-white data-[state=active]:text-[#7a2828] data-[state=active]:shadow-sm"
              >
                Shipping & Returns
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <div className="prose max-w-none">
                <p className="leading-relaxed text-gray-700">{product.description || "No description available."}</p>
                <p className="mt-4 leading-relaxed text-gray-700">
                  This exquisite piece is crafted with the finest materials and expert craftsmanship, ensuring both
                  beauty and durability. The {product.gold_color} finish adds a timeless elegance that complements any
                  outfit or occasion.
                </p>
                <div className="mt-6 p-4 bg-[#fff8f0] rounded-lg border border-[#e6d2b3]">
                  <h4 className="font-medium text-[#7a2828] mb-2">Care Instructions</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    <li>Store in a cool, dry place away from direct sunlight</li>
                    <li>Clean with a soft, lint-free cloth</li>
                    <li>Avoid contact with perfumes, lotions, and chemicals</li>
                    <li>Remove before swimming or bathing</li>
                    <li>Have your jewelry professionally cleaned once a year</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="details" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-lg text-[#7a2828] mb-3">Product Specifications</h3>
                    <div className="bg-white rounded-lg border border-[#e6d2b3] overflow-hidden">
                      <div className="grid grid-cols-2 text-sm border-b border-[#e6d2b3] hover:bg-[#fff8f0] transition-colors">
                        <div className="p-3 font-medium text-gray-600 border-r border-[#e6d2b3]">Gold Color</div>
                        <div className="p-3">{product.gold_color}</div>
                      </div>
                      <div className="grid grid-cols-2 text-sm border-b border-[#e6d2b3] hover:bg-[#fff8f0] transition-colors">
                        <div className="p-3 font-medium text-gray-600 border-r border-[#e6d2b3]">BIS Hallmark</div>
                        <div className="p-3">{product.bis_hallmark}</div>
                      </div>
                      <div className="grid grid-cols-2 text-sm border-b border-[#e6d2b3] hover:bg-[#fff8f0] transition-colors">
                        <div className="p-3 font-medium text-gray-600 border-r border-[#e6d2b3]">Size</div>
                        <div className="p-3">{product.size}</div>
                      </div>
                      <div className="grid grid-cols-2 text-sm border-b border-[#e6d2b3] hover:bg-[#fff8f0] transition-colors">
                        <div className="p-3 font-medium text-gray-600 border-r border-[#e6d2b3]">Occasion</div>
                        <div className="p-3">{product.occasion}</div>
                      </div>
                      <div className="grid grid-cols-2 text-sm hover:bg-[#fff8f0] transition-colors">
                        <div className="p-3 font-medium text-gray-600 border-r border-[#e6d2b3]">Gender</div>
                        <div className="p-3">{product.gender}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-lg text-[#7a2828] mb-3">Materials & Craftsmanship</h3>
                    <p className="text-gray-700 mb-4">
                      Each piece is meticulously crafted by our skilled artisans with decades of experience in
                      traditional jewelry making techniques.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#7a2828]/10 flex items-center justify-center mr-3">
                          <Check className="h-4 w-4 text-[#7a2828]" />
                        </div>
                        <div>
                          <h4 className="font-medium">Premium Materials</h4>
                          <p className="text-sm text-gray-600">Only the finest quality gold and gemstones are used</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#7a2828]/10 flex items-center justify-center mr-3">
                          <Check className="h-4 w-4 text-[#7a2828]" />
                        </div>
                        <div>
                          <h4 className="font-medium">Certified Quality</h4>
                          <p className="text-sm text-gray-600">BIS hallmarked for authenticity and quality assurance</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#7a2828]/10 flex items-center justify-center mr-3">
                          <Check className="h-4 w-4 text-[#7a2828]" />
                        </div>
                        <div>
                          <h4 className="font-medium">Handcrafted Excellence</h4>
                          <p className="text-sm text-gray-600">Each piece is handcrafted with attention to detail</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="shipping" className="mt-6">
              <div className="space-y-8">
                <div>
                  <h3 className="font-medium text-lg text-[#7a2828] mb-3 flex items-center">
                    <Truck className="h-5 w-5 mr-2" />
                    Shipping Information
                  </h3>
                  <div className="bg-[#fff8f0] rounded-lg p-4 border border-[#e6d2b3]">
                    <p className="mb-4 text-gray-700">
                      We offer free shipping on all orders above ₹10,000. Standard delivery takes 3-5 business days.
                      Express shipping options are available at checkout.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-start p-3 bg-white rounded-md border border-[#e6d2b3] hover:shadow-sm transition-all">
                        <div className="font-medium mr-2">Standard Shipping:</div>
                        <div className="text-gray-600">3-5 business days</div>
                      </div>
                      <div className="flex items-start p-3 bg-white rounded-md border border-[#e6d2b3] hover:shadow-sm transition-all">
                        <div className="font-medium mr-2">Express Shipping:</div>
                        <div className="text-gray-600">1-2 business days</div>
                      </div>
                      <div className="flex items-start p-3 bg-white rounded-md border border-[#e6d2b3] hover:shadow-sm transition-all">
                        <div className="font-medium mr-2">International:</div>
                        <div className="text-gray-600">7-14 business days</div>
                      </div>
                      <div className="flex items-start p-3 bg-white rounded-md border border-[#e6d2b3] hover:shadow-sm transition-all">
                        <div className="font-medium mr-2">Free Shipping:</div>
                        <div className="text-gray-600">Orders above ₹10,000</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-lg text-[#7a2828] mb-3 flex items-center">
                    <RefreshCcw className="h-5 w-5 mr-2" />
                    Returns & Exchanges
                  </h3>
                  <div className="bg-[#fff8f0] rounded-lg p-4 border border-[#e6d2b3]">
                    <p className="mb-4 text-gray-700">
                      We accept returns within 14 days of delivery. Items must be in original condition with all tags
                      attached. Please note that customized items cannot be returned unless there is a manufacturing
                      defect.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#7a2828]/10 flex items-center justify-center mr-3">
                          <Check className="h-3 w-3 text-[#7a2828]" />
                        </div>
                        <div className="text-sm text-gray-700">Easy returns within 14 days of delivery</div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#7a2828]/10 flex items-center justify-center mr-3">
                          <Check className="h-3 w-3 text-[#7a2828]" />
                        </div>
                        <div className="text-sm text-gray-700">Full refund or exchange options available</div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#7a2828]/10 flex items-center justify-center mr-3">
                          <Check className="h-3 w-3 text-[#7a2828]" />
                        </div>
                        <div className="text-sm text-gray-700">Lifetime warranty against manufacturing defects</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* You May Also Like Section */}
        <div className="mt-16 mb-8">
          <h2 className="text-2xl font-semibold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white rounded-lg shadow-sm overflow-hidden border border-[#e6d2b3] hover:shadow-md hover:border-[#7a2828]/30 transition-all duration-300 group"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src="/placeholder.svg"
                    alt="Related product"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/80 hover:bg-white border-none text-[#7a2828]"
                    >
                      Quick View
                    </Button>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm truncate group-hover:text-[#7a2828] transition-colors">
                    Similar Gold Jewelry
                  </h3>
                  <p className="text-[#7a2828] font-bold mt-1">₹24,999</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails