

// "use client"

// import { useEffect, useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { useWishlist } from "@/Context/WishlistContext"
// import { useNavigate } from "react-router-dom"
// import { useCart } from "@/Context/CartContext"
// import { Heart, ShoppingCart, Trash2, Package, Weight } from "lucide-react"
// import Swal from "sweetalert2"


// const showToast = (message, type = "success") => {
//   const toast = document.createElement("div")
//   const isError = type === "error"
//   const isSuccess = type === "success"

//   toast.className = `fixed top-4 right-4 p-4 rounded-lg shadow-xl transform transition-all duration-500 ease-in-out z-50 max-w-sm ${
//     isError
//       ? "bg-red-50 border border-red-200 text-red-800"
//       : isSuccess
//         ? "bg-green-50 border border-green-200 text-green-800"
//         : "bg-blue-50 border border-blue-200 text-blue-800"
//   }`

//   toast.innerHTML = `
//     <div class="flex items-center gap-3">
//       <div class="flex-shrink-0">
//         ${isError ? "❌" : isSuccess ? "✅" : "ℹ️"}
//       </div>
//       <div class="font-medium">${message}</div>
//     </div>
//   `

//   document.body.appendChild(toast)

//   setTimeout(() => {
//     toast.style.transform = "translateX(0)"
//     toast.style.opacity = "1"
//   }, 100)

//   setTimeout(() => {
//     toast.style.transform = "translateX(100%)"
//     toast.style.opacity = "0"
//     setTimeout(() => {
//       if (document.body.contains(toast)) {
//         document.body.removeChild(toast)
//       }
//     }, 500)
//   }, 3000)
// }


// const WishlistSkeleton = () => (
//   <div className="space-y-4">
//     {[1, 2, 3].map((i) => (
//       <Card key={i} className="overflow-hidden">
//         <CardContent className="p-6">
//           <div className="flex flex-col lg:flex-row gap-6">
//             <div className="w-full lg:w-48 h-48 bg-gray-200 rounded-lg animate-pulse" />
//             <div className="flex-grow space-y-3">
//               <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
//               <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
//               <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
//               <div className="flex gap-2 mt-4">
//                 <div className="h-10 bg-gray-200 rounded animate-pulse w-24" />
//                 <div className="h-10 bg-gray-200 rounded animate-pulse w-32" />
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     ))}
//   </div>
// )


// const EmptyWishlist = () => (
//   <div className="text-center py-16">
//     <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
//       <Heart className="w-12 h-12 text-gray-400" />
//     </div>
//     <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
//     <p className="text-gray-500 mb-6 max-w-md mx-auto">
//       Start adding items to your wishlist by clicking the heart icon on products you love.
//     </p>
//     <Button
//       onClick={() => (window.location.href = "/user/home")}
//       className="bg-gradient-to-r from-rose-700 to-red-900 hover:from-rose-600 hover:to-red-800 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
//     >
//       Continue Shopping
//     </Button>
//   </div>
// )

// export default function Wishlist() {
//   const [isRemove, setIsRemove] = useState(false)
//   const [processingItems, setProcessingItems] = useState(new Set())

//   const { wishlist, fetchWishlist, removeFromWishlist, loading, error } = useWishlist()
//   const navigate = useNavigate()
//   const { addToCart } = useCart()
//   const [quantity] = useState(1)

//   const BASE_URL = "http://127.0.0.1:8000"

//   useEffect(() => {
//     fetchWishlist()
//   }, [isRemove])

//   const handleAddToCart = async (variantId, quantity, event) => {
//     event.preventDefault()
//     event.stopPropagation()

//     setProcessingItems((prev) => new Set(prev).add(variantId))

//     try {
//       await addToCart(variantId, quantity)
//       showToast("Item added to cart successfully!", "success")
//       await removeFromWishlist(variantId)
//       showToast("Item moved from wishlist to cart!", "success")
//       setIsRemove(!isRemove)
//     } catch (error) {
//       console.error("Add to cart failed:", error)
//       showToast("Failed to add item to cart", "error")
//     } finally {
//       setProcessingItems((prev) => {
//         const newSet = new Set(prev)
//         newSet.delete(variantId)
//         return newSet
//       })
//     }
//   }

