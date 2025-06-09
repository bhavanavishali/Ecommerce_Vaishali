// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Button } from "@/components/ui/button"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { useNavigate } from "react-router-dom"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import {
//   AlertCircle,
//   CheckCircle,
//   Package,
//   ShoppingCart,
//   Truck,
//   User,
//   Calendar,
//   ArrowLeft,
//   RefreshCcw,
// } from "lucide-react"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import api from "../../api"
// import { useParams } from "react-router-dom"

// export default function OrderHandlePage() {
//   const [orderStatus, setOrderStatus] = useState("pending")
//   const [order, setOrder] = useState(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [updateMessage, setUpdateMessage] = useState(null)
//   const [isReturnModalOpen, setIsReturnModalOpen] = useState(false)
//   const [isItemReturnModalOpen, setIsItemReturnModalOpen] = useState(false)
//   const [selectedItem, setSelectedItem] = useState(null)
//   const [returnAction, setReturnAction] = useState(null)
//   const [itemReturnAction, setItemReturnAction] = useState(null)
//   const { id } = useParams()
//   const navigate=useNavigate()
//   useEffect(() => {
//     const fetchOrder = async () => {
//       try {
//         setIsLoading(true)
//         const response = await api.get(`cartapp/orders/${id}/`)
//         console.log("Order details data:", response.data)
//         setOrder(response.data)
//         setOrderStatus(response.data.status)
//         setIsLoading(false)
//       } catch (err) {
//         setError(err.message || "Failed to fetch order")
//         setIsLoading(false)
//       }
//     }

//     fetchOrder()
//   }, [id])

//   const handleStatusUpdate = async () => {
//     try {
//       const response = await api.patch(`cartapp/orderupdating/${id}/`, {
//         status: orderStatus,
//       })
//       setOrder({ ...order, status: orderStatus })
//       setUpdateMessage("Order status updated successfully!")
//       setTimeout(() => setUpdateMessage(null), 3000)
//     } catch (err) {
//       setError(err.message || "Failed to update order status")
//       setTimeout(() => setError(null), 3000)
//     }
//   }

//   const handleReturnAction = async () => {
//     try {
//       const response = await api.patch(`cartapp/orders/${id}/return/approve/`, {
//         approve: returnAction === "approve",
//       })
//       const updatedOrderResponse = await api.get(`cartapp/orders/${id}/`)
//       setOrder(updatedOrderResponse.data)
//       setIsReturnModalOpen(false)
//       setUpdateMessage(`Order return ${returnAction === "approve" ? "approved" : "denied"} successfully!`)
//       setTimeout(() => setUpdateMessage(null), 3000)
//     } catch (err) {
//       console.error("Error response:", err.response?.data, err.response?.status);
//       setError(err.message || "Failed to process return action")
//       setTimeout(() => setError(null), 3000)
//     }
//   }

//   const handleItemReturnAction = async () => {
//     try {
//       await api.patch(`cartapp/orderitems/${selectedItem.id}/return/approve/`, {
//         approve: itemReturnAction === "approve",
//       })
//       const updatedOrderResponse = await api.get(`cartapp/orders/${id}/`)
//       setOrder(updatedOrderResponse.data)
//       setIsItemReturnModalOpen(false)
//       setSelectedItem(null)
//       setUpdateMessage(`Item return ${itemReturnAction === "approve" ? "approved" : "denied"} successfully!`)
//       setTimeout(() => setUpdateMessage(null), 3000)
//     } catch (err) {
//       setError(err.message || "Failed to process item return action")
//       setTimeout(() => setError(null), 3000)
//     }
//   }

//   const getStatusColor = (status) => {
//     const statusMap = {
//       pending: "bg-amber-100 text-amber-800 border-amber-200",
//       processing: "bg-purple-100 text-purple-800 border-purple-200",
//       shipped: "bg-sky-100 text-sky-800 border-sky-200",
//       delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
//       cancelled: "bg-rose-100 text-rose-800 border-rose-200",
//       return_requested: "bg-orange-100 text-orange-800 border-orange-200",
//       returned: "bg-slate-100 text-slate-800 border-slate-200",
//       return_denied: "bg-red-100 text-red-800 border-red-200",
//     }
//     return statusMap[status] || "bg-gray-100 text-gray-800 border-gray-200"
//   }

//   const formatStatus = (status) => {
//     return status
//       .split("_")
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(" ")
//   }

//   if (isLoading)
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7a2828]"></div>
//       </div>
//     )

//   if (error)
//     return (
//       <Alert variant="destructive" className="max-w-md mx-auto mt-8">
//         <AlertCircle className="h-4 w-4" />
//         <AlertTitle>Error</AlertTitle>
//         <AlertDescription>{error}</AlertDescription>
//         <Button onClick={() => window.location.reload()} className="mt-4 bg-[#7a2828] hover:bg-[#7a2828]">
//           <RefreshCcw className="mr-2 h-4 w-4" /> Retry
//         </Button>
//       </Alert>
//     )

//   if (!order)
//     return (
//       <Alert className="max-w-md mx-auto mt-8">
//         <AlertCircle className="h-4 w-4" />
//         <AlertTitle>No Order Found</AlertTitle>
//         <AlertDescription>The requested order could not be found.</AlertDescription>
//       </Alert>
//     )

//   return (
//     <div className="container mx-auto p-4 bg-gradient-to-b from-white to-red-50">
//       <div className="max-w-5xl mx-auto">
//         <div className="flex items-center mb-6">
//           <div className="w-1 h-8 bg-[#7a2828] mr-3"></div>
//           <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
          
//         </div>
//         <Button
//             variant="outline"
//             onClick={() => navigate("/dashboard")}
//             className="flex items-center gap-2 border-[#7a2828] text-[#7a2828] hover:bg-[#7a2828] hover:text-white"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             Back
//           </Button>

//         {updateMessage && (
//           <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
//             <CheckCircle className="h-4 w-4" />
//             <AlertTitle>Success</AlertTitle>
//             <AlertDescription>{updateMessage}</AlertDescription>
//           </Alert>
//         )}

//         <Card className="mb-6 border-[#7a2828] shadow-sm overflow-hidden">
//           <div className="bg-gradient-to-r from-[#7a2828] to-red-50 h-2"></div>
//           <CardContent className="p-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <div className="flex items-center mb-4">
//                   <ShoppingCart className="text-[#7a2828] mr-2 h-5 w-5" />
//                   <h2 className="text-lg font-semibold text-gray-900">Order Information</h2>
//                 </div>
//                 <div className="space-y-2">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Order ID:</span>
//                     <span className="font-medium">{order.order_number}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Created Date:</span>
//                     <span className="font-medium">{new Date(order.created_at).toLocaleString()}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Estimated Delivery:</span>
//                     <span className="font-medium">{order.est_delivery}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Status:</span>
//                     <Badge className={`${getStatusColor(order.status)} font-medium`}>
//                       {formatStatus(order.status)}
//                     </Badge>
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <div className="flex items-center mb-4">
//                   <User className="text-[#7a2828] mr-2 h-5 w-5" />
//                   <h2 className="text-lg font-semibold text-gray-900">Customer Information</h2>
//                 </div>
//                 <div className="space-y-2">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Name:</span>
//                     <span className="font-medium">
//                       {order.user.first_name} {order.user.last_name}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Email:</span>
//                     <span className="font-medium">{order.user.email}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Phone:</span>
//                     <span className="font-medium">{order.user.phone_number}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <Card className="border-[#7a2828] shadow-sm">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-lg flex items-center">
//                 <Truck className="text-[#7a2828] mr-2 h-5 w-5" />
//                 Shipping Information
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-1 text-sm">
//                 <p className="font-medium">{order.order_address.name}</p>
//                 <p>{order.order_address.house_no}</p>
//                 <p>
//                   {order.order_address.city}, {order.order_address.state}
//                 </p>
//                 <p>{order.order_address.pin_code}</p>
//                 <p className="mt-2">
//                   <span className="text-gray-600">Phone: </span>
//                   <span className="font-medium">{order.order_address.mobile_number}</span>
//                 </p>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="border-purple-200 shadow-sm">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-lg flex items-center">
//                 <Package className="text-[#7a2828] mr-2 h-5 w-5" />
//                 Order Status
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="flex flex-col gap-3">
//                 <Select value={orderStatus} onValueChange={setOrderStatus}>
//                   <SelectTrigger className="border-gray-300" aria-label="Select order status">
//                     <SelectValue placeholder="Select status" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-white">
//                     <SelectItem value="pending">Pending</SelectItem>
//                     <SelectItem value="processing">Processing</SelectItem>
//                     <SelectItem value="shipped">Shipped</SelectItem>
//                     <SelectItem value="delivered">Delivered</SelectItem>
//                     <SelectItem value="cancelled">Cancelled</SelectItem>
//                     <SelectItem value="return_requested">Return Requested</SelectItem>
//                     <SelectItem value="returned">Returned</SelectItem>
//                     <SelectItem value="return_denied">Return Denied</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Button
//                   onClick={handleStatusUpdate}
//                   className="bg-[#7a2828] hover:bg-[#7a2828] text-white"
//                   aria-label="Update order status"
//                 >
//                   Update Status
//                 </Button>
//                 {order.status === "return_requested" && (
//                   <Dialog open={isReturnModalOpen} onOpenChange={setIsReturnModalOpen}>
//                     <DialogTrigger asChild>
//                       <Button className="bg-orange-500 hover:bg-orange-600 text-white">Process Return</Button>
//                     </DialogTrigger>
//                     <DialogContent className="bg-white">
//                       <DialogHeader>
//                         <DialogTitle>Process Order Return</DialogTitle>
//                         <DialogDescription>
//                           Review the return reason: "{order.return_reason}" and choose to approve or deny the return
//                           request.
//                         </DialogDescription>
//                       </DialogHeader>
//                       <div className="flex gap-4">
//                         <Button
//                           onClick={() => setReturnAction("approve")}
//                           className="bg-emerald-600 hover:bg-emerald-700 text-white"
//                         >
//                           Approve Return
//                         </Button>
//                         <Button
//                           onClick={() => setReturnAction("deny")}
//                           className="bg-rose-600 hover:bg-rose-700 text-white"
//                         >
//                           Deny Return
//                         </Button>
//                       </div>
//                       <DialogFooter>
//                         <Button variant="outline" onClick={() => setIsReturnModalOpen(false)}>
//                           Cancel
//                         </Button>
//                         <Button
//                           onClick={handleReturnAction}
//                           className="bg-[#7a2828] hover:bg-[#7a2828] text-white"
//                           disabled={!returnAction}
//                         >
//                           Submit
//                         </Button>
//                       </DialogFooter>
//                     </DialogContent>
//                   </Dialog>
//                 )}
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="border-[#7a2828] shadow-sm">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-lg flex items-center">
//                 <Calendar className="text-[#7a2828] mr-2 h-5 w-5" />
//                 Payment Details
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Payment Method:</span>
//                   <span className="font-medium">{order.payment_method.toUpperCase()}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Payment Status:</span>
//                   <Badge
//                     className={
//                       order.payment_status === "completed"
//                         ? "bg-emerald-100 text-emerald-800 border-emerald-200"
//                         : "bg-rose-100 text-rose-800 border-rose-200"
//                     }
//                   >
//                     {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
//                   </Badge>
//                 </div>
//                 <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
//                   <span className="text-gray-900 font-semibold">Grand Total:</span>
//                   <span className="font-bold text-green-600">₹{order.final_total}</span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Cancellation and Return Details Section */}
//         {(order.cancel_reason || order.return_reason) && (
//           <Card className="mb-8 border-purple-200 shadow-sm overflow-hidden">
//             <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-2"></div>
//             <CardHeader className="pb-2">
//               <CardTitle className="text-lg flex items-center">
//                 <ArrowLeft className="text-orange-600 mr-2 h-5 w-5" />
//                 Cancellation & Return Details
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <Tabs defaultValue={order.return_reason ? "return" : "cancel"} className="w-full">
//                 <TabsList className="grid w-full grid-cols-2">
//                   <TabsTrigger value="cancel" disabled={!order.cancel_reason}>
//                     Cancellation
//                   </TabsTrigger>
//                   <TabsTrigger value="return" disabled={!order.return_reason}>
//                     Return
//                   </TabsTrigger>
//                 </TabsList>
//                 <TabsContent value="cancel" className="p-4 bg-amber-50 rounded-md mt-2">
//                   {order.cancel_reason ? (
//                     <div className="space-y-3">
//                       <div className="flex items-start">
//                         <div className="font-medium text-amber-800 min-w-32">Reason:</div>
//                         <div className="text-gray-800">{order.cancel_reason}</div>
//                       </div>
//                       {order.cancelled_at && (
//                         <div className="flex items-start">
//                           <div className="font-medium text-amber-800 min-w-32">Cancelled On:</div>
//                           <div className="text-gray-800">{new Date(order.cancelled_at).toLocaleString()}</div>
//                         </div>
//                       )}
//                     </div>
//                   ) : (
//                     <div className="text-gray-500 italic">No cancellation information available</div>
//                   )}
//                 </TabsContent>
//                 <TabsContent value="return" className="p-4 bg-orange-50 rounded-md mt-2">
//                   {order.return_reason ? (
//                     <div className="space-y-3">
//                       <div className="flex items-start">
//                         <div className="font-medium text-orange-800 min-w-32">Reason:</div>
//                         <div className="text-gray-800">{order.return_reason}</div>
//                       </div>
//                       {order.returned_at && (
//                         <div className="flex items-start">
//                           <div className="font-medium text-orange-800 min-w-32">Returned On:</div>
//                           <div className="text-gray-800">{new Date(order.returned_at).toLocaleString()}</div>
//                         </div>
//                       )}
//                       <div className="flex items-start">
//                         <div className="font-medium text-orange-800 min-w-32">Approval Status:</div>
//                         <Badge
//                           className={
//                             order.approve_status
//                               ? "bg-emerald-100 text-emerald-800 border-emerald-200"
//                               : "bg-slate-100 text-slate-800 border-slate-200"
//                           }
//                         >
//                           {order.approve_status ? "Approved" : "Not Approved"}
//                         </Badge>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="text-gray-500 italic">No return information available</div>
//                   )}
//                 </TabsContent>
//               </Tabs>
//             </CardContent>
//           </Card>
//         )}

//         <Card className="mb-8 border-[#7a2828] shadow-sm overflow-hidden">
//           <div className="bg-gradient-to-r from-red-100 to-[#7a2828] h-2"></div>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-xl">Order Items</CardTitle>
//           </CardHeader>
//           <CardContent className="p-0">
//             <div className="overflow-x-auto">
//               <Table>
//                 <TableHeader className="bg-purple-50">
//                   <TableRow>
//                     <TableHead className="font-medium">Product</TableHead>
//                     <TableHead className="font-medium">Variant</TableHead>
//                     <TableHead className="font-medium">Qty</TableHead>
//                     <TableHead className="font-medium">Price</TableHead>
//                     <TableHead className="font-medium">Discount</TableHead>
//                     <TableHead className="font-medium">Total</TableHead>
//                     <TableHead className="font-medium">Status</TableHead>
//                     <TableHead className="font-medium">Return Info</TableHead>
//                     <TableHead className="font-medium">Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {order.items.map((item) => (
//                     <TableRow key={item.id} className="hover:bg-purple-50">
//                       <TableCell className="font-medium">{item.product.name}</TableCell>
//                       <TableCell>{item.variant ? `${item.variant.gross_weight || "N/A"}g` : "N/A"}</TableCell>
//                       <TableCell>{item.quantity}</TableCell>
//                       <TableCell>
//                         <div className="text-gray-500 line-through text-xs">₹{item.price}</div>
//                         <div>₹{item.final_price || item.price}</div>
//                       </TableCell>
//                       <TableCell className="text-rose-600">₹{item.discount}</TableCell>
//                       <TableCell className="font-medium">₹{item.subtotal || item.final_price}</TableCell>
//                       <TableCell>
//                         <Badge className={getStatusColor(item.status)}>{formatStatus(item.status)}</Badge>
//                       </TableCell>
//                       <TableCell>
//                         {item.return_reason ? (
//                           <Dialog >
//                             <DialogTrigger asChild>
//                               <Button variant="outline" size="sm" className="text-xs h-7">
//                                 View Details
//                               </Button>
//                             </DialogTrigger>
//                             <DialogContent className='bg-white'>
//                               <DialogHeader>
//                                 <DialogTitle>Return Details</DialogTitle>
//                               </DialogHeader>
//                               <div className="space-y-3 text-sm">
//                                 <div className="grid grid-cols-3 gap-2">
//                                   <div className="font-medium">Return Reason:</div>
//                                   <div className="col-span-2">{item.return_reason}</div>
//                                 </div>
//                                 {item.returned_at && (
//                                   <div className="grid grid-cols-3 gap-2">
//                                     <div className="font-medium">Return Date:</div>
//                                     <div className="col-span-2">{new Date(item.returned_at).toLocaleString()}</div>
//                                   </div>
//                                 )}
//                                 <div className="grid grid-cols-3 gap-2">
//                                   <div className="font-medium">Approval Status:</div>
//                                   <div className="col-span-2">
//                                     <Badge
//                                       className={
//                                         item.approve_status
//                                           ? "bg-emerald-100 text-emerald-800 border-emerald-200"
//                                           : "bg-slate-100 text-slate-800 border-slate-200"
//                                       }
//                                     >
//                                       {item.approve_status ? "Approved" : "Not Approved"}
//                                     </Badge>
//                                   </div>
//                                 </div>
//                               </div>
//                             </DialogContent>
//                           </Dialog>
//                         ) : (
//                           <span className="text-gray-500 text-sm">N/A</span>
//                         )}
//                       </TableCell>
//                       <TableCell>
//                         {item.status === "return_requested" && (
//                           <Dialog
//                             open={isItemReturnModalOpen && selectedItem?.id === item.id}
//                             onOpenChange={(open) => {
//                               setIsItemReturnModalOpen(open)
//                               if (open) setSelectedItem(item)
//                               else setSelectedItem(null)
//                             }}
//                           >
//                             <DialogTrigger asChild>
//                               <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white h-7 text-xs">
//                                 Process Return
//                               </Button>
//                             </DialogTrigger>
//                             <DialogContent className='bg-white'>
//                               <DialogHeader>
//                                 <DialogTitle>Process Item Return</DialogTitle>
//                                 <DialogDescription>
//                                   Review the return reason: "{item.return_reason}" and choose to approve or deny the
//                                   return request.
//                                 </DialogDescription>
//                               </DialogHeader>
//                               <div className="flex gap-4">
//                                 <Button
//                                   onClick={() => setItemReturnAction("approve")}
//                                   className="bg-emerald-600 hover:bg-emerald-700 text-white"
//                                 >
//                                   Approve Return
//                                 </Button>
//                                 <Button
//                                   onClick={() => setItemReturnAction("deny")}
//                                   className="bg-rose-600 hover:bg-rose-700 text-white"
//                                 >
//                                   Deny Return
//                                 </Button>
//                               </div>
//                               <DialogFooter>
//                                 <Button variant="outline" onClick={() => setIsItemReturnModalOpen(false)}>
//                                   Cancel
//                                 </Button>
//                                 <Button
//                                   onClick={handleItemReturnAction}
//                                   className="bg-purple-600 hover:bg-purple-700 text-white"
//                                   disabled={!itemReturnAction}
//                                 >
//                                   Submit
//                                 </Button>
//                               </DialogFooter>
//                             </DialogContent>
//                           </Dialog>
//                         )}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="border-purple-200 shadow-sm overflow-hidden">
//           <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2"></div>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-xl">Order Summary</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-3">
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">Original Subtotal:</span>
//                 <span className="font-medium">₹{order.total_amount}</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">Total Discounts:</span>
//                 <span className="font-medium text-rose-600">-₹{order.total_discount}</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">Tax:</span>
//                 <span className="font-medium ">₹{order.total_tax}</span>
//               </div>
//                <div className="flex justify-between items-center">
//                 <span className="text-gray-600">Coupon discount:</span>
//                 <span className="font-medium text-rose-600">-₹{order.coupon_discount}</span>
//               </div>
//                <div className="flex justify-between items-center">
//                 <span className="text-gray-600">Shipping:</span>
//                 <span className="font-medium">₹{order.shipping}</span>
//               </div>
//               <div className="flex justify-between items-center pt-3 border-t border-gray-200 mt-2">
//                 <span className="text-gray-900 font-semibold text-lg">Grand Total:</span>
//                 <span className="font-bold text-lg text-emerald-700">₹{order.final_total}</span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useNavigate } from "react-router-dom"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertCircle,
  CheckCircle,
  Package,
  ShoppingCart,
  Truck,
  User,
  Calendar,
  ArrowLeft,
  RefreshCcw,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import api from "../../api"
import { useParams } from "react-router-dom"

export default function OrderHandlePage() {
  const [orderStatus, setOrderStatus] = useState("pending")
  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updateMessage, setUpdateMessage] = useState(null)
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false)
  const [isItemReturnModalOpen, setIsItemReturnModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [returnAction, setReturnAction] = useState(null)
  const [itemReturnAction, setItemReturnAction] = useState(null)
  const { id } = useParams()
  const navigate=useNavigate()
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true)
        const response = await api.get(`cartapp/orders/${id}/`)
        console.log("Order details data:", response.data)
        setOrder(response.data)
        setOrderStatus(response.data.status)
        setIsLoading(false)
      } catch (err) {
        setError(err.message || "Failed to fetch order")
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  const handleStatusUpdate = async () => {
    try {
      const response = await api.patch(`cartapp/orderupdating/${id}/`, {
        status: orderStatus,
      })
      setOrder({ ...order, status: orderStatus })
      setUpdateMessage("Order status updated successfully!")
      setTimeout(() => setUpdateMessage(null), 3000)
    } catch (err) {
      setError(err.message || "Failed to update order status")
      setTimeout(() => setError(null), 3000)
    }
  }

  const handleReturnAction = async () => {
    try {
      const response = await api.patch(`cartapp/orders/${id}/return/approve/`, {
        approve: returnAction === "approve",
      })
      const updatedOrderResponse = await api.get(`cartapp/orders/${id}/`)
      setOrder(updatedOrderResponse.data)
      setIsReturnModalOpen(false)
      setUpdateMessage(`Order return ${returnAction === "approve" ? "approved" : "denied"} successfully!`)
      setTimeout(() => setUpdateMessage(null), 3000)
    } catch (err) {
      console.error("Error response:", err.response?.data, err.response?.status);
      setError(err.message || "Failed to process return action")
      setTimeout(() => setError(null), 3000)
    }
  }

  const handleItemReturnAction = async () => {
    try {
      await api.patch(`cartapp/orderitems/${selectedItem.id}/return/approve/`, {
        approve: itemReturnAction === "approve",
      })
      const updatedOrderResponse = await api.get(`cartapp/orders/${id}/`)
      setOrder(updatedOrderResponse.data)
      setIsItemReturnModalOpen(false)
      setSelectedItem(null)
      setUpdateMessage(`Item return ${itemReturnAction === "approve" ? "approved" : "denied"} successfully!`)
      setTimeout(() => setUpdateMessage(null), 3000)
    } catch (err) {
      setError(err.message || "Failed to process item return action")
      setTimeout(() => setError(null), 3000)
    }
  }

  const getStatusColor = (status) => {
    const statusMap = {
      pending: "bg-amber-100 text-amber-800 border-amber-200",
      processing: "bg-purple-100 text-purple-800 border-purple-200",
      shipped: "bg-sky-100 text-sky-800 border-sky-200",
      delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
      cancelled: "bg-rose-100 text-rose-800 border-rose-200",
      return_requested: "bg-orange-100 text-orange-800 border-orange-200",
      returned: "bg-slate-100 text-slate-800 border-slate-200",
      return_denied: "bg-red-100 text-red-800 border-red-200",
    }
    return statusMap[status] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const formatStatus = (status) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7a2828]"></div>
      </div>
    )

  if (error)
    return (
      <Alert variant="destructive" className="max-w-md mx-auto mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
        <Button onClick={() => window.location.reload()} className="mt-4 bg-[#7a2828] hover:bg-[#7a2828]">
          <RefreshCcw className="mr-2 h-4 w-4" /> Retry
        </Button>
      </Alert>
    )

  if (!order)
    return (
      <Alert className="max-w-md mx-auto mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Order Found</AlertTitle>
        <AlertDescription>The requested order could not be found.</AlertDescription>
      </Alert>
    )

  const statusOptions = ["pending", "processing", "shipped", "delivered"]
  const restrictedStatuses = ["delivered", "cancelled", "returned", "return_requested"]
  const isRestricted = restrictedStatuses.includes(order.status)
  const availableStatuses = order.status === "delivered" ? ["delivered"] : isRestricted ? [order.status] : statusOptions

  return (
    <div className="container mx-auto p-4 bg-gradient-to-b from-white to-red-50">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-6">
          <div className="w-1 h-8 bg-[#7a2828] mr-3"></div>
          <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
          
        </div>
        <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 border-[#7a2828] text-[#7a2828] hover:bg-[#7a2828] hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

        {updateMessage && (
          <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{updateMessage}</AlertDescription>
          </Alert>
        )}

        <Card className="mb-6 border-[#7a2828] shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-[#7a2828] to-red-50 h-2"></div>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center mb-4">
                  <ShoppingCart className="text-[#7a2828] mr-2 h-5 w-5" />
                  <h2 className="text-lg font-semibold text-gray-900">Order Information</h2>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-medium">{order.order_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created Date:</span>
                    <span className="font-medium">{new Date(order.created_at).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Delivery:</span>
                    <span className="font-medium">{order.est_delivery}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge className={`${getStatusColor(order.status)} font-medium`}>
                      {formatStatus(order.status)}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center mb-4">
                  <User className="text-[#7a2828] mr-2 h-5 w-5" />
                  <h2 className="text-lg font-semibold text-gray-900">Customer Information</h2>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">
                      {order.user.first_name} {order.user.last_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{order.user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{order.user.phone_number}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-[#7a2828] shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Truck className="text-[#7a2828] mr-2 h-5 w-5" />
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                <p className="font-medium">{order.order_address.name}</p>
                <p>{order.order_address.house_no}</p>
                <p>
                  {order.order_address.city}, {order.order_address.state}
                </p>
                <p>{order.order_address.pin_code}</p>
                <p className="mt-2">
                  <span className="text-gray-600">Phone: </span>
                  <span className="font-medium">{order.order_address.mobile_number}</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Package className="text-[#7a2828] mr-2 h-5 w-5" />
                Order Status
                 </CardTitle>
              </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <Select 
                  value={orderStatus} 
                  onValueChange={setOrderStatus}
                  disabled={isRestricted}
                >
                  <SelectTrigger className="border-gray-300" aria-label="Select order status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {availableStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {formatStatus(status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleStatusUpdate}
                  className="bg-[#7a2828] hover:bg-[#7a2828] text-white"
                  aria-label="Update order status"
                  disabled={isRestricted}
                >
                  Update Status
                </Button>
                {order.status === "return_requested" && (
                  <Dialog open={isReturnModalOpen} onOpenChange={setIsReturnModalOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-orange-500 hover:bg-orange-600 text-white">Process Return</Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white">
                      <DialogHeader>
                        <DialogTitle>Process Order Return</DialogTitle>
                        <DialogDescription>
                          Review the return reason: "{order.return_reason}" and choose to approve or deny the return
                          request.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex gap-4">
                        <Button
                          onClick={() => setReturnAction("approve")}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          Approve Return
                        </Button>
                        <Button
                          onClick={() => setReturnAction("deny")}
                          className="bg-rose-600 hover:bg-rose-700 text-white"
                        >
                          Deny Return
                        </Button>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsReturnModalOpen(false)}>
                          Cancel
                        </Button>
                        <Button
                          onClick={handleReturnAction}
                          className="bg-[#7a2828] hover:bg-[#7a2828] text-white"
                          disabled={!returnAction}
                        >
                          Submit
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#7a2828] shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Calendar className="text-[#7a2828] mr-2 h-5 w-5" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium">{order.payment_method.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status:</span>
                  <Badge
                    className={
                      order.payment_status === "completed"
                        ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                        : "bg-rose-100 text-rose-800 border-rose-200"
                    }
                  >
                    {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                  </Badge>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                  <span className="text-gray-900 font-semibold">Grand Total:</span>
                  <span className="font-bold text-green-600">₹{order.final_total}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {(order.cancel_reason || order.return_reason) && (
          <Card className="mb-8 border-purple-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-2"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <ArrowLeft className="text-orange-600 mr-2 h-5 w-5" />
                Cancellation & Return Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={order.return_reason ? "return" : "cancel"} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="cancel" disabled={!order.cancel_reason}>
                    Cancellation
                  </TabsTrigger>
                  <TabsTrigger value="return" disabled={!order.return_reason}>
                    Return
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="cancel" className="p-4 bg-amber-50 rounded-md mt-2">
                  {order.cancel_reason ? (
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="font-medium text-amber-800 min-w-32">Reason:</div>
                        <div className="text-gray-800">{order.cancel_reason}</div>
                      </div>
                      {order.cancelled_at && (
                        <div className="flex items-start">
                          <div className="font-medium text-amber-800 min-w-32">Cancelled On:</div>
                          <div className="text-gray-800">{new Date(order.cancelled_at).toLocaleString()}</div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-500 italic">No cancellation information available</div>
                  )}
                </TabsContent>
                <TabsContent value="return" className="p-4 bg-orange-50 rounded-md mt-2">
                  {order.return_reason ? (
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="font-medium text-orange-800 min-w-32">Reason:</div>
                        <div className="text-gray-800">{order.return_reason}</div>
                      </div>
                      {order.returned_at && (
                        <div className="flex items-start">
                          <div className="font-medium text-orange-800 min-w-32">Returned On:</div>
                          <div className="text-gray-800">{new Date(order.returned_at).toLocaleString()}</div>
                        </div>
                      )}
                      <div className="flex items-start">
                        <div className="font-medium text-orange-800 min-w-32">Approval Status:</div>
                        <Badge
                          className={
                            order.approve_status
                              ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                              : "bg-slate-100 text-slate-800 border-slate-200"
                          }
                        >
                          {order.approve_status ? "Approved" : "Not Approved"}
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500 italic">No return information available</div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        <Card className="mb-8 border-[#7a2828] shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-red-100 to-[#7a2828] h-2"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Order Items</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-purple-50">
                  <TableRow>
                    <TableHead className="font-medium">Product</TableHead>
                    <TableHead className="font-medium">Variant</TableHead>
                    <TableHead className="font-medium">Qty</TableHead>
                    <TableHead className="font-medium">Price</TableHead>
                    <TableHead className="font-medium">Discount</TableHead>
                    <TableHead className="font-medium">Total</TableHead>
                    <TableHead className="font-medium">Status</TableHead>
                    <TableHead className="font-medium">Return Info</TableHead>
                    <TableHead className="font-medium">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id} className="hover:bg-purple-50">
                      <TableCell className="font-medium">{item.product.name}</TableCell>
                      <TableCell>{item.variant ? `${item.variant.gross_weight || "N/A"}g` : "N/A"}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        <div className="text-gray-500 line-through text-xs">₹{item.price}</div>
                        <div>₹{item.final_price || item.price}</div>
                      </TableCell>
                      <TableCell className="text-rose-600">₹{item.discount}</TableCell>
                      <TableCell className="font-medium">₹{item.subtotal || item.final_priceI}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(item.status)}>{formatStatus(item.status)}</Badge>
                      </TableCell>
                      <TableCell>
                        {item.return_reason ? (
                          <Dialog >
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-xs h-7">
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className='bg-white'>
                              <DialogHeader>
                                <DialogTitle>Return Details</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-3 text-sm">
                                <div className="grid grid-cols-3 gap-2">
                                  <div className="font-medium">Return Reason:</div>
                                  <div className="col-span-2">{item.return_reason}</div>
                                </div>
                                {item.returned_at && (
                                  <div className="grid grid-cols-3 gap-2">
                                    <div className="font-medium">Return Date:</div>
                                    <div className="col-span-2">{new Date(item.returned_at).toLocaleString()}</div>
                                  </div>
                                )}
                                <div className="grid grid-cols-3 gap-2">
                                  <div className="font-medium">Approval Status:</div>
                                  <div className="col-span-2">
                                    <Badge
                                      className={
                                        item.approve_status
                                          ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                          : "bg-slate-100 text-slate-800 border-slate-200"
                                      }
                                    >
                                      {item.approve_status ? "Approved" : "Not Approved"}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        ) : (
                          <span className="text-gray-500 text-sm">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.status === "return_requested" && (
                          <Dialog
                            open={isItemReturnModalOpen && selectedItem?.id === item.id}
                            onOpenChange={(open) => {
                              setIsItemReturnModalOpen(open)
                              if (open) setSelectedItem(item)
                              else setSelectedItem(null)
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white h-7 text-xs">
                                Process Return
                              </Button>
                            </DialogTrigger>
                            <DialogContent className='bg-white'>
                              <DialogHeader>
                                <DialogTitle>Process Item Return</DialogTitle>
                                <DialogDescription>
                                  Review the return reason: "{item.return_reason}" and choose to approve or deny the
                                  return request.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex gap-4">
                                <Button
                                  onClick={() => setItemReturnAction("approve")}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                >
                                  Approve Return
                                </Button>
                                <Button
                                  onClick={() => setItemReturnAction("deny")}
                                  className="bg-rose-600 hover:bg-rose-700 text-white"
                                >
                                  Deny Return
                                </Button>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsItemReturnModalOpen(false)}>
                                  Cancel
                                </Button>
                                <Button
                                  onClick={handleItemReturnback}
                                  className="bg-purple-600 hover:bg-purple-700 text-white"
                                  disabled={!itemReturnAction}
                                >
                                  Submit
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Original Subtotal:</span>
                <span className="font-medium">₹{order.total_amount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Discounts:</span>
                <span className="font-medium text-rose-600">-₹{order.total_discount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tax:</span>
                <span className="font-medium ">₹{order.total_tax}</span>
              </div>
               <div className="flex justify-between items-center">
                <span className="text-gray-600">Coupon discount:</span>
                <span className="font-medium text-rose-600">-₹{order.coupon_discount}</span>
              </div>
               <div className="flex justify-between items-center">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-medium">₹{order.shipping}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-200 mt-2">
                <span className="text-gray-900 font-semibold text-lg">Grand Total:</span>
                <span className="font-bold text-lg text-emerald-700">₹{order.final_total}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}