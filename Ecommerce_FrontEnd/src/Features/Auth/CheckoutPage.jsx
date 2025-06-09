

// "use client"

// import { useState, useEffect } from "react"
// import { useCart } from "@/Context/CartContext"
// import { Link, useNavigate } from "react-router-dom"
// import api from "../../api"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Separator } from "@/components/ui/separator"
// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import {
//   ArrowLeft,
//   MapPin,
//   Plus,
//   Home,
//   Building,
//   Edit,
//   Trash2,
//   Tag,
//   ChevronRight,
//   ShieldCheck,
//   CreditCard,
//   Wallet,
//   Copy,
//   Gift,
//   Truck,
//   Star,
//   XCircle,
//   AlertTriangle,
// } from "lucide-react"
// import AddressDialog from "./AddressDialog"

// export default function CheckoutPage() {
//   const { cart, fetchCart, clearCart, loading: cartLoading, error: cartError, setCart } = useCart()
//   const navigate = useNavigate()

//   const BASE_URL = import.meta.env.VITE_BASE_URL


//   const [loading, setLoading] = useState(true)
//   const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false)
//   const [addresses, setAddresses] = useState([])
//   const [error, setError] = useState(null)
//   const [isPlacingOrder, setIsPlacingOrder] = useState(false)
//   const [couponCode, setCouponCode] = useState("")
//   const [couponError, setCouponError] = useState(null)
//   const [couponApplied, setCouponApplied] = useState(null)
//   const [selectedAddress, setSelectedAddress] = useState(null)
//   const [selectedPayment, setSelectedPayment] = useState("card")
//   const [showAddressDialog, setShowAddressDialog] = useState(false)
//   const [editingAddress, setEditingAddress] = useState(null)
//   const [newAddress, setNewAddress] = useState({
//     name: "",
//     type: "home",
//     house_no: "",
//     landmark: "",
//     city: "",
//     state: "",
//     pincode: "",
//     phone: "",
//     alternate_number: "",
//     isDefault: false,
//   })
//   const [showCouponsDialog, setShowCouponsDialog] = useState(false)
//   const [availableCoupons, setAvailableCoupons] = useState([])
//   const [couponLoading, setCouponLoading] = useState(false)

//   // Payment failure modal states
//   const [showPaymentFailedModal, setShowPaymentFailedModal] = useState(false)
//   const [paymentFailureData, setPaymentFailureData] = useState({
//     orderId: null,
//     errorMessage: "",
//     errorDescription: "",
//   })

//   const toast = ({ title, description, variant }) => {
//     console.log(`Toast: ${title} - ${description} (${variant})`)
//     setError(description)
//   }

//   const handleApiError = (err, defaultMessage) => {
//     const message = err.response?.data?.message || err.response?.data?.error || defaultMessage
//     setError(message)
//     console.log(`Error: ${message}`)
//   }

//   useEffect(() => {
//     const script = document.createElement("script")
//     script.src = "https://checkout.razorpay.com/v1/checkout.js"
//     script.async = true
//     script.onload = () => {
//       console.log("Razorpay script loaded")
//       setIsRazorpayLoaded(true)
//     }
//     script.onerror = () => {
//       console.error("Failed to load Razorpay script")
//       handleApiError(
//         new Error("Payment service unavailable"),
//         "Payment service is unavailable. Please try another payment method.",
//       )
//     }
//     document.body.appendChild(script)
//     return () => {
//       document.body.removeChild(script)
//     }
//   }, [])

//   useEffect(() => {
//     if (!cart) {
//       fetchCart()
//     }
//   }, [cart, fetchCart])

//   useEffect(() => {
//     console.log("Cart data:", cart)
//     if (cart?.coupon && cart?.final_coupon_discount > 0 && cart.coupon.coupon_code) {
//       setCouponApplied({
//         code: cart.coupon.coupon_code,
//         discount: cart.final_coupon_discount,
//       })
//       setCouponCode(cart.coupon.coupon_code)
//       console.log("couponApplied set:", { code: cart.coupon.coupon_code, discount: cart.final_coupon_discount })
//     } else {
//       console.log("Coupon not applied: missing coupon_code or invalid cart data")
//       setCouponApplied(null)
//       setCouponCode("")
//     }
//   }, [cart])

//   useEffect(() => {
//     fetchAddress()
//   }, [])

//   useEffect(() => {
//     if (addresses.length > 0 && !selectedAddress) {
//       setSelectedAddress(addresses.find((addr) => addr.isDefault)?.id || addresses[0].id)
//     }
//   }, [addresses])

//   const fetchAddress = async () => {
//     setLoading(true)
//     try {
//       const response = await api.get("address/")
//       const mappedAddresses = response.data.map((addr) => ({
//         id: addr.id,
//         name: addr.name,
//         type: addr.address_type,
//         house_no: addr.house_no,
//         landmark: addr.landmark || "",
//         city: addr.city,
//         state: addr.state,
//         pincode: addr.pin_code,
//         phone: addr.mobile_number,
//         alternate_number: addr.alternate_number || "",
//         isDefault: addr.isDefault || false,
//       }))
//       setAddresses(mappedAddresses)
//       setError(null)
//     } catch (err) {
//       handleApiError(err, "Failed to fetch addresses")
//       setAddresses([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchAvailableCoupons = async () => {
//     setCouponLoading(true)
//     try {
//       const response = await api.get("offer/user/available-coupons/")
//       setAvailableCoupons(response.data)
//       setError(null)
//     } catch (err) {
//       handleApiError(err, "Failed to fetch available coupons")
//       setAvailableCoupons([])
//     } finally {
//       setCouponLoading(false)
//     }
//   }

//   const handleCopyCoupon = (code) => {
//     navigator.clipboard
//       .writeText(code)
//       .then(() => {
//         toast({
//           title: "Success",
//           description: `Coupon code ${code} copied to clipboard!`,
//           variant: "success",
//         })
//       })
//       .catch(() => {
//         handleApiError(new Error("Failed to copy coupon code"), "Failed to copy coupon code")
//       })
//   }

//   const handleApplyCouponFromModal = async (code) => {
//     setCouponCode(code)
//     await handleApplyCoupon()
//     setShowCouponsDialog(false)
//   }

//   const cartItems =
//     cart?.items?.map((item) => ({
//       id: item.id,
//       name: item.product.name,
//       price: item.variant.total_price,
//       quantity: item.quantity,
//       tax: item.tax_amount,
//       discount: item.discount_amount,
//       final_price: item.final_price,
//       image: item.primary_image,
//     })) || []

//   const subtotal = cart?.final_subtotal || 0
//   const totalTax = cart?.final_tax || 0
//   const totalDiscount = cart?.final_discount || 0
//   const total = cart?.final_total || 0
//   const shipping = cart?.shipping || 0
//   const isCodDisabled = total > 1000

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(price)
//   }

//   const validateAddress = (address) => {
//     const errors = []
//     if (!address.name.trim()) errors.push("Full name is required")
//     if (!address.house_no.trim()) errors.push("House number is required")
//     if (!address.city.trim()) errors.push("City is required")
//     if (!address.state.trim()) errors.push("State is required")
//     if (!address.pincode || !/^\d{6}$/.test(address.pincode)) errors.push("Valid 6-digit PIN code is required")
//     if (!address.phone || !/^\d{10}$/.test(address.phone)) errors.push("Valid 10-digit phone number is required")
//     if (address.alternate_number && !/^\d{10}$/.test(address.alternate_number))
//       errors.push("Valid 10-digit alternate number is required")
//     return errors
//   }

//   const handleApplyCoupon = async () => {
//     if (!couponCode.trim()) {
//       setCouponError("Please enter a coupon code")
//       return
//     }
//     try {
//       const response = await api.post("cartapp/apply-coupon/", { code: couponCode.trim() })
//       setCouponApplied({ code: couponCode, discount: response.data.discount })
//       setCouponError(null)
//       setError(null)
//       await fetchCart()
//     } catch (err) {
//       setCouponError(err.response?.data?.error || "Invalid coupon code")
//       setCouponApplied(null)
//     }
//   }

//   const handleRemoveCoupon = async () => {
//     try {
//       await api.post("cartapp/remove-coupon/")
//       setCouponApplied(null)
//       setCouponCode("")
//       setCouponError(null)
//       fetchCart()
//     } catch (err) {
//       setCouponError("Failed to remove coupon")
//     }
//   }

//   const handleAddAddress = async () => {
//     const errors = validateAddress(newAddress)
//     if (errors.length > 0) {
//       handleApiError(new Error(errors.join(", ")), errors.join(", "))
//       return
//     }
//     try {
//       const response = await api.post("address/", {
//         name: newAddress.name.trim(),
//         house_no: newAddress.house_no.trim(),
//         address_type: newAddress.type,
//         city: newAddress.city.trim(),
//         state: newAddress.state.trim(),
//         pin_code: newAddress.pincode,
//         mobile_number: newAddress.phone,
//         landmark: newAddress.landmark || null,
//         alternate_number: newAddress.alternate_number || null,
//         isDefault: newAddress.isDefault,
//       })
//       const newId = response.data.id
//       const updatedAddresses = newAddress.isDefault
//         ? addresses.map((addr) => ({ ...addr, isDefault: false }))
//         : [...addresses]
//       setAddresses([
//         ...updatedAddresses,
//         {
//           id: newId,
//           name: newAddress.name,
//           type: newAddress.type,
//           house_no: newAddress.house_no,
//           landmark: newAddress.landmark || "",
//           city: newAddress.city,
//           state: newAddress.state,
//           pincode: newAddress.pincode,
//           phone: newAddress.phone,
//           alternate_number: newAddress.alternate_number || "",
//           isDefault: newAddress.isDefault,
//         },
//       ])
//       setSelectedAddress(newId)
//       setNewAddress({
//         name: "",
//         type: "home",
//         house_no: "",
//         landmark: "",
//         city: "",
//         state: "",
//         pincode: "",
//         phone: "",
//         alternate_number: "",
//         isDefault: false,
//       })
//       setShowAddressDialog(false)
//       setError(null)
//     } catch (err) {
//       handleApiError(err, "Failed to add address")
//     }
//   }

//   const handleEditAddress = async () => {
//     const errors = validateAddress(editingAddress)
//     if (errors.length > 0) {
//       handleApiError(new Error(errors.join(", ")), errors.join(", "))
//       return
//     }
//     try {
//       const response = await api.patch(`address/${editingAddress.id}/`, {
//         name: editingAddress.name.trim(),
//         house_no: editingAddress.house_no.trim(),
//         address_type: editingAddress.type,
//         city: editingAddress.city.trim(),
//         state: editingAddress.state.trim(),
//         pin_code: editingAddress.pincode,
//         mobile_number: editingAddress.phone,
//         landmark: editingAddress.landmark || null,
//         alternate_number: editingAddress.alternate_number || null,
//         isDefault: editingAddress.isDefault,
//       })
//       const updatedAddresses = addresses.map((addr) => {
//         if (addr.id === editingAddress.id) {
//           return {
//             ...editingAddress,
//             house_no: editingAddress.house_no,
//             landmark: editingAddress.landmark || "",
//             alternate_number: editingAddress.alternate_number || "",
//           }
//         }
//         return { ...addr, isDefault: editingAddress.isDefault ? false : addr.isDefault }
//       })
//       setAddresses(updatedAddresses)
//       setEditingAddress(null)
//       setShowAddressDialog(false)
//       setError(null)
//     } catch (err) {
//       handleApiError(err, "Failed to update address")
//     }
//   }

//   const handleRemoveAddress = async (id) => {
//     try {
//       await api.delete(`address/${id}/`)
//       const updatedAddresses = addresses.filter((addr) => addr.id !== id)
//       if (id === selectedAddress && updatedAddresses.length > 0) {
//         setSelectedAddress(updatedAddresses.find((addr) => addr.isDefault)?.id || updatedAddresses[0].id)
//       } else if (updatedAddresses.length === 0) {
//         setSelectedAddress(null)
//       }
//       setAddresses(updatedAddresses)
//       setError(null)
//     } catch (err) {
//       handleApiError(err, "Failed to remove address")
//     }
//   }

//   const setDefaultAddress = async (id) => {
//     try {
//       await api.patch(`address/${id}/`, { isDefault: true })
//       const updatedAddresses = addresses.map((addr) => ({
//         ...addr,
//         isDefault: addr.id === id ? true : false,
//       }))
//       setAddresses(updatedAddresses)
//       setSelectedAddress(id)
//       setError(null)
//     } catch (err) {
//       handleApiError(err, "Failed to set default address")
//       await fetchAddress()
//     }
//   }

//   const startEditAddress = (address) => {
//     setEditingAddress({
//       ...address,
//       house_no: address.house_no,
//       landmark: address.landmark || "",
//       alternate_number: address.alternate_number || "",
//     })
//     setShowAddressDialog(true)
//   }

//   const handlePaymentFailure = (orderId, errorMessage, errorDescription) => {
//     setPaymentFailureData({
//       orderId,
//       errorMessage,
//       errorDescription,
//     })
//     setShowPaymentFailedModal(true)
//     setIsPlacingOrder(false)
//   }