//   const handleRemoveItem = (itemId, productName) => {
//     Swal.fire({
//       title: "Remove from Wishlist?",
//       text: `Remove "${productName}" from your wishlist?`,
//       icon: "question",
//       showCancelButton: true,
//       confirmButtonColor: "#ef4444",
//       cancelButtonColor: "#6b7280",
//       confirmButtonText: "Yes, remove it",
//       cancelButtonText: "Keep it",
//       customClass: {
//         popup: "rounded-xl",
//         confirmButton: "rounded-lg",
//         cancelButton: "rounded-lg",
//       },
//     }).then((result) => {
//       if (result.isConfirmed) {
//         removeFromWishlist(itemId)
//         setIsRemove(!isRemove)
//         Swal.fire({
//           title: "Removed!",
//           text: `"${productName}" has been removed from your wishlist.`,
//           icon: "success",
//           confirmButtonColor: "#ef4444",
//           timer: 2000,
//           showConfirmButton: false,
//           customClass: {
//             popup: "rounded-xl",
//           },
//         })
//       }
//     })
//   }

//   if (loading) return <WishlistSkeleton />
//   if (error)
//     return (
//       <div className="text-center py-16">
//         <div className="text-red-500 text-lg font-medium mb-2">Oops! Something went wrong</div>
//         <p className="text-gray-500 mb-4">{error}</p>
//         <Button onClick={() => fetchWishlist()} variant="outline">
//           Try Again
//         </Button>
//       </div>
//     )
//   if (!wishlist || !wishlist.items || wishlist.items.length === 0) {
//     return (
//       <div className="container mx-auto px-4 py-8 max-w-6xl">
//         <EmptyWishlist />
//       </div>
//     )
//   }

//   const totalItems = wishlist.total_items || 0

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-6xl">
      
//       <div className="mb-8">
//         <div className="flex items-center gap-3 mb-2">
//           <Heart className="w-8 h-8 text-red-900 fill-current" />
//           <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
//         </div>
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Badge variant="secondary" className="bg-rose-100 text-rose-700 px-3 py-1">
//               {totalItems} {totalItems === 1 ? "item" : "items"}
//             </Badge>
//           </div>
//           <Button
//             variant="outline"
//             onClick={() => navigate("/user/home")}
//             className="hidden sm:flex items-center gap-2 hover:bg-gray-50"
//           >
//             <Package className="w-4 h-4" />
//             Continue Shopping
//           </Button>
//         </div>
//       </div>

    
//       <div className="space-y-6">
//         {wishlist.items.map((item) => (
//           <Card
//             key={item.id}
//             className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white rounded-2xl"
//           >
//             <CardContent className="p-0">
//               <div className="flex flex-col lg:flex-row">
//                 {/* Product Image */}
//                 <div className="w-full lg:w-64 h-64 lg:h-auto bg-gray-50 flex items-center justify-center p-4">
//                   <img
//                     src={`${BASE_URL}${item.product.images[0].url}`}
//                     alt={item.product.name}
//                     className="w-full h-full object-contain rounded-lg hover:scale-105 transition-transform duration-300"
//                   />
//                 </div>

//                 {/* Product Details */}
//                 <div className="flex-grow p-6">
//                   <div className="flex flex-col h-full">
//                     <div className="flex-grow">
//                       <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">{item.product.name}</h3>

//                       <p className="text-gray-600 mb-4 line-clamp-2">{item.product.description}</p>

//                       <div className="flex items-center gap-4 mb-4">
//                         <div className="flex items-center gap-2 text-sm text-gray-500">
//                           <Weight className="w-4 h-4" />
//                           <span>{item.variant.gross_weight}g</span>
//                         </div>
//                       </div>

