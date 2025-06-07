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

  const BASE_URL = import.meta.env.VITE_BASE_URL

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