//   const handleGoToOrderDetails = () => {
//     setShowPaymentFailedModal(false)
//     if (paymentFailureData.orderId) {
//       navigate(`/order-details/${paymentFailureData.orderId}`, {
//         state: { paymentStatus: "failed", order: paymentFailureData.orderId },
//       })
//     }
//   }

//   const handlePlaceOrder = async () => {
//     if (!selectedAddress) {
//       handleApiError(new Error("Please select a shipping address"), "Please select a shipping address")
//       return
//     }
//     if (selectedPayment === "card" && !isRazorpayLoaded) {
//       handleApiError(
//         new Error("Payment service is loading"),
//         "Payment service is loading. Please wait or try another payment method.",
//       )
//       return
//     }
//     if (selectedPayment === "cod" && isCodDisabled) {
//       handleApiError(
//         new Error("Cash on Delivery is not available"),
//         "Cash on Delivery is not available for orders above ₹1000.",
//       )
//       return
//     }
//     setIsPlacingOrder(true)
//     try {
//       const couponData = couponApplied && couponApplied.code ? { coupon_code: couponApplied.code } : {}
//       if (selectedPayment === "card") {
//         if (!window.Razorpay) {
//           handleApiError(
//             new Error("Payment service unavailable"),
//             "Payment service is unavailable. Please try another payment method.",
//           )
//           setIsPlacingOrder(false)
//           return
//         }

//         const response = await api.post("cartapp/orders/razorpay/create/", {
//           address_id: selectedAddress,
//           payment_method: "card",
//           ...couponData,
//         })
//         if (!response.data.order_id || !response.data.amount) {
//           throw new Error("Invalid Razorpay response: missing order_id or amount")
//         }
//         const { order_id: razorpayOrderId, amount, currency, key, order } = response.data

//         const options = {
//           key: key,
//           amount: amount,
//           currency: currency,
//           name: "Vishali Gold",
//           description: `Payment for Order #${order.order_number}`,
//           order_id: razorpayOrderId,
//           handler: async (response) => {
//             try {
//               const verifyResponse = await api.post("cartapp/orders/razorpay/verify/", {
//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_signature: response.razorpay_signature,
//               })
//               if (verifyResponse.data.order_id) {
//                 navigate(`/order-details/${verifyResponse.data.order_id}`, {
//                   state: { paymentStatus: "success", order: verifyResponse.data.order_id },
//                 })
//               } else {
//                 await clearCart()
//               }
//               setIsPlacingOrder(false)
//             } catch (err) {
//               console.error("Payment verification error:", err.response?.data, err.message)
//               const orderId = err.response?.data?.order_id || order.id
//               handlePaymentFailure(
//                 orderId,
//                 "Payment Verification Failed",
//                 "Payment verification failed. Please contact support if amount was deducted.",
//               )
//             }
//           },
//           prefill: {
//             name: addresses.find((addr) => addr.id === selectedAddress)?.name || "",
//             email: "customer@example.com",
//             contact: addresses.find((addr) => addr.id === selectedAddress)?.phone || "",
//           },
//           notes: {
//             address_id: selectedAddress,
//             order_id: response.data.order.id,
//           },
//           theme: {
//             color: "#8B2131",
//           },
//           modal: {
//             ondismiss: async () => {
//               setIsPlacingOrder(false)
//               try {
//                 await api.post("cartapp/orders/cancel/", { order_id: response.data.order.id })
//                 console.log("Pending order cancelled")
//               } catch (err) {
//                 console.error("Failed to cancel order:", err)
//               }
//             },
//           },
//         }

//         try {
//           const rzp = new window.Razorpay(options)
//           rzp.on("payment.failed", async (response) => {
//             console.error("Razorpay payment failed:", response.error)
//             try {
//               await api.post("cartapp/orders/cancel/", { order_id: order.id })
//               console.log("Failed order cancelled")
//             } catch (err) {
//               console.error("Failed to cancel order:", err)
//             }

//             handlePaymentFailure(
//               order.id,
//               "Payment Failed",
//               response.error.description || "Your payment could not be processed. Please try again.",
//             )
//           })
//           rzp.open()
//         } catch (err) {
//           console.error("Razorpay modal error:", err)
//           setIsPlacingOrder(false)
//           try {
//             await api.post("cartapp/orders/cancel/", { order_id: order.id })
//             console.log("Pending order cancelled")
//           } catch (cancelErr) {
//             console.error("Failed to cancel order:", cancelErr)
//           }
//           handlePaymentFailure(
//             order.id,
//             "Payment Initialization Failed",
//             "Failed to initialize payment. Please try again.",
//           )
//         }
//       } else {
//         const response = await api.post("cartapp/orders/create/", {
//           address_id: selectedAddress,
//           payment_method: selectedPayment,
//           ...couponData,
//         })
//         if (response.data.cart) {
//           setCart(response.data.cart)
//         } else {
//           await clearCart()
//         }
//         navigate(`/order-details/${response.data.order.id}`, {
//           state: { paymentStatus: "success", order: response.data.order },
//         })
//         setIsPlacingOrder(false)
//       }
//     } catch (error) {
//       console.error("Place order error details:", error.response?.data, error.message)
//       handleApiError(error, "Failed to place order. Please try again.")
//       setIsPlacingOrder(false)
//     }
//   }

//   const PaymentFailedModal = () => {
//     if (!showPaymentFailedModal) return null

//     return (
//       <Dialog open={showPaymentFailedModal} onOpenChange={setShowPaymentFailedModal}>
//         <DialogContent className="max-w-md bg-white">
//           <DialogHeader>
//             <DialogTitle className="text-xl font-semibold text-red-600 flex items-center">
//               <XCircle className="h-6 w-6 mr-2" />
//               Payment Failed
//             </DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4 py-4">
//             <div className="flex items-center justify-center">
//               <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
//                 <AlertTriangle className="h-8 w-8 text-red-600" />
//               </div>
//             </div>
//             <div className="text-center space-y-2">
//               <h3 className="text-lg font-medium text-gray-900">{paymentFailureData.errorMessage}</h3>
//               <p className="text-sm text-gray-600">{paymentFailureData.errorDescription}</p>
//               {paymentFailureData.orderId && (
//                 <p className="text-xs text-gray-500 mt-2">Order ID: #{paymentFailureData.orderId}</p>
//               )}
//             </div>
//             <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
//               <p className="text-sm text-yellow-800">
//                 <strong>Note:</strong> If amount was deducted from your account, it will be refunded within 5-7 business
//                 days.
//               </p>
//             </div>
//           </div>
//           <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
//             <Button variant="outline" onClick={() => setShowPaymentFailedModal(false)} className="w-full sm:w-auto">
//               Try Again
//             </Button>
//             <Button
//               onClick={handleGoToOrderDetails}
//               className="bg-[#8B2131] hover:bg-[#6d1926] w-full sm:w-auto"
//               disabled={!paymentFailureData.orderId}
//             >
//               View Order Details
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     )
//   }

//   const CouponsDialog = () => {
//     if (!showCouponsDialog) return null

//     return (
//       <Dialog open={showCouponsDialog} onOpenChange={setShowCouponsDialog}>
//         <DialogContent className="max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="text-xl font-semibold text-[#8B2131] flex items-center">
//               <Gift className="h-5 w-5 mr-2" />
//               Available Coupons
//             </DialogTitle>
//           </DialogHeader>
//           {error && (
//             <div className="bg-red-50 border border-red-200 rounded-lg p-3">
//               <p className="text-red-600 text-sm">{error}</p>
//             </div>
//           )}
//           <div className="space-y-4 max-h-[60vh] overflow-y-auto">
//             {couponLoading ? (
//               <div className="flex items-center justify-center py-8">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B2131]"></div>
//                 <span className="ml-2">Loading coupons...</span>
//               </div>
//             ) : availableCoupons.length === 0 ? (
//               <div className="text-center py-8">
//                 <Gift className="h-12 w-12 mx-auto text-gray-400 mb-3" />
//                 <p className="text-gray-500">No available coupons found.</p>
//               </div>
//             ) : (
//               availableCoupons.map((coupon) => (
//                 <Card key={coupon.id} className="border-l-4 border-l-[#8B2131]">
//                   <CardContent className="p-4">
//                     <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-3">
//                       <div className="flex-1">
//                         <h3 className="font-semibold text-[#8B2131] text-lg">{coupon.coupon_code}</h3>
//                         <p className="text-sm text-gray-600 mt-1">
//                           Save {formatPrice(coupon.discount)} on orders above {formatPrice(coupon.min_amount)}
//                         </p>
//                       </div>
//                       <div className="flex gap-2 w-full sm:w-auto">
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => handleCopyCoupon(coupon.coupon_code)}
//                           className="text-[#8B2131] hover:text-[#6d1926] hover:bg-[#f8ece9] flex-1 sm:flex-none"
//                         >
//                           <Copy className="h-4 w-4 mr-1" />
//                           Copy
//                         </Button>
//                         <Button
//                           size="sm"
//                           onClick={() => handleApplyCouponFromModal(coupon.coupon_code)}
//                           className="bg-[#8B2131] hover:bg-[#6d1926] flex-1 sm:flex-none"
//                           disabled={couponApplied?.code === coupon.coupon_code}
//                         >
//                           {couponApplied?.code === coupon.coupon_code ? "Applied" : "Apply"}
//                         </Button>
//                       </div>
//                     </div>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
//                       <div>
//                         <span className="text-gray-500">Min Purchase:</span>
//                         <span className="ml-1 font-medium">{formatPrice(coupon.min_amount)}</span>
//                       </div>
//                       <div>
//                         <span className="text-gray-500">Offer Amount:</span>
//                         <span className="ml-1 font-medium">{formatPrice(coupon.min_offer_amount)}</span>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))
//             )}
//           </div>
//           <div className="flex justify-end pt-4 border-t">
//             <Button
//               variant="outline"
//               onClick={() => {
//                 setShowCouponsDialog(false)
//                 setError(null)
//               }}
//             >
//               Close
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
//       <div className="container mx-auto px-4 py-8 max-w-7xl">
//         <div className="mb-8">
//           <Link
//             to="/cart"
//             className="inline-flex items-center text-gray-600 hover:text-[#8B2131] transition-colors mb-4 group"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
//             <span>Back to Cart</span>
//           </Link>
//           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//             <div>
//               <h1 className="text-3xl sm:text-4xl font-bold text-[#8B2131] mb-2">Secure Checkout</h1>
//               <p className="text-gray-600">Complete your purchase with confidence</p>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2 space-y-6">
//             <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
//               <CardHeader className="pb-4">
//                 <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//                   <div className="flex items-center">
//                     <div className="bg-[#8B2131] text-white rounded-full p-2 mr-3">
//                       <MapPin className="h-5 w-5" />
//                     </div>
//                     <span className="text-xl font-semibold text-[#8B2131]">Shipping Address</span>
//                   </div>
//                   <Button
//                     variant="outline"
//                     className="border-[#8B2131] text-[#8B2131] hover:bg-[#8B2131] hover:text-white w-full sm:w-auto"
//                     // onClick={() => setShowAddressDialog(true)}
//                       onClick={() => navigate(`/addaddress/`)}
                    
//                     disabled={showAddressDialog}
//                   >
//                     <Plus className="h-4 w-4 mr-2" />
//                     Add Address
//                   </Button>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="bg-white">
//                 {(error || cartError) && (
//                   <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
//                     <p className="text-red-600 text-sm">{error || cartError}</p>
//                   </div>
//                 )}

//                 {loading || cartLoading ? (
//                   <div className="flex items-center justify-center py-8">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B2131]"></div>
//                     <span className="ml-2">Loading addresses...</span>
//                   </div>
//                 ) : addresses.length === 0 ? (
//                   <div className="text-center py-12">
//                     <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-3" />
//                     <p className="text-gray-500 mb-4">No addresses found</p>
//                     <Button onClick={() => setShowAddressDialog(true)} className="bg-[#8B2131] hover:bg-[#6d1926]">
//                       Add Your First Address
//                     </Button>
//                   </div>
//                 ) : (
//                   <RadioGroup
//                     value={selectedAddress?.toString()}
//                     onValueChange={(value) => setSelectedAddress(Number.parseInt(value))}
//                   >
//                     <div className="space-y-4">
//                       {addresses.map((address) => (
//                         <div
//                           key={address.id}
//                           className={`relative border rounded-xl p-4 transition-all duration-200 cursor-pointer ${
//                             selectedAddress === address.id
//                               ? "border-[#8B2131] bg-gradient-to-r from-[#8B2131]/5 to-orange-50 shadow-md"
//                               : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
//                           }`}
//                         >
//                           <div className="flex items-start space-x-4">
//                             <RadioGroupItem
//                               value={address.id.toString()}
//                               id={`address-${address.id}`}
//                               className="mt-1"
//                             />
//                             <div className="flex-1">
//                               <div className="flex flex-wrap items-center gap-2 mb-2">
//                                 <Label
//                                   htmlFor={`address-${address.id}`}
//                                   className="font-semibold text-gray-900 cursor-pointer"
//                                 >
//                                   {address.name}
//                                 </Label>
//                                 {address.isDefault && (
//                                   <Badge
//                                     variant="secondary"
//                                     className="bg-[#8B2131]/10 text-[#8B2131] border-[#8B2131]/20"
//                                   >
//                                     <Star className="h-3 w-3 mr-1" />
//                                     Default
//                                   </Badge>
//                                 )}
//                                 <Badge variant="outline" className="text-xs">
//                                   {address.type === "home" ? (
//                                     <>
//                                       <Home className="h-3 w-3 mr-1" />
//                                       Home
//                                     </>
//                                   ) : (
//                                     <>
//                                       <Building className="h-3 w-3 mr-1" />
//                                       Work
//                                     </>
//                                   )}
//                                 </Badge>
//                               </div>
//                               <p className="text-gray-600 text-sm mb-1">
//                                 {address.house_no}
//                                 {address.landmark ? `, ${address.landmark}` : ""}
//                               </p>
//                               <p className="text-gray-600 text-sm mb-1">
//                                 {address.city}, {address.state} - {address.pincode}
//                               </p>
//                               <p className="text-gray-600 text-sm">Phone: {address.phone}</p>
//                               {address.alternate_number && (
//                                 <p className="text-gray-600 text-sm">Alternate: {address.alternate_number}</p>
//                               )}
//                               <div className="flex flex-wrap items-center gap-3 mt-3">
//                                 <Button
//                                   variant="ghost"
//                                   size="sm"
//                                   className="text-[#8B2131] hover:text-[#6d1926] hover:bg-[#8B2131]/10"
//                                   onClick={(e) => {
//                                     e.stopPropagation()
//                                     startEditAddress(address)
//                                   }}
//                                 >
//                                   <Edit className="h-4 w-4 mr-1" />
//                                   Edit
//                                 </Button>
//                                 <Button
//                                   variant="ghost"
//                                   size="sm"
//                                   className="text-red-600 hover:text-red-700 hover:bg-red-50"
//                                   onClick={(e) => {
//                                     e.stopPropagation()
//                                     handleRemoveAddress(address.id)
//                                   }}
//                                 >
//                                   <Trash2 className="h-4 w-4 mr-1" />
//                                   Delete
//                                 </Button>
//                                 {!address.isDefault && (
//                                   <Button
//                                     variant="ghost"
//                                     size="sm"
//                                     className="text-green-600 hover:text-green-700 hover:bg-green-50"
//                                     onClick={(e) => {
//                                       e.stopPropagation()
//                                       setDefaultAddress(address.id)
//                                     }}
//                                   >
//                                     <Star className="h-4 w-4 mr-1" />
//                                     Set Default
//                                   </Button>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </RadioGroup>
//                 )}
//               </CardContent>
//             </Card>

//             <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
//               <CardHeader className="pb-4">
//                 <CardTitle className="flex items-center">
//                   <div className="bg-[#8B2131] text-white rounded-full p-2 mr-3">
//                     <CreditCard className="h-5 w-5" />
//                   </div>
//                   <span className="text-xl font-semibold text-[#8B2131]">Payment Method</span>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
//                   <div className="space-y-4">
//                     <div
//                       className={`relative border rounded-xl p-4 transition-all duration-200 cursor-pointer ${
//                         selectedPayment === "card"
//                           ? "border-[#8B2131] bg-gradient-to-r from-[#8B2131]/5 to-orange-50 shadow-md"
//                           : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
//                       }`}
//                     >
//                       <div className="flex items-center space-x-4">
//                         <RadioGroupItem value="card" id="card" />
//                         <div className="flex-1">
//                           <Label htmlFor="card" className="font-medium cursor-pointer flex items-center">
//                             <CreditCard className="h-5 w-5 mr-2 text-[#8B2131]" />
//                             Credit/Debit Card
//                           </Label>
//                           <p className="text-sm text-gray-500 mt-1">Pay securely with your card via Razorpay</p>
//                         </div>
//                         <div className="flex space-x-1">
//                           <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
//                             VISA
//                           </div>
//                           <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
//                             MC
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <div
//                       className={`relative border rounded-xl p-4 transition-all duration-200 cursor-pointer ${
//                         selectedPayment === "wallet"
//                           ? "border-[#8B2131] bg-gradient-to-r from-[#8B2131]/5 to-orange-50 shadow-md"
//                           : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
//                       }`}
//                     >
//                       <div className="flex items-center space-x-4">
//                         <RadioGroupItem value="wallet" id="wallet" />
//                         <div className="flex-1">
//                           <Label htmlFor="wallet" className="font-medium cursor-pointer flex items-center">
//                             <Wallet className="h-5 w-5 mr-2 text-[#8B2131]" />
//                             Wallet
//                           </Label>
//                           <p className="text-sm text-gray-500 mt-1">Pay using your wallet balance</p>
//                         </div>
//                       </div>
//                     </div>

//                     <div
//                       className={`relative border rounded-xl p-4 transition-all duration-200 ${
//                         isCodDisabled
//                           ? "opacity-50 cursor-not-allowed"
//                           : selectedPayment === "cod"
//                             ? "border-[#8B2131] bg-gradient-to-r from-[#8B2131]/5 to-orange-50 shadow-md"
//                             : "border-gray-200 hover:border-gray-300 hover:shadow-sm cursor-pointer"
//                       }`}
//                     >
//                       <div className="flex items-center space-x-4">
//                         <RadioGroupItem value="cod" id="cod" disabled={isCodDisabled} />
//                         <div className="flex-1">
//                           <Label
//                             htmlFor="cod"
//                             className={`font-medium flex items-center ${isCodDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
//                           >
//                             <Truck className="h-5 w-5 mr-2 text-[#8B2131]" />
//                             Cash on Delivery
//                           </Label>
//                           <p className="text-sm text-gray-500 mt-1">
//                             {isCodDisabled
//                               ? "Cash on Delivery is not available for orders above ₹1000"
//                               : "Pay when you receive your order"}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </RadioGroup>
//               </CardContent>
//             </Card>
//           </div>

//           <div className="lg:col-span-1">
//             <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm sticky top-6">
//               <CardHeader className="pb-4">
//                 <CardTitle className="text-xl font-semibold text-[#8B2131]">Order Summary</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div className="space-y-4 max-h-64 overflow-y-auto">
//                   {cart?.items?.length > 0 ? (
//                     cart.items.map((item) => (
//                       <div key={item.id} className="space-y-3">
//                         <div className="flex gap-3">
//                           <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
//                             <img
//                               src={
//                                 item.primary_image
//                                   ? `${BASE_URL}${item.primary_image}`
//                                   : "/placeholder.svg?height=64&width=64"
//                               }
//                               alt={item.product.name}
//                               className="w-full h-full object-cover"
//                             />
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <h3 className="text-sm font-medium text-gray-900 truncate">{item.product.name}</h3>
//                             <div className="flex justify-between items-center mt-1">
//                               <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
//                               <span className="text-sm font-semibold text-[#8B2131]">
//                                 {formatPrice(item.final_price)}
//                               </span>
//                             </div>
//                             {item.discount_amount > 0 && (
//                               <div className="flex justify-between items-center mt-1">
//                                 <span className="text-xs text-green-600 flex items-center">
//                                   <Tag className="h-3 w-3 mr-1" />
//                                   Discount
//                                 </span>
//                                 <span className="text-xs text-green-600">-{formatPrice(item.discount_amount)}</span>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                         <Separator />
//                       </div>
//                     ))
//                   ) : (
//                     <div className="text-center py-8">
//                       <p className="text-gray-500">Your cart is empty</p>
//                       <Link to="/cart" className="text-[#8B2131] hover:underline text-sm">
//                         Go to cart
//                       </Link>
//                     </div>
//                   )}
//                 </div>

//                 <div className="space-y-3">
//                   <div className="flex gap-2">
//                     <Input
//                       value={couponCode}
//                       onChange={(e) => setCouponCode(e.target.value)}
//                       placeholder="Enter coupon code"
//                       className="flex-1"
//                       disabled={couponApplied}
//                     />
//                     {couponApplied ? (
//                       <Button
//                         variant="ghost"
//                         onClick={handleRemoveCoupon}
//                         className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0"
//                       >
//                         Remove
//                       </Button>
//                     ) : (
//                       <Button
//                         onClick={handleApplyCoupon}
//                         disabled={!couponCode.trim()}
//                         className="bg-[#8B2131] hover:bg-[#6d1926] shrink-0"
//                       >
//                         Apply
//                       </Button>
//                     )}
//                   </div>

//                   <Button
//                     variant="outline"
//                     onClick={() => {
//                       fetchAvailableCoupons()
//                       setShowCouponsDialog(true)
//                     }}
//                     className="w-full border-[#8B2131] text-[#8B2131] hover:bg-[#8B2131] hover:text-white"
//                   >
//                     <Gift className="h-4 w-4 mr-2" />
//                     View Available Coupons
//                   </Button>

//                   {couponError && <p className="text-red-600 text-xs">{couponError}</p>}
//                   {couponApplied && (
//                     <div className="bg-green-50 border border-green-200 rounded-lg p-3">
//                       <p className="text-green-700 text-sm font-medium">🎉 Coupon "{couponApplied.code}" applied!</p>
//                       <p className="text-green-600 text-xs">You saved {formatPrice(couponApplied.discount)}</p>
//                     </div>
//                   )}
//                 </div>

//                 <div className="space-y-3 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Subtotal</span>
//                     <span className="font-medium">{formatPrice(subtotal)}</span>
//                   </div>
//                   {totalDiscount > 0 && (
//                     <div className="flex justify-between text-green-600">
//                       <span className="flex items-center">
//                         <Tag className="h-4 w-4 mr-1" />
//                         Item Discount
//                       </span>
//                       <span>-{formatPrice(totalDiscount)}</span>
//                     </div>
//                   )}
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Tax</span>
//                     <span className="font-medium">{formatPrice(totalTax)}</span>
//                   </div>
//                   {couponApplied && (
//                     <div className="flex justify-between text-green-600">
//                       <span className="flex items-center">
//                         <Gift className="h-4 w-4 mr-1" />
//                         Coupon Discount
//                       </span>
//                       <span>-{formatPrice(couponApplied.discount)}</span>
//                     </div>
//                   )}
//                   <div className="flex justify-between">
//                     <span className="text-gray-600 flex items-center">
//                       <Truck className="h-4 w-4 mr-1" />
//                       Shipping
//                     </span>
//                     <span className="font-medium">{formatPrice(shipping)}</span>
//                   </div>
//                   <Separator />
//                   <div className="flex justify-between text-lg font-bold text-[#8B2131]">
//                     <span>Total</span>
//                     <span>{formatPrice(total)}</span>
//                   </div>
//                 </div>

//                 <Button
//                   className="w-full bg-gradient-to-r from-[#8B2131] to-[#a02a3a] hover:from-[#6d1926] hover:to-[#8B2131] text-white py-3 text-lg font-semibold shadow-lg"
//                   disabled={
//                     addresses.length === 0 ||
//                     !cart?.items?.length ||
//                     isPlacingOrder ||
//                     (selectedPayment === "card" && !isRazorpayLoaded)
//                   }
//                   onClick={handlePlaceOrder}
//                 >
//                   {isPlacingOrder ? (
//                     <div className="flex items-center">
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                       Processing...
//                     </div>
//                   ) : (
//                     <div className="flex items-center justify-center">
//                       <span>Place Order {formatPrice(total)}</span>
//                       <ChevronRight className="ml-2 h-5 w-5" />
//                     </div>
//                   )}
//                 </Button>

//                 <div className="flex items-center justify-center text-xs text-gray-500 pt-2">
//                   <ShieldCheck className="h-4 w-4 mr-1 text-green-600" />
//                   <span>Secured by 256-bit SSL encryption</span>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>

//         <AddressDialog
//           showAddressDialog={showAddressDialog}
//           setShowAddressDialog={setShowAddressDialog}
//           editingAddress={editingAddress}
//           setEditingAddress={setEditingAddress}
//           newAddress={newAddress}
//           setNewAddress={setNewAddress}
//           error={error}
//           setError={setError}
//           handleAddAddress={handleAddAddress}
//           handleEditAddress={handleEditAddress}
//         />
//         <CouponsDialog />
//         <PaymentFailedModal />
//       </div>
//     </div>
//   )
// }


// "use client"

// import { useState, useEffect } from "react"
// import { useCart } from "@/Context/CartContext"
// import { Link, useNavigate } from "react-router-dom"
// import api from "../../api"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Separator } from "@/components/ui/separator"
// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import {
//   ArrowLeft,
//   MapPin,
//   Plus,
//   Home,
//   Building,
//   Edit,
//   Trash2,
//   Tag,
//   ChevronRight,
//   ShieldCheck,
//   CreditCard,
//   Wallet,
//   Copy,
//   Gift,
//   Truck,
//   Star,
//   XCircle,
//   AlertTriangle,
// } from "lucide-react"
// import AddressDialog from "./AddressDialog"

// export default function CheckoutPage() {
//   const { cart, fetchCart, clearCart, loading: cartLoading, error: cartError, setCart } = useCart()
//   const navigate = useNavigate()
//   const [isCartCleared, setIsCartCleared] = useState(false);

//   const BASE_URL = import.meta.env.VITE_BASE_URL

//   const [loading, setLoading] = useState(true)
//   const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false)
//   const [addresses, setAddresses] = useState([])
//   const [error, setError] = useState(null)
//   const [isPlacingOrder, setIsPlacingOrder] = useState(false)
//   const [couponCode, setCouponCode] = useState("")
//   const [couponError, setCouponError] = useState(null)
//   const [couponApplied, setCouponApplied] = useState(null)
//   const [selectedAddress, setSelectedAddress] = useState(null)
//   const [selectedPayment, setSelectedPayment] = useState("card")
//   const [showAddressDialog, setShowAddressDialog] = useState(false)
//   const [editingAddress, setEditingAddress] = useState(null)
//   const [newAddress, setNewAddress] = useState({
//     name: "",
//     type: "home",
//     house_no: "",
//     landmark: "",
//     city: "",
//     state: "",
//     pincode: "",
//     phone: "",
//     alternate_number: "",
//     isDefault: false,
//   })
//   const [showCouponsDialog, setShowCouponsDialog] = useState(false)
//   const [availableCoupons, setAvailableCoupons] = useState([])
//   const [couponLoading, setCouponLoading] = useState(false)

//   // Payment failure modal states
//   const [showPaymentFailedModal, setShowPaymentFailedModal] = useState(false)
//   const [paymentFailureData, setPaymentFailureData] = useState({
//     orderId: null,
//     errorMessage: "",
//     errorDescription: "",
//   })

//   const toast = ({ title, description, variant }) => {
//     console.log(`Toast: ${title} - ${description} (${variant})`)
//     setError(description)
//   }

//   const handleApiError = (err, defaultMessage) => {
//     const message = err.response?.data?.message || err.response?.data?.error || defaultMessage
//     setError(message)
//     console.log(`Error: ${message}`)
//   }

// // useEffect to handle refresh after cart is cleared
//   useEffect(() => {
//     if (isCartCleared) {
//       // Ensure cart is cleared before refresh
//       if (!cart?.items?.length) {
//         window.location.reload()
//       } else {
//         // If cart is not cleared, refetch to confirm
//         fetchCart().then(() => {
//           if (!cart?.items?.length) {
//             window.location.reload()
//           }
//         })
//       }
//       setIsCartCleared(false) 
//     }
//   }, [isCartCleared, cart, fetchCart])

//   useEffect(() => {
//     const script = document.createElement("script")
//     script.src = "https://checkout.razorpay.com/v1/checkout.js"
//     script.async = true
//     script.onload = () => {
//       console.log("Razorpay script loaded")
//       setIsRazorpayLoaded(true)
//     }
//     script.onerror = () => {
//       console.error("Failed to load Razorpay script")
//       handleApiError(
//         new Error("Payment service unavailable"),
//         "Payment service is unavailable. Please try another payment method.",
//       )
//     }
//     document.body.appendChild(script)
//     return () => {
//       document.body.removeChild(script)
//     }
//   }, [])

//   useEffect(() => {
//     if (!cart) {
//       fetchCart()
//     }
//   }, [cart, fetchCart])

//   useEffect(() => {
//     console.log("Cart data:", cart)
//     if (cart?.coupon && cart?.final_coupon_discount > 0 && cart.coupon.coupon_code) {
//       setCouponApplied({
//         code: cart.coupon.coupon_code,
//         discount: cart.final_coupon_discount,
//       })
//       setCouponCode(cart.coupon.coupon_code)
//       console.log("couponApplied set:", { code: cart.coupon.coupon_code, discount: cart.final_coupon_discount })
//     } else {
//       console.log("Coupon not applied: missing coupon_code or invalid cart data")
//       setCouponApplied(null)
//       setCouponCode("")
//     }
//   }, [cart])

//   useEffect(() => {
//     fetchAddress()
//   }, [])

//   useEffect(() => {
//     if (addresses.length > 0 && !selectedAddress) {
//       setSelectedAddress(addresses.find((addr) => addr.isDefault)?.id || addresses[0].id)
//     }
//   }, [addresses])

//   const fetchAddress = async () => {
//     setLoading(true)
//     try {
//       const response = await api.get("address/")
//       const mappedAddresses = response.data.map((addr) => ({
//         id: addr.id,
//         name: addr.name,
//         type: addr.address_type,
//         house_no: addr.house_no,
//         landmark: addr.landmark || "",
//         city: addr.city,
//         state: addr.state,
//         pincode: addr.pin_code,
//         phone: addr.mobile_number,
//         alternate_number: addr.alternate_number || "",
//         isDefault: addr.isDefault || false,
//       }))
//       setAddresses(mappedAddresses)
//       setError(null)
//     } catch (err) {
//       handleApiError(err, "Failed to fetch addresses")
//       setAddresses([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchAvailableCoupons = async () => {
//     setCouponLoading(true)
//     try {
//       const response = await api.get("offer/user/available-coupons/")
//       setAvailableCoupons(response.data)
//       setError(null)
//     } catch (err) {
//       handleApiError(err, "Failed to fetch available coupons")
//       setAvailableCoupons([])
//     } finally {
//       setCouponLoading(false)
//     }
//   }

//   const handleCopyCoupon = (code) => {
//     navigator.clipboard
//       .writeText(code)
//       .then(() => {
//         toast({
//           title: "Success",
//           description: `Coupon code ${code} copied to clipboard!`,
//           variant: "success",
//         })
//       })
//       .catch(() => {
//         handleApiError(new Error("Failed to copy coupon code"), "Failed to copy coupon code")
//       })
//   }

//   const handleApplyCouponFromModal = async (code) => {
//     setCouponCode(code)
//     await handleApplyCoupon()
//     setShowCouponsDialog(false)
//   }

//   const cartItems =
//     cart?.items?.map((item) => ({
//       id: item.id,
//       name: item.product.name,
//       price: item.variant.total_price,
//       quantity: item.quantity,
//       tax: item.tax_amount,
//       discount: item.discount_amount,
//       final_price: item.final_price,
//       image: item.primary_image,
//     })) || []

//   const subtotal = cart?.final_subtotal || 0
//   const totalTax = cart?.final_tax || 0
//   const totalDiscount = cart?.final_discount || 0
//   const total = cart?.final_total || 0
//   const shipping = cart?.shipping || 0
//   const isCodDisabled = total > 1000

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(price)
//   }

//   const validateAddress = (address) => {
//     const errors = []
//     if (!address.name.trim()) errors.push("Full name is required")
//     if (!address.house_no.trim()) errors.push("House number is required")
//     if (!address.city.trim()) errors.push("City is required")
//     if (!address.state.trim()) errors.push("State is required")
//     if (!address.pincode || !/^\d{6}$/.test(address.pincode)) errors.push("Valid 6-digit PIN code is required")
//     if (!address.phone || !/^\d{10}$/.test(address.phone)) errors.push("Valid 10-digit phone number is required")
//     if (address.alternate_number && !/^\d{10}$/.test(address.alternate_number))
//       errors.push("Valid 10-digit alternate number is required")
//     return errors
//   }

//   const handleApplyCoupon = async () => {
//     if (!couponCode.trim()) {
//       setCouponError("Please enter a coupon code")
//       return
//     }
//     try {
//       const response = await api.post("cartapp/apply-coupon/", { code: couponCode.trim() })
//       setCouponApplied({ code: couponCode, discount: response.data.discount })
//       setCouponError(null)
//       setError(null)
//       await fetchCart()
//     } catch (err) {
//       setCouponError(err.response?.data?.error || "Invalid coupon code")
//       setCouponApplied(null)
//     }
//   }

//   const handleRemoveCoupon = async () => {
//     try {
//       await api.post("cartapp/remove-coupon/")
//       setCouponApplied(null)
//       setCouponCode("")
//       setCouponError(null)
//       fetchCart()
//     } catch (err) {
//       setCouponError("Failed to remove coupon")
//     }
//   }

//   const handleAddAddress = async () => {
//     const errors = validateAddress(newAddress)
//     if (errors.length > 0) {
//       handleApiError(new Error(errors.join(", ")), errors.join(", "))
//       return
//     }
//     try {
//       const response = await api.post("address/", {
//         name: newAddress.name.trim(),
//         house_no: newAddress.house_no.trim(),
//         address_type: newAddress.type,
//         city: newAddress.city.trim(),
//         state: newAddress.state.trim(),
//         pin_code: newAddress.pincode,
//         mobile_number: newAddress.phone,
//         landmark: newAddress.landmark || null,
//         alternate_number: newAddress.alternate_number || null,
//         isDefault: newAddress.isDefault,
//       })
//       const newId = response.data.id
//       const updatedAddresses = newAddress.isDefault
//         ? addresses.map((addr) => ({ ...addr, isDefault: false }))
//         : [...addresses]
//       setAddresses([
//         ...updatedAddresses,
//         {
//           id: newId,
//           name: newAddress.name,
//           type: newAddress.type,
//           house_no: newAddress.house_no,
//           landmark: newAddress.landmark || "",
//           city: newAddress.city,
//           state: newAddress.state,
//           pincode: newAddress.pincode,
//           phone: newAddress.phone,
//           alternate_number: newAddress.alternate_number || "",
//           isDefault: newAddress.isDefault,
//         },
//       ])
//       setSelectedAddress(newId)
//       setNewAddress({
//         name: "",
//         type: "home",
//         house_no: "",
//         landmark: "",
//         city: "",
//         state: "",
//         pincode: "",
//         phone: "",
//         alternate_number: "",
//         isDefault: false,
//       })
//       setShowAddressDialog(false)
//       setError(null)
//     } catch (err) {
//       handleApiError(err, "Failed to add address")
//     }
//   }

//   const handleEditAddress = async () => {
//     const errors = validateAddress(editingAddress)
//     if (errors.length > 0) {
//       handleApiError(new Error(errors.join(", ")), errors.join(", "))
//       return
//     }
//     try {
//       const response = await api.patch(`address/${editingAddress.id}/`, {
//         name: editingAddress.name.trim(),
//         house_no: editingAddress.house_no.trim(),
//         address_type: editingAddress.type,
//         city: editingAddress.city.trim(),
//         state: editingAddress.state.trim(),
//         pin_code: editingAddress.pincode,
//         mobile_number: editingAddress.phone,
//         landmark: editingAddress.landmark || null,
//         alternate_number: editingAddress.alternate_number || null,
//         isDefault: editingAddress.isDefault,
//       })
//       const updatedAddresses = addresses.map((addr) => {
//         if (addr.id === editingAddress.id) {
//           return {
//             ...editingAddress,
//             house_no: editingAddress.house_no,
//             landmark: editingAddress.landmark || "",
//             alternate_number: editingAddress.alternate_number || "",
//           }
//         }
//         return { ...addr, isDefault: editingAddress.isDefault ? false : addr.isDefault }
//       })
//       setAddresses(updatedAddresses)
//       setEditingAddress(null)
//       setShowAddressDialog(false)
//       setError(null)
//     } catch (err) {
//       handleApiError(err, "Failed to update address")
//     }
//   }

//   const handleRemoveAddress = async (id) => {
//     try {
//       await api.delete(`address/${id}/`)
//       const updatedAddresses = addresses.filter((addr) => addr.id !== id)
//       if (id === selectedAddress && updatedAddresses.length > 0) {
//         setSelectedAddress(updatedAddresses.find((addr) => addr.isDefault)?.id || updatedAddresses[0].id)
//       } else if (updatedAddresses.length === 0) {
//         setSelectedAddress(null)
//       }
//       setAddresses(updatedAddresses)
//       setError(null)
//     } catch (err) {
//       handleApiError(err, "Failed to remove address")
//     }
//   }

//   const setDefaultAddress = async (id) => {
//     try {
//       await api.patch(`address/${id}/`, { isDefault: true })
//       const updatedAddresses = addresses.map((addr) => ({
//         ...addr,
//         isDefault: addr.id === id ? true : false,
//       }))
//       setAddresses(updatedAddresses)
//       setSelectedAddress(id)
//       setError(null)
//     } catch (err) {
//       handleApiError(err, "Failed to set default address")
//       await fetchAddress()
//     }
//   }

//   const startEditAddress = (address) => {
//     setEditingAddress({
//       ...address,
//       house_no: address.house_no,
//       landmark: address.landmark || "",
//       alternate_number: address.alternate_number || "",
//     })
//     setShowAddressDialog(true)
//   }

//   const handlePaymentFailure = (orderId, errorMessage, errorDescription) => {
//     setPaymentFailureData({
//       orderId,
//       errorMessage,
//       errorDescription,
//     })
//     setShowPaymentFailedModal(true)
//     setIsPlacingOrder(false)
//   }

//   const handleGoToOrderDetails = () => {
//     setShowPaymentFailedModal(false)
//     if (paymentFailureData.orderId) {
//       navigate(`/order-details/${paymentFailureData.orderId}`, {
//         state: { paymentStatus: "failed", order: paymentFailureData.orderId },
//       })
//     }
//   }

//   const handlePlaceOrder = async () => {
//     if (!selectedAddress) {
//       handleApiError(new Error("Please select a shipping address"), "Please select a shipping address")
//       return
//     }
//     if (selectedPayment === "card" && !isRazorpayLoaded) {
//       handleApiError(
//         new Error("Payment service is loading"),
//         "Payment service is loading. Please wait or try another payment method.",
//       )
//       return
//     }
//     if (selectedPayment === "cod" && isCodDisabled) {
//       handleApiError(
//         new Error("Cash on Delivery is not available"),
//         "Cash on Delivery is not available for orders above ₹1000.",
//       )
//       return
//     }
//     setIsPlacingOrder(true)
//     try {
//       const couponData = couponApplied && couponApplied.code ? { coupon_code: couponApplied.code } : {}
//       if (selectedPayment === "card") {
//         if (!window.Razorpay) {
//           handleApiError(
//             new Error("Payment service unavailable"),
//             "Payment service is unavailable. Please try another payment method.",
//           )
//           setIsPlacingOrder(false)
//           return
//         }

//         const response = await api.post("cartapp/orders/razorpay/create/", {
//           address_id: selectedAddress,
//           payment_method: "card",
//           ...couponData,
//         })
//         if (!response.data.order_id || !response.data.amount) {
//           throw new Error("Invalid Razorpay response: missing order_id or amount")
//         }
//         const { order_id: razorpayOrderId, amount, currency, key, order } = response.data

//         const options = {
//           key: key,
//           amount: amount,
//           currency: currency,
//           name: "Vishali Gold",
//           description: `Payment for Order #${order.order_number}`,
//           order_id: razorpayOrderId,
//           handler: async (response) => {
//             try {
//               const verifyResponse = await api.post("cartapp/orders/razorpay/verify/", {
//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_signature: response.razorpay_signature,
//               })
//               if (verifyResponse.data.order_id) {
//                 navigate(`/order-details/${verifyResponse.data.order_id}`, {
//                   state: { paymentStatus: "success", order: verifyResponse.data.order_id },
//                 })
//               } else {
//                 await clearCart()
//                 setIsCartCleared(true);
//               }
//               setIsPlacingOrder(false)
//             } catch (err) {
//               console.error("Payment verification error:", err.response?.data, err.message)
//               const orderId = err.response?.data?.order_id || order.id
//               handleApiError(err, "Payment verification failed")
//               setIsPlacingOrder(false)
//             }
//           },
//           prefill: {
//             name: addresses.find((addr) => addr.id === selectedAddress)?.name || "",
//             email: "customer@example.com",
//             contact: addresses.find((addr) => addr.id === selectedAddress)?.phone || "",
//           },
//           notes: {
//             address_id: selectedAddress,
//             order_id: response.data.order.id,
//           },
//           theme: {
//             color: "#8B2131",
//           },
//           modal: {
//             ondismiss: async () => {
//               setIsPlacingOrder(false)
//               handlePaymentFailure(
//                 response.data.order.id,
//                 "Payment Cancelled",
//                 "You closed the payment modal. Please try again to complete the payment."
//               )
//             },
//           },
//         }

//         try {
//           const rzp = new window.Razorpay(options)
//           rzp.on("payment.failed", async (response) => {
//             console.error("Razorpay payment failed:", response.error)
//             handlePaymentFailure(
//               order.id,
//               "Payment Failed",
//               response.error.description || "Your payment could not be processed. Please try again."
//             )
//           })
//           rzp.open()
//         } catch (err) {
//           console.error("Razorpay modal error:", err)
//           handleApiError(err, "Failed to initialize payment")
//           setIsPlacingOrder(false)
//         }
//       } else {
//         const response = await api.post("cartapp/orders/create/", {
//           address_id: selectedAddress,
//           payment_method: selectedPayment,
//           ...couponData,
//         })
//         if (response.data.cart) {
//           setCart(response.data.cart)
//         } else {
//           await clearCart()
//           setIsCartCleared(true);
//         }
//         navigate(`/order-details/${response.data.order.id}`, {
//           state: { paymentStatus: "success", order: response.data.order },
//         })
//         setIsPlacingOrder(false)
//       }
//     } catch (error) {
//       console.error("Place order error details:", error.response?.data, error.message)
//       handleApiError(error, "Failed to place order. Please try again.")
//       setIsPlacingOrder(false)
//     }
//   }

//   const PaymentFailedModal = () => {
//     if (!showPaymentFailedModal) return null

//     return (
//       <Dialog open={showPaymentFailedModal} onOpenChange={setShowPaymentFailedModal}>
//         <DialogContent className="max-w-md bg-white">
//           <DialogHeader>
//             <DialogTitle className="text-xl font-semibold text-red-600 flex items-center">
//               <XCircle className="h-6 w-6 mr-2" />
//               Payment Failed
//             </DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4 py-4">
//             <div className="flex items-center justify-center">
//               <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
//                 <AlertTriangle className="h-8 w-8 text-red-600" />
//               </div>
//             </div>
//             <div className="text-center space-y-2">
//               <h3 className="text-lg font-medium text-gray-900">{paymentFailureData.errorMessage}</h3>
//               <p className="text-sm text-gray-600">{paymentFailureData.errorDescription}</p>
//               {paymentFailureData.orderId && (
//                 <p className="text-xs text-gray-500 mt-2">Order ID: #{paymentFailureData.orderId}</p>
//               )}
//             </div>
//             <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
//               <p className="text-sm text-yellow-800">
//                 <strong>Note:</strong> If amount was deducted from your account, it will be refunded within 5-7 business days.
//               </p>
//             </div>
//           </div>
//           <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
//             <Button variant="outline" onClick={() => setShowPaymentFailedModal(false)} className="w-full sm:w-auto">
//               Try Again
//             </Button>
//             <Button
//               onClick={handleGoToOrderDetails}
//               className="bg-[#8B2131] hover:bg-[#6d1926] w-full sm:w-auto"
//               disabled={!paymentFailureData.orderId}
//             >
//               View Order Details
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     )
//   }

//   const CouponsDialog = () => {
//     if (!showCouponsDialog) return null

//     return (
//       <Dialog open={showCouponsDialog} onOpenChange={setShowCouponsDialog}>
//         <DialogContent className="max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="text-xl font-semibold text-[#8B2131] flex items-center">
//               <Gift className="h-5 w-5 mr-2" />
//               Available Coupons
//             </DialogTitle>
//           </DialogHeader>
//           {error && (
//             <div className="bg-red-50 border border-red-200 rounded-lg p-3">
//               <p className="text-red-600 text-sm">{error}</p>
//             </div>
//           )}
//           <div className="space-y-4 max-h-[60vh] overflow-y-auto">
//             {couponLoading ? (
//               <div className="flex items-center justify-center py-8">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B2131]"></div>
//                 <span className="ml-2">Loading coupons...</span>
//               </div>
//             ) : availableCoupons.length === 0 ? (
//               <div className="text-center py-8">
//                 <Gift className="h-12 w-12 mx-auto text-gray-400 mb-3" />
//                 <p className="text-gray-500">No available coupons found.</p>
//               </div>
//             ) : (
//               availableCoupons.map((coupon) => (
//                 <Card key={coupon.id} className="border-l-4 border-l-[#8B2131]">
//                   <CardContent className="p-4">
//                     <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-3">
//                       <div className="flex-1">
//                         <h3 className="font-semibold text-[#8B2131] text-lg">{coupon.coupon_code}</h3>
//                         <p className="text-sm text-gray-600 mt-1">
//                           Save {formatPrice(coupon.discount)} on orders above {formatPrice(coupon.min_amount)}
//                         </p>
//                       </div>
//                       <div className="flex gap-2 w-full sm:w-auto">
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => handleCopyCoupon(coupon.coupon_code)}
//                           className="text-[#8B2131] hover:text-[#6d1926] hover:bg-[#f8ece9] flex-1 sm:flex-none"
//                         >
//                           <Copy className="h-4 w-4 mr-1" />
//                           Copy
//                         </Button>
//                         <Button
//                           size="sm"
//                           onClick={() => handleApplyCouponFromModal(coupon.coupon_code)}
//                           className="bg-[#8B2131] hover:bg-[#6d1926] flex-1 sm:flex-none"
//                           disabled={couponApplied?.code === coupon.coupon_code}
//                         >
//                           {couponApplied?.code === coupon.coupon_code ? "Applied" : "Apply"}
//                         </Button>
//                       </div>
//                     </div>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
//                       <div>
//                         <span className="text-gray-500">Min Purchase:</span>
//                         <span className="ml-1 font-medium">{formatPrice(coupon.min_amount)}</span>
//                       </div>
//                       <div>
//                         <span className="text-gray-500">Offer Amount:</span>
//                         <span className="ml-1 font-medium">{formatPrice(coupon.min_offer_amount)}</span>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))
//             )}
//           </div>
//           <div className="flex justify-end pt-4 border-t">
//             <Button
//               variant="outline"
//               onClick={() => {
//                 setShowCouponsDialog(false)
//                 setError(null)
//               }}
//             >
//               Close
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
//       <div className="container mx-auto px-4 py-8 max-w-7xl">
//         <div className="mb-8">
//           <Link
//             to="/cart"
//             className="inline-flex items-center text-gray-600 hover:text-[#8B2131] transition-colors mb-4 group"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
//             <span>Back to Cart</span>
//           </Link>
//           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//             <div>
//               <h1 className="text-3xl sm:text-4xl font-bold text-[#8B2131] mb-2">Secure Checkout</h1>
//               <p className="text-gray-600">Complete your purchase with confidence</p>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2 space-y-6">
//             <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
//               <CardHeader className="pb-4">
//                 <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//                   <div className="flex items-center">
//                     <div className="bg-[#8B2131] text-white rounded-full p-2 mr-3">
//                       <MapPin className="h-5 w-5" />
//                     </div>
//                     <span className="text-xl font-semibold text-[#8B2131]">Shipping Address</span>
//                   </div>
//                   <Button
//                     variant="outline"
//                     className="border-[#8B2131] text-[#8B2131] hover:bg-[#8B2131] hover:text-white w-full sm:w-auto"
//                     onClick={() => navigate(`/addaddress/`)}
//                     disabled={showAddressDialog}
//                   >
//                     <Plus className="h-4 w-4 mr-2" />
//                     Add Address
//                   </Button>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="bg-white">
//                 {(error || cartError) && (
//                   <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
//                     <p className="text-red-600 text-sm">{error || cartError}</p>
//                   </div>
//                 )}

//                 {loading || cartLoading ? (
//                   <div className="flex items-center justify-center py-8">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B2131]"></div>
//                     <span className="ml-2">Loading addresses...</span>
//                   </div>
//                 ) : addresses.length === 0 ? (
//                   <div className="text-center py-12">
//                     <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-3" />
//                     <p className="text-gray-500 mb-4">No addresses found</p>
//                     <Button onClick={() => setShowAddressDialog(true)} className="bg-[#8B2131] hover:bg-[#6d1926]">
//                       Add Your First Address
//                     </Button>
//                   </div>
//                 ) : (
//                   <RadioGroup
//                     value={selectedAddress?.toString()}
//                     onValueChange={(value) => setSelectedAddress(Number.parseInt(value))}
//                   >
//                     <div className="space-y-4">
//                       {addresses.map((address) => (
//                         <div
//                           key={address.id}
//                           className={`relative border rounded-xl p-4 transition-all duration-200 cursor-pointer ${
//                             selectedAddress === address.id
//                               ? "border-[#8B2131] bg-gradient-to-r from-[#8B2131]/5 to-orange-50 shadow-md"
//                               : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
//                           }`}
//                         >
//                           <div className="flex items-start space-x-4">
//                             <RadioGroupItem
//                               value={address.id.toString()}
//                               id={`address-${address.id}`}
//                               className="mt-1"
//                             />
//                             <div className="flex-1">
//                               <div className="flex flex-wrap items-center gap-2 mb-2">
//                                 <Label
//                                   htmlFor={`address-${address.id}`}
//                                   className="font-semibold text-gray-900 cursor-pointer"
//                                 >
//                                   {address.name}
//                                 </Label>
//                                 {address.isDefault && (
//                                   <Badge
//                                     variant="secondary"
//                                     className="bg-[#8B2131]/10 text-[#8B2131] border-[#8B2131]/20"
//                                   >
//                                     <Star className="h-3 w-3 mr-1" />
//                                     Default
//                                   </Badge>
//                                 )}
//                                 <Badge variant="outline" className="text-xs">
//                                   {address.type === "home" ? (
//                                     <>
//                                       <Home className="h-3 w-3 mr-1" />
//                                       Home
//                                     </>
//                                   ) : (
//                                     <>
//                                       <Building className="h-3 w-3 mr-1" />
//                                       Work
//                                     </>
//                                   )}
//                                 </Badge>
//                               </div>
//                               <p className="text-gray-600 text-sm mb-1">
//                                 {address.house_no}
//                                 {address.landmark ? `, ${address.landmark}` : ""}
//                               </p>
//                               <p className="text-gray-600 text-sm mb-1">
//                                 {address.city}, {address.state} - {address.pincode}
//                               </p>
//                               <p className="text-gray-600 text-sm">Phone: {address.phone}</p>
//                               {address.alternate_number && (
//                                 <p className="text-gray-600 text-sm">Alternate: {address.alternate_number}</p>
//                               )}
//                               <div className="flex flex-wrap items-center gap-3 mt-3">
//                                 <Button
//                                   variant="ghost"
//                                   size="sm"
//                                   className="text-[#8B2131] hover:text-[#6d1926] hover:bg-[#8B2131]/10"
//                                   onClick={(e) => {
//                                     e.stopPropagation()
//                                     startEditAddress(address)
//                                   }}
//                                 >
//                                   <Edit className="h-4 w-4 mr-1" />
//                                   Edit
//                                 </Button>
//                                 <Button
//                                   variant="ghost"
//                                   size="sm"
//                                   className="text-red-600 hover:text-red-700 hover:bg-red-50"
//                                   onClick={(e) => {
//                                     e.stopPropagation()
//                                     handleRemoveAddress(address.id)
//                                   }}
//                                 >
//                                   <Trash2 className="h-4 w-4 mr-1" />
//                                   Delete
//                                 </Button>
//                                 {!address.isDefault && (
//                                   <Button
//                                     variant="ghost"
//                                     size="sm"
//                                     className="text-green-600 hover:text-green-700 hover:bg-green-50"
//                                     onClick={(e) => {
//                                       e.stopPropagation()
//                                       setDefaultAddress(address.id)
//                                     }}
//                                   >
//                                     <Star className="h-4 w-4 mr-1" />
//                                     Set Default
//                                   </Button>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </RadioGroup>
//                 )}
//               </CardContent>
//             </Card>

//             <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
//               <CardHeader className="pb-4">
//                 <CardTitle className="flex items-center">
//                   <div className="bg-[#8B2131] text-white rounded-full p-2 mr-3">
//                     <CreditCard className="h-5 w-5" />
//                   </div>
//                   <span className="text-xl font-semibold text-[#8B2131]">Payment Method</span>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
//                   <div className="space-y-4">
//                     <div
//                       className={`relative border rounded-xl p-4 transition-all duration-200 cursor-pointer ${
//                         selectedPayment === "card"
//                           ? "border-[#8B2131] bg-gradient-to-r from-[#8B2131]/5 to-orange-50 shadow-md"
//                           : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
//                       }`}
//                     >
//                       <div className="flex items-center space-x-4">
//                         <RadioGroupItem value="card" id="card" />
//                         <div className="flex-1">
//                           <Label htmlFor="card" className="font-medium cursor-pointer flex items-center">
//                             <CreditCard className="h-5 w-5 mr-2 text-[#8B2131]" />
//                             Credit/Debit Card
//                           </Label>
//                           <p className="text-sm text-gray-500 mt-1">Pay securely with your card via Razorpay</p>
//                         </div>
//                         <div className="flex space-x-1">
//                           <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
//                             VISA
//                           </div>
//                           <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
//                             MC
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <div
//                       className={`relative border rounded-xl p-4 transition-all duration-200 cursor-pointer ${
//                         selectedPayment === "wallet"
//                           ? "border-[#8B2131] bg-gradient-to-r from-[#8B2131]/5 to-orange-50 shadow-md"
//                           : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
//                       }`}
//                     >
//                       <div className="flex items-center space-x-4">
//                         <RadioGroupItem value="wallet" id="wallet" />
//                         <div className="flex-1">
//                           <Label htmlFor="wallet" className="font-medium cursor-pointer flex items-center">
//                             <Wallet className="h-5 w-5 mr-2 text-[#8B2131]" />
//                             Wallet
//                           </Label>
//                           <p className="text-sm text-gray-500 mt-1">Pay using your wallet balance</p>
//                         </div>
//                       </div>
//                     </div>

//                     <div
//                       className={`relative border rounded-xl p-4 transition-all duration-200 cursor-${
//                         isCodDisabled ? "not-allowed" : "pointer"
//                       } opacity-${isCodDisabled ? "50" : "100"}`}
//                     >
//                       <div className="flex items-center space-x-4">
//                         <RadioGroupItem value="cod" id="cod" disabled={isCodDisabled} />
//                         <div className="flex-1">
//                           <Label
//                             htmlFor="cod"
//                             className={`font-medium flex items-center ${
//                               isCodDisabled ? "cursor-not-allowed text-gray-400" : "cursor-pointer"
//                             }`}
//                           >
//                             <Truck className="h-5 w-5 mr-2 text-[#8B2131]" />
//                             Cash on Delivery
//                           </Label>
//                           <p className="text-sm text-gray-500 mt-1">
//                             {isCodDisabled
//                               ? "Not available for orders above ₹1000"
//                               : "Pay when you receive your order"}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </RadioGroup>
//               </CardContent>
//             </Card>
//           </div>

//           <div className="lg:col-span-1">
//             <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm sticky top-6">
//               <CardHeader className="pb-4">
//                 <CardTitle className="text-xl font-semibold text-[#8B2131]">Order Summary</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div className="space-y-4 max-h-[60vh] overflow-y-auto">
//                   {cart?.items?.length > 0 ? (
//                     cart.items.map((item) => (
//                       <div key={item.id}>
//                         <div className="flex gap-4">
//                           <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
//                             <img
//                               src={
//                                 item.primary_image
//                                   ? `${BASE_URL}${item.primary_image}`
//                                   : "/placeholder.svg?height=64&width=64"
//                               }
//                               alt={item.product.name}
//                               className="w-full h-full object-cover"
//                             />
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <h3 className="text-sm font-medium text-gray-900 truncate">{item.product.name}</h3>
//                             <div className="flex justify-between items-center mt-1">
//                               <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
//                               <span className="text-sm font-semibold text-[#8B2131]">
//                                 {formatPrice(item.final_price)}
//                               </span>
//                             </div>
//                             {item.discount_amount > 0 && (
//                               <div className="flex justify-between items-center mt-1">
//                                 <span className="text-xs text-green-600 flex items-center">
//                                   <Tag className="h-3 w-3 mr-1" />
//                                   Discount
//                                 </span>
//                                 <span className="text-xs text-green-600">
//                                   -{formatPrice(item.discount_amount)}
//                                 </span>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                         <Separator className="my-3" />
//                       </div>
//                     ))
//                   ) : (
//                     <div className="text-center py-8">
//                       <p className="text-gray-500">Your cart is empty</p>
//                       <Link to="/cart" className="text-[#8B2131] hover:underline">
//                         Go to Cart
//                       </Link>
//                     </div>
//                   )}
//                 </div>

//                 <div className="space-y-3">
//                   <div className="flex gap-2">
//                     <Input
//                       value={couponCode}
//                       onChange={(e) => setCouponCode(e.target.value)}
//                       placeholder="Enter coupon code"
//                       className="flex-1"
//                       disabled={couponApplied}
//                     />
//                     {couponApplied ? (
//                       <Button
//                         variant="ghost"
//                         onClick={handleRemoveCoupon}
//                         className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0"
//                       >
//                         Remove
//                       </Button>
//                     ) : (
//                       <Button
//                         onClick={handleApplyCoupon}
//                         disabled={!couponCode.trim()}
//                         className="bg-[#8B2131] hover:bg-[#6d1926] shrink-0"
//                       >
//                         Apply
//                       </Button>
//                     )}
//                   </div>

//                   <Button
//                     variant="outline"
//                     onClick={() => {
//                       fetchAvailableCoupons()
//                       setShowCouponsDialog(true)
//                     }}
//                     className="w-full border-[#8B2131] text-[#8B2131] hover:bg-[#8B2131] hover:text-white"
//                   >
//                     <Gift className="h-4 w-4 mr-2" />
//                     View Available Coupons
//                   </Button>

//                   {couponError && <p className="text-red-600 text-sm">{couponError}</p>}
//                   {couponApplied && (
//                     <div className="bg-green-50 border border-green-200 rounded-lg p-3">
//                       <p className="text-green-700 font-medium text-sm">
//                         🎉 Coupon "{couponApplied.code}" applied!
//                       </p>
//                       <p className="text-green-600 text-sm">You saved {formatPrice(couponApplied.discount)}</p>
//                     </div>
//                   )}
//                 </div>

//                 <div className="space-y-3 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Subtotal</span>
//                     <span className="font-medium">{formatPrice(subtotal)}</span>
//                   </div>
//                   {totalDiscount > 0 && (
//                     <div className="flex justify-between text-green-600">
//                       <span className="flex items-center">
//                         <Tag className="h-3 w-3 mr-1" />
//                         Item Discount
//                       </span>
//                       <span>-{formatPrice(totalDiscount)}</span>
//                     </div>
//                   )}
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Tax</span>
//                     <span className="font-medium">{formatPrice(totalTax)}</span>
//                   </div>
//                   {couponApplied && (
//                     <div className="flex justify-between text-green-600">
//                       <span className="flex items-center">
//                         <Gift className="h-3 w-3 mr-1" />
//                         Coupon Discount
//                       </span>
//                       <span>-{formatPrice(couponApplied.discount)}</span>
//                     </div>
//                   )}
//                   <div className="flex justify-between">
//                     <span className="text-gray-600 flex items-center">
//                       <Truck className="h-4 w-4 mr-1" />
//                       Delivery
//                     </span>
//                     <span className="font-medium">{formatPrice(shipping)}</span>
//                   </div>
//                   <Separator />
//                   <div className="flex justify-between text-lg text-[#8B2131]">
//                     <span className="font-semibold">Total</span>
//                     <span className="font-bold">{formatPrice(total)}</span>
//                   </div>
//                 </div>

//                 <Button
//                   className="w-full bg-gradient-to-r from-[#8B2131] to-[#B33A3A] hover:bg-[#6d1926] text-white py-6 text-lg font-semibold shadow-md"
//                   disabled={
//                     !addresses.length ||
//                     !cart?.items?.length ||
//                     isPlacingOrder ||
//                     (selectedPayment === "card" && !isRazorpayLoaded)
//                   }
//                   onClick={handlePlaceOrder}
//                 >
//                   {isPlacingOrder ? (
//                     <div className="flex items-center justify-center">
//                       <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                       Processing...
//                     </div>
//                   ) : (
//                     <div className="flex items-center justify-center">
//                       Place Order {formatPrice(total)}
//                       <ChevronRight className="h-5 w-5 ml-2" />
//                     </div>
//                   )}
//                 </Button>

//                 <div className="flex items-center justify-center text-gray-500 text-xs pt-4">
//                   <ShieldCheck className="h-4 w-4 mr-1 text-gray-400" />
//                   Secured by 256-bit SSL encryption
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>

//         <AddressDialog
//           open={showAddressDialog}
//           onOpenChange={setShowAddressDialog}
//           editingAddress={editingAddress}
//           setEditingAddress={setEditingAddress}
//           newAddress={newAddress}
//           setNewAddress={setNewAddress}
//           error={error}
//           setError={setError}
//           handleAddAddress={handleAddAddress}
//           handleEditAddress={handleEditAddress}
//         />
//         <CouponsDialog />
//         <PaymentFailedModal />
//       </div>
//     </div>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/Context/CartContext"
import { Link, useNavigate } from "react-router-dom"
import api from "../../api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  ArrowLeft,
  MapPin,
  Plus,
  Home,
  Building,
  Edit,
  Trash2,
  Tag,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Wallet,
  Copy,
  Gift,
  Truck,
  Star,
  XCircle,
  AlertTriangle,
} from "lucide-react"
import AddressDialog from "./AddressDialog"

export default function CheckoutPage() {
  const { cart, fetchCart, clearCart, loading: cartLoading, error: cartError, setCart } = useCart()
  const navigate = useNavigate()

  const BASE_URL = import.meta.env.VITE_BASE_URL

  const [loading, setLoading] = useState(true)
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false)
  const [addresses, setAddresses] = useState([])
  const [error, setError] = useState(null)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [couponError, setCouponError] = useState(null)
  const [couponApplied, setCouponApplied] = useState(null)
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [selectedPayment, setSelectedPayment] = useState("card")
  const [showAddressDialog, setShowAddressDialog] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [newAddress, setNewAddress] = useState({
    name: "",
    type: "home",
    house_no: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    alternate_number: "",
    isDefault: false,
  })
  const [showCouponsDialog, setShowCouponsDialog] = useState(false)
  const [availableCoupons, setAvailableCoupons] = useState([])
  const [couponLoading, setCouponLoading] = useState(false)
  const [walletBalance, setWalletBalance] = useState(0)

  const [showPaymentFailedModal, setShowPaymentFailedModal] = useState(false)
  const [paymentFailureData, setPaymentFailureData] = useState({
    orderId: null,
    errorMessage: "",
    errorDescription: "",
  })

  const toast = ({ title, description, variant }) => {
    console.log(`Toast: ${title} - ${description} (${variant})`)
    setError(description)
  }

  const handleApiError = (err, defaultMessage) => {
    const message = err.response?.data?.message || err.response?.data?.error || defaultMessage
    setError(message)
    console.log(`Error: ${message}`)
  }

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    script.onload = () => {
      console.log("Razorpay script loaded")
      setIsRazorpayLoaded(true)
    }
    script.onerror = () => {
      console.error("Failed to load Razorpay script")
      handleApiError(
        new Error("Payment service unavailable"),
        "Payment service is unavailable. Please try another payment method.",
      )
    }
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  useEffect(() => {
    if (!cart) {
      fetchCart()
    }
  }, [cart, fetchCart])

  useEffect(() => {
    console.log("Cart data:", cart)
    if (cart?.coupon && cart?.final_coupon_discount > 0 && cart.coupon.coupon_code) {
      setCouponApplied({
        code: cart.coupon.coupon_code,
        discount: cart.final_coupon_discount,
      })
      setCouponCode(cart.coupon.coupon_code)
      console.log("couponApplied set:", { code: cart.coupon.coupon_code, discount: cart.final_coupon_discount })
    } else {
      console.log("Coupon not applied: missing coupon_code or invalid cart data")
      setCouponApplied(null)
      setCouponCode("")
    }
  }, [cart])

  useEffect(() => {
    fetchAddress()
    fetchWalletBalance()
  }, [])

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      setSelectedAddress(addresses.find((addr) => addr.isDefault)?.id || addresses[0].id)
    }
  }, [addresses])

  const fetchAddress = async () => {
    setLoading(true)
    try {
      const response = await api.get("address/")
      const mappedAddresses = response.data.map((addr) => ({
        id: addr.id,
        name: addr.name,
        type: addr.address_type,
        house_no: addr.house_no,
        landmark: addr.landmark || "",
        city: addr.city,
        state: addr.state,
        pincode: addr.pin_code,
        phone: addr.mobile_number,
        alternate_number: addr.alternate_number || "",
        isDefault: addr.isDefault || false,
      }))
      setAddresses(mappedAddresses)
      setError(null)
    } catch (err) {
      handleApiError(err, "Failed to fetch addresses")
      setAddresses([])
    } finally {
      setLoading(false)
    }
  }

  const fetchWalletBalance = async () => {
    try {
      const response = await api.get("wallet/balance/")
      setWalletBalance(response.data.balance || 0)
      setError(null)
    } catch (err) {
      handleApiError(err, "Failed to fetch wallet balance")
      setWalletBalance(0)
    }
  }

  const fetchAvailableCoupons = async () => {
    setCouponLoading(true)
    try {
      const response = await api.get("offer/user/available-coupons/")
      setAvailableCoupons(response.data)
      setError(null)
    } catch (err) {
      handleApiError(err, "Failed to fetch available coupons")
      setAvailableCoupons([])
    } finally {
      setCouponLoading(false)
    }
  }

  const handleCopyCoupon = (code) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        toast({
          title: "Success",
          description: `Coupon code ${code} copied to clipboard!`,
          variant: "success",
        })
      })
      .catch(() => {
        handleApiError(new Error("Failed to copy coupon code"), "Failed to copy coupon code")
      })
  }

  const handleApplyCouponFromModal = async (code) => {
    setCouponCode(code)
    await handleApplyCoupon()
    setShowCouponsDialog(false)
  }

  const cartItems =
    cart?.items?.map((item) => ({
      id: item.id,
      name: item.product.name,
      price: item.variant.total_price,
      quantity: item.quantity,
      tax: item.tax_amount,
      discount: item.discount_amount,
      final_price: item.final_price,
      image: item.primary_image,
    })) || []

  const subtotal = cart?.final_subtotal || 0
  const totalTax = cart?.final_tax || 0
  const totalDiscount = cart?.final_discount || 0
  const total = cart?.final_total || 0
  const shipping = cart?.shipping || 0
  const isCodDisabled = total > 1000
  const isWalletDisabled = walletBalance < total

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const validateAddress = (address) => {
    const errors = []
    if (!address.name.trim()) errors.push("Full name is required")
    if (!address.house_no.trim()) errors.push("House number is required")
    if (!address.city.trim()) errors.push("City is required")
    if (!address.state.trim()) errors.push("State is required")
    if (!address.pincode || !/^\d{6}$/.test(address.pincode)) errors.push("Valid 6-digit PIN code is required")
    if (!address.phone || !/^\d{10}$/.test(address.phone)) errors.push("Valid 10-digit phone number is required")
    if (address.alternate_number && !/^\d{10}$/.test(address.alternate_number))
      errors.push("Valid 10-digit alternate number is required")
    return errors
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code")
      return
    }
    try {
      const response = await api.post("cartapp/apply-coupon/", { code: couponCode.trim() })
      setCouponApplied({ code: couponCode, discount: response.data.discount })
      setCouponError(null)
      setError(null)
      await fetchCart()
    } catch (err) {
      setCouponError(err.response?.data?.error || "Invalid coupon code")
      setCouponApplied(null)
    }
  }

  const handleRemoveCoupon = async () => {
    try {
      await api.post("cartapp/remove-coupon/")
      setCouponApplied(null)
      setCouponCode("")
      setCouponError(null)
      fetchCart()
    } catch (err) {
      setCouponError("Failed to remove coupon")
    }
  }

  const handleAddAddress = async () => {
    const errors = validateAddress(newAddress)
    if (errors.length > 0) {
      handleApiError(new Error(errors.join(", ")), errors.join(", "))
      return
    }
    try {
      const response = await api.post("address/", {
        name: newAddress.name.trim(),
        house_no: newAddress.house_no.trim(),
        address_type: newAddress.type,
        city: newAddress.city.trim(),
        state: newAddress.state.trim(),
        pin_code: newAddress.pincode,
        mobile_number: newAddress.phone,
        landmark: newAddress.landmark || null,
        alternate_number: newAddress.alternate_number || null,
        isDefault: newAddress.isDefault,
      })
      const newId = response.data.id
      const updatedAddresses = newAddress.isDefault
        ? addresses.map((addr) => ({ ...addr, isDefault: false }))
        : [...addresses]
      setAddresses([
        ...updatedAddresses,
        {
          id: newId,
          name: newAddress.name,
          type: newAddress.type,
          house_no: newAddress.house_no,
          landmark: newAddress.landmark || "",
          city: newAddress.city,
          state: newAddress.state,
          pincode: newAddress.pincode,
          phone: newAddress.phone,
          alternate_number: newAddress.alternate_number || "",
          isDefault: newAddress.isDefault,
        },
      ])
      setSelectedAddress(newId)
      setNewAddress({
        name: "",
        type: "home",
        house_no: "",
        landmark: "",
        city: "",
        state: "",
        pincode: "",
        phone: "",
        alternate_number: "",
        isDefault: false,
      })
      setShowAddressDialog(false)
      setError(null)
    } catch (err) {
      handleApiError(err, "Failed to add address")
    }
  }

  const handleEditAddress = async () => {
    const errors = validateAddress(editingAddress)
    if (errors.length > 0) {
      handleApiError(new Error(errors.join(", ")), errors.join(", "))
      return
    }
    try {
      const response = await api.patch(`address/${editingAddress.id}/`, {
        name: editingAddress.name.trim(),
        house_no: editingAddress.house_no.trim(),
        address_type: editingAddress.type,
        city: editingAddress.city.trim(),
        state: editingAddress.state.trim(),
        pin_code: editingAddress.pincode,
        mobile_number: editingAddress.phone,
        landmark: editingAddress.landmark || null,
        alternate_number: editingAddress.alternate_number || null,
        isDefault: editingAddress.isDefault,
      })
      const updatedAddresses = addresses.map((addr) => {
        if (addr.id === editingAddress.id) {
          return {
            ...editingAddress,
            house_no: editingAddress.house_no,
            landmark: editingAddress.landmark || "",
            alternate_number: editingAddress.alternate_number || "",
          }
        }
        return { ...addr, isDefault: editingAddress.isDefault ? false : addr.isDefault }
      })
      setAddresses(updatedAddresses)
      setEditingAddress(null)
      setShowAddressDialog(false)
      setError(null)
    } catch (err) {
      handleApiError(err, "Failed to update address")
    }
  }

  const handleRemoveAddress = async (id) => {
    try {
      await api.delete(`address/${id}/`)
      const updatedAddresses = addresses.filter((addr) => addr.id !== id)
      if (id === selectedAddress && updatedAddresses.length > 0) {
        setSelectedAddress(updatedAddresses.find((addr) => addr.isDefault)?.id || updatedAddresses[0].id)
      } else if (updatedAddresses.length === 0) {
        setSelectedAddress(null)
      }
      setAddresses(updatedAddresses)
      setError(null)
    } catch (err) {
      handleApiError(err, "Failed to remove address")
    }
  }

  const setDefaultAddress = async (id) => {
    try {
      await api.patch(`address/${id}/`, { isDefault: true })
      const updatedAddresses = addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id ? true : false,
      }))
      setAddresses(updatedAddresses)
      setSelectedAddress(id)
      setError(null)
    } catch (err) {
      handleApiError(err, "Failed to set default address")
      await fetchAddress()
    }
  }

  const startEditAddress = (address) => {
    setEditingAddress({
      ...address,
      house_no: address.house_no,
      landmark: address.landmark || "",
      alternate_number: address.alternate_number || "",
    })
    setShowAddressDialog(true)
  }

  const handlePaymentFailure = (orderId, errorMessage, errorDescription) => {
    setPaymentFailureData({
      orderId,
      errorMessage,
      errorDescription,
    })
    setShowPaymentFailedModal(true)
    setIsPlacingOrder(false)
  }

  const handleGoToOrderDetails = () => {
    setShowPaymentFailedModal(false)
    if (paymentFailureData.orderId) {
      navigate(`/order-details/${paymentFailureData.orderId}`, {
        state: { paymentStatus: "failed", order: paymentFailureData.orderId },
      })
    }
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      handleApiError(new Error("Please select a shipping address"), "Please select a shipping address")
      return
    }
    if (selectedPayment === "card" && !isRazorpayLoaded) {
      handleApiError(
        new Error("Payment service is loading"),
        "Payment service is loading. Please wait or try another payment method.",
      )
      return
    }
    if (selectedPayment === "cod" && isCodDisabled) {
      handleApiError(
        new Error("Cash on Delivery is not available"),
        "Cash on Delivery is not available for orders above ₹1000.",
      )
      return
    }
    if (selectedPayment === "wallet" && isWalletDisabled) {
      handleApiError(
        new Error("Insufficient wallet balance"),
        "Your wallet balance is insufficient to complete this purchase.",
      )
      return
    }
    setIsPlacingOrder(true)
    try {
      const couponData = couponApplied && couponApplied.code ? { coupon_code: couponApplied.code } : {}
      if (selectedPayment === "card") {
        if (!window.Razorpay) {
          handleApiError(
            new Error("Payment service unavailable"),
            "Payment service is unavailable. Please try another payment method.",
          )
          setIsPlacingOrder(false)
          return
        }

        const response = await api.post("cartapp/orders/razorpay/create/", {
          address_id: selectedAddress,
          payment_method: "card",
          ...couponData,
        })
        if (!response.data.order_id || !response.data.amount) {
          throw new Error("Invalid Razorpay response: missing order_id or amount")
        }
        const { order_id: razorpayOrderId, amount, currency, key, order } = response.data

        const options = {
          key: key,
          amount: amount,
          currency: currency,
          name: "Vishali Gold",
          description: `Payment for Order #${order.order_number}`,
          order_id: razorpayOrderId,
          handler: async (response) => {
            try {
              const verifyResponse = await api.post("cartapp/orders/razorpay/verify/", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })
              if (verifyResponse.data.order_id) {
                navigate(`/order-details/${verifyResponse.data.order_id}`, {
                  state: { paymentStatus: "success", order: verifyResponse.data.order_id },
                })
              } else {
                await clearCart()
              }
              setIsPlacingOrder(false)
            } catch (err) {
              console.error("Payment verification error:", err.response?.data, err.message)
              const orderId = err.response?.data?.order_id || order.id
              handlePaymentFailure(
                orderId,
                "Payment Verification Failed",
                "Payment verification failed. Please contact support if amount was deducted.",
              )
            }
          },
          prefill: {
            name: addresses.find((addr) => addr.id === selectedAddress)?.name || "",
            email: "customer@example.com",
            contact: addresses.find((addr) => addr.id === selectedAddress)?.phone || "",
          },
          notes: {
            address_id: selectedAddress,
            order_id: response.data.order.id,
          },
          theme: {
            color: "#8B2131",
          },
          modal: {
            ondismiss: async () => {
              setIsPlacingOrder(false)
              try {
                await api.post("cartapp/orders/cancel/", { order_id: response.data.order.id })
                console.log("Pending order cancelled")
              } catch (err) {
                console.error("Failed to cancel order:", err)
              }
            },
          },
        }

        try {
          const rzp = new window.Razorpay(options)
          rzp.on("payment.failed", async (response) => {
            console.error("Razorpay payment failed:", response.error)
            try {
              await api.post("cartapp/orders/cancel/", { order_id: order.id })
              console.log("Failed order cancelled")
            } catch (err) {
              console.error("Failed to cancel order:", err)
            }

            handlePaymentFailure(
              order.id,
              "Payment Failed",
              response.error.description || "Your payment could not be processed. Please try again.",
            )
          })
          rzp.open()
        } catch (err) {
          console.error("Razorpay modal error:", err)
          setIsPlacingOrder(false)
          try {
            await api.post("cartapp/orders/cancel/", { order_id: order.id })
            console.log("Pending order cancelled")
          } catch (cancelErr) {
            console.error("Failed to cancel order:", cancelErr)
          }
          handlePaymentFailure(
            order.id,
            "Payment Initialization Failed",
            "Failed to initialize payment. Please try again.",
          )
        }
      } else {
        const response = await api.post("cartapp/orders/create/", {
          address_id: selectedAddress,
          payment_method: selectedPayment,
          ...couponData,
        })
        if (response.data.cart) {
          setCart(response.data.cart)
        } else {
          await clearCart()
        }
        navigate(`/order-details/${response.data.order.id}`, {
          state: { paymentStatus: "success", order: response.data.order },
        })
        setIsPlacingOrder(false)
      }
    } catch (error) {
      console.error("Place order error details:", error.response?.data, error.message)
      handleApiError(error, "Failed to place order. Please try again.")
      setIsPlacingOrder(false)
    }
  }

  const PaymentFailedModal = () => {
    if (!showPaymentFailedModal) return null

    return (
      <Dialog open={showPaymentFailedModal} onOpenChange={setShowPaymentFailedModal}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-red-600 flex items-center">
              <XCircle className="h-6 w-6 mr-2" />
              Payment Failed
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium text-gray-900">{paymentFailureData.errorMessage}</h3>
              <p className="text-sm text-gray-600">{paymentFailureData.errorDescription}</p>
              {paymentFailureData.orderId && (
                <p className="text-xs text-gray-500 mt-2">Order ID: #{paymentFailureData.orderId}</p>
              )}
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> If amount was deducted from your account, it will be refunded within 5-7 business
                days.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowPaymentFailedModal(false)} className="w-full sm:w-auto">
              Try Again
            </Button>
            <Button
              onClick={handleGoToOrderDetails}
              className="bg-[#8B2131] hover:bg-[#6d1926] w-full sm:w-auto"
              disabled={!paymentFailureData.orderId}
            >
              View Order Details
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const CouponsDialog = () => {
    if (!showCouponsDialog) return null

    return (
      <Dialog open={showCouponsDialog} onOpenChange={setShowCouponsDialog}>
        <DialogContent className="max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-[#8B2131] flex items-center">
              <Gift className="h-5 w-5 mr-2" />
              Available Coupons
            </DialogTitle>
          </DialogHeader>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {couponLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B2131]"></div>
                <span className="ml-2">Loading coupons...</span>
              </div>
            ) : availableCoupons.length === 0 ? (
              <div className="text-center py-8">
                <Gift className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500">No available coupons found.</p>
              </div>
            ) : (
              availableCoupons.map((coupon) => (
                <Card key={coupon.id} className="border-l-4 border-l-[#8B2131]">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#8B2131] text-lg">{coupon.coupon_code}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Save {formatPrice(coupon.discount)} on orders above {formatPrice(coupon.min_amount)}
                        </p>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyCoupon(coupon.coupon_code)}
                          className="text-[#8B2131] hover:text-[#6d1926] hover:bg-[#f8ece9] flex-1 sm:flex-none"
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApplyCouponFromModal(coupon.coupon_code)}
                          className="bg-[#8B2131] hover:bg-[#6d1926] flex-1 sm:flex-none"
                          disabled={couponApplied?.code === coupon.coupon_code}
                        >
                          {couponApplied?.code === coupon.coupon_code ? "Applied" : "Apply"}
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Min Purchase:</span>
                        <span className="ml-1 font-medium">{formatPrice(coupon.min_amount)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Offer Amount:</span>
                        <span className="ml-1 font-medium">{formatPrice(coupon.min_offer_amount)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          <div className="flex justify-end pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setShowCouponsDialog(false)
                setError(null)
              }}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center text-gray-600 hover:text-[#8B2131] transition-colors mb-4 group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Cart</span>
          </Link>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#8B2131] mb-2">Secure Checkout</h1>
              <p className="text-gray-600">Complete your purchase with confidence</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center">
                    <div className="bg-[#8B2131] text-white rounded-full p-2 mr-3">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <span className="text-xl font-semibold text-[#8B2131]">Shipping Address</span>
                  </div>
                  <Button
                    variant="outline"
                    className="border-[#8B2131] text-[#8B2131] hover:bg-[#8B2131] hover:text-white w-full sm:w-auto"
                    onClick={() => navigate("/addaddress/")}
                    disabled={showAddressDialog}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Address
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-white">
                {(error || cartError) && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <p className="text-red-600 text-sm">{error || cartError}</p>
                  </div>
                )}

                {loading || cartLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B2131]"></div>
                    <span className="ml-2">Loading addresses...</span>
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-12">
                    <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-500 mb-4">No addresses found</p>
                    <Button onClick={() => setShowAddressDialog(true)} className="bg-[#8B2131] hover:bg-[#6d1926]">
                      Add Your First Address
                    </Button>
                  </div>
                ) : (
                  <RadioGroup
                    value={selectedAddress?.toString()}
                    onValueChange={(value) => setSelectedAddress(Number.parseInt(value))}
                  >
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          className={`relative border rounded-xl p-4 transition-all duration-200 cursor-pointer ${
                            selectedAddress === address.id
                              ? "border-[#8B2131] bg-gradient-to-r from-[#8B2131]/5 to-orange-50 shadow-md"
                              : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                          }`}
                        >
                          <div className="flex items-start space-x-4">
                            <RadioGroupItem
                              value={address.id.toString()}
                              id={`address-${address.id}`}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <Label
                                  htmlFor={`address-${address.id}`}
                                  className="font-semibold text-gray-900 cursor-pointer"
                                >
                                  {address.name}
                                </Label>
                                {address.isDefault && (
                                  <Badge
                                    variant="secondary"
                                    className="bg-[#8B2131]/10 text-[#8B2131] border-[#8B2131]/20"
                                  >
                                    <Star className="h-3 w-3 mr-1" />
                                    Default
                                  </Badge>
                                )}
                                <Badge variant="outline" className="text-xs">
                                  {address.type === "home" ? (
                                    <>
                                      <Home className="h-3 w-3 mr-1" />
                                      Home
                                    </>
                                  ) : (
                                    <>
                                      <Building className="h-3 w-3 mr-1" />
                                      Work
                                    </>
                                  )}
                                </Badge>
                              </div>
                              <p className="text-gray-600 text-sm mb-1">
                                {address.house_no}
                                {address.landmark ? `, ${address.landmark}` : ""}
                              </p>
                              <p className="text-gray-600 text-sm mb-1">
                                {address.city}, {address.state} - {address.pincode}
                              </p>
                              <p className="text-gray-600 text-sm">Phone: {address.phone}</p>
                              {address.alternate_number && (
                                <p className="text-gray-600 text-sm">Alternate: {address.alternate_number}</p>
                              )}
                              <div className="flex flex-wrap items-center gap-3 mt-3">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-[#8B2131] hover:text-[#6d1926] hover:bg-[#8B2131]/10"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    startEditAddress(address)
                                  }}
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleRemoveAddress(address.id)
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                                {!address.isDefault && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setDefaultAddress(address.id)
                                    }}
                                  >
                                    <Star className="h-4 w-4 mr-1" />
                                    Set Default
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center">
                  <div className="bg-[#8B2131] text-white rounded-full p-2 mr-3">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <span className="text-xl font-semibold text-[#8B2131]">Payment Method</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
                  <div className="space-y-4">
                    <div
                      className={`relative border rounded-xl p-4 transition-all duration-200 cursor-pointer ${
                        selectedPayment === "card"
                          ? "border-[#8B2131] bg-gradient-to-r from-[#8B2131]/5 to-orange-50 shadow-md"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <RadioGroupItem value="card" id="card" />
                        <div className="flex-1">
                          <Label htmlFor="card" className="font-medium cursor-pointer flex items-center">
                            <CreditCard className="h-5 w-5 mr-2 text-[#8B2131]" />
                            Credit/Debit Card
                          </Label>
                          <p className="text-sm text-gray-500 mt-1">Pay securely with your card via Razorpay</p>
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                            VISA
                          </div>
                          <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
                            MC
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`relative border rounded-xl p-4 transition-all duration-200 ${
                        isWalletDisabled
                          ? "opacity-50 cursor-not-allowed"
                          : selectedPayment === "wallet"
                            ? "border-[#8B2131] bg-gradient-to-r from-[#8B2131]/5 to-orange-50 shadow-md"
                            : "border-gray-200 hover:border-gray-300 hover:shadow-sm cursor-pointer"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <RadioGroupItem value="wallet" id="wallet" disabled={isWalletDisabled} />
                        <div className="flex-1">
                          <Label
                            htmlFor="wallet"
                            className={`font-medium flex items-center ${isWalletDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                          >
                            <Wallet className="h-5 w-5 mr-2 text-[#8B2131]" />
                            Wallet
                          </Label>
                          <p className="text-sm text-gray-500 mt-1">
                            {isWalletDisabled
                              ? `Insufficient balance (Available: ${formatPrice(walletBalance)})`
                              : `Pay using your wallet balance (Available: ${formatPrice(walletBalance)})`}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`relative border rounded-xl p-4 transition-all duration-200 ${
                        isCodDisabled
                          ? "opacity-50 cursor-not-allowed"
                          : selectedPayment === "cod"
                            ? "border-[#8B2131] bg-gradient-to-r from-[#8B2131]/5 to-orange-50 shadow-md"
                            : "border-gray-200 hover:border-gray-300 hover:shadow-sm cursor-pointer"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <RadioGroupItem value="cod" id="cod" disabled={isCodDisabled} />
                        <div className="flex-1">
                          <Label
                            htmlFor="cod"
                            className={`font-medium flex items-center ${isCodDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                          >
                            <Truck className="h-5 w-5 mr-2 text-[#8B2131]" />
                            Cash on Delivery
                          </Label>
                          <p className="text-sm text-gray-500 mt-1">
                            {isCodDisabled
                              ? "Cash on Delivery is not available for orders above ₹1000"
                              : "Pay when you receive your order"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm sticky top-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-[#8B2131]">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {cart?.items?.length > 0 ? (
                    cart.items.map((item) => (
                      <div key={item.id} className="space-y-3">
                        <div className="flex gap-3">
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                            <img
                              src={
                                item.primary_image
                                  ? `${BASE_URL}${item.primary_image}`
                                  : "/placeholder.svg?height=64&width=64"
                              }
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 truncate">{item.product.name}</h3>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                              <span className="text-sm font-semibold text-[#8B2131]">
                                {formatPrice(item.final_price)}
                              </span>
                            </div>
                            {item.discount_amount > 0 && (
                              <div className="flex justify-between items-center mt-1">
                                <span className="text-xs text-green-600 flex items-center">
                                  <Tag className="h-3 w-3 mr-1" />
                                  Discount
                                </span>
                                <span className="text-xs text-green-600">-{formatPrice(item.discount_amount)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Separator />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Your cart is empty</p>
                      <Link to="/cart" className="text-[#8B2131] hover:underline text-sm">
                        Go to cart
                      </Link>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-1"
                      disabled={couponApplied}
                    />
                    {couponApplied ? (
                      <Button
                        variant="ghost"
                        onClick={handleRemoveCoupon}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0"
                      >
                        Remove
                      </Button>
                    ) : (
                      <Button
                        onClick={handleApplyCoupon}
                        disabled={!couponCode.trim()}
                        className="bg-[#8B2131] hover:bg-[#6d1926] shrink-0"
                      >
                        Apply
                      </Button>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => {
                      fetchAvailableCoupons()
                      setShowCouponsDialog(true)
                    }}
                    className="w-full border-[#8B2131] text-[#8B2131] hover:bg-[#8B2131] hover:text-white"
                  >
                    <Gift className="h-4 w-4 mr-2" />
                    View Available Coupons
                  </Button>

                  {couponError && <p className="text-red-600 text-xs">{couponError}</p>}
                  {couponApplied && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-green-700 text-sm font-medium">🎉 Coupon "{couponApplied.code}" applied!</p>
                      <p className="text-green-600 text-xs">You saved {formatPrice(couponApplied.discount)}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="flex items-center">
                        <Tag className="h-4 w-4 mr-1" />
                        Item Discount
                      </span>
                      <span>-{formatPrice(totalDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">{formatPrice(totalTax)}</span>
                  </div>
                  {couponApplied && (
                    <div className="flex justify-between text-green-600">
                      <span className="flex items-center">
                        <Gift className="h-4 w-4 mr-1" />
                        Coupon Discount
                      </span>
                      <span>-{formatPrice(couponApplied.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600 flex items-center">
                      <Truck className="h-4 w-4 mr-1" />
                      Shipping
                    </span>
                    <span className="font-medium">{formatPrice(shipping)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold text-[#8B2131]">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-[#8B2131] to-[#a02a3a] hover:from-[#6d1926] hover:to-[#8B2131] text-white py-3 text-lg font-semibold shadow-lg"
                  disabled={
                    addresses.length === 0 ||
                    !cart?.items?.length ||
                    isPlacingOrder ||
                    (selectedPayment === "card" && !isRazorpayLoaded)
                  }
                  onClick={handlePlaceOrder}
                >
                  {isPlacingOrder ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span>Place Order {formatPrice(total)}</span>
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </div>
                  )}
                </Button>

                <div className="flex items-center justify-center text-xs text-gray-500 pt-2">
                  <ShieldCheck className="h-4 w-4 mr-1 text-green-600" />
                  <span>Secured by 256-bit SSL encryption</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <AddressDialog
          showAddressDialog={showAddressDialog}
          setShowAddressDialog={setShowAddressDialog}
          editingAddress={editingAddress}
          setEditingAddress={setEditingAddress}
          newAddress={newAddress}
          setNewAddress={setNewAddress}
          error={error}
          setError={setError}
          handleAddAddress={handleAddAddress}
          handleEditAddress={handleEditAddress}
        />
        <CouponsDialog />
        <PaymentFailedModal />
      </div>
    </div>
  )
}