//                       <div className="flex items-center justify-between mb-6">
//                         <div className="text-2xl font-bold text-green-600">
//                           ₹{item.variant.total_price.toLocaleString()}
//                         </div>
//                       </div>
//                     </div>

                  
//                     <div className="flex flex-col sm:flex-row gap-3">
//                       <Button
//                         onClick={(e) => handleAddToCart(item.variant.id, quantity, e)}
//                         disabled={loading || processingItems.has(item.variant.id)}
//                         className="flex-1 bg-gradient-to-r from-rose-900 to-red-800 hover:from-rose-600 hover:to-red-700 text-white font-medium py-3 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         <ShoppingCart className="w-4 h-4 mr-2" />
//                         {processingItems.has(item.variant.id) ? "Adding..." : "Add to Cart"}
//                       </Button>

//                       <Button
//                         variant="outline"
//                         onClick={() => handleRemoveItem(item.id, item.product.name)}
//                         disabled={loading}
//                         className="flex-1 sm:flex-none border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-medium py-3 px-6 rounded-xl transition-all duration-200"
//                       >
//                         <Trash2 className="w-4 h-4 mr-2" />
//                         Remove
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

   
//       <div className="mt-8 sm:hidden">
//         <Button
//           onClick={() => navigate("/user/home")}
//           className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium py-3 rounded-xl"
//         >
//           <Package className="w-4 h-4 mr-2" />
//           Continue Shopping
//         </Button>
//       </div>
//     </div>
//   )
// }


"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useWishlist } from "@/Context/WishlistContext"
import { useNavigate } from "react-router-dom"
import { useCart } from "@/Context/CartContext"
import { Heart, ShoppingCart, Trash2, Package, Weight } from "lucide-react"
import Swal from "sweetalert2"

const showToast = (message, type = "success") => {
  const toast = document.createElement("div")
  const isError = type === "error"
  const isSuccess = type === "success"

  toast.className = `fixed top-4 right-4 p-4 rounded-lg shadow-xl transform transition-all duration-500 ease-in-out z-50 max-w-sm ${
    isError
      ? "bg-red-50 border border-red-200 text-red-800"
      : isSuccess
        ? "bg-green-50 border border-green-200 text-green-800"
        : "bg-blue-50 border border-blue-200 text-blue-800"
  }`

  toast.innerHTML = `
    <div class="flex items-center gap-3">
      <div class="flex-shrink-0">
        ${isError ? "❌" : isSuccess ? "✅" : "ℹ️"}
      </div>
      <div class="font-medium">${message}</div>
    </div>
  `

  document.body.appendChild(toast)

  setTimeout(() => {
    toast.style.transform = "translateX(0)"
    toast.style.opacity = "1"
  }, 100)

  setTimeout(() => {
    toast.style.transform = "translateX(100%)"
    toast.style.opacity = "0"
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast)
      }
    }, 500)
  }, 3000)
}

const WishlistSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <Card key={i} className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-48 h-48 bg-gray-200 rounded-lg animate-pulse" />
            <div className="flex-grow space-y-3">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
              <div className="flex gap-2 mt-4">
                <div className="h-10 bg-gray-200 rounded animate-pulse w-24" />
                <div className="h-10 bg-gray-200 rounded animate-pulse w-32" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
)

const EmptyWishlist = () => (
  <div className="text-center py-16">
    <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
      <Heart className="w-12 h-12 text-gray-400" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
    <p className="text-gray-500 mb-6 max-w-md mx-auto">
      Start adding items to your wishlist by clicking the heart icon on products you love.
    </p>
    <Button
      onClick={() => (window.location.href = "/user/home")}
      className="bg-gradient-to-r from-rose-700 to-red-900 hover:from-rose-600 hover:to-red-800 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
    >
      Continue Shopping
    </Button>
  </div>
)

