

// "use client"

// import { useState, useEffect } from "react"
// import { Link } from "react-router-dom"
// import { CheckCircle, ShoppingBag, ChevronRight, ArrowLeft } from "lucide-react"
// import { motion } from "framer-motion"

// export default function OrderConfirmationPage() {
//   const [orderDetails, setOrderDetails] = useState(null)
//   const [isLoading, setIsLoading] = useState(true)

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         when: "beforeChildren",
//         staggerChildren: 0.2,
//         duration: 0.3,
//       },
//     },
//   }

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
//   }

//   // Simulate fetching order confirmation details
//   useEffect(() => {
//     // In a real application, you would get this data from your checkout process
//     // or from a URL parameter/state passed from the checkout page
//     const mockOrderData = {
//       orderId: "ORD" + Math.floor(100000 + Math.random() * 900000),
//       date: new Date().toISOString(),
//       totalAmount: Math.floor(1000 + Math.random() * 9000),
//       itemCount: Math.floor(1 + Math.random() * 5),
//       email: "customer@example.com",
//     }

//     // Simulate API delay
//     const timer = setTimeout(() => {
//       setOrderDetails(mockOrderData)
//       setIsLoading(false)
//     }, 800)

//     return () => clearTimeout(timer)
//   }, [])

//   // Format price in Indian Rupees
//   const formatPrice = (price) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(price)
//   }

//   // Format date
//   const formatDate = (dateString) => {
//     return new Intl.DateTimeFormat("en-IN", {
//       dateStyle: "medium",
//     }).format(new Date(dateString))
//   }

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-[60vh]">
//         <div className="text-center">
//           <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#7a2828] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
//           <p className="mt-4 text-gray-600">Processing your order...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <motion.div
//       className="container mx-auto px-4 py-8 max-w-3xl"
//       variants={containerVariants}
//       initial="hidden"
//       animate="visible"
//     >
//       <motion.div className="bg-white rounded-xl shadow-lg border overflow-hidden" variants={itemVariants}>
//         {/* Success Header */}
//         <div className="bg-gradient-to-r from-[#7a2828] to-[#8B2131] text-white p-8 text-center">
//           <motion.div
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             transition={{ duration: 0.5, type: "spring" }}
//             className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white mb-4"
//           >
//             <CheckCircle className="h-10 w-10 text-[#7a2828]" />
//           </motion.div>
//           <h1 className="text-3xl font-bold mb-2">Thank You!</h1>
//           <p className="text-lg opacity-90">Your order has been successfully placed</p>
//         </div>

//         {/* Order Information */}
//         <div className="p-6 md:p-8">
//           <motion.div variants={itemVariants} className="mb-6">
//             <h2 className="text-xl font-semibold mb-4">Order Information</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
//               <div>
//                 <p className="text-sm text-gray-500">Order Number</p>
//                 <p className="font-medium">{orderDetails.orderId}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Date</p>
//                 <p className="font-medium">{formatDate(orderDetails.date)}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Total Amount</p>
//                 <p className="font-medium">{formatPrice(orderDetails.totalAmount)}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Items</p>
//                 <p className="font-medium">{orderDetails.itemCount} item(s)</p>
//               </div>
//             </div>
//           </motion.div>

//           <motion.div variants={itemVariants} className="mb-8">
//             <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
//               <div className="flex items-start">
//                 <div className="flex-shrink-0 mr-3">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5 text-gray-400"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//                     />
//                   </svg>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-700">Order confirmation sent to:</p>
//                   <p className="text-sm text-gray-600">{orderDetails.email}</p>
//                 </div>
//               </div>
//             </div>
//           </motion.div>

//           {/* Next Steps */}
//           <motion.div variants={itemVariants} className="space-y-4">
//             <Link
//               to={`/orders/${orderDetails.orderId}`}
//               className="flex items-center justify-between w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
//             >
//               <div className="flex items-center">
//                 <ShoppingBag className="h-5 w-5 mr-3 text-[#7a2828]" />
//                 <span className="font-medium">View Order Details</span>
//               </div>
//               <ChevronRight className="h-5 w-5 text-gray-400" />
//             </Link>
//           </motion.div>

//           {/* Buttons */}
//           <motion.div variants={itemVariants} className="mt-8 flex flex-col sm:flex-row gap-4">
//             <Link to="/user/home" className="flex-1">
//               <button className="w-full bg-[#7a2828] text-white px-6 py-3 rounded-md hover:bg-[#8B2131] transition-colors font-medium">
//                 Continue Shopping
//               </button>
//             </Link>
//             <Link to="/myorders" className="flex-1">
//               <button className="w-full border border-[#7a2828] text-[#7a2828] px-6 py-3 rounded-md hover:bg-[#7a2828] hover:text-white transition-colors font-medium">
//                 View All Orders
//               </button>
//             </Link>
//           </motion.div>
//         </div>
//       </motion.div>

//       {/* Back Link */}
//       <motion.div variants={itemVariants} className="mt-6">
//         <Link to="/" className="inline-flex items-center text-gray-600 hover:text-[#8B2131]">
//           <ArrowLeft className="h-4 w-4 mr-2" />
//           Back to Home
//         </Link>
//       </motion.div>
//     </motion.div>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { CheckCircle, ShoppingBag, ChevronRight, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import api from '../../api'
import Swal from 'sweetalert2'

