
// "use client";

// import { useState, useEffect } from "react";
// import {
//   Home,
//   ChevronRight,
//   RefreshCw,
//   AlertTriangle,
//   Package,
//   CreditCard,
//   MapPin,
//   ArrowLeft,
//   Download,
//   Clock,
//   XCircle,
//   RotateCcw,
//   CheckCircle2,
//   Truck,
//   ShoppingBag,
//   Calendar,
//   User,
//   Phone,
//   Mail,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { Badge } from "@/components/ui/badge";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
// import { useNavigate, useParams } from "react-router-dom";
// import api from "../../api";
// import { Link } from 'react-router-dom';
// import Swal from "sweetalert2";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// const ViewOrderDetails = () => {
//   const [order, setOrder] = useState(null);
//   const [isRetrying, setIsRetrying] = useState(false);
//   const [isHoveringTimeline, setIsHoveringTimeline] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
//   const [cancelReason, setCancelReason] = useState("");
//   const [cancelReasonType, setCancelReasonType] = useState("");
//   const [isItemCancelModalOpen, setIsItemCancelModalOpen] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [itemCancelReason, setItemCancelReason] = useState("");
//   const [itemCancelReasonType, setItemCancelReasonType] = useState("");
//   const [isCancellingItem, setIsCancellingItem] = useState(false);
//   const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
//   const [returnReason, setReturnReason] = useState("");
//   const [returnReasonType, setReturnReasonType] = useState("");
//   const [isItemReturnModalOpen, setIsItemReturnModalOpen] = useState(false);
//   const [itemReturnReason, setItemReturnReason] = useState("");
//   const [itemReturnReasonType, setItemReturnReasonType] = useState("");
//   const [isReturningItem, setIsReturningItem] = useState(false);
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const capitalize = (str) => {
//     if (typeof str !== "string" || str.length === 0) return "Unknown";
//     return str.charAt(0).toUpperCase() + str.slice(1);
//   };
//   const BASE_URL = import.meta.env.VITE_BASE_URL
//   const loadRazorpayScript = () => {
//     return new Promise((resolve, reject) => {
//       if (window.Razorpay) {
//         resolve(true);
//         return;
//       }
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.onload = () => resolve(true);
//       script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
//       document.body.appendChild(script);
//     });
//   };

//   useEffect(() => {
//     const fetchOrder = async () => {
//       try {
//         const response = await api.get(`cartapp/orders/${id}/`);
//         setOrder(response.data);
//         console.log("Order data plxxxxxxxxxxxxxxx:", response.data);
//         setIsLoading(false);
//       } catch (err) {
//         setError("Failed to load order details. Please try again later.");
//         setIsLoading(false);
//         console.error("Error fetching order:", err);
//       }
//     };
//     fetchOrder();
//   }, [id]);

//   const handleRetryPayment = async (orderId) => {
//     setIsRetrying(true);
//     try {
//       await loadRazorpayScript();

//       const response = await api.post("cartapp/orders/razorpay/retry/", { order_id: orderId });

//       if (!response.data || !response.data.order_id || !response.data.amount || !response.data.currency || !response.data.key) {
//         throw new Error("Invalid response from payment retry API.");
//       }

//       const { order_id: razorpayOrderId, amount, currency, key, order } = response.data;

//       const options = {
//         key: key,
//         amount: amount,
//         currency: currency,
//         order_id: razorpayOrderId,
//         name: "Your Company Name",
//         description: `Payment for Order #${order.order_number}`,
//         image: "https://yourdomain.com/logo.png",
//         handler: async (paymentResponse) => {
//           try {
//             const verificationResponse = await api.post("cartapp/orders/razorpay/verify/", {
//               razorpay_payment_id: paymentResponse.razorpay_payment_id,
//               razorpay_order_id: paymentResponse.razorpay_order_id,
//               razorpay_signature: paymentResponse.razorpay_signature,
//             });

//             setOrder((prevOrder) => ({
//               ...prevOrder,
//               payment_status: "completed",
//               status: "processing",
//             }));

//             Swal.fire({
//               icon: "success",
//               title: "Payment Successful",
//               text: "Your payment has been verified successfully!",
//             });
//           } catch (err) {
//             console.error("Payment verification failed:", err);
//             Swal.fire({
//               icon: "error",
//               title: "Payment Verification Failed",
//               text: err.response?.data?.error || "Failed to verify payment. Please contact support.",
//             });
//           }
//         },
//         theme: {
//           color: "#7a2828",
//         },
//         modal: {
//           ondismiss: () => {
//             setIsRetrying(false);
//             Swal.fire({
//               icon: "info",
//               title: "Payment Cancelled",
//               text: "The payment process was cancelled. Please try again.",
//             });
//           },
//         },
//       };

//       const razorpay = new window.Razorpay(options);
//       razorpay.open();

//       razorpay.on("payment.failed", (error) => {
//         setIsRetrying(false);
//         Swal.fire({
//           icon: "error",
//           title: "Payment Failed",
//           text: error.error.description || "Payment failed. Please try again.",
//         });
//       });
//     } catch (err) {
//       setIsRetrying(false);
//       console.error("Error retrying payment:", err);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: err.response?.data?.error || "Failed to initiate payment retry. Please try again.",
//       });
//     }
//   };

//   const handleCancelOrder = async () => {
//     if (!cancelReasonType) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Please select a reason type.",
//       });
//       return;
//     }

//     if (cancelReasonType === "other" && !cancelReason) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: 'Please provide details for the "Other" reason.',
//       });
//       return;
//     }

//     const cancelReasonPayload = cancelReasonType === "other" ? cancelReason : cancelReasonType;

//     try {
//       await api.post(`cartapp/orders/${id}/cancel/`, {
//         cancel_reason: cancelReasonPayload,
//       });
//       setOrder({ ...order, status: "cancelled", cancel_reason: cancelReasonPayload });
//       setIsCancelModalOpen(false);
//       Swal.fire({
//         icon: "success",
//         title: "Order Cancellation",
//         text: "Your Order Cancelled Successfully.",
//       });
//     } catch (err) {
//       console.error("Error cancelling order:", err);
//       const errorMessage =
//         err.response?.data?.error ||
//         err.response?.data?.cancel_reason?.[0] ||
//         "Failed to cancel order. Please try again.";
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: errorMessage,
//       });
//     }
//   };

//   const handleCancelItem = async () => {
//     if (!itemCancelReasonType) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Please select a reason type.",
//       });
//       return;
//     }

//     if (itemCancelReasonType === "other" && !itemCancelReason) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: 'Please provide details for the "Other" reason.',
//       });
//       return;
//     }

//     setIsCancellingItem(true);
//     const cancelReasonPayload = itemCancelReasonType === "other" ? itemCancelReason : itemCancelReasonType;
//     let originalOrder = { ...order };

//     try {
//       const itemResponse = await api.get(`cartapp/orderitems/${selectedItem.id}/`);
//       if (itemResponse.data.status !== "active") {
//         Swal.fire({
//           icon: "error",
//           title: "Error",
//           text: `This item is ${itemResponse.data.status} and cannot be cancelled.`,
//         });
//         setIsItemCancelModalOpen(false);
//         return;
//       }

//       const updatedItems = order.items.map((item) =>
//         item.id === selectedItem.id ? { ...item, status: "cancelled", cancel_reason: cancelReasonPayload } : item
//       );
//       setOrder({ ...order, items: updatedItems });

//       await api.post(`cartapp/orderitems/${selectedItem.id}/cancel/`, {
//         cancel_reason: cancelReasonPayload,
//       });

//       const updatedOrderResponse = await api.get(`cartapp/orders/${id}/`);
//       setOrder(updatedOrderResponse.data);
//       setIsItemCancelModalOpen(false);
//       setItemCancelReason("");
//       setItemCancelReasonType("");
//       setSelectedItem(null);
//       Swal.fire({
//         icon: "success",
//         title: "Item Cancellation",
//         text: "The item has been cancelled successfully.",
//       });
//     } catch (err) {
//       console.error("Error cancelling item:", err.response?.data);
//       setOrder(originalOrder);
//       const errorMessage =
//         err.response?.data?.error ||
//         err.response?.data?.cancel_reason?.[0] ||
//         `Failed to cancel item. The item is ${err.response?.data?.status || "no longer cancellable"}.`;
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: errorMessage,
//       });
//     } finally {
//       setIsCancellingItem(false);
//     }
//   };

//   const handleReturnOrder = async () => {
//     if (!returnReasonType) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Please select a reason type.",
//       });
//       return;
//     }

//     if (returnReasonType === "other" && !returnReason) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: 'Please provide details for the "Other" reason.',
//       });
//       return;
//     }

//     const returnReasonPayload = returnReasonType === "other" ? returnReason : returnReasonType;

//     try {
//       await api.patch(`cartapp/orders/${id}/return/`, {
//         return_reason: returnReasonPayload,
//       });
//       setOrder({ ...order, status: "return_requested", return_reason: returnReasonPayload });
//       setIsReturnModalOpen(false);
//       Swal.fire({
//         icon: "success",
//         title: "Return Request",
//         text: "Your return request has been submitted successfully.",
//       });
//     } catch (err) {
//       console.error("Error requesting return:", err);
//       const errorMessage =
//         err.response?.data?.error ||
//         err.response?.data?.return_reason?.[0] ||
//         "Failed to submit return request. Please try again.";
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: errorMessage,
//       });
//     }
//   };

//   const handleReturnItem = async () => {
//     if (!itemReturnReasonType) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Please select a reason type.",
//       });
//       return;
//     }

//     if (itemReturnReasonType === "other" && !itemReturnReason) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: 'Please provide details for the "Other" reason.',
//       });
//       return;
//     }

//     setIsReturningItem(true);
//     const returnReasonPayload = itemReturnReasonType === "other" ? itemReturnReason : itemReturnReasonType;
//     let originalOrder = { ...order };

//     try {
//       const itemResponse = await api.get(`cartapp/orderitems/${selectedItem.id}/`);
//       if (itemResponse.data.status !== "delivered") {
//         Swal.fire({
//           icon: "error",
//           title: "Error",
//           text: `This item is ${itemResponse.data.status} and cannot be returned.`,
//         });
//         setIsItemReturnModalOpen(false);
//         return;
//       }

//       const updatedItems = order.items.map((item) =>
//         item.id === selectedItem.id
//           ? { ...item, status: "return_requested", return_reason: returnReasonPayload }
//           : item
//       );
//       setOrder({ ...order, items: updatedItems });

//       await api.patch(`cartapp/orderitems/${selectedItem.id}/return/`, {
//         return_reason: returnReasonPayload,
//       });

//       const updatedOrderResponse = await api.get(`cartapp/orders/${id}/`);
//       setOrder(updatedOrderResponse.data);
//       setIsItemReturnModalOpen(false);
//       setItemReturnReason("");
//       setItemReturnReasonType("");
//       setSelectedItem(null);
//       Swal.fire({
//         icon: "success",
//         title: "Item Return Request",
//         text: "The item return request has been submitted successfully.",
//       });
//     } catch (err) {
//       console.error("Error requesting item return:", err.response?.data);
//       setOrder(originalOrder);
//       const errorMessage =
//         err.response?.data?.error ||
//         err.response?.data?.return_reason?.[0] ||
//         `Failed to submit item return request. The item is ${err.response?.data?.status || "no longer returnable"}.`;
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: errorMessage,
//       });
//     } finally {
//       setIsReturningItem(false);
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "active":
//         return "bg-emerald-100 text-emerald-800 border-emerald-200";
//       case "cancelled":
//         return "bg-red-100 text-red-800 border-red-200";
//       case "return_requested":
//         return "bg-amber-100 text-amber-800 border-amber-200";
//       case "returned":
//         return "bg-emerald-100 text-emerald-800 border-emerald-200";
//       case "return_denied":
//         return "bg-red-100 text-red-800 border-red-200";
//       case "delivered":
//         return "bg-emerald-100 text-emerald-800 border-emerald-200";
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-200";
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "pending":
//         return <Clock className="h-5 w-5" />;
//       case "processing":
//         return <RefreshCw className="h-5 w-5" />;
//       case "shipped":
//         return <Truck className="h-5 w-5" />;
//       case "delivered":
//         return <CheckCircle2 className="h-5 w-5" />;
//       case "cancelled":
//         return <XCircle className="h-5 w-5" />;
//       case "return_requested":
//       case "returned":
//         return <RotateCcw className="h-5 w-5" />;
//       default:
//         return <AlertTriangle className="h-5 w-5" />;
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-white to-[#f8f3f3] flex justify-center items-center p-4">
//         <div className="flex flex-col items-center gap-6 text-center">
//           <div className="relative w-24 h-24">
//             <div className="absolute inset-0 rounded-full border-4 border-[#e5d1d1] opacity-25"></div>
//             <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-[#7a2828] animate-spin"></div>
//           </div>
//           <div className="space-y-2">
//             <h3 className="text-2xl font-bold text-[#441717]">Loading Order Details</h3>
//             <p className="text-[#7a2828]">Please wait while we fetch your order information...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-white to-[#f8f3f3] flex justify-center items-center p-4">
//         <Card className="w-full max-w-lg border-red-200 shadow-xl animate-bounce-in">
//           <CardContent className="p-6">
//             <div className="flex flex-col items-center gap-4 text-center">
//               <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center">
//                 <AlertTriangle className="h-10 w-10 text-red-600" />
//               </div>
//               <div className="space-y-2">
//                 <h3 className="text-2xl font-bold text-red-800">Error Loading Order</h3>
//                 <p className="text-red-600">{error}</p>
//                 <Button
//                   className="mt-4 bg-gradient-to-r from-[#7a2828] to-[#441717] hover:from-[#5e1f1f] hover:to-[#2a0e0e] text-white"
//                   onClick={() => navigate("/myorders")}
//                 >
//                   Return to Orders
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   if (!order) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-white to-[#f8f3f3] flex justify-center items-center p-4">
//         <Card className="w-full max-w-lg border-amber-200 shadow-xl">
//           <CardContent className="p-6">
//             <div className="flex flex-col items-center gap-4 text-center">
//               <div className="h-20 w-20 rounded-full bg-amber-100 flex items-center justify-center">
//                 <AlertTriangle className="h-10 w-10 text-amber-600" />
//               </div>
//               <div className="space-y-2">
//                 <h3 className="text-2xl font-bold text-amber-800">Order Not Found</h3>
//                 <p className="text-amber-600">We couldn't find the order you're looking for.</p>
//                 <Button
//                   className="mt-4 bg-gradient-to-r from-[#7a2828] to-[#441717] hover:from-[#5e1f1f] hover:to-[#2a0e0e] text-white"
//                   onClick={() => navigate("/myorders")}
//                 >
//                   Return to Orders
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   const orderedDate = new Date(order.created_at).toLocaleString("en-US", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });
//   const estDeliveryDate = new Date(order.est_delivery).toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });

//   const canCancel = order.status === "pending" || order.status === "processing";
//   const canReturn = order.status === "delivered";

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-white to-[#f8f3f3] pt-6 pb-16">
//       <div className="container mx-auto px-4 max-w-7xl">
//         {/* Back to Orders Button */}
//         <Button
//           variant="ghost"
//           size="sm"
//           className="mb-6 text-[#7a2828] hover:text-[#2a0e0e] hover:bg-[#f3e9e9] transition-all duration-300 group flex items-center"
//           onClick={() => navigate("/myorders")}
//         >
//           <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
//           <span className="font-medium">Back to Orders</span>
//         </Button>

//         {/* Breadcrumb */}
//         <nav className="flex items-center text-sm text-gray-600 mb-8 overflow-x-auto pb-2 font-medium">
//   <Link to="/" className="flex items-center hover:text-[#7a2828] transition-colors duration-200">
//     <Home className="h-4 w-4 mr-1" />
//     Home
//   </Link>
//   <ChevronRight className="h-4 w-4 mx-2 flex-shrink-0 text-gray-400" />
  
//   <Link to="/userprofile" className="hover:text-[#7a2828] transition-colors duration-200 whitespace-nowrap">
//     My Account
//   </Link>

//   <ChevronRight className="h-4 w-4 mx-2 flex-shrink-0 text-gray-400" />
  
//   <span className="text-[#7a2828] font-semibold whitespace-nowrap">
//     Order #{order.order_number}
//   </span>
// </nav>
//         {/* Order Header */}
//    {/* <Card className="mb-8 border-none shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden relative">
//   <div className="absolute inset-0 bg-gradient-to-br from-[#f3e9e9] to-[#f7f2e9] opacity-50"></div>
//   <CardContent className="p-8 relative z-10">
//     <div className="flex items-center justify-between gap-3 mb-6">
//       <div className="flex items-center gap-3">
//         <div className="bg-gradient-to-r from-[#7a2828] to-[#b8860b] p-2 rounded-lg shadow-md">
//           <Package className="h-6 w-6 text-white" />
//         </div>
//         <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#7a2828] to-[#b8860b]">
//           Order Status
//         </h2>
//       </div>
//       <div className="flex flex-wrap items-center gap-4">
//         <Badge
//           variant="outline"
//           className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-sm ${
//             order.payment_status === "pending"
//               ? "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200"
//               : "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200"
//           }`}
//         >
//           <span
//             className={`h-2.5 w-2.5 rounded-full ${
//               order.payment_status === "pending" ? "bg-amber-500" : "bg-emerald-500"
//             } animate-pulse`}
//           ></span>
//           {order.payment_status === "pending" ? "Payment Pending" : "Payment Completed"}
//         </Badge>
//         {(order.status === "pending" || order.status === "processing") && (
//           <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
//             <DialogTrigger asChild>
//               <Button
//                 variant="destructive"
//                 size="sm"
//                 className="bg-gradient-to-r from-[#7a2828] to-[#5e1f1f] hover:from-[#5e1f1f] hover:to-[#441717] text-white font-semibold px-4 py-2 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
//                 disabled={isCancellingItem || isReturningItem}
//               >
//                 <XCircle className="h-5 w-5 mr-2" />
//                 Cancel Order
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-md bg-white rounded-xl shadow-2xl border-none">
//               <DialogHeader>
//                 <DialogTitle className="text-2xl font-bold text-red-600">Cancel Order</DialogTitle>
//                 <DialogDescription className="text-gray-600">
//                   Please select the reason for cancelling your order
//                   {cancelReasonType === "other" ? " and provide details." : "."}
//                 </DialogDescription>
//               </DialogHeader>
//               <div className="grid gap-6 py-6">
//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <label htmlFor="reason-type" className="text-right font-medium text-gray-700">
//                     Reason Type
//                   </label>
//                   <Select
//                     onValueChange={(value) => {
//                       setCancelReasonType(value);
//                       if (value !== "other") {
//                         setCancelReason("");
//                       }
//                     }}
//                     value={cancelReasonType}
//                     className="col-span-3"
//                   >
//                     <SelectTrigger className="bg-white border-red-200 focus:ring-[#7a2828]">
//                       <SelectValue placeholder="Select a reason" />
//                     </SelectTrigger>
//                     <SelectContent className="bg-white border-red-200">
//                       <SelectItem value="changed_mind">Changed Mind</SelectItem>
//                       <SelectItem value="ordered_by_mistake">Ordered by Mistake</SelectItem>
//                       <SelectItem value="found_better_price">Found Better Price</SelectItem>
//                       <SelectItem value="other">Other</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 {cancelReasonType === "other" && (
//                   <div className="grid grid-cols-4 items-center gap-4">
//                     <label htmlFor="reason-details" className="text-right font-medium text-gray-700">
//                       Details
//                     </label>
//                     <Input
//                       id="reason-details"
//                       value={cancelReason}
//                       onChange={(e) => setCancelReason(e.target.value)}
//                       className="col-span-3 border-red-200 focus:ring-[#7a2828]"
//                       placeholder="Provide more details"
//                     />
//                   </div>
//                 )}
//               </div>
//               <DialogFooter className="flex justify-end gap-3">
//                 <Button
//                   variant="outline"
//                   onClick={() => {
//                     setIsCancelModalOpen(false);
//                     setCancelReason("");
//                     setCancelReasonType("");
//                   }}
//                   className="border-red-200 text-red-600 hover:bg-red-50"
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={handleCancelOrder}
//                   className="bg-gradient-to-r from-[#7a2828] to-[#5e1f1f] hover:from-[#5e1f1f] hover:to-[#441717] text-white"
//                   disabled={isCancellingItem || isReturningItem}
//                 >
//                   Submit
//                 </Button>
//               </DialogFooter>
//             </DialogContent>
//           </Dialog>
//         )}
//       </div>
//     </div>
//     <Separator className="mb-6 bg-gradient-to-r from-[#e5d1d1] to[#f0e6c9] h-0.5 rounded-full" />

//     <div
//       className="relative"
//       onMouseEnter={() => setIsHoveringTimeline(true)}
//       onMouseLeave={() => setIsHoveringTimeline(false)}
//     >
//       <div className="flex justify-between mb-4">
//         {(() => {
//           const filteredSteps = [
//             { status: "pending", label: "Ordered", date: order.created_at },
//             { status: "processing", label: "Processing", date: null },
//             { status: "shipped", label: "Shipped", date: null },
//             { status: "delivered", label: "Delivered", date: order.est_delivery },
//             ...(order.status === "cancelled"
//               ? [{ status: "cancelled", label: "Cancelled", date: null }]
//               : []),
//             ...(order.status === "return_requested"
//               ? [{ status: "return_requested", label: "Return Requested", date: null }]
//               : []),
//             ...(order.status === "returned"
//               ? [{ status: "returned", label: "Returned", date: null }]
//               : []),
//             ...(order.status === "return_denied"
//               ? [{ status: "return_denied", label: "Return Denied", date: null }]
//               : []),
//           ];

//           return filteredSteps.map((step, index) => {
//             const isActive = () => {
//               const statusOrder = [
//                 "pending",
//                 "processing",
//                 "shipped",
//                 "delivered",
//                 "cancelled",
//                 "return_requested",
//                 "returned",
//                 "return_denied",
//               ];
//               const currentIndex = statusOrder.indexOf(order.status);
//               const stepIndex = statusOrder.indexOf(step.status);
//               if (order.status === "cancelled" || order.status.includes("return")) {
//                 return step.status === order.status;
//               }
//               return (
//                 stepIndex <= currentIndex &&
//                 !["cancelled", "return_requested", "returned", "return_denied"].includes(order.status)
//               );
//             };

//             const getTooltipContent = () => {
//               if (step.status === order.status) {
//                 return `Order is currently ${capitalize(step.status.replace("_", " "))}`;
//               }
//               if (step.date && step.status === "pending") {
//                 return `Order placed on ${new Date(step.date).toLocaleString("en-US", {
//                   year: "numeric",
//                   month: "long",
//                   day: "numeric",
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 })}`;
//               }
//               if (step.date && step.status === "delivered" && order.status !== "delivered") {
//                 return `Expected delivery on ${new Date(step.date).toLocaleDateString("en-US", {
//                   year: "numeric",
//                   month: "long",
//                   day: "numeric",
//                 })}`;
//               }
//               return `Order ${step.status} ${isActive() ? "active" : "pending"}`;
//             };

//             return (
//               <TooltipProvider key={step.status}>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <div className="flex flex-col items-center cursor-pointer group">
//                       <div
//                         className={`rounded-full h-14 w-14 flex items-center justify-center ${
//                           isActive()
//                             ? "bg-gradient-to-br from-[#7a2828] to-[#b8860b] text-white"
//                             : "bg-gray-200 text-gray-500"
//                         } font-bold text-lg group-hover:shadow-lg group-hover:shadow-purple-300 transition-all duration-300 transform group-hover:scale-110`}
//                       >
//                         {index + 1}
//                       </div>
//                       <p
//                         className={`mt-3 font-semibold text-sm ${
//                           isActive() ? "text-gray-800 group-hover:text-[#7a2828]" : "text-gray-500"
//                         } transition-colors duration-200`}
//                       >
//                         {step.label}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         {step.date && step.status === "pending"
//                           ? new Date(step.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
//                           : step.date && step.status === "delivered" && order.status !== "delivered"
//                           ? `Est. ${new Date(step.date).toLocaleDateString("en-US", {
//                               month: "short",
//                               day: "numeric",
//                             })}`
//                           : isActive()
//                           ? "Active"
//                           : "Pending"}
//                       </p>
//                     </div>
//                   </TooltipTrigger>
//                   <TooltipContent className="bg-gradient-to-r from-[#7a2828] to-[#b8860b] text-white border-none shadow-lg">
//                     <p>{getTooltipContent()}</p>
//                   </TooltipContent>
//                 </Tooltip>
//               </TooltipProvider>
//             );
//           });
//         })()}
//       </div>

//       <div className="absolute top-7 left-0 right-0 h-2 bg-gray-200 -z-10 rounded-full">
//         <div
//           className="h-full bg-gradient-to-r from-[#7a2828] to-[#b8860b] transition-all duration-1000 rounded-full"
//           style={{
//             width: (() => {
//               const filteredSteps = [
//                 { status: "pending", label: "Ordered", date: order.created_at },
//                 { status: "processing", label: "Processing", date: null },
//                 { status: "shipped", label: "Shipped", date: null },
//                 { status: "delivered", label: "Delivered", date: order.est_delivery },
//                 ...(order.status === "cancelled"
//                   ? [{ status: "cancelled", label: "Cancelled", date: null }]
//                   : []),
//                 ...(order.status === "return_requested"
//                   ? [{ status: "return_requested", label: "Return Requested", date: null }]
//                   : []),
//                 ...(order.status === "returned"
//                   ? [{ status: "returned", label: "Returned", date: null }]
//                   : []),
//                 ...(order.status === "return_denied"
//                   ? [{ status: "return_denied", label: "Return Denied", date: null }]
//                   : []),
//               ];
//               const statusOrder = [
//                 "pending",
//                 "processing",
//                 "shipped",
//                 "delivered",
//                 "cancelled",
//                 "return_requested",
//                 "returned",
//                 "return_denied",
//               ];
//               const currentIndex = statusOrder.indexOf(order.status);
//               const defaultStatuses = ["pending", "processing", "shipped", "delivered"];
//               if (order.status === "cancelled" || order.status.includes("return")) {
//                 return currentIndex === -1 ? "0%" : "100%";
//               }
//               return currentIndex === -1 ? "0%" : `${(currentIndex / (defaultStatuses.length - 1)) * 100}%`;
//             })(),
//             boxShadow: isHoveringTimeline ? "0 0 10px rgba(147, 51, 234, 0.5)" : "none",
//           }}
//         ></div>
//       </div>
//     </div>
//   </CardContent>
// </Card> */}


// <Card className="mb-8 border-none shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden relative">
//   <div className="absolute inset-0 bg-gradient-to-br from-[#f3e9e9] to-[#f7f2e9] opacity-50"></div>
//   <CardContent className="p-8 relative z-10">
//     <div className="flex items-center justify-between gap-3 mb-6">
//       <div className="flex items-center gap-3">
//         <div className="bg-gradient-to-r from-[#7a2828] to-[#b8860b] p-2 rounded-lg shadow-md">
//           <Package className="h-6 w-6 text-white" />
//         </div>
//         <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#7a2828] to-[#b8860b]">
//           Order Status
//         </h2>
//       </div>
//       <div className="flex flex-wrap items-center gap-4">
//         <Badge
//           variant="outline"
//           className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-sm ${
//             order.payment_status === "pending"
//               ? "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200"
//               : "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200"
//           }`}
//         >
//           <span
//             className={`h-2.5 w-2.5 rounded-full ${
//               order.payment_status === "pending" ? "bg-amber-500" : "bg-emerald-500"
//             } animate-pulse`}
//           ></span>
//           {order.payment_status === "pending" ? "Payment Pending" : "Payment Completed"}
//         </Badge>
//         {(order.status === "pending" || order.status === "processing") && (
//           <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
//             <DialogTrigger asChild>
//               <Button
//                 variant="destructive"
//                 size="sm"
//                 className="bg-gradient-to-r from-[#7a2828] to-[#5e1f1f] hover:from-[#5e1f1f] hover:to-[#441717] text-white font-semibold px-4 py-2 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
//                 disabled={isCancellingItem || isReturningItem}
//               >
//                 <XCircle className="h-5 w-5 mr-2" />
//                 Cancel Order
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-md bg-white rounded-xl shadow-2xl border-none">
//               <DialogHeader>
//                 <DialogTitle className="text-2xl font-bold text-red-600">Cancel Order</DialogTitle>
//                 <DialogDescription className="text-gray-600">
//                   Please select the reason for cancelling your order
//                   {cancelReasonType === "other" ? " and provide details." : "."}
//                 </DialogDescription>
//               </DialogHeader>
//               <div className="grid gap-6 py-6">
//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <label htmlFor="reason-type" className="text-right font-medium text-gray-700">
//                     Reason Type
//                   </label>
//                   <Select
//                     onValueChange={(value) => {
//                       setCancelReasonType(value);
//                       if (value !== "other") {
//                         setCancelReason("");
//                       }
//                     }}
//                     value={cancelReasonType}
//                     className="col-span-3"
//                   >
//                     <SelectTrigger className="bg-white border-red-200 focus:ring-[#7a2828]">
//                       <SelectValue placeholder="Select a reason" />
//                     </SelectTrigger>
//                     <SelectContent className="bg-white border-red-200">
//                       <SelectItem value="changed_mind">Changed Mind</SelectItem>
//                       <SelectItem value="ordered_by_mistake">Ordered by Mistake</SelectItem>
//                       <SelectItem value="found_better_price">Found Better Price</SelectItem>
//                       <SelectItem value="other">Other</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 {cancelReasonType === "other" && (
//                   <div className="grid grid-cols-4 items-center gap-4">
//                     <label htmlFor="reason-details" className="text-right font-medium text-gray-700">
//                       Details
//                     </label>
//                     <Input
//                       id="reason-details"
//                       value={cancelReason}
//                       onChange={(e) => setCancelReason(e.target.value)}
//                       className="col-span-3 border-red-200 focus:ring-[#7a2828]"
//                       placeholder="Provide more details"
//                     />
//                   </div>
//                 )}
//               </div>
//               <DialogFooter className="flex justify-end gap-3">
//                 <Button
//                   variant="outline"
//                   onClick={() => {
//                     setIsCancelModalOpen(false);
//                     setCancelReason("");
//                     setCancelReasonType("");
//                   }}
//                   className="border-red-200 text-red-600 hover:bg-red-50"
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={handleCancelOrder}
//                   className="bg-gradient-to-r from-[#7a2828] to-[#5e1f1f] hover:from-[#5e1f1f] hover:to-[#441717] text-white"
//                   disabled={isCancellingItem || isReturningItem}
//                 >
//                   Submit
//                 </Button>
//               </DialogFooter>
//             </DialogContent>
//           </Dialog>
//         )}
//       </div>
//     </div>
//     <Separator className="mb-6 bg-gradient-to-r from-[#e5d1d1] to-[#f0e6c9] h-0.5 rounded-full" />

//     <div
//       className="relative"
//       onMouseEnter={() => setIsHoveringTimeline(true)}
//       onMouseLeave={() => setIsHoveringPaymentTimeline(false)}
//     >
//       <div className="flex justify-between mb-4">
//         {(() => {
//           const filteredSteps = [
//             { status: "pending", label: "Ordered", date: order.created_at },
//             { status: "processing", label: "Processing", date: null },
//             { status: "shipped", label: "Shipped", date: null },
//             { status: "delivered", label: "Delivered", date: order.est_delivery },
//             ...(order.status === "cancelled"
//               ? [{ status: "cancelled", label: "Cancelled", date: null }]
//               : []),
//             ...(order.status === "return_requested"
//               ? [{ status: "return_requested", label: "Return Requested", date: null }]
//               : []),
//             ...(order.status === "returned"
//               ? [{ status: "returned", label: "Returned", date: null }]
//               : []),
//             ...(order.status === "return_denied"
//               ? [{ status: "return_denied", label: "Return Denied", date: null }]
//               : []),
//           ];

//           return filteredSteps.map((step, index) => {
//             const isActive = () => {
//               const statusOrder = [
//                 "pending",
//                 "processing",
//                 "shipped",
//                 "delivered",
//                 "cancelled",
//                 "return_requested",
//                 "returned",
//                 "return_denied",
//               ];
//               const currentIndex = statusOrder.indexOf(order.status);
//               const stepIndex = statusOrder.indexOf(step.status);
//               if (order.status === "cancelled" || order.status.includes("return")) {
//                 return step.status === order.status;
//               }
//               return (
//                 stepIndex <= currentIndex &&
//                 !["cancelled", "return_requested", "returned", "return_denied"].includes(order.status)
//               );
//             };

//             const getTooltipContent = () => {
//               if (step.status === order.status) {
//                 return `Order is currently ${capitalize(step.status.replace("_", " "))}`;
//               }
//               if (step.date && step.status === "pending") {
//                 return `Order placed on ${new Date(step.date).toLocaleString("en-US", {
//                   year: "numeric",
//                   month: "long",
//                   day: "numeric",
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 })}`;
//               }
//               if (step.date && step.status === "delivered" && order.status !== "delivered") {
//                 return `Expected delivery on ${new Date(step.date).toLocaleDateString("en-US", {
//                   year: "numeric",
//                   month: "long",
//                   day: "numeric",
//                 })}`;
//               }
//               return `Order ${step.status} ${isActive() ? "active" : "pending"}`;
//             };

//             return (
//               <TooltipProvider key={step.status}>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <div className="flex flex-col items-center cursor-pointer group">
//                       <div
//                         className={`rounded-full h-14 w-14 flex items-center justify-center ${
//                           isActive()
//                             ? "bg-gradient-to-br from-[#7a2828] to-[#b8860b] text-white"
//                             : "bg-gray-200 text-gray-500"
//                         } font-bold text-lg group-hover:shadow-lg group-hover:shadow-purple-300 transition-all duration-300 transform group-hover:scale-110`}
//                       >
//                         {index + 1}
//                       </div>
//                       <p
//                         className={`mt-3 font-semibold text-sm ${
//                           isActive() ? "text-gray-800 group-hover:text-[#7a2828]" : "text-gray-500"
//                         } transition-colors duration-200`}
//                       >
//                         {step.label}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         {step.date && step.status === "pending"
//                           ? new Date(step.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
//                           : step.date && step.status === "delivered" && order.status !== "delivered"
//                           ? `Est. ${new Date(step.date).toLocaleDateString("en-US", {
//                               month: "short",
//                               day: "numeric",
//                             })}`
//                           : isActive()
//                           ? "Active"
//                           : "Pending"}
//                       </p>
//                     </div>
//                   </TooltipTrigger>
//                   <TooltipContent className="bg-gradient-to-r from-[#7a2828] to-[#b8860b] text-white border-none shadow-lg">
//                     <p>{getTooltipContent()}</p>
//                   </TooltipContent>
//                 </Tooltip>
//               </TooltipProvider>
//             );
//           });
//         })()}
//       </div>

//       <div className="absolute top-7 left-0 right-0 h-2 bg-gray-200 -z-10 rounded-full">
//         <div
//           className="h-full bg-gradient-to-r from-[#7a2828] to-[#b8860b] transition-all duration-1000 rounded-full"
//           style={{
//             width: (() => {
//               const filteredSteps = [
//                 { status: "pending", label: "Ordered", date: order.created_at },
//                 { status: "processing", label: "Processing", date: null },
//                 { status: "shipped", label: "Shipped", date: null },
//                 { status: "delivered", label: "Delivered", date: order.est_delivery },
//                 ...(order.status === "cancelled"
//                   ? [{ status: "cancelled", label: "Cancelled", date: null }]
//                   : []),
//                 ...(order.status === "return_requested"
//                   ? [{ status: "return_requested", label: "Return Requested", date: null }]
//                   : []),
//                 ...(order.status === "returned"
//                   ? [{ status: "returned", label: "Returned", date: null }]
//                   : []),
//                 ...(order.status === "return_denied"
//                   ? [{ status: "return_denied", label: "Return Denied", date: null }]
//                   : []),
//               ];
//               const statusOrder = [
//                 "pending",
//                 "processing",
//                 "shipped",
//                 "delivered",
//                 "cancelled",
//                 "return_requested",
//                 "returned",
//                 "return_denied",
//               ];
//               const currentIndex = statusOrder.indexOf(order.status);
//               const defaultStatuses = ["pending", "processing", "shipped", "delivered"];
//               if (order.status === "cancelled" || order.status.includes("return")) {
//                 return currentIndex === -1 ? "0%" : "100%";
//               }
//               return currentIndex === -1 ? "0%" : `${(currentIndex / (defaultStatuses.length - 1)) * 100}%`;
//             })(),
//             boxShadow: isHoveringTimeline ? "0 0 10px rgba(147, 51, 234, 0.5)" : "none",
//           }}
//         ></div>
//       </div>
//       {order.status === "cancelled" && order.cancel_reason && (
//         <div className="mt-6 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 shadow-sm animate-fade-in">
//           <span className="font-medium">Cancellation Reason:</span> {order.cancel_reason}
//         </div>
//       )}
//       {order.status === "return_requested" && order.return_reason && (
//         <div className="mt-6 text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200 shadow-sm animate-fade-in">
//           <span className="font-medium">Return Reason:</span> {order.return_reason}
//         </div>
//       )}
//       {order.status === "returned" && order.return_reason && (
//         <div className="mt-6 text-emerald-600 bg-emerald-50 p-3 rounded-lg border border-emerald-200 shadow-sm animate-fade-in">
//           <span className="font-medium">Return Approved:</span> {order.return_reason}
//         </div>
//       )}
//       {order.status === "return_denied" && order.return_reason && (
//         <div className="mt-6 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 shadow-sm animate-fade-in">
//           <span className="font-medium">Return Denied:</span> {order.return_reason}
//         </div>
//       )}
//     </div>
//   </CardContent>
// </Card>




//         {/* Payment Failed Alert */}
//         {order.payment_status === "pending" && order.payment_method === "card" && (
//           <Card className="mb-8 border-none shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden relative">
//             <div className="absolute inset-0 bg-gradient-to-r from-[#b8860b] to-[#7a2828] opacity-10"></div>
//             <CardContent className="p-8 relative z-10">
//               <div className="flex items-start gap-4">
//                 <div className="bg-amber-100 p-3 rounded-full shadow-md">
//                   <AlertTriangle className="h-6 w-6 text-amber-600" />
//                 </div>
//                 <div className="flex-1">
//                   <h3 className="font-bold text-xl text-amber-800 mb-2">Payment Pending</h3>
                  
//                   <Button
//                     onClick={() => handleRetryPayment(order.id)}
//                     disabled={isRetrying || isCancellingItem || isReturningItem}
//                     className="bg-gradient-to-r from-[#b8860b] to-[#8f6608] hover:from-[#b8860b] hover:to-[#8f6608] text-white font-semibold px-6 py-2 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
//                   >
//                     {isRetrying ? (
//                       <>
//                         <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
//                         Processing...
//                       </>
//                     ) : (
//                       <>
//                         <RefreshCw className="mr-2 h-5 w-5" />
//                         Retry Payment
//                       </>
//                     )}
//                   </Button>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* Order Status */}
        

//         {/* Tabs for Order Items and Summary */}
//         <Tabs defaultValue="items" className="mb-8">
//           <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto bg-[#f3e9e9] p-1 rounded-lg">
//             <TabsTrigger
//               value="items"
//               className="data-[state=active]:bg-white data-[state=active]:text-[#7a2828] data-[state=active]:shadow-sm rounded-md transition-all duration-200"
//             >
//               <div className="flex items-center gap-2">
//                 <ShoppingBag className="h-4 w-4" />
//                 Order Items
//               </div>
//             </TabsTrigger>
//             <TabsTrigger
//               value="details"
//               className="data-[state=active]:bg-white data-[state=active]:text-[#7a2828] data-[state=active]:shadow-sm rounded-md transition-all duration-200"
//             >
//               <div className="flex items-center gap-2">
//                 <CreditCard className="h-4 w-4" />
//                 Order Details
//               </div>
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="items" className="mt-6">
//             <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden relative">
//               <div className="absolute inset-0 bg-gradient-to-br from-[#f8f3f3] to-[#f7f2e9] opacity-50"></div>
//               <CardContent className="p-8 relative z-10">
//                 <div className="flex items-center gap-3 mb-6">
//                   <div className="bg-gradient-to-r from-[#7a2828] to-[#b8860b] p-2 rounded-lg shadow-md">
//                     <Package className="h-6 w-6 text-white" />
//                   </div>
//                   <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#7a2828] to-[#b8860b]">
//                     Order Items
//                   </h2>
//                 </div>
//                 <Separator className="mb-8 bg-gradient-to-r from-[#e5d1d1] to-[#f0e6c9] h-0.5 rounded-full" />

//                 {order.items.map((item, index) => (
//                   <div
//                     key={item.id}
//                     className="flex gap-6 mb-8 pb-8 border-b border-[#f3e9e9] group hover:bg-gradient-to-r hover:from-[#f8f3f3] hover:to-[#f7f2e9] p-4 rounded-xl transition-all duration-300 -mx-4"
//                     style={{ animationDelay: `${index * 100}ms` }}
//                   >
//                     <div className="w-24 h-24 bg-white rounded-xl overflow-hidden flex-shrink-0 group-hover:shadow-lg transition-all duration-300 border border-gray-100">
//                       <img
//                         src={`${BASE_URL}${item.product.images[0]}` || "https://yourdomain.com/placeholder.jpg"}
//                         alt={item.product.name}
//                         className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
//                       />
//                     </div>
//                     <div className="flex-1">
//                       <div className="flex justify-between items-center">
//                         <h3 className="font-semibold text-lg group-hover:text-[#7a2828] transition-colors duration-200">
//                           {item.product.name}
//                         </h3>
//                         <span className="font-semibold text-[#7a2828] group-hover:scale-110 transition-transform duration-200">
//                           ₹{item.final_price}
//                         </span>
//                       </div>
//                       <p className="text-sm text-gray-600 mt-2 line-clamp-2 group-hover:text-gray-800 transition-colors duration-200">
//                         {item.product.description}
//                       </p>
//                       <div className="flex flex-wrap justify-between mt-3 text-sm text-gray-600 items-center gap-2">
//                         <div className="flex flex-wrap items-center gap-3">
//                           <span className="bg-gray-100 px-2 py-1 rounded-md group-hover:bg-white transition-colors duration-200">
//                             Price: ₹{item.final_price}
//                           </span>
//                           <span className="text-[#d9b3b3]">•</span>
//                           <span className="bg-gray-100 px-2 py-1 rounded-md group-hover:bg-white transition-colors duration-200">
//                             Qty: {item.quantity}
//                           </span>
//                           <span className="text-[#d9b3b3]">•</span>
//                           <span>Status: </span>
//                           <Badge
//                             variant="outline"
//                             className={`${getStatusColor(item.status)} font-semibold transition-all duration-300 transform group-hover:scale-105 shadow-sm`}
//                           >
//                             {capitalize(item.status.replace("_", " "))}
//                           </Badge>
//                         </div>
//                         {item.status === "active" && canCancel && (
//                           <Dialog
//                             open={isItemCancelModalOpen && selectedItem?.id === item.id}
//                             onOpenChange={(open) => {
//                               setIsItemCancelModalOpen(open);
//                               if (open) setSelectedItem(item);
//                               else {
//                                 setSelectedItem(null);
//                                 setItemCancelReason("");
//                                 setItemCancelReasonType("");
//                               }
//                             }}
//                           >
//                             <DialogTrigger asChild>
//                               <Button
//                                 variant="destructive"
//                                 size="sm"
//                                 className="bg-gradient-to-r from-[#7a2828] to-[#5e1f1f] hover:from-[#5e1f1f] hover:to-[#441717] text-white font-semibold px-4 py-2 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
//                                 disabled={isCancellingItem || isReturningItem}
//                               >
//                                 {isCancellingItem && selectedItem?.id === item.id ? (
//                                   <>
//                                     <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
//                                     Cancelling...
//                                   </>
//                                 ) : (
//                                   <>
//                                     <XCircle className="h-5 w-5 mr-2" />
//                                     Cancel Item
//                                   </>
//                                 )}
//                               </Button>
//                             </DialogTrigger>
//                             <DialogContent className="sm:max-w-md bg-white rounded-xl shadow-2xl border-none">
//                               <DialogHeader>
//                                 <DialogTitle className="text-2xl font-bold text-red-600">Cancel Item</DialogTitle>
//                                 <DialogDescription className="text-gray-600">
//                                   Please select the reason for cancelling this item
//                                   {itemCancelReasonType === "other" ? " and provide details." : "."}
//                                 </DialogDescription>
//                               </DialogHeader>
//                               <div className="grid gap-6 py-6">
//                                 <div className="grid grid-cols-4 items-center gap-4">
//                                   <label htmlFor="item-reason-type" className="text-right font-medium text-gray-700">
//                                     Reason Type
//                                   </label>
//                                   <Select
//                                     onValueChange={(value) => {
//                                       setItemCancelReasonType(value);
//                                       if (value !== "other") {
//                                         setItemCancelReason("");
//                                       }
//                                     }}
//                                     value={itemCancelReasonType}
//                                     className="col-span-3"
//                                   >
//                                     <SelectTrigger className="bg-white border-red-200 focus:ring-[#7a2828]">
//                                       <SelectValue placeholder="Select a reason" />
//                                     </SelectTrigger>
//                                     <SelectContent className="bg-white border-red-200">
//                                       <SelectItem value="changed_mind">Changed Mind</SelectItem>
//                                       <SelectItem value="ordered_by_mistake">Ordered by Mistake</SelectItem>
//                                       <SelectItem value="found_better_price">Found Better Price</SelectItem>
//                                       <SelectItem value="other">Other</SelectItem>
//                                     </SelectContent>
//                                   </Select>
//                                 </div>
//                                 {itemCancelReasonType === "other" && (
//                                   <div className="grid grid-cols-4 items-center gap-4">
//                                     <label
//                                       htmlFor="item-reason-details"
//                                       className="text-right font-medium text-gray-700"
//                                     >
//                                       Details
//                                     </label>
//                                     <Input
//                                       id="item-reason-details"
//                                       value={itemCancelReason}
//                                       onChange={(e) => setItemCancelReason(e.target.value)}
//                                       className="col-span-3 border-red-200 focus:ring-[#7a2828]"
//                                       placeholder="Provide more details"
//                                     />
//                                   </div>
//                                 )}
//                               </div>
//                               <DialogFooter className="flex justify-end gap-3">
//                                 <Button
//                                   variant="outline"
//                                   onClick={() => {
//                                     setIsItemCancelModalOpen(false);
//                                     setItemCancelReason("");
//                                     setItemCancelReasonType("");
//                                     setSelectedItem(null);
//                                   }}
//                                   className="border-red-200 text-red-600 hover:bg-red-50"
//                                 >
//                                   Cancel
//                                 </Button>
//                                 <Button
//                                   onClick={handleCancelItem}
//                                   className="bg-gradient-to-r from-[#7a2828] to-[#5e1f1f] hover:from-[#5e1f1f] hover:to-[#441717] text-white"
//                                   disabled={isCancellingItem || isReturningItem}
//                                 >
//                                   Submit
//                                 </Button>
//                               </DialogFooter>
//                             </DialogContent>
//                           </Dialog>
//                         )}
//                         {item.status === "delivered" && !["return_requested", "returned", "return_denied"].includes(item.status) && (
//                           <Dialog
//                             open={isItemReturnModalOpen && selectedItem?.id === item.id}
//                             onOpenChange={(open) => {
//                               setIsItemReturnModalOpen(open);
//                               if (open) setSelectedItem(item);
//                               else {
//                                 setSelectedItem(null);
//                                 setItemReturnReason("");
//                                 setItemReturnReasonType("");
//                               }
//                             }}
//                           >
//                             <DialogTrigger asChild>
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 className="border-[#7a2828] text-[#7a2828] hover:bg-[#7a2828] hover:text-white font-semibold px-4 py-2 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
//                                 disabled={isCancellingItem || isReturningItem}
//                               >
//                                 <RotateCcw className="h-5 w-5 mr-2" />
//                                 Request Return
//                               </Button>
//                             </DialogTrigger>
//                             <DialogContent className="sm:max-w-md bg-white rounded-xl shadow-2xl border-none">
//                               <DialogHeader>
//                                 <DialogTitle className="text-2xl font-bold text-[#7a2828]">
//                                   Request Item Return
//                                 </DialogTitle>
//                                 <DialogDescription className="text-gray-600">
//                                   Please select the reason for returning this item
//                                   {itemReturnReasonType === "other" ? " and provide details." : "."}
//                                 </DialogDescription>
//                               </DialogHeader>
//                               <div className="grid gap-6 py-6">
//                                 <div className="grid grid-cols-4 items-center gap-4">
//                                   <label
//                                     htmlFor="item-return-reason-type"
//                                     className="text-right font-medium text-gray-700"
//                                   >
//                                     Reason Type
//                                   </label>
//                                   <Select
//                                     onValueChange={(value) => {
//                                       setItemReturnReasonType(value);
//                                       if (value !== "other") {
//                                         setItemReturnReason("");
//                                       }
//                                     }}
//                                     value={itemReturnReasonType}
//                                     className="col-span-3"
//                                   >
//                                     <SelectTrigger className="bg-white border-[#e5d1d1] focus:ring-[#7a2828]">
//                                       <SelectValue placeholder="Select a reason" />
//                                     </SelectTrigger>
//                                     <SelectContent className="bg-white border-[#e5d1d1]">
//                                       <SelectItem value="defective_product">Defective Product</SelectItem>
//                                       <SelectItem value="wrong_item">Wrong Item Received</SelectItem>
//                                       <SelectItem value="not_as_expected">Not As Expected</SelectItem>
//                                       <SelectItem value="other">Other</SelectItem>
//                                     </SelectContent>
//                                   </Select>
//                                 </div>
//                                 {itemReturnReasonType === "other" && (
//                                   <div className="grid grid-cols-4 items-center gap-4">
//                                     <label
//                                       htmlFor="item-return-reason-details"
//                                       className="text-right font-medium text-gray-700"
//                                     >
//                                       Details
//                                     </label>
//                                     <Input
//                                       id="item-return-reason-details"
//                                       value={itemReturnReason}
//                                       onChange={(e) => setItemReturnReason(e.target.value)}
//                                       className="col-span-3 border-[#e5d1d1] focus:ring-[#7a2828]"
//                                       placeholder="Provide more details"
//                                     />
//                                   </div>
//                                 )}
//                               </div>
//                               <DialogFooter className="flex justify-end gap-3">
//                                 <Button
//                                   variant="outline"
//                                   onClick={() => {
//                                     setIsItemReturnModalOpen(false);
//                                     setItemReturnReason("");
//                                     setItemReturnReasonType("");
//                                     setSelectedItem(null);
//                                   }}
//                                   className="border-[#e5d1d1] text-[#7a2828] hover:bg-[#f8f3f3]"
//                                 >
//                                   Cancel
//                                 </Button>
//                                 <Button
//                                   onClick={handleReturnItem}
//                                   className="bg-gradient-to-r from-[#7a2828] to-[#5e1f1f] hover:from-[#5e1f1f] hover:to-[#441717] text-white"
//                                   disabled={isCancellingItem || isReturningItem}
//                                 >
//                                   Submit
//                                 </Button>
//                               </DialogFooter>
//                             </DialogContent>
//                           </Dialog>
//                         )}
//                       </div>
//                       {(item.cancel_reason || item.return_reason) && (
//                         <div className="mt-3">
//                           {item.cancel_reason && (
//                             <p className="text-sm text-red-600 bg-red-50 p-2 rounded-md border border-red-200 shadow-sm animate-fade-in">
//                               <span className="font-medium">Cancellation Reason:</span> {item.cancel_reason}
//                             </p>
//                           )}
//                           {item.return_reason && (
//                             <p
//                               className={`text-sm p-2 rounded-md border shadow-sm animate-fade-in ${item.status === "return_requested"
//                                 ? "text-amber-600 bg-amber-50 border-amber-200"
//                                 : item.status === "returned"
//                                   ? "text-emerald-600 bg-emerald-50 border-emerald-200"
//                                   : "text-red-600 bg-red-50 border-red-200"
//                                 }`}
//                             >
//                               <span className="font-medium">
//                                 {item.status === "return_requested"
//                                   ? "Return Reason:"
//                                   : item.status === "returned"
//                                     ? "Return Approved:"
//                                     : "Return Denied:"}
//                               </span>{" "}
//                               {item.return_reason}
//                             </p>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="details" className="mt-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden relative">
//                 <div className="absolute inset-0 bg-gradient-to-br from-[#f8f3f3] to-[#f7f2e9] opacity-50"></div>
//                 <CardContent className="p-8 relative z-10">
//                   <div className="flex items-center gap-3 mb-6">
//                     <div className="bg-gradient-to-r from-[#7a2828] to-[#b8860b] p-2 rounded-lg shadow-md">
//                       <CreditCard className="h-6 w-6 text-white" />
//                     </div>
//                     <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#7a2828] to-[#b8860b]">
//                       Order Summary
//                     </h2>
//                   </div>
//                   <Separator className="mb-8 bg-gradient-to-r from-[#e5d1d1] to-[#f0e6c9] h-0.5 rounded-full" />
//                   <div className="space-y-4">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Iteam Prices</span>
//                       <span className="font-semibold">₹{order.total_amount}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Product  Discount</span>
//                       <span className="text-red-600">− ₹{order.total_discount}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Tax </span>
//                       <span className="font-semibold">₹{order.total_tax}</span>
//                     </div>
                    
                    

//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Coupon Discount</span>
//                       <span className="text-red-600">− ₹{order.coupon_discount}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Shipping</span>
//                       <span className="font-semibold">₹{order.shipping}</span>
//                     </div>
//                     <Separator className="my-4 bg-gradient-to-r from-[#e5d1d1] to-[#f0e6c9] h-0.5 rounded-full" />
//                     <div className="flex justify-between">
//                       <span className="font-semibold text-[#7a2828]">Grand Total</span>
//                       <span className="font-semibold text-[#7a2828]">₹{order.final_total}</span>
//                     </div>
//                     <div className="flex justify-between mt-4">
//                       <span className="text-gray-600">Payment Method</span>
//                       <span className="font-semibold">{order.payment_method.toUpperCase()}</span>
//                     </div>
//                   </div>
//                   <Button
//                     variant="outline"
//                     className="w-full mt-8 flex items-center justify-center gap-3 border-[#7a2828] text-[#7a2828] hover:bg-gradient-to-r hover:from-[#7a2828] hover:to-[#b8860b] hover:text-white font-semibold py-3 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
//                     onClick={() => navigate(`/invoice/${order.id}/`)}
//                     disabled={order.status !== "delivered" || isCancellingItem || isReturningItem}
//                   >
//                     <Download className="h-5 w-5" />
//                     Download Invoice
//                   </Button>
//                 </CardContent>
//               </Card>

//               <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden relative">
//                 <div className="absolute inset-0 bg-gradient-to-br from-[#f3e9e9] to-[#f7f2e9] opacity-50"></div>
//                 <CardContent className="p-8 relative z-10">
//                   <div className="flex items-center gap-3 mb-6">
//                     <div className="bg-gradient-to-r from-[#7a2828] to-[#b8860b] p-2 rounded-lg shadow-md">
//                       <MapPin className="h-6 w-6 text-white" />
//                     </div>
//                     <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#7a2828] to-[#b8860b]">
//                       Shipping Information
//                     </h2>
//                   </div>
//                   <Separator className="mb-8 bg-gradient-to-r from-[#e5d1d1] to-[#f0e6c9] h-0.5 rounded-full" />
//                   <div className="space-y-4">
//                     <div className="flex items-start gap-3">
//                       <User className="h-5 w-5 text-[#7a2828] mt-1" />
//                       <div>
//                         <p className="font-semibold">{order.order_address.name}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-start gap-3">
//                       <MapPin className="h-5 w-5 text-[#7a2828] mt-1" />
//                       <div>
//                         <p className="text-gray-600">
//                           {order.order_address.house_no}, {order.order_address.landmark}
//                         </p>
//                         <p className="text-gray-600">
//                           {order.order_address.city}, {order.order_address.state} - {order.order_address.pin_code}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-start gap-3">
//                       <Phone className="h-5 w-5 text-[#7a2828] mt-1" />
//                       <p className="text-gray-600">{order.order_address.phone || "+91 9876543210"}</p>
//                     </div>
//                     <div className="flex items-start gap-3">
//                       <Mail className="h-5 w-5 text-[#7a2828] mt-1" />
//                       <p className="text-gray-600">{order.user.email}</p>
//                     </div>
//                     <div className="flex items-start gap-3">
//                       <Calendar className="h-5 w-5 text-[#7a2828] mt-1" />
//                       <p className="text-gray-600">Expected Delivery: {estDeliveryDate}</p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// };

// export default ViewOrderDetails;


"use client";

import { useState, useEffect } from "react";
import {
  Home,
  ChevronRight,
  RefreshCw,
  AlertTriangle,
  Package,
  CreditCard,
  MapPin,
  ArrowLeft,
  Download,
  Clock,
  XCircle,
  RotateCcw,
  CheckCircle2,
  Truck,
  ShoppingBag,
  Calendar,
  User,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import { Link } from 'react-router-dom';
import Swal from "sweetalert2";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ViewOrderDetails = () => {
  const [order, setOrder] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isHoveringTimeline, setIsHoveringTimeline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelReasonType, setCancelReasonType] = useState("");
  const [isItemCancelModalOpen, setIsItemCancelModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemCancelReason, setItemCancelReason] = useState("");
  const [itemCancelReasonType, setItemCancelReasonType] = useState("");
  const [isCancellingItem, setIsCancellingItem] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [returnReasonType, setReturnReasonType] = useState("");
  const [isItemReturnModalOpen, setIsItemReturnModalOpen] = useState(false);
  const [itemReturnReason, setItemReturnReason] = useState("");
  const [itemReturnReasonType, setItemReturnReasonType] = useState("");
  const [isReturningItem, setIsReturningItem] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const capitalize = (str) => {
    if (typeof str !== "string" || str.length === 0) return "Unknown";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const BASE_URL = import.meta.env.VITE_BASE_URL
  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`cartapp/orders/${id}/`);
        setOrder(response.data);
        console.log("Order data plxxxxxxxxxxxxxxx:", response.data);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load order details. Please try again later.");
        setIsLoading(false);
        console.error("Error fetching order:", err);
      }
    };
    fetchOrder();
  }, [id]);

  const handleRetryPayment = async (orderId) => {
    setIsRetrying(true);
    try {
      await loadRazorpayScript();

      const response = await api.post("cartapp/orders/razorpay/retry/", { order_id: orderId });

      if (!response.data || !response.data.order_id || !response.data.amount || !response.data.currency || !response.data.key) {
        throw new Error("Invalid response from payment retry API.");
      }

      const { order_id: razorpayOrderId, amount, currency, key, order } = response.data;

      const options = {
        key: key,
        amount: amount,
        currency: currency,
        order_id: razorpayOrderId,
        name: "Your Company Name",
        description: `Payment for Order #${order.order_number}`,
        image: "https://yourdomain.com/logo.png",
        handler: async (paymentResponse) => {
          try {
            const verificationResponse = await api.post("cartapp/orders/razorpay/verify/", {
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_signature: paymentResponse.razorpay_signature,
            });

            setOrder((prevOrder) => ({
              ...prevOrder,
              payment_status: "completed",
              status: "processing",
            }));

            Swal.fire({
              icon: "success",
              title: "Payment Successful",
              text: "Your payment has been verified successfully!",
            });
          } catch (err) {
            console.error("Payment verification failed:", err);
            Swal.fire({
              icon: "error",
              title: "Payment Verification Failed",
              text: err.response?.data?.error || "Failed to verify payment. Please contact support.",
            });
          }
        },
        theme: {
          color: "#7a2828",
        },
        modal: {
          ondismiss: () => {
            setIsRetrying(false);
            Swal.fire({
              icon: "info",
              title: "Payment Cancelled",
              text: "The payment process was cancelled. Please try again.",
            });
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

      razorpay.on("payment.failed", (error) => {
        setIsRetrying(false);
        Swal.fire({
          icon: "error",
          title: "Payment Failed",
          text: error.error.description || "Payment failed. Please try again.",
        });
      });
    } catch (err) {
      setIsRetrying(false);
      console.error("Error retrying payment:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.error || "Failed to initiate payment retry. Please try again.",
      });
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelReasonType) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please select a reason type.",
      });
      return;
    }

    if (cancelReasonType === "other" && !cancelReason) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: 'Please provide details for the "Other" reason.',
      });
      return;
    }

    const cancelReasonPayload = cancelReasonType === "other" ? cancelReason : cancelReasonType;

    try {
      await api.post(`cartapp/orders/${id}/cancel/`, {
        cancel_reason: cancelReasonPayload,
      });
      setOrder({ ...order, status: "cancelled", cancel_reason: cancelReasonPayload });
      setIsCancelModalOpen(false);
      Swal.fire({
        icon: "success",
        title: "Order Cancellation",
        text: "Your Order Cancelled Successfully.",
      });
    } catch (err) {
      console.error("Error cancelling order:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.cancel_reason?.[0] ||
        "Failed to cancel order. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    }
  };

  const handleCancelItem = async () => {
    if (!itemCancelReasonType) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please select a reason type.",
      });
      return;
    }

    if (itemCancelReasonType === "other" && !itemCancelReason) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: 'Please provide details for the "Other" reason.',
      });
      return;
    }

    setIsCancellingItem(true);
    const cancelReasonPayload = itemCancelReasonType === "other" ? itemCancelReason : itemCancelReasonType;
    let originalOrder = { ...order };

    try {
      const itemResponse = await api.get(`cartapp/orderitems/${selectedItem.id}/`);
      if (itemResponse.data.status !== "active") {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `This item is ${itemResponse.data.status} and cannot be cancelled.`,
        });
        setIsItemCancelModalOpen(false);
        return;
      }

      const updatedItems = order.items.map((item) =>
        item.id === selectedItem.id ? { ...item, status: "cancelled", cancel_reason: cancelReasonPayload } : item
      );
      setOrder({ ...order, items: updatedItems });

      await api.post(`cartapp/orderitems/${selectedItem.id}/cancel/`, {
        cancel_reason: cancelReasonPayload,
      });

      const updatedOrderResponse = await api.get(`cartapp/orders/${id}/`);
      setOrder(updatedOrderResponse.data);
      setIsItemCancelModalOpen(false);
      setItemCancelReason("");
      setItemCancelReasonType("");
      setSelectedItem(null);
      Swal.fire({
        icon: "success",
        title: "Item Cancellation",
        text: "The item has been cancelled successfully.",
      });
    } catch (err) {
      console.error("Error cancelling item:", err.response?.data);
      setOrder(originalOrder);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.cancel_reason?.[0] ||
        `Failed to cancel item. The item is ${err.response?.data?.status || "no longer cancellable"}.`;
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    } finally {
      setIsCancellingItem(false);
    }
  };

  const handleReturnOrder = async () => {
    if (!returnReasonType) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please select a reason type.",
      });
      return;
    }

    if (returnReasonType === "other" && !returnReason) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: 'Please provide details for the "Other" reason.',
      });
      return;
    }

    const returnReasonPayload = returnReasonType === "other" ? returnReason : returnReasonType;

    try {
      await api.patch(`cartapp/orders/${id}/return/`, {
        return_reason: returnReasonPayload,
      });
      setOrder({ ...order, status: "return_requested", return_reason: returnReasonPayload });
      setIsReturnModalOpen(false);
      Swal.fire({
        icon: "success",
        title: "Return Request",
        text: "Your return request has been submitted successfully.",
      });
    } catch (err) {
      console.error("Error requesting return:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.return_reason?.[0] ||
        "Failed to submit return request. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    }
  };

  const handleReturnItem = async () => {
    if (!itemReturnReasonType) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please select a reason type.",
      });
      return;
    }

    if (itemReturnReasonType === "other" && !itemReturnReason) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: 'Please provide details for the "Other" reason.',
      });
      return;
    }

    setIsReturningItem(true);
    const returnReasonPayload = itemReturnReasonType === "other" ? itemReturnReason : itemReturnReasonType;
    let originalOrder = { ...order };

    try {
      const itemResponse = await api.get(`cartapp/orderitems/${selectedItem.id}/`);
      if (itemResponse.data.status !== "delivered") {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `This item is ${itemResponse.data.status} and cannot be returned.`,
        });
        setIsItemReturnModalOpen(false);
        return;
      }

      const updatedItems = order.items.map((item) =>
        item.id === selectedItem.id
          ? { ...item, status: "return_requested", return_reason: returnReasonPayload }
          : item
      );
      setOrder({ ...order, items: updatedItems });

      await api.patch(`cartapp/orderitems/${selectedItem.id}/return/`, {
        return_reason: returnReasonPayload,
      });

      const updatedOrderResponse = await api.get(`cartapp/orders/${id}/`);
      setOrder(updatedOrderResponse.data);
      setIsItemReturnModalOpen(false);
      setItemReturnReason("");
      setItemReturnReasonType("");
      setSelectedItem(null);
      Swal.fire({
        icon: "success",
        title: "Item Return Request",
        text: "The item return request has been submitted successfully.",
      });
    } catch (err) {
      console.error("Error requesting item return:", err.response?.data);
      setOrder(originalOrder);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.return_reason?.[0] ||
        `Failed to submit item return request. The item is ${err.response?.data?.status || "no longer returnable"}.`;
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    } finally {
      setIsReturningItem(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "return_requested":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "returned":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "return_denied":
        return "bg-red-100 text-red-800 border-red-200";
      case "delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5" />;
      case "processing":
        return <RefreshCw className="h-5 w-5" />;
      case "shipped":
        return <Truck className="h-5 w-5" />;
      case "delivered":
        return <CheckCircle2 className="h-5 w-5" />;
      case "cancelled":
        return <XCircle className="h-5 w-5" />;
      case "return_requested":
      case "returned":
        return <RotateCcw className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-[#f8f3f3] flex justify-center items-center p-4">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full border-4 border-[#e5d1d1] opacity-25"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-[#7a2828] animate-spin"></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-[#441717]">Loading Order Details</h3>
            <p className="text-[#7a2828]">Please wait while we fetch your order information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-[#f8f3f3] flex justify-center items-center p-4">
        <Card className="w-full max-w-lg border-red-200 shadow-xl animate-bounce-in">
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-10 w-10 text-red-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-red-800">Error Loading Order</h3>
                <p className="text-red-600">{error}</p>
                <Button
                  className="mt-4 bg-gradient-to-r from-[#7a2828] to-[#441717] hover:from-[#5e1f1f] hover:to-[#2a0e0e] text-white"
                  onClick={() => navigate("/myorders")}
                >
                  Return to Orders
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-[#f8f3f3] flex justify-center items-center p-4">
        <Card className="w-full max-w-lg border-amber-200 shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="h-20 w-20 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="h-10 w-10 text-amber-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-amber-800">Order Not Found</h3>
                <p className="text-amber-600">We couldn't find the order you're looking for.</p>
                <Button
                  className="mt-4 bg-gradient-to-r from-[#7a2828] to-[#441717] hover:from-[#5e1f1f] hover:to-[#2a0e0e] text-white"
                  onClick={() => navigate("/myorders")}
                >
                  Return to Orders
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const orderedDate = new Date(order.created_at).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const estDeliveryDate = new Date(order.est_delivery).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const canCancel = order.status === "pending" || order.status === "processing";
  const canReturn = order.status === "delivered";

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#f8f3f3] pt-6 pb-16">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Back to Orders Button */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-6 text-[#7a2828] hover:text-[#2a0e0e] hover:bg-[#f3e9e9] transition-all duration-300 group flex items-center"
          onClick={() => navigate("/myorders")}
        >
          <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-medium">Back to Orders</span>
        </Button>

        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-600 mb-8 overflow-x-auto pb-2 font-medium">
          <Link to="/" className="flex items-center hover:text-[#7a2828] transition-colors duration-200">
            <Home className="h-4 w-4 mr-1" />
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2 flex-shrink-0 text-gray-400" />
          
          <Link to="/userprofile" className="hover:text-[#7a2828] transition-colors duration-200 whitespace-nowrap">
            My Account
          </Link>

          <ChevronRight className="h-4 w-4 mx-2 flex-shrink-0 text-gray-400" />
          
          <span className="text-[#7a2828] font-semibold whitespace-nowrap">
            Order #{order.order_number}
          </span>
        </nav>

        {/* Order Header */}
        <Card className="mb-8 border-none shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#f3e9e9] to-[#f7f2e9] opacity-50"></div>
          <CardContent className="p-8 relative z-10">
            <div className="flex items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-[#7a2828] to-[#b8860b] p-2 rounded-lg shadow-md">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#7a2828] to-[#b8860b]">
                  Order Status
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                {/* <Badge
                  variant="outline"
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-sm ${
                    order.payment_status === "pending"
                      ? "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200"
                      : "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200"
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      order.payment_status === "pending" ? "bg-amber-500" : "bg-emerald-500"
                    } animate-pulse`}
                  ></span>
                  {order.payment_status === "pending" ? "Payment Pending" : "Payment Completed"}
                </Badge> */}
                {(order.status === "pending" || order.status === "processing") && (
                  <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="bg-gradient-to-r from-[#7a2828] to-[#5e1f1f] hover:from-[#5e1f1f] hover:to-[#441717] text-white font-semibold px-4 py-2 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                        disabled={isCancellingItem || isReturningItem}
                      >
                        <XCircle className="h-5 w-5 mr-2" />
                        Cancel Order
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md bg-white rounded-xl shadow-2xl border-none">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-red-600">Cancel Order</DialogTitle>
                        <DialogDescription className="text-gray-600">
                          Please select the reason for cancelling your order
                          {cancelReasonType === "other" ? " and provide details." : "."}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-6 py-6">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="reason-type" className="text-right font-medium text-gray-700">
                            Reason Type
                          </label>
                          <Select
                            onValueChange={(value) => {
                              setCancelReasonType(value);
                              if (value !== "other") {
                                setCancelReason("");
                              }
                            }}
                            value={cancelReasonType}
                            className="col-span-3"
                          >
                            <SelectTrigger className="bg-white border-red-200 focus:ring-[#7a2828]">
                              <SelectValue placeholder="Select a reason" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-red-200">
                              <SelectItem value="changed_mind">Changed Mind</SelectItem>
                              <SelectItem value="ordered_by_mistake">Ordered by Mistake</SelectItem>
                              <SelectItem value="found_better_price">Found Better Price</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {cancelReasonType === "other" && (
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="reason-details" className="text-right font-medium text-gray-700">
                              Details
                            </label>
                            <Input
                              id="reason-details"
                              value={cancelReason}
                              onChange={(e) => setCancelReason(e.target.value)}
                              className="col-span-3 border-red-200 focus:ring-[#7a2828]"
                              placeholder="Provide more details"
                            />
                          </div>
                        )}
                      </div>
                      <DialogFooter className="flex justify-end gap-3">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsCancelModalOpen(false);
                            setCancelReason("");
                            setCancelReasonType("");
                          }}
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleCancelOrder}
                          className="bg-gradient-to-r from-[#7a2828] to-[#5e1f1f] hover:from-[#5e1f1f] hover:to-[#441717] text-white"
                          disabled={isCancellingItem || isReturningItem}
                        >
                          Submit
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
                {canReturn && !["return_requested", "returned", "return_denied"].includes(order.status) && (
                  <Dialog open={isReturnModalOpen} onOpenChange={setIsReturnModalOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#7a2828] text-[#7a2828] hover:bg-[#7a2828] hover:text-white font-semibold px-4 py-2 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                        disabled={isCancellingItem || isReturningItem}
                      >
                        <RotateCcw className="h-5 w-5 mr-2" />
                        Return Order
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md bg-white rounded-xl shadow-2xl border-none">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-[#7a2828]">Return Order</DialogTitle>
                        <DialogDescription className="text-gray-600">
                          Please select the reason for returning your order
                          {returnReasonType === "other" ? " and provide details." : "."}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-6 py-6">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="return-reason-type" className="text-right font-medium text-gray-700">
                            Reason Type
                          </label>
                          <Select
                            onValueChange={(value) => {
                              setReturnReasonType(value);
                              if (value !== "other") {
                                setReturnReason("");
                              }
                            }}
                            value={returnReasonType}
                            className="col-span-3"
                          >
                            <SelectTrigger className="bg-white border-[#e5d1d1] focus:ring-[#7a2828]">
                              <SelectValue placeholder="Select a reason" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-[#e5d1d1]">
                              <SelectItem value="defective_product">Defective Product</SelectItem>
                              <SelectItem value="wrong_item">Wrong Item Received</SelectItem>
                              <SelectItem value="not_as_expected">Not As Expected</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {returnReasonType === "other" && (
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="return-reason-details" className="text-right font-medium text-gray-700">
                              Details
                            </label>
                            <Input
                              id="return-reason-details"
                              value={returnReason}
                              onChange={(e) => setReturnReason(e.target.value)}
                              className="col-span-3 border-[#e5d1d1] focus:ring-[#7a2828]"
                              placeholder="Provide more details"
                            />
                          </div>
                        )}
                      </div>
                      <DialogFooter className="flex justify-end gap-3">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsReturnModalOpen(false);
                            setReturnReason("");
                            setReturnReasonType("");
                          }}
                          className="border-[#e5d1d1] text-[#7a2828] hover:bg-[#f8f3f3]"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleReturnOrder}
                          className="bg-gradient-to-r from-[#7a2828] to-[#5e1f1f] hover:from-[#5e1f1f] hover:to-[#441717] text-white"
                          disabled={isCancellingItem || isReturningItem}
                        >
                          Submit
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
            <Separator className="mb-6 bg-gradient-to-r from-[#e5d1d1] to-[#f0e6c9] h-0.5 rounded-full" />

            <div
              className="relative"
              onMouseEnter={() => setIsHoveringTimeline(true)}
              onMouseLeave={() => setIsHoveringTimeline(false)}
            >
              <div className="flex justify-between mb-4">
                {(() => {
                  const filteredSteps = [
                    { status: "pending", label: "Ordered", date: order.created_at },
                    { status: "processing", label: "Processing", date: null },
                    { status: "shipped", label: "Shipped", date: null },
                    { status: "delivered", label: "Delivered", date: order.est_delivery },
                    ...(order.status === "cancelled"
                      ? [{ status: "cancelled", label: "Cancelled", date: null }]
                      : []),
                    ...(order.status === "return_requested"
                      ? [{ status: "return_requested", label: "Return Requested", date: null }]
                      : []),
                    ...(order.status === "returned"
                      ? [{ status: "returned", label: "Returned", date: null }]
                      : []),
                    ...(order.status === "return_denied"
                      ? [{ status: "return_denied", label: "Return Denied", date: null }]
                      : []),
                  ];

                  return filteredSteps.map((step, index) => {
                    const isActive = () => {
                      const statusOrder = [
                        "pending",
                        "processing",
                        "shipped",
                        "delivered",
                        "cancelled",
                        "return_requested",
                        "returned",
                        "return_denied",
                      ];
                      const currentIndex = statusOrder.indexOf(order.status);
                      const stepIndex = statusOrder.indexOf(step.status);
                      if (order.status === "cancelled" || order.status.includes("return")) {
                        return step.status === order.status;
                      }
                      return (
                        stepIndex <= currentIndex &&
                        !["cancelled", "return_requested", "returned", "return_denied"].includes(order.status)
                      );
                    };

                    const getTooltipContent = () => {
                      if (step.status === order.status) {
                        return `Order is currently ${capitalize(step.status.replace("_", " "))}`;
                      }
                      if (step.date && step.status === "pending") {
                        return `Order placed on ${new Date(step.date).toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}`;
                      }
                      if (step.date && step.status === "delivered" && order.status !== "delivered") {
                        return `Expected delivery on ${new Date(step.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}`;
                      }
                      return `Order ${step.status} ${isActive() ? "active" : "pending"}`;
                    };

                    return (
                      <TooltipProvider key={step.status}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex flex-col items-center cursor-pointer group">
                              <div
                                className={`rounded-full h-14 w-14 flex items-center justify-center ${
                                  isActive()
                                    ? "bg-gradient-to-br from-[#7a2828] to-[#b8860b] text-white"
                                    : "bg-gray-200 text-gray-500"
                                } font-bold text-lg group-hover:shadow-lg group-hover:shadow-purple-300 transition-all duration-300 transform group-hover:scale-110`}
                              >
                                {index + 1}
                              </div>
                              <p
                                className={`mt-3 font-semibold text-sm ${
                                  isActive() ? "text-gray-800 group-hover:text-[#7a2828]" : "text-gray-500"
                                } transition-colors duration-200`}
                              >
                                {step.label}
                              </p>
                              <p className="text-xs text-gray-500">
                                {step.date && step.status === "pending"
                                  ? new Date(step.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                                  : step.date && step.status === "delivered" && order.status !== "delivered"
                                  ? `Est. ${new Date(step.date).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                    })}`
                                  : isActive()
                                  ? "Active"
                                  : "Pending"}
                              </p>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="bg-gradient-to-r from-[#7a2828] to-[#b8860b] text-white border-none shadow-lg">
                            <p>{getTooltipContent()}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  });
                })()}
              </div>

              <div className="absolute top-7 left-0 right-0 h-2 bg-gray-200 -z-10 rounded-full">
                <div
                  className="h-full bg-gradient-to-r from-[#7a2828] to-[#b8860b] transition-all duration-1000 rounded-full"
                  style={{
                    width: (() => {
                      const filteredSteps = [
                        { status: "pending", label: "Ordered", date: order.created_at },
                        { status: "processing", label: "Processing", date: null },
                        { status: "shipped", label: "Shipped", date: null },
                        { status: "delivered", label: "Delivered", date: order.est_delivery },
                        ...(order.status === "cancelled"
                          ? [{ status: "cancelled", label: "Cancelled", date: null }]
                          : []),
                        ...(order.status === "return_requested"
                          ? [{ status: "return_requested", label: "Return Requested", date: null }]
                          : []),
                        ...(order.status === "returned"
                          ? [{ status: "returned", label: "Returned", date: null }]
                          : []),
                        ...(order.status === "return_denied"
                          ? [{ status: "return_denied", label: "Return Denied", date: null }]
                          : []),
                      ];
                      const statusOrder = [
                        "pending",
                        "processing",
                        "shipped",
                        "delivered",
                        "cancelled",
                        "return_requested",
                        "returned",
                        "return_denied",
                      ];
                      const currentIndex = statusOrder.indexOf(order.status);
                      const defaultStatuses = ["pending", "processing", "shipped", "delivered"];
                      if (order.status === "cancelled" || order.status.includes("return")) {
                        return currentIndex === -1 ? "0%" : "100%";
                      }
                      return currentIndex === -1 ? "0%" : `${(currentIndex / (defaultStatuses.length - 1)) * 100}%`;
                    })(),
                    boxShadow: isHoveringTimeline ? "0 0 10px rgba(147, 51, 234, 0.5)" : "none",
                  }}
                ></div>
              </div>
              {order.status === "cancelled" && order.cancel_reason && (
                <div className="mt-6 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 shadow-sm animate-fade-in">
                  <span className="font-medium">Cancellation Reason:</span> {order.cancel_reason}
                </div>
              )}
              {order.status === "return_requested" && order.return_reason && (
                <div className="mt-6 text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200 shadow-sm animate-fade-in">
                  <span className="font-medium">Return Reason:</span> {order.return_reason}
                </div>
              )}
              {order.status === "returned" && order.return_reason && (
                <div className="mt-6 text-emerald-600 bg-emerald-50 p-3 rounded-lg border border-emerald-200 shadow-sm animate-fade-in">
                  <span className="font-medium">Return Approved:</span> {order.return_reason}
                </div>
              )}
              {order.status === "return_denied" && order.return_reason && (
                <div className="mt-6 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 shadow-sm animate-fade-in">
                  <span className="font-medium">Return Denied:</span> {order.return_reason}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment Failed Alert */}
        {order.payment_status === "pending" && order.payment_method === "card" && (
          <Card className="mb-8 border-none shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#b8860b] to-[#7a2828] opacity-10"></div>
            <CardContent className="p-8 relative z-10">
              <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-3 rounded-full shadow-md">
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-amber-800 mb-2">Payment Pending</h3>
                  
                  <Button
                    onClick={() => handleRetryPayment(order.id)}
                    disabled={isRetrying || isCancellingItem || isReturningItem}
                    className="bg-gradient-to-r from-[#b8860b] to-[#8f6608] hover:from-[#b8860b] hover:to-[#8f6608] text-white font-semibold px-6 py-2 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                  >
                    {isRetrying ? (
                      <>
                        <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-5 w-5" />
                        Retry Payment
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs for Order Items and Summary */}
        <Tabs defaultValue="items" className="mb-8">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto bg-[#f3e9e9] p-1 rounded-lg">
            <TabsTrigger
              value="items"
              className="data-[state=active]:bg-white data-[state=active]:text-[#7a2828] data-[state=active]:shadow-sm rounded-md transition-all duration-200"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Order Items
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="data-[state=active]:bg-white data-[state=active]:text-[#7a2828] data-[state=active]:shadow-sm rounded-md transition-all duration-200"
            >
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Order Details
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="items" className="mt-6">
            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#f8f3f3] to-[#f7f2e9] opacity-50"></div>
              <CardContent className="p-8 relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-r from-[#7a2828] to-[#b8860b] p-2 rounded-lg shadow-md">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#7a2828] to-[#b8860b]">
                    Order Items
                  </h2>
                </div>
                <Separator className="mb-8 bg-gradient-to-r from-[#e5d1d1] to-[#f0e6c9] h-0.5 rounded-full" />

                {order.items.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex gap-6 mb-8 pb-8 border-b border-[#f3e9e9] group hover:bg-gradient-to-r hover:from-[#f8f3f3] hover:to-[#f7f2e9] p-4 rounded-xl transition-all duration-300 -mx-4"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="w-24 h-24 bg-white rounded-xl overflow-hidden flex-shrink-0 group-hover:shadow-lg transition-all duration-300 border border-gray-100">
                      <img
                        src={`${BASE_URL}${item.product.images[0]}` || "https://yourdomain.com/placeholder.jpg"}
                        alt={item.product.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-lg group-hover:text-[#7a2828] transition-colors duration-200">
                          {item.product.name}
                        </h3>
                        <span className="font-semibold text-[#7a2828] group-hover:scale-110 transition-transform duration-200">
                          ₹{item.final_price}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2 group-hover:text-gray-800 transition-colors duration-200">
                        {item.product.description}
                      </p>
                      <div className="flex flex-wrap justify-between mt-3 text-sm text-gray-600 items-center gap-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="bg-gray-100 px-2 py-1 rounded-md group-hover:bg-white transition-colors duration-200">
                            Price: ₹{item.final_price}
                          </span>
                          <span className="text-[#d9b3b3]">•</span>
                          <span className="bg-gray-100 px-2 py-1 rounded-md group-hover:bg-white transition-colors duration-200">
                            Qty: {item.quantity}
                          </span>
                          <span className="text-[#d9b3b3]">•</span>
                          <span>Status: </span>
                          <Badge
                            variant="outline"
                            className={`${getStatusColor(item.status)} font-semibold transition-all duration-300 transform group-hover:scale-105 shadow-sm`}
                          >
                            {capitalize(item.status.replace("_", " "))}
                          </Badge>
                        </div>
                        {item.status === "active" && canCancel && (
                          <Dialog
                            open={isItemCancelModalOpen && selectedItem?.id === item.id}
                            onOpenChange={(open) => {
                              setIsItemCancelModalOpen(open);
                              if (open) setSelectedItem(item);
                              else {
                                setSelectedItem(null);
                                setItemCancelReason("");
                                setItemCancelReasonType("");
                              }
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="bg-gradient-to-r from-[#7a2828] to-[#5e1f1f] hover:from-[#5e1f1f] hover:to-[#441717] text-white font-semibold px-4 py-2 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                                disabled={isCancellingItem || isReturningItem}
                              >
                                {isCancellingItem && selectedItem?.id === item.id ? (
                                  <>
                                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                                    Cancelling...
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-5 w-5 mr-2" />
                                    Cancel Item
                                  </>
                                )}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md bg-white rounded-xl shadow-2xl border-none">
                              <DialogHeader>
                                <DialogTitle className="text-2xl font-bold text-red-600">Cancel Item</DialogTitle>
                                <DialogDescription className="text-gray-600">
                                  Please select the reason for cancelling this item
                                  {itemCancelReasonType === "other" ? " and provide details." : "."}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-6 py-6">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <label htmlFor="item-reason-type" className="text-right font-medium text-gray-700">
                                    Reason Type
                                  </label>
                                  <Select
                                    onValueChange={(value) => {
                                      setItemCancelReasonType(value);
                                      if (value !== "other") {
                                        setItemCancelReason("");
                                      }
                                    }}
                                    value={itemCancelReasonType}
                                    className="col-span-3"
                                  >
                                    <SelectTrigger className="bg-white border-red-200 focus:ring-[#7a2828]">
                                      <SelectValue placeholder="Select a reason" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-red-200">
                                      <SelectItem value="changed_mind">Changed Mind</SelectItem>
                                      <SelectItem value="ordered_by_mistake">Ordered by Mistake</SelectItem>
                                      <SelectItem value="found_better_price">Found Better Price</SelectItem>
                                      <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                {itemCancelReasonType === "other" && (
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <label
                                      htmlFor="item-reason-details"
                                      className="text-right font-medium text-gray-700"
                                    >
                                      Details
                                    </label>
                                    <Input
                                      id="item-reason-details"
                                      value={itemCancelReason}
                                      onChange={(e) => setItemCancelReason(e.target.value)}
                                      className="col-span-3 border-red-200 focus:ring-[#7a2828]"
                                      placeholder="Provide more details"
                                    />
                                  </div>
                                )}
                              </div>
                              <DialogFooter className="flex justify-end gap-3">
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setIsItemCancelModalOpen(false);
                                    setItemCancelReason("");
                                    setItemCancelReasonType("");
                                    setSelectedItem(null);
                                  }}
                                  className="border-red-200 text-red-600 hover:bg-red-50"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={handleCancelItem}
                                  className="bg-gradient-to-r from-[#7a2828] to-[#5e1f1f] hover:from-[#5e1f1f] hover:to-[#441717] text-white"
                                  disabled={isCancellingItem || isReturningItem}
                                >
                                  Submit
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                        {item.status === "delivered" && !["return_requested", "returned", "return_denied"].includes(item.status) && (
                          <Dialog
                            open={isItemReturnModalOpen && selectedItem?.id === item.id}
                            onOpenChange={(open) => {
                              setIsItemReturnModalOpen(open);
                              if (open) setSelectedItem(item);
                              else {
                                setSelectedItem(null);
                                setItemReturnReason("");
                                setItemReturnReasonType("");
                              }
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-[#7a2828] text-[#7a2828] hover:bg-[#7a2828] hover:text-white font-semibold px-4 py-2 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                                disabled={isCancellingItem || isReturningItem}
                              >
                                <RotateCcw className="h-5 w-5 mr-2" />
                                Request Return
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md bg-white rounded-xl shadow-2xl border-none">
                              <DialogHeader>
                                <DialogTitle className="text-2xl font-bold text-[#7a2828]">
                                  Request Item Return
                                </DialogTitle>
                                <DialogDescription className="text-gray-600">
                                  Please select the reason for returning this item
                                  {itemReturnReasonType === "other" ? " and provide details." : "."}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-6 py-6">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <label
                                    htmlFor="item-return-reason-type"
                                    className="text-right font-medium text-gray-700"
                                  >
                                    Reason Type
                                  </label>
                                  <Select
                                    onValueChange={(value) => {
                                      setItemReturnReasonType(value);
                                      if (value !== "other") {
                                        setItemReturnReason("");
                                      }
                                    }}
                                    value={itemReturnReasonType}
                                    className="col-span-3"
                                  >
                                    <SelectTrigger className="bg-white border-[#e5d1d1] focus:ring-[#7a2828]">
                                      <SelectValue placeholder="Select a reason" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-[#e5d1d1]">
                                      <SelectItem value="defective_product">Defective Product</SelectItem>
                                      <SelectItem value="wrong_item">Wrong Item Received</SelectItem>
                                      <SelectItem value="not_as_expected">Not As Expected</SelectItem>
                                      <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                {itemReturnReasonType === "other" && (
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <label
                                      htmlFor="item-return-reason-details"
                                      className="text-right font-medium text-gray-700"
                                    >
                                      Details
                                    </label>
                                    <Input
                                      id="item-return-reason-details"
                                      value={itemReturnReason}
                                      onChange={(e) => setItemReturnReason(e.target.value)}
                                      className="col-span-3 border-[#e5d1d1] focus:ring-[#7a2828]"
                                      placeholder="Provide more details"
                                    />
                                  </div>
                                )}
                              </div>
                              <DialogFooter className="flex justify-end gap-3">
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setIsItemReturnModalOpen(false);
                                    setItemReturnReason("");
                                    setItemReturnReasonType("");
                                    setSelectedItem(null);
                                  }}
                                  className="border-[#e5d1d1] text-[#7a2828] hover:bg-[#f8f3f3]"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={handleReturnItem}
                                  className="bg-gradient-to-r from-[#7a2828] to-[#5e1f1f] hover:from-[#5e1f1f] hover:to-[#441717] text-white"
                                  disabled={isCancellingItem || isReturningItem}
                                >
                                  Submit
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                      {(item.cancel_reason || item.return_reason) && (
                        <div className="mt-3">
                          {item.cancel_reason && (
                            <p className="text-sm text-red-600 bg-red-50 p-2 rounded-md border border-red-200 shadow-sm animate-fade-in">
                              <span className="font-medium">Cancellation Reason:</span> {item.cancel_reason}
                            </p>
                          )}
                          {item.return_reason && (
                            <p
                              className={`text-sm p-2 rounded-md border shadow-sm animate-fade-in ${
                                item.status === "return_requested"
                                  ? "text-amber-600 bg-amber-50 border-amber-200"
                                  : item.status === "returned"
                                    ? "text-emerald-600 bg-emerald-50 border-emerald-200"
                                    : "text-red-600 bg-red-50 border-red-200"
                              }`}
                            >
                              <span className="font-medium">
                                {item.status === "return_requested"
                                  ? "Return Reason:"
                                  : item.status === "returned"
                                    ? "Return Approved:"
                                    : "Return Denied:"}
                              </span>{" "}
                              {item.return_reason}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#f8f3f3] to-[#f7f2e9] opacity-50"></div>
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-gradient-to-r from-[#7a2828] to-[#b8860b] p-2 rounded-lg shadow-md">
                      <CreditCard className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#7a2828] to-[#b8860b]">
                      Order Summary
                    </h2>
                  </div>
                  <Separator className="mb-8 bg-gradient-to-r from-[#e5d1d1] to-[#f0e6c9] h-0.5 rounded-full" />
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Item Prices</span>
                      <span className="font-semibold">₹{order.total_amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Product Discount</span>
                      <span className="text-red-600">− ₹{order.total_discount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-semibold">₹{order.total_tax}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Coupon Discount</span>
                      <span className="text-red-600">− ₹{order.coupon_discount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-semibold">₹{order.shipping}</span>
                    </div>
                    <Separator className="my-4 bg-gradient-to-r from-[#e5d1d1] to-[#f0e6c9] h-0.5 rounded-full" />
                    <div className="flex justify-between">
                      <span className="font-semibold text-[#7a2828]">Grand Total</span>
                      <span className="font-semibold text-[#7a2828]">₹{order.final_total}</span>
                    </div>
                    <div className="flex justify-between mt-4">
                      <span className="text-gray-600">Payment Method</span>
                      <span className="font-semibold">{order.payment_method.toUpperCase()}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-8 flex items-center justify-center gap-3 border-[#7a2828] text-[#7a2828] hover:bg-gradient-to-r hover:from-[#7a2828] hover:to-[#b8860b] hover:text-white font-semibold py-3 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                    onClick={() => navigate(`/invoice/${order.id}/`)}
                    disabled={order.status !== "delivered" || isCancellingItem || isReturningItem}
                  >
                    <Download className="h-5 w-5" />
                    Download Invoice
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#f3e9e9] to-[#f7f2e9] opacity-50"></div>
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-gradient-to-r from-[#7a2828] to-[#b8860b] p-2 rounded-lg shadow-md">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#7a2828] to-[#b8860b]">
                      Shipping Information
                    </h2>
                  </div>
                  <Separator className="mb-8 bg-gradient-to-r from-[#e5d1d1] to-[#f0e6c9] h-0.5 rounded-full" />
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-[#7a2828] mt-1" />
                      <div>
                        <p className="font-semibold">{order.order_address.name}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-[#7a2828] mt-1" />
                      <div>
                        <p className="text-gray-600">
                          {order.order_address.house_no}, {order.order_address.landmark}
                        </p>
                        <p className="text-gray-600">
                          {order.order_address.city}, {order.order_address.state} - {order.order_address.pin_code}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-[#7a2828] mt-1" />
                      <p className="text-gray-600">{order.order_address.phone || "+91 9876543210"}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-[#7a2828] mt-1" />
                      <p className="text-gray-600">{order.user.email}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-[#7a2828] mt-1" />
                      <p className="text-gray-600">Expected Delivery: {estDeliveryDate}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ViewOrderDetails;