export default function Wishlist() {
  const [isRemove, setIsRemove] = useState(false)
  const [processingItems, setProcessingItems] = useState(new Set())

  const { wishlist, fetchWishlist, removeFromWishlist, loading, error } = useWishlist()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [quantity] = useState(1)

  const BASE_URL = "http://127.0.0.1:8000"

  useEffect(() => {
    fetchWishlist()
  }, [isRemove])

  const handleAddToCart = async (variantId, quantity, event) => {
    event.preventDefault()
    event.stopPropagation()
    console.log("#################",wishlist)
    setProcessingItems((prev) => new Set(prev).add(variantId))

    try {
      await addToCart(variantId, quantity)
      showToast("Item added to cart successfully!", "success")
      await removeFromWishlist(variantId)
      showToast("Item moved from wishlist to cart!", "success")
      setIsRemove(!isRemove)
    } catch (error) {
      console.error("Add to cart failed:", error)
      showToast("Failed to add item to cart", "error")
    } finally {
      setProcessingItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(variantId)
        return newSet
      })
    }
  }

  const handleRemoveItem = (itemId, productName) => {
    Swal.fire({
      title: "Remove from Wishlist?",
      text: `Remove "${productName}" from your wishlist?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, remove it",
      cancelButtonText: "Keep it",
      customClass: {
        popup: "rounded-xl",
        confirmButton: "rounded-lg",
        cancelButton: "rounded-lg",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        removeFromWishlist(itemId)
        setIsRemove(!isRemove)
        Swal.fire({
          title: "Removed!",
          text: `"${productName}" has been removed from your wishlist.`,
          icon: "success",
          confirmButtonColor: "#ef4444",
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: "rounded-xl",
          },
        })
      }
    })
  }

  if (loading) return <WishlistSkeleton />
  if (error)
    return (
      <div className="text-center py-16">
        <div className="text-red-500 text-lg font-medium mb-2">Oops! Something went wrong</div>
        <p className="text-gray-500 mb-4">{error}</p>
        <Button onClick={() => fetchWishlist()} variant="outline">
          Try Again
        </Button>
      </div>
    )
  if (!wishlist || !wishlist.items || wishlist.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <EmptyWishlist />
      </div>
    )
  }

  const totalItems = wishlist.total_items || 0
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="w-8 h-8 text-red-900 fill-current" />
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-rose-100 text-rose-700 px-3 py-1">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </Badge>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/user/home")}
            className="hidden sm:flex items-center gap-2 hover:bg-gray-50"
          >
            <Package className="w-4 h-4" />
            Continue Shopping
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {wishlist.items.map((item) => (
          <Card
            key={item.id}
            className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white rounded-2xl"
          >
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row">
                {/* Product Image */}
                <div className="w-full lg:w-64 h-64 lg:h-auto bg-gray-50 flex items-center justify-center p-4">
                  <img
                    src={`${BASE_URL}${item.product.images[0].url}`}
                    alt={item.product.name}
                    className="w-full h-full object-contain rounded-lg hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-grow p-6">
                  <div className="flex flex-col h-full">
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">{item.product.name}</h3>

                      <p className="text-gray-600 mb-4 line-clamp-2">{item.product.description}</p>

                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Weight className="w-4 h-4" />
                          <span>{item.variant.gross_weight}g</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-6">
                        <div className="text-2xl font-bold text-green-600">
                          ₹{item.variant.total_price.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      {item.product.available  && item.product.is_active  && item.variant.stock > 0 ? (
                        <Button
                          onClick={(e) => handleAddToCart(item.variant.id, quantity, e)}
                          disabled={loading || processingItems.has(item.variant.id)}
                          className="flex-1 bg-gradient-to-r from-rose-900 to-red-800 hover:from-rose-600 hover:to-red-700 text-white font-medium py-3 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          {processingItems.has(item.variant.id) ? "Adding..." : "Add to Cart"}
                        </Button>
                      ) : (
                        <Button
                          disabled={true}
                          className="flex-1 bg-gray-300 text-gray-600 font-medium py-3 rounded-xl cursor-not-allowed"
                        >
                          Unavailable
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        onClick={() => handleRemoveItem(item.id, item.product.name)}
                        disabled={loading}
                        className="flex-1 sm:flex-none border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-medium py-3 px-6 rounded-xl transition-all duration-200"
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
        ))}
      </div>

      <div className="mt-8 sm:hidden">
        <Button
          onClick={() => navigate("/user/home")}
          className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium py-3 rounded-xl"
        >
          <Package className="w-4 h-4 mr-2" />
          Continue Shopping
        </Button>
      </div>
    </div>
  )
}