const MyOrders = () => {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const BASE_URL = "http://127.0.0.1:8000"

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        duration: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  }

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('cartapp/userorders/')
        console.log("order detaile",response.data)
        const latestOrder = response.data.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        )[0]
        setOrders(latestOrder ? [latestOrder] : [])
      } catch (error) {
        console.error('Error fetching orders:', error)
        setError('Failed to load orders')
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrders()
  }, [])

  // const handleCancelOrder = async (orderId) => {
  //   const result = await Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'Do you really want to cancel this order? This action cannot be undone.',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#7a2828',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, cancel it!',
  //     cancelButtonText: 'No, keep it'
  //   })

  //   if (!result.isConfirmed) {
  //     return
  //   }

  //   setIsLoading(true)
  //   setError(null)

  //   try {
  //     const response = await api.put(`/cartapp/orders/${orderId}/cancel/`)
  //     const updatedOrders = orders.map(order => 
  //       order.id === orderId ? { ...order, ...response.data.order } : order
  //     )
  //     setOrders(updatedOrders)

  //     await Swal.fire({
  //       title: 'Cancelled!',
  //       text: 'Your order has been successfully cancelled.',
  //       icon: 'success',
  //       confirmButtonColor: '#7a2828'
  //     })
  //   } catch (err) {
  //     await Swal.fire({
  //       title: 'Error!',
  //       text: err.response?.data?.error || 'Failed to cancel order',
  //       icon: 'error',
  //       confirmButtonColor: '#7a2828'
  //     })
  //     setError(err.response?.data?.error || 'Failed to cancel order')
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  // Format price in Indian Rupees
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Format date
  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
    }).format(new Date(dateString))
  }

  const capitalizeFirst = (text) => {
    if (!text) return 'Unknown'
    return text.charAt(0).toUpperCase() + text.slice(1)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#7a2828] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-gray-600">Loading your order...</p>
        </div>
      </div>
    )
  }

  if (!orders.length) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 text-gray-400 mb-4 mx-auto" />
          <h3 className="text-xl font-medium">No orders found</h3>
          <p className="text-gray-500 mt-2">You haven't placed any orders yet.</p>
        </div>
      </div>
    )
  }

  const order = orders[0] // Latest order

  return (
    <motion.div
      className="container mx-auto px-4 py-8 max-w-3xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="bg-white rounded-xl shadow-lg border overflow-hidden" variants={itemVariants}>
        {/* Success Header */}
        <div className="bg-gradient-to-r from-[#7a2828] to-[#8B2131] text-white p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white mb-4"
          >
            <CheckCircle className="h-10 w-10 text-[#7a2828]" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-2">Order Details</h1>
          <p className="text-lg opacity-90">Your latest order details</p>
        </div>

        {/* Order Information */}
        <div className="p-6 md:p-8">
          <motion.div variants={itemVariants} className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Order Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              <div>
                <p className="text-sm text-gray-500">Order Number</p>
                <p className="font-medium">{order.order_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{formatDate(order.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-medium">{formatPrice(order.final_total)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Items</p>
                <p className="font-medium">{order.items?.length || 0} item(s)</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">{capitalizeFirst(order.status)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-medium">{capitalizeFirst(order.payment_method)}</p>
              </div>
            </div>
          </motion.div>

          {/* Delivery Address */}
          {order.order_address && (
            <motion.div variants={itemVariants} className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="text-sm text-gray-600">
                  <p className="font-medium">{order.order_address?.name}</p>
                  <p>{order.order_address?.house_no}</p>
                  <p>{order.order_address?.city}, {order.order_address?.state} - {order.order_address?.pin_code}</p>
                  {order.order_address?.landmark && <p>Landmark: {order.order_address.landmark}</p>}
                  <p>Phone: {order.order_address?.mobile_number}</p>
                  {order.order_address?.alternate_number && <p>Alt Phone: {order.order_address.alternate_number}</p>}
                </div>
              </div>
            </motion.div>
          )}

          {/* Order Items */}
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-start justify-between border-b pb-4 last:border-0">
                  <div className="flex gap-4">
                    <div className="h-20 w-20 rounded-md overflow-hidden bg-gray-100">
                      {item.product?.images && item.product.images.length > 0 ? (
                        <img 
                          src={`${BASE_URL}${item.product.images[0]}`} 
                          alt={item.product.name} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-400">
                          <ShoppingBag size={24} />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium">{item.product?.name}</h3>
                      <p className="text-sm text-gray-600">
                        {item.variant?.size && `Size: ${item.variant.size}`}
                        {item.variant?.color && `, Color: ${item.variant.color}`}
                      </p>
                      <p className="text-sm">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatPrice(item.final_price)}</div>
                    {item.discount > 0 && (
                      <div className="text-sm">
                        <span className="line-through text-gray-500">{formatPrice(item.subtotal)}</span>
                        <span className="text-green-600 ml-2">Save {formatPrice(item.discount)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div variants={itemVariants} className="mt-8 flex flex-col sm:flex-row gap-4">
            
            <Link to="/user/home" className="flex-1">
              <button className="w-full bg-[#7a2828] text-white px-6 py-3 rounded-md hover:bg-[#8B2131] transition-colors font-medium">
                Continue Shopping
              </button>
            </Link>
            <Link to="/myorders" className="flex-1">
              <button className="w-full border border-[#7a2828] text-[#7a2828] px-6 py-3 rounded-md hover:bg-[#7a2828] hover:text-white transition-colors font-medium">
                View All Orders
              </button>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Back Link */}
      <motion.div variants={itemVariants} className="mt-6">
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-[#8B2131]">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </motion.div>
    </motion.div>
  )
}

export default MyOrders