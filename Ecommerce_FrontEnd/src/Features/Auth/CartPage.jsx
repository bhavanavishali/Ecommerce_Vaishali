

"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/Context/CartContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";


export default function ShoppingCart() {
  const { cart, fetchCart, updateQuantity, removeFromCart, loading, error } = useCart();
  const navigate = useNavigate();
  console.log("Cart Data:", cart);

  const BASE_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    if (!cart) {
      fetchCart();
    }
  }, [cart, fetchCart]);

  if (loading) return <div className="text-center py-10">Loading cart...</div>;
  if (error) return <div className="text-center py-10 text-red-600">Error: {error}</div>;
  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold mb-4">Your Cart is Empty</h2>
        <Button
          className="bg-[#8c2a2a] hover:bg-[#7a2424] text-white"
          onClick={() => navigate("/user/home")}
        >
          Shop Now
        </Button>
      </div>
    );
  }

  const totalItems = cart.total_items || 0;

  const handleIncreaseQuantity = (itemId, currentQuantity, stock) => {
    if (currentQuantity >= stock) {
      Swal.fire({
        icon: "warning",
        title: "Out of Stock!",
        text: "Sorry, this item is out of stock. You cannot add more.",
        confirmButtonText: "OK",
        confirmButtonColor: "#8c2a2a",
      });
    } else {
      updateQuantity(itemId, currentQuantity + 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>
      <div className="flex justify-between mb-6">
        <p className="text-base">Total ({totalItems} {totalItems === 1 ? "item" : "items"})</p>
        <p className="text-base font-medium">₹ {cart.final_total.toLocaleString("en-IN")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left side - Products */}
        <div className="md:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <Card key={item.id} className="overflow-hidden border rounded-md shadow-sm">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Product Image */}
                  <div className="w-full sm:w-32 h-32 flex-shrink-0">
                    <img
                      src={item.primary_image ? `${BASE_URL}${item.primary_image}` : "/placeholder-image.png"}
                      alt={item.product.name}
                      className="w-full h-full object-contain rounded"
                      onError={(e) => (e.target.src = "/placeholder-image.png")}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row justify-between">
                      <div className="flex-grow">
                        <h3 className="font-medium text-lg">{item.product.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">
                          Weight: {item.variant.gross_weight}g | Gold Color: {item.product.gold_color}
                        </p>
                        <p className="text-sm text-gray-500 mb-2">
                          Category: {item.product.category || "N/A"}
                        </p>

                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-sm">Quantity:</span>
                          <div className="flex items-center border rounded">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-r-none border-r-0"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={loading || item.quantity <= 1}
                            >
                              <span className="text-base">-</span>
                            </Button>
                            <div className="h-8 w-12 flex items-center justify-center border-t border-b">
                              {item.quantity}
                            </div>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-l-none border-l-0"
                              onClick={() => handleIncreaseQuantity(item.id, item.quantity, item.variant.stock)}
                              disabled={loading || item.quantity >= item.variant.stock}
                            >
                              <span className="text-base">+</span>
                            </Button>
                          </div>
                        </div>

                        <div className="text-sm text-gray-600">
                          <p>Subtotal: ₹ {item.variant.base_price.toLocaleString("en-IN")}</p>
                          <p>Discount: ₹ {item.variant.discount_amount.toLocaleString("en-IN")}</p>
                          <p>Tax: ₹ {item.variant.tax_amount.toLocaleString("en-IN")}</p>
                        </div>
                      </div>

                      <div className="mt-4 sm:mt-0 flex flex-col items-end justify-between">
                        <span className="text-green-600 font-medium text-lg">
                          ₹ {item.variant.total_price.toLocaleString("en-IN")}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-red-600 text-white border border-red-600 hover:bg-red-700 hover:text-white mt-4"
                          onClick={() => removeFromCart(item.id)}
                          disabled={loading}
                        >
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

        {/* Right side - Order Summary */}
        <div className="space-y-4">
          <Card className="border rounded-md shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-medium text-lg mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-medium">₹ {cart.final_subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span className="font-medium text-green-600">
                    -₹ {cart.final_discount.toLocaleString("en-IN")}
                  </span>
                </div>
                    <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="font-medium">₹ {cart.shipping.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span className="font-medium">₹ {cart.final_tax.toLocaleString("en-IN")}</span>
                </div>
             
                <div className="flex justify-between font-medium text-lg border-t pt-3">
                  <span>Total:</span>
                  <span>₹ {cart.final_total.toLocaleString("en-IN")}</span>
                </div>
                <p className="text-xs text-right text-gray-500 mt-2">(Inclusive of all taxes)</p>
                <Button
                  className="w-full mt-4 bg-[#8c2a2a] hover:bg-[#7a2424] text-white"
                  onClick={() => navigate("/checkoutpage")}
                  disabled={loading || cart.items.length === 0}
                >
                  Place Order
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// "use client"

// import { useEffect, useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { useCart } from "@/Context/CartContext"
// import { useNavigate } from "react-router-dom"
// import Swal from "sweetalert2"
// import { Trash2, ShoppingBag, ChevronLeft, Plus, Minus, ArrowRight, Gift, Truck,Receipt } from "lucide-react"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { Skeleton } from "@/components/ui/skeleton"

// export default function ShoppingCart() {
//   const { cart, fetchCart, updateQuantity, removeFromCart, loading, error } = useCart()
//   const navigate = useNavigate()
//   const [isRemoving, setIsRemoving] = useState(null)
//   const [isUpdating, setIsUpdating] = useState(null)

//   const BASE_URL = "http://127.0.0.1:8000"

//   useEffect(() => {
//     if (!cart) {
//       fetchCart()
//     }
//   }, [cart, fetchCart])

//   // Function to handle quantity increase with stock check
//   const handleIncreaseQuantity = async (itemId, currentQuantity, stock) => {
//     if (currentQuantity + 1 > stock) {
//       Swal.fire({
//         icon: "warning",
//         title: "Out of Stock!",
//         text: "Sorry, this item is out of stock. You cannot add more.",
//         confirmButtonText: "OK",
//         confirmButtonColor: "#7a2828",
//         background: "#fffbf0",
//         iconColor: "#7a2828",
//       })
//     } else {
//       setIsUpdating(itemId)
//       await updateQuantity(itemId, currentQuantity + 1)
//       setIsUpdating(null)
//     }
//   }

//   const handleDecreaseQuantity = async (itemId, currentQuantity) => {
//     if (currentQuantity > 1) {
//       setIsUpdating(itemId)
//       await updateQuantity(itemId, currentQuantity - 1)
//       setIsUpdating(null)
//     }
//   }

//   const handleRemoveItem = async (itemId) => {
//     setIsRemoving(itemId)
//     await removeFromCart(itemId)
//     setIsRemoving(null)
//   }

//   if (loading) {
//     return (
//       <div className="container mx-auto px-4 py-12 max-w-6xl">
//         <div className="space-y-6">
//           <div className="space-y-2">
//             <Skeleton className="h-8 w-48" />
//             <div className="flex justify-between">
//               <Skeleton className="h-5 w-32" />
//               <Skeleton className="h-5 w-24" />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="md:col-span-2 space-y-4">
//               {[1, 2, 3].map((i) => (
//                 <Card key={i} className="overflow-hidden border border-[#e9d9b6]">
//                   <CardContent className="p-4">
//                     <div className="flex gap-4">
//                       <Skeleton className="w-32 h-32" />
//                       <div className="flex-grow space-y-2">
//                         <Skeleton className="h-6 w-3/4" />
//                         <Skeleton className="h-4 w-1/4" />
//                         <Skeleton className="h-8 w-32" />
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//             <div>
//               <Card className="border border-[#e9d9b6]">
//                 <CardContent className="p-6 space-y-4">
//                   <Skeleton className="h-6 w-32" />
//                   <div className="space-y-2">
//                     <div className="flex justify-between">
//                       <Skeleton className="h-4 w-20" />
//                       <Skeleton className="h-4 w-16" />
//                     </div>
//                     <div className="flex justify-between">
//                       <Skeleton className="h-4 w-20" />
//                       <Skeleton className="h-4 w-16" />
//                     </div>
//                     <div className="flex justify-between">
//                       <Skeleton className="h-5 w-20" />
//                       <Skeleton className="h-5 w-20" />
//                     </div>
//                     <Skeleton className="h-10 w-full mt-4" />
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto px-4 py-12 max-w-6xl">
//         <Card className="border border-[#e9d9b6] bg-red-50">
//           <CardContent className="p-8 text-center">
//             <div className="text-[#7a2828] mb-4 flex justify-center">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="48"
//                 height="48"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <circle cx="12" cy="12" r="10"></circle>
//                 <line x1="12" y1="8" x2="12" y2="12"></line>
//                 <line x1="12" y1="16" x2="12.01" y2="16"></line>
//               </svg>
//             </div>
//             <h3 className="text-xl font-medium text-[#7a2828] mb-2">Error Loading Cart</h3>
//             <p className="text-[#7a2828]/80 mb-6">{error}</p>
//             <Button
//               onClick={() => fetchCart()}
//               className="bg-[#7a2828] hover:bg-[#5e1e1e] text-white transition-all duration-300"
//             >
//               Try Again
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   if (!cart || cart.items?.length === 0) {
//     return (
//       <div className="container mx-auto px-4 py-12 max-w-6xl">
//         <Card className="border border-[#e9d9b6] bg-gradient-to-b from-[#fffbf0] to-[#fff9e6]">
//           <CardContent className="p-8 text-center">
//             <div className="text-[#d4b78c] mb-6 flex justify-center">
//               <ShoppingBag size={64} />
//             </div>
//             <h3 className="text-2xl font-medium text-[#7a2828] mb-2">Your Cart is Empty</h3>
//             <p className="text-[#a67c52] mb-6">Looks like you haven't added anything to your cart yet.</p>
//             <Button
//               onClick={() => navigate("/")}
//               className="bg-[#7a2828] hover:bg-[#5e1e1e] text-white transition-all duration-300 shadow-md hover:shadow-lg"
//             >
//               <ChevronLeft className="mr-2 h-4 w-4" /> Continue Shopping
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   const totalItems = cart.items.length || 0

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-6xl">
//       <div className="mbsti-8">
//         <h1 className="text-2xl md:text-3xl font-serif text-[#7a2828] mb-2">Shopping Cart</h1>
//         <div className="flex justify-between items-center">
//           <p className="text-[#a67c52]">
//             <span className="font-medium">{totalItems}</span> {totalItems === 1 ? "item" : "items"} in your cart
//           </p>
//           <Button
//             variant="ghost"
//             className="text-[#7a2828] hover:text-[#5e1e1e] hover:bg-[#f8f0dd] transition-all duration-300"
//             onClick={() => navigate("/")}
//           >
//             <ChevronLeft className="mr-1 h-4 w-4" /> Continue Shopping
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//         {/* Left side - Products */}
//         <div className="md:col-span-2 space-y-6">
//           {cart.items.map((item) => (
//             <Card
//               key={item.id}
//               className="overflow-hidden border border-[#e9d9b6] hover:border-[#d4b78c] transition-all duration-300 bg-gradient-to-b from-[#fffbf0] to-[#fff9e6] shadow-sm hover:shadow-md"
//             >
//               <CardContent className="p-6">
//                 <div className="flex flex-col sm:flex-row gap-6">
//                   {/* Product Image */}
//                   <div className="w-full sm:w-36 h-36 flex-shrink-0 bg-white rounded-md p-2 border border-[#e9d9b6] overflow-hidden group">
//                     <img
//                       src={`${BASE_URL}${item.primary_image}`}
//                       alt={item.product.name}
//                       className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
//                     />
//                   </div>

//                   {/* Product Details */}
//                   <div className="flex-grow">
//                     <div className="flex flex-col sm:flex-row justify-between">
//                       <div className="flex-grow">
//                         <div className="flex justify-between">
//                           <h3 className="font-medium text-lg text-[#7a2828]">{item.product.name}</h3>
//                           <div className="sm:hidden">
//                             <span className="text-[#7a2828] font-medium">₹ {item.final_price.toLocaleString()}</span>
//                           </div>
//                         </div>

//                         <div className="flex flex-wrap gap-2 mt-1 mb-3">
//                           <Badge variant="outline" className="bg-[#f8f0dd] text-[#a67c52] border-[#e9d9b6] font-normal">
//                             Weight: {item.variant.gross_weight}g
//                           </Badge>

//                           {item.variant.stock < 10 && (
//                             <Badge className="bg-[#7a2828]/10 text-[#7a2828] border-[#7a2828]/20 font-normal">
//                               Only {item.variant.stock} left
//                             </Badge>
//                           )}
//                         </div>

//                         <div className="flex items-center gap-3 mb-4">
//                           <span className="text-sm text-[#a67c52]">Quantity: </span>
//                           <div className="flex items-center">
//                             <Button
//                               variant="outline"
//                               size="icon"
//                               className="h-8 w-8 rounded-r-none border-r-0 border-[#e9d9b6] hover:border-[#d4b78c] hover:bg-[#f8f0dd] text-[#7a2828] transition-all duration-300"
//                               onClick={() => handleDecreaseQuantity(item.id, item.quantity)}
//                               disabled={loading || item.quantity <= 1 || isUpdating === item.id}
//                             >
//                               <Minus className="h-3 w-3" />
//                             </Button>
//                             <div className="h-8 w-10 flex items-center justify-center border border-[#e9d9b6] bg-white text-[#7a2828]">
//                               {isUpdating === item.id ? (
//                                 <div className="h-3 w-3 rounded-full border-2 border-[#7a2828] border-t-transparent animate-spin"></div>
//                               ) : (
//                                 item.quantity
//                               )}
//                             </div>
//                             <Button
//                               variant="outline"
//                               size="icon"
//                               className="h-8 w-8 rounded-l-none border-l-0 border-[#e9d9b6] hover:border-[#d4b78c] hover:bg-[#f8f0dd] text-[#7a2828] transition-all duration-300"
//                               onClick={() => handleIncreaseQuantity(item.id, item.quantity, item.variant.stock)}
//                               disabled={loading || isUpdating === item.id}
//                             >
//                               <Plus className="h-3 w-3" />
//                             </Button>
//                           </div>
//                         </div>

//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           className="text-[#7a2828]/70 hover:text-[#7a2828] hover:bg-[#7a2828]/10 transition-all duration-300 text-xs"
//                           onClick={() => handleRemoveItem(item.id)}
//                           disabled={loading || isRemoving === item.id}
//                         >
//                           {isRemoving === item.id ? (
//                             <div className="h-3 w-3 rounded-full border-2 border-[#7a2828] border-t-transparent animate-spin mr-2"></div>
//                           ) : (
//                             <Trash2 className="h-3 w-3 mr-1" />
//                           )}
//                           Remove
//                         </Button>
//                       </div>

//                       <div className="hidden sm:flex flex-col items-end justify-between">
//                         {item.final_subtotal > item.final_total ? (
//                           <div className="flex flex-col items-end">
//                             <span className="text-[#a67c52] line-through text-sm">₹ {item.base_price.toLocaleString()}</span>
//                             <span className="text-[#7a2828] font-medium text-lg">₹ {item.total_price.toLocaleString()}</span>
//                             <span className="text-green-600 text-xs">
//                               Save ₹ {(item.final_subtotal - item.final_total).toLocaleString()}
//                             </span>
//                           </div>
//                         ) : (
//                           <span className="text-[#7a2828] font-medium text-lg">
//                       ₹ {Number(item.total_price ).toLocaleString('en-IN')}
//                       </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {/* Right side - Order Summary */}
//         <div className="space-y-6">
//           <Card className="border border-[#e9d9b6] bg-gradient-to-b from-[#fffbf0] to-[#fff9e6] shadow-sm sticky top-4">
//             <CardContent className="p-6">
//               <h3 className="font-serif text-xl text-[#7a2828] mb-6">Order Summary</h3>

//               <div className="space-y-4">
//                 <div className="flex justify-between text-[#a67c52]">
//                   <span>Subtotal</span>
//                   <span>
//                ₹ {cart.final_subtotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
//                 </span>
//                 </div>

//                 {cart.final_discount > 0 && (
//                   <div className="flex justify-between">
//                     <span className="flex items-center text-green-600">
//                       <Gift className="h-4 w-4 mr-1" /> Discount
//                     </span>
//                        ₹ {cart.final_discount .toLocaleString('en-IN', { maximumFractionDigits: 2 })}
//                   </div>
//                 )}
//                 {cart.final_tax > 0 && (
//                   <div className="flex justify-between text-[#a67c52] ">
//                     <span className="flex items-center  ">
//                       <Receipt className="h-4 w-4 mr-1" /> Tax
//                     </span>
//                       ₹  {cart.final_tax.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
//                   </div>
//                 )}
                
                 
//                 {cart.shipping > 0 && (
//                   <div className="flex justify-between text-[#a67c52]">
//                     <span className="flex items-center ">
//                       <Truck className="h-4 w-4 mr-1" /> Shipping
//                     </span>
//                      ₹ <span> {cart.shipping .toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
//                   </div>
//                 )}

//                 <Separator className="bg-[#e9d9b6]" />

//                 <div className="flex justify-between font-medium text-lg text-[#7a2828]">
//                   <span>TOTAL</span>
//                   <span>₹ {cart.final_total.toLocaleString()}</span>
//                 </div>

//                 <p className="text-xs text-right text-[#a67c52]">(Inclusive of all taxes)</p>

//                 <Button
//                   className="w-full mt-2 bg-[#7a2828] hover:bg-[#5e1e1e] text-white transition-all duration-300 shadow-md hover:shadow-lg"
//                   onClick={() => navigate("/checkoutpage")}
//                 >
//                   CHECKOUT <ArrowRight className="ml-2 h-4 w-4" />
//                 </Button>

//                 <div className="mt-4 text-xs text-[#a67c52] space-y-2">
//                   <div className="flex items-center">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="16"
//                       height="16"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       className="mr-2"
//                     >
//                       <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
//                     </svg>
//                     <span>Secure checkout</span>
//                   </div>
//                   <div className="flex items-center">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="16"
//                       height="16"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       className="mr-2"
//                     >
//                       <rect width="20" height="12" x="2" y="6" rx="2" />
//                       <circle cx="12" cy="12" r="2" />
//                       <path d="M6 12h.01M18 12h.01" />
//                     </svg>
//                     <span>We accept all major credit cards</span>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="border border-[#e9d9b6] bg-[#f8f0dd]/50">
//             <CardContent className="p-4">
//               <div className="flex items-start">
//                 <div className="mr-3 text-[#7a2828]">
//                   <Gift className="h-5 w-5" />
//                 </div>
//                 <div>
//                   <h4 className="font-medium text-[#7a2828] text-sm">Have a promo code?</h4>
//                   <p className="text-xs text-[#a67c52]">You'll be able to apply it at checkout</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }


// "use client"

// import { useEffect, useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { useCart } from "@/Context/CartContext"
// import { useNavigate } from "react-router-dom"
// import Swal from "sweetalert2"
// import { Trash2, ShoppingBag, ChevronLeft, Plus, Minus, ArrowRight, Gift, Truck, Receipt } from "lucide-react"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { Skeleton } from "@/components/ui/skeleton"

// export default function ShoppingCart() {
//   const { cart, fetchCart, updateQuantity, removeFromCart, loading, error } = useCart()
//   const navigate = useNavigate()
//   const [isRemoving, setIsRemoving] = useState(null)
//   const [isUpdating, setIsUpdating] = useState(null)

//   const BASE_URL = "http://127.0.0.1:8000"

//   useEffect(() => {
//     if (!cart) {
//       fetchCart()
//     }
//   }, [cart, fetchCart,updateQuantity,loading])

//   const handleIncreaseQuantity = async (itemId, currentQuantity, stock) => {
//     if (currentQuantity + 1 > stock) {
//       Swal.fire({
//         icon: "warning",
//         title: "Out of Stock!",
//         text: "Sorry, this item is out of stock. You cannot add more.",
//         confirmButtonText: "OK",
//         confirmButtonColor: "#7a2828",
//         background: "#fffbf0",
//         iconColor: "#7a2828",
//       })
//     } else {
//       setIsUpdating(itemId)
//       await updateQuantity(itemId, currentQuantity + 1)
//       setIsUpdating(null)
//     }
//   }

//   const handleDecreaseQuantity = async (itemId, currentQuantity) => {
//     if (currentQuantity > 1) {
//       setIsUpdating(itemId)
//       await updateQuantity(itemId, currentQuantity - 1)
//       setIsUpdating(null)
//     }
//   }

//   const handleRemoveItem = async (itemId) => {
//     setIsRemoving(itemId)
//     await removeFromCart(itemId)
//     setIsRemoving(null)
//   }

//   const formatPrice = (price) => {
//     // Convert price to number if it's a string, and provide fallback
//     const numericPrice = Number(price) || 0
//     return numericPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
//   }

//   if (loading) {
//     return (
//       <div className="container mx-auto px-4 py-12 max-w-6xl">
//         <div className="space-y-6">
//           <div className="space-y-2">
//             <Skeleton className="h-8 w-48" />
//             <div className="flex justify-between">
//               <Skeleton className="h-5 w-32" />
//               <Skeleton className="h-5 w-24" />
//             </div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="md:col-span-2 space-y-4">
//               {[1, 2, 3].map((i) => (
//                 <Card key={i} className="overflow-hidden border border-[#e9d9b6]">
//                   <CardContent className="p-4">
//                     <div className="flex gap-4">
//                       <Skeleton className="w-32 h-32" />
//                       <div className="flex-grow space-y-2">
//                         <Skeleton className="h-6 w-3/4" />
//                         <Skeleton className="h-4 w-1/4" />
//                         <Skeleton className="h-8 w-32" />
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//             <div>
//               <Card className="border border-[#e9d9b6]">
//                 <CardContent className="p-6 space-y-4">
//                   <Skeleton className="h-6 w-32" />
//                   <div className="space-y-2">
//                     <div className="flex justify-between">
//                       <Skeleton className="h-4 w-20" />
//                       <Skeleton className="h-4 w-16" />
//                     </div>
//                     <div className="flex justify-between">
//                       <Skeleton className="h-4 w-20" />
//                       <Skeleton className="h-4 w-16" />
//                     </div>
//                     <div className="flex justify-between">
//                       <Skeleton className="h-5 w-20" />
//                       <Skeleton className="h-5 w-20" />
//                     </div>
//                     <Skeleton className="h-10 w-full mt-4" />
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto px-4 py-12 max-w-6xl">
//         <Card className="border border-[#e9d9b6] bg-red-50">
//           <CardContent className="p-8 text-center">
//             <div className="text-[#7a2828] mb-4 flex justify-center">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="48"
//                 height="48"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <circle cx="12" cy="12" r="10"></circle>
//                 <line x1="12" y1="8" x2="12" y2="12"></line>
//                 <line x1="12" y1="16" x2="12.01" y2="16"></line>
//               </svg>
//             </div>
//             <h3 className="text-xl font-medium text-[#7a2828] mb-2">Error Loading Cart</h3>
//             <p className="text-[#7a2828]/80 mb-6">{error}</p>
//             <Button
//               onClick={() => fetchCart()}
//               className="bg-[#7a2828] hover:bg-[#5e1e1e] text-white transition-all duration-300"
//             >
//               Try Again
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   if (!cart || cart.items?.length === 0) {
//     return (
//       <div className="container mx-auto px-4 py-12 max-w-6xl">
//         <Card className="border border-[#e9d9b6] bg-gradient-to-b from-[#fffbf0] to-[#fff9e6]">
//           <CardContent className="p-8 text-center">
//             <div className="text-[#d4b78c] mb-6 flex justify-center">
//               <ShoppingBag size={64} />
//             </div>
//             <h3 className="text-2xl font-medium text-[#7a2828] mb-2">Your Cart is Empty</h3>
//             <p className="text-[#a67c52] mb-6">Looks like you haven't added anything to your cart yet.</p>
//             <Button
//               onClick={() => navigate("/")}
//               className="bg-[#7a2828] hover:bg-[#5e1e1e] text-white transition-all duration-300 shadow-md hover:shadow-lg"
//             >
//               <ChevronLeft className="mr-2 h-4 w-4" /> Continue Shopping
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   const totalItems = cart.items.length || 0

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-6xl">
//       <div className="mb-8">
//         <h1 className="text-2xl md:text-3xl font-serif text-[#7a2828] mb-2">Shopping Cart</h1>
//         <div className="flex justify-between items-center">
//           <p className="text-[#a67c52]">
//             <span className="font-medium">{totalItems}</span> {totalItems === 1 ? "item" : "items"} in your cart
//           </p>
//           <Button
//             variant="ghost"
//             className="text-[#7a2828] hover:text-[#5e1e1e] hover:bg-[#f8f0dd] transition-all duration-300"
//             onClick={() => navigate("/")}
//           >
//             <ChevronLeft className="mr-1 h-4 w-4" /> Continue Shopping
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//         {/* Left side - Products */}
//         <div className="md:col-span-2 space-y-6">
//           {cart.items.map((item) => (
//             <Card
//               key={item.id}
//               className="overflow-hidden border border-[#e9d9b6] hover:border-[#d4b78c] transition-all duration-300 bg-gradient-to-b from-[#fffbf0] to-[#fff9e6] shadow-sm hover:shadow-md"
//             >
//               <CardContent className="p-6">
//                 <div className="flex flex-col sm:flex-row gap-6">
//                   {/* Product Image */}
//                   <div className="w-full sm:w-36 h-36 flex-shrink-0 bg-white rounded-md p-2 border border-[#e9d9b6] overflow-hidden group">
//                     <img
//                       src={`${BASE_URL}${item.primary_image}`}
//                       alt={item.product.name}
//                       className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
//                     />
//                   </div>

//                   {/* Product Details */}
//                   <div className="flex-grow">
//                     <div className="flex flex-col sm:flex-row justify-between">
//                       <div className="flex-grow">
//                         <div className="flex justify-between">
//                           <h3 className="font-medium text-lg text-[#7a2828]">{item.product.name}</h3>
//                           <div className="sm:hidden">
//                             <span className="text-[#7a2828] font-medium">₹ {formatPrice(item.final_price)}</span>
//                           </div>
//                         </div>

//                         <div className="flex flex-wrap gap-2 mt-1 mb-3">
//                           <Badge variant="outline" className="bg-[#f8f0dd] text-[#a67c52] border-[#e9d9b6] font-normal">
//                             Weight: {item.variant.gross_weight}g
//                           </Badge>
//                           {item.variant.stock < 10 && (
//                             <Badge className="bg-[#7a2828]/10 text-[#7a2828] border-[#7a2828]/20 font-normal">
//                               Only {item.variant.stock} left
//                             </Badge>
//                           )}
//                         </div>

//                         <div className="flex items-center gap-3 mb-4">
//                           <span className="text-sm text-[#a67c52]">Quantity: </span>
//                           <div className="flex items-center">
//                             <Button
//                               variant="outline"
//                               size="icon"
//                               className="h-8 w-8 rounded-r-none border-r-0 border-[#e9d9b6] hover:border-[#d4b78c] hover:bg-[#f8f0dd] text-[#7a2828] transition-all duration-300"
//                               onClick={() => handleDecreaseQuantity(item.id, item.quantity)}
//                               disabled={loading || item.quantity <= 1 || isUpdating === item.id}
//                             >
//                               <Minus className="h-3 w-3" />
//                             </Button>
//                             <div className="h-8 w-10 flex items-center justify-center border border-[#e9d9b6] bg-white text-[#7a2828]">
//                               {isUpdating === item.id ? (
//                                 <div className="h-3 w-3 rounded-full border-2 border-[#7a2828] border-t-transparent animate-spin"></div>
//                               ) : (
//                                 item.quantity
//                               )}
//                             </div>
//                             <Button
//                               variant="outline"
//                               size="icon"
//                               className="h-8 w-8 rounded-l-none border-l-0 border-[#e9d9b6] hover:border-[#d4b78c] hover:bg-[#f8f0dd] text-[#7a2828] transition-all duration-300"
//                               onClick={() => handleIncreaseQuantity(item.id, item.quantity, item.variant.stock)}
//                               disabled={loading || isUpdating === item.id}
//                             >
//                               <Plus className="h-3 w-3" />
//                             </Button>
//                           </div>
//                         </div>

//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           className="text-[#7a2828]/70 hover:text-[#7a2828] hover:bg-[#7a2828]/10 transition-all duration-300 text-xs"
//                           onClick={() => handleRemoveItem(item.id)}
//                           disabled={loading || isRemoving === item.id}
//                         >
//                           {isRemoving === item.id ? (
//                             <div className="h-3 w-3 rounded-full border-2 border-[#7a2828] border-t-transparent animate-spin mr-2"></div>
//                           ) : (
//                             <Trash2 className="h-3 w-3 mr-1" />
//                           )}
//                           Remove
//                         </Button>
//                       </div>

//                       <div className="hidden sm:flex flex-col items-end justify-between">
//                         {item.subtotal > item.final_price ? (
//                           <div className="flex flex-col items-end">
//                             <span className="text-[#a67c52] line-through text-sm">₹ {formatPrice(item.subtotal)}</span>
//                             <span className="text-[#7a2828] font-medium text-lg">₹ {formatPrice(item.final_price)}</span>
//                             <span className="text-green-600 text-xs">
//                               Save ₹ {formatPrice(item.subtotal - item.final_price)}
//                             </span>
//                           </div>
//                         ) : (
//                           <span className="text-[#7a2828] font-medium text-lg">₹ {formatPrice(item.final_price)}</span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {/* Right side - Order Summary */}
//         <div className="space-y-6">
//           <Card className="border border-[#e9d9b6] bg-gradient-to-b from-[#fffbf0] to-[#fff9e6] shadow-sm sticky top-4">
//             <CardContent className="p-6">
//               <h3 className="font-serif text-xl text-[#7a2828] mb-6">Order Summary</h3>
//               <div className="space-y-4">
//                 <div className="flex justify-between text-[#a67c52]">
//                   <span>Subtotal</span>
//                   <span>₹ {formatPrice(cart.final_subtotal)}</span>
//                 </div>
//                 {cart.final_discount > 0 && (
//                   <div className="flex justify-between">
//                     <span className="flex items-center text-green-600">
//                       <Gift className="h-4 w-4 mr-1" /> Discount
//                     </span>
//                     <span>₹ {formatPrice(cart.final_discount)}</span>
//                   </div>
//                 )}
//                 {cart.final_tax > 0 && (
//                   <div className="flex justify-between text-[#a67c52]">
//                     <span className="flex items-center">
//                       <Receipt className="h-4 w-4 mr-1" /> Tax
//                     </span>
//                     <span>₹ {formatPrice(cart.final_tax)}</span>
//                   </div>
//                 )}
//                 {cart.shipping > 0 && (
//                   <div className="flex justify-between text-[#a67c52]">
//                     <span className="flex items-center">
//                       <Truck className="h-4 w-4 mr-1" /> Shipping
//                     </span>
//                     <span>₹ {formatPrice(cart.shipping)}</span>
//                   </div>
//                 )}
//                 <Separator className="bg-[#e9d9b6]" />
//                 <div className="flex justify-between font-medium text-lg text-[#7a2828]">
//                   <span>TOTAL</span>
//                   <span>₹ {formatPrice(cart.final_total)}</span>
//                 </div>
//                 <p className="text-xs text-right text-[#a67c52]">(Inclusive of all taxes)</p>
//                 <Button
//                   className="w-full mt-2 bg-[#7a2828] hover:bg-[#5e1e1e] text-white transition-all duration-300 shadow-md hover:shadow-lg"
//                   onClick={() => navigate("/checkoutpage")}
//                 >
//                   CHECKOUT <ArrowRight className="ml-2 h-4 w-4" />
//                 </Button>
//                 <div className="mt-4 text-xs text-[#a67c52] space-y-2">
//                   <div className="flex items-center">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="16"
//                       height="16"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       className="mr-2"
//                     >
//                       <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
//                     </svg>
//                     <span>Secure checkout</span>
//                   </div>
//                   <div className="flex items-center">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="16"
//                       height="16"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       className="mr-2"
//                     >
//                       <rect width="20" height="12" x="2" y="6" rx="2" />
//                       <circle cx="12" cy="12" r="2" />
//                       <path d="M6 12h.01M18 12h.01" />
//                     </svg>
//                     <span>We accept all major credit cards</span>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//           <Card className="border border-[#e9d9b6] bg-[#f8f0dd]/50">
//             <CardContent className="p-4">
//               <div className="flex items-start">
//                 <div className="mr-3 text-[#7a2828]">
//                   <Gift className="h-5 w-5" />
//                 </div>
//                 <div>
//                   <h4 className="font-medium text-[#7a2828] text-sm">Have a promo code?</h4>
//                   <p className="text-xs text-[#a67c52]">You'll be able to apply it at checkout</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }