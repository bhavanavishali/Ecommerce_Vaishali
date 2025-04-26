


// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
// import { ChevronDown, Package } from "lucide-react"
// import api from '../../api'
// import Swal from 'sweetalert2' // Import SweetAlert2

// const MyOrders = () => {
//   const [orders, setOrders] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [openCollapsibles, setOpenCollapsibles] = useState({})
//   const [cancelLoading, setCancelLoading] = useState({})
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await api.get('cartapp/userorders/')
//         setOrders(response.data)
//         console.log("plzz filter", response.data)
//       } catch (error) {
//         console.error('Error fetching orders:', error)
//         setError('Failed to load orders')
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchOrders()
//   }, [])

//   const toggleCollapsible = (orderId) => {
//     setOpenCollapsibles(prev => ({
//       ...prev,
//       [orderId]: !prev[orderId]
//     }))
//   }

//   const handleCancelOrder = async (orderId) => {
//     // Show confirmation dialog using SweetAlert2
//     const result = await Swal.fire({
//       title: 'Are you sure?',
//       text: 'Do you really want to cancel this order? This action cannot be undone.',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#7a2828', // Match your button color
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Yes, cancel it!',
//       cancelButtonText: 'No, keep it'
//     })

//     if (!result.isConfirmed) {
//       return // Exit if user clicks "No"
//     }

//     setCancelLoading(prev => ({ ...prev, [orderId]: true }))
//     setError(null)

//     try {
//       const response = await api.put(`/cartapp/orders/${orderId}/cancel/`)
//       const updatedOrders = orders.map(order => 
//         order.id === orderId ? { ...order, ...response.data.order } : order
//       )
//       setOrders(updatedOrders)

//       // Show success alert
//       await Swal.fire({
//         title: 'Cancelled!',
//         text: 'Your order has been successfully cancelled.',
//         icon: 'success',
//         confirmButtonColor: '#7a2828'
//       })
//     } catch (err) {
//       // Show error alert
//       await Swal.fire({
//         title: 'Error!',
//         text: err.response?.data?.error || 'Failed to cancel order',
//         icon: 'error',
//         confirmButtonColor: '#7a2828'
//       })
//       setError(err.response?.data?.error || 'Failed to cancel order')
//     } finally {
//       setCancelLoading(prev => ({ ...prev, [orderId]: false }))
//     }
//   }

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A"
//     const date = new Date(dateString)
//     return date.toLocaleDateString('en-IN', { 
//       year: 'numeric', 
//       month: 'long', 
//       day: 'numeric' 
//     })
//   }

//   const getStatusColor = (status) => {
//     const statusColors = {
//       'pending': 'text-yellow-600',
//       'processing': 'text-blue-600',
//       'shipped': 'text-indigo-600',
//       'delivered': 'text-green-600',
//       'cancelled': 'text-red-600'
//     }
//     return statusColors[status] || 'text-gray-600'
//   }

//   const capitalizeFirst = (text) => {
//     if (!text) return 'Unknown'
//     return text.charAt(0).toUpperCase() + text.slice(1)
//   }

//   if (loading) return (
//     <div className="w-full flex justify-center items-center min-h-[300px]">
//       Loading your orders...
//     </div>
//   )
  
//   if (!orders.length) return (
//     <div className="w-full flex flex-col justify-center items-center min-h-[300px] text-center">
//       <Package className="h-16 w-16 text-gray-400 mb-4" />
//       <h3 className="text-xl font-medium">No orders found</h3>
//       <p className="text-gray-500 mt-2">You haven't placed any orders yet.</p>
//     </div>
//   )

//   return (
//     <div className="w-full max-w-4xl mx-auto space-y-6 p-4">
//       <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      
//       {error && <div className="text-red-600 mb-4">{error}</div>}
      
//       {orders.map((order) => (
//         <Card key={order.id} className="bg-[#f8ece9] overflow-hidden">
//           <CardContent className="p-6 space-y-6">
//             {/* Order Header */}
//             <div className="flex justify-between items-center border-b pb-4">
//               <div>
//                 <div className="text-xl font-medium">Order #{order.order_number}</div>
//                 <div className="text-sm text-gray-500">Placed on {formatDate(order.created_at)}</div>
//               </div>
//               <div className={`font-medium ${getStatusColor(order.status)}`}>
//                 {capitalizeFirst(order.status)}
//               </div>
//             </div>

//             {/* Delivery Address */}
//             {order.order_address && (
//               <Collapsible 
//                 open={openCollapsibles[`address-${order.id}`]} 
//                 onOpenChange={() => toggleCollapsible(`address-${order.id}`)}
//                 className="border-b pb-4"
//               >
//                 <div className="flex items-center justify-between">
//                   <CollapsibleTrigger className="flex items-center text-left font-medium">
//                     Delivery Address
//                     <ChevronDown 
//                       className={`h-5 w-5 ml-2 transition-transform ${openCollapsibles[`address-${order.id}`] ? "rotate-180" : ""}`} 
//                     />
//                   </CollapsibleTrigger>
//                 </div>
//                 <CollapsibleContent className="pt-2">
//                   <div className="text-sm space-y-1 text-gray-600">
//                     <p className="font-medium">{order.order_address?.name}</p>
//                     <p>{order.order_address?.house_no}</p>
//                     <p>{order.order_address?.city}, {order.order_address?.state} - {order.order_address?.pin_code}</p>
//                     {order.order_address?.landmark && <p>Landmark: {order.order_address.landmark}</p>}
//                     <p>Phone: {order.order_address?.mobile_number}</p>
//                     {order.order_address?.alternate_number && <p>Alt Phone: {order.order_address.alternate_number}</p>}
//                   </div>
//                 </CollapsibleContent>
//               </Collapsible>
//             )}

//             {/* Order Items */}
//             <Collapsible
//               open={openCollapsibles[`items-${order.id}`]}
//               onOpenChange={() => toggleCollapsible(`items-${order.id}`)}
//               className="border-b pb-4"
//             >
//               <div className="flex items-center justify-between">
//                 <CollapsibleTrigger className="flex items-center text-left font-medium">
//                   Order Items ({order.items?.length || 0})
//                   <ChevronDown 
//                     className={`h-5 w-5 ml-2 transition-transform ${openCollapsibles[`items-${order.id}`] ? "rotate-180" : ""}`} 
//                   />
//                 </CollapsibleTrigger>
//               </div>
//               <CollapsibleContent className="pt-4">
//                 <div className="space-y-4">
//                   {order.items?.map((item) => (
//                     <div key={item.id} className="flex items-start justify-between border-b pb-4 last:border-0">
//                       <div className="flex gap-4">
//                         <div className="h-20 w-20 rounded-md overflow-hidden bg-gray-100">
//                           {item.product?.images && item.product.images.length > 0 ? (
//                             <img 
//                               src={item.product.images[0]} 
//                               alt={item.product.name} 
//                               className="h-full w-full object-cover"
//                             />
//                           ) : (
//                             <div className="h-full w-full flex items-center justify-center text-gray-400">
//                               <Package size={24} />
//                             </div>
//                           )}
//                         </div>
//                         <div className="space-y-1">
//                           <h3 className="font-medium">{item.product?.name}</h3>
//                           <p className="text-sm text-gray-600">
//                             {item.variant?.size && `Size: ${item.variant.size}`}
//                             {item.variant?.color && `, Color: ${item.variant.color}`}
//                           </p>
//                           <p className="text-sm">Qty: {item.quantity}</p>
//                           <p className="text-gray-600">Items Total: ₹{item.price}</p>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <div className="font-medium">₹{item.final_price}</div>
//                         {item.discount > 0 && (
//                           <div className="text-sm">
//                             <span className="line-through text-gray-500">₹{item.subtotal}</span>
//                             <span className="text-green-600 ml-2">Save ₹{item.discount}</span>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CollapsibleContent>
//             </Collapsible>

//             {/* Order Summary */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <p className="text-gray-600">Estimated Delivery: {formatDate(order.est_delivery)}</p>
//                 <p className="text-gray-600">Payment Method: {capitalizeFirst(order.payment_method)}</p>
//               </div>
//               <div className="space-y-2 md:text-right">
//                 {order.total_discount > 0 && (
//                   <p className="text-green-600">Discount: -₹{order.total_discount}</p>
//                 )}
//                 <p className="font-medium text-lg">Final Total: ₹{order.final_total}</p>
//               </div>
//             </div>

//             {/* Actions */}
//             <div className="flex justify-end gap-3 pt-2">
//               {order.status !== 'cancelled' && order.status !== 'delivered' && order.status !== 'shipped' && (
//                 <Button 
//                   variant="destructive" 
//                   onClick={() => handleCancelOrder(order.id)}
//                   disabled={cancelLoading[order.id]}
//                   className="bg-[#7a2828] hover:bg-[#7a2828]/90 text-white"
//                 >
//                   {cancelLoading[order.id] ? 'Cancelling...' : 'Cancel Order'}
//                 </Button>
//               )}
//               <Button variant="outline">View Invoice</Button>
//             </div>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   )
// }

// export default MyOrders


"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import api from "../../api"
import { useNavigate } from "react-router-dom"

const MyOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeFilter, setActiveFilter] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const navigate=useNavigate()

  const filters = ["All", "Pending","Processing", "Shipped", "Delivered", "Cancelled"]

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("cartapp/userorders/")
        setOrders(response.data)
        setTotalPages(Math.ceil(response.data.length / 10)) // Assuming 10 items per page
      } catch (error) {
        console.error("Error fetching orders:", error)
        setError("Failed to load orders")
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const filteredOrders = () => {
    if (activeFilter === "All") return orders
    return orders.filter((order) => order.status.toLowerCase() === activeFilter.toLowerCase())
  }

  const paginatedOrders = () => {
    const filtered = filteredOrders()
    const startIndex = (currentPage - 1) * 10
    return filtered.slice(startIndex, startIndex + 10)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    })
  }

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      "payment failed": "bg-orange-100 text-orange-800",
    }

    const statusClass = statusStyles[status.toLowerCase()] || "bg-gray-100 text-gray-800"

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusClass}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  if (loading) {
    return <div className="w-full flex justify-center items-center min-h-[300px]">Loading your orders...</div>
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">My Orders</h1>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                className={`rounded-full ${activeFilter === filter ? "bg-purple-600 hover:bg-purple-700" : ""}`}
                onClick={() => {
                  setActiveFilter(filter)
                  setCurrentPage(1)
                }}
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-gray-500">ORDER ID</th>
                  <th className="text-left p-4 font-medium text-gray-500">DATE</th>
                  <th className="text-left p-4 font-medium text-gray-500">ITEMS</th>
                  <th className="text-left p-4 font-medium text-gray-500">AMOUNT</th>
                  <th className="text-left p-4 font-medium text-gray-500">ORDER STATUS</th>
                  <th className="text-right p-4 font-medium text-gray-500"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders().map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{order.order_number}</td>
                    <td className="p-4 text-gray-600">{formatDate(order.created_at)}</td>
                    <td className="p-4">{order.items?.length || 0} items</td>
                    <td className="p-4 font-medium">₹{order.final_total}</td>
                    <td className="p-4">{getStatusBadge( order.status)}</td>
                    <td className="p-4 text-right">
                    <Button variant="secondary" className="bg-red-800 text-white hover:bg-red-700"
                                        onClick={()=>navigate(`/user/view-order-details/${order.id}`)}>
                    View Details</Button>
                    </td>
                  </tr>
                ))}

                {paginatedOrders().length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center justify-center h-8 w-8 rounded-md bg-purple-600 text-white">
              {currentPage}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrders
