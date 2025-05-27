
// import { useState, useEffect } from "react";
// import { useCart } from "@/Context/CartContext";
// import { Link, useNavigate } from "react-router-dom";
// import api from '../../api';

// export default function CheckoutPage() {
//   const { cart, fetchCart, removeFromCart, clearCart, loading: cartLoading, error: cartError } = useCart();
//   const navigate = useNavigate();
//   const BASE_URL = "http://127.0.0.1:8000";

//   const [loading, setLoading] = useState(true);
//   const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
//   const [addresses, setAddresses] = useState([]);
//   const [error, setError] = useState(null);
//   const [isPlacingOrder, setIsPlacingOrder] = useState(false);
//   const [couponCode, setCouponCode] = useState("");
//   const [couponError, setCouponError] = useState(null);
//   const [couponApplied, setCouponApplied] = useState(null);
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [selectedPayment, setSelectedPayment] = useState("card");
//   const [showAddressDialog, setShowAddressDialog] = useState(false);
//   const [editingAddress, setEditingAddress] = useState(null);
//   const [newAddress, setNewAddress] = useState({
//     name: "",
//     type: "home",
//     street: "",
//     city: "",
//     state: "",
//     pincode: "",
//     phone: "",
//     isDefault: false,
//   });
//   const [showCouponsDialog, setShowCouponsDialog] = useState(false);
//   const [availableCoupons, setAvailableCoupons] = useState([]);
//   const [couponLoading, setCouponLoading] = useState(false);

//   const toast = ({ title, description, variant }) => {
//     console.log(`Toast: ${title} - ${description} (${variant})`);
//     setError(description);
//   };

//   const handleApiError = (err, defaultMessage) => {
//     const message = err.response?.data?.message || err.response?.data?.error || defaultMessage;
//     setError(message);
//     toast({
//       title: "Error",
//       description: message,
//       variant: "destructive",
//     });
//   };

//   useEffect(() => {
//     const script = document.createElement('script');
//     script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//     script.async = true;
//     script.onload = () => {
//       console.log('Razorpay script loaded');
//       setIsRazorpayLoaded(true);
//     };
//     script.onerror = () => {
//       console.error('Failed to load Razorpay script');
//       handleApiError(new Error('Payment service unavailable'), 'Payment service is unavailable. Please try another payment method.');
//     };
//     document.body.appendChild(script);
//     return () => {
//       document.body.removeChild(script);
//     };
//   }, []);

//   useEffect(() => {
//     if (!cart) {
//       fetchCart();
//     }
//   }, [cart, fetchCart]);

//   useEffect(() => {
//     console.log('Cart data:', cart);
//     if (cart?.coupon && cart?.final_coupon_discount > 0 && cart.coupon.coupon_code) {
//       setCouponApplied({
//         code: cart.coupon.coupon_code,
//         discount: cart.final_coupon_discount,
//       });
//       setCouponCode(cart.coupon.coupon_code);
//       console.log('couponApplied set:', { code: cart.coupon.coupon_code, discount: cart.final_coupon_discount });
//     } else {
//       console.log('Coupon not applied: missing coupon_code or invalid cart data');
//       setCouponApplied(null);
//       setCouponCode("");
//     }
//   }, [cart]);

//   console.log('couponApplied:', couponApplied);

//   useEffect(() => {
//     fetchAddress();
//   }, []);

//   useEffect(() => {
//     if (addresses.length > 0 && !selectedAddress) {
//       setSelectedAddress(addresses.find(addr => addr.isDefault)?.id || addresses[0].id);
//     }
//   }, [addresses, selectedAddress]);

//   const fetchAddress = async () => {
//     setLoading(true);
//     try {
//       const response = await api.get('address/');
//       const mappedAddresses = response.data.map(addr => ({
//         id: addr.id,
//         name: addr.name,
//         type: addr.address_type,
//         street: `${addr.house_no || ''}${addr.landmark ? `, ${addr.landmark}` : ''}`.trim(),
//         city: addr.city,
//         state: addr.state,
//         pincode: addr.pin_code,
//         phone: addr.mobile_number,
//         isDefault: addr.isDefault || false,
//       }));
//       setAddresses(mappedAddresses);
//       setError(null);
//     } catch (err) {
//       handleApiError(err, "Failed to fetch addresses");
//       setAddresses([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAvailableCoupons = async () => {
//     setCouponLoading(true);
//     try {
//       const response = await api.get('offer/user/available-coupons/');
//       setAvailableCoupons(response.data);
//       setError(null);
//     } catch (err) {
//       handleApiError(err, "Failed to fetch available coupons");
//       setAvailableCoupons([]);
//     } finally {
//       setCouponLoading(false);
//     }
//   };

//   const handleCopyCoupon = (code) => {
//     navigator.clipboard.writeText(code).then(() => {
//       toast({
//         title: "Success",
//         description: `Coupon code ${code} copied to clipboard!`,
//         variant: "success",
//       });
//     }).catch(() => {
//       handleApiError(new Error("Failed to copy coupon code"), "Failed to copy coupon code");
//     });
//   };

//   const handleApplyCouponFromModal = async (code) => {
//     setCouponCode(code);
//     await handleApplyCoupon();
//     setShowCouponsDialog(false);
//   };

//   const cartItems = cart?.items?.map(item => ({
//     id: item.id,
//     name: item.product.name,
//     price: item.variant.total_price,
//     quantity: item.quantity,
//     tax: item.tax_amount,
//     discount: item.discount_amount,
//     final_price: item.final_price,
//     image: item.primary_image,
//   })) || [];

//   const subtotal = cart?.final_subtotal || 0;
//   const totalTax = cart?.final_tax || 0;
//   const totalDiscount = cart?.final_discount || 0;
//   const total = cart?.final_total || 0;
//   const shipping = cart?.shipping || 0;
//   const final_coupon_discount = cart?.final_coupon_discount || 0;

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(price);
//   };

//   const validateAddress = (address) => {
//     const errors = [];
//     if (!address.name.trim()) errors.push("Full name is required");
//     if (!address.street.trim()) errors.push("Street address is required");
//     if (!address.city.trim()) errors.push("City is required");
//     if (!address.state.trim()) errors.push("State is required");
//     if (!address.pincode || !/^\d{6}$/.test(address.pincode)) errors.push("Valid 6-digit PIN code is required");
//     if (!address.phone || !/^\d{10}$/.test(address.phone)) errors.push("Valid 10-digit phone number is required");
//     return errors;
//   };

//   const handleApplyCoupon = async () => {
//     if (!couponCode.trim()) {
//       setCouponError("Please enter a coupon code");
//       return;
//     }
//     try {
//       const response = await api.post('cartapp/apply-coupon/', { code: couponCode.trim() });
//       setCouponApplied({ code: couponCode, discount: response.data.discount });
//       setCouponError(null);
//       setError(null);
//       await fetchCart();
//       console.log("applied", response.data);
//     } catch (err) {
//       setCouponError(err.response?.data?.error || "Invalid coupon code");
//       setCouponApplied(null);
//     }
//   };

//   const handleRemoveCoupon = async () => {
//     try {
//       await api.post('cartapp/remove-coupon/');
//       setCouponApplied(null);
//       setCouponCode("");
//       setCouponError(null);
//       fetchCart();
//     } catch (err) {
//       setCouponError("Failed to remove coupon");
//     }
//   };

//   const handleAddAddress = async () => {
//     const errors = validateAddress(newAddress);
//     if (errors.length > 0) {
//       handleApiError(new Error(errors.join(", ")), errors.join(", "));
//       return;
//     }
//     try {
//       const [house_no = '', landmark = ''] = newAddress.street.split(',').map(s => s.trim());
//       const response = await api.post('address/', {
//         name: newAddress.name.trim(),
//         house_no,
//         address_type: newAddress.type,
//         city: newAddress.city.trim(),
//         state: newAddress.state.trim(),
//         pin_code: newAddress.pincode,
//         mobile_number: newAddress.phone,
//         landmark,
//         isDefault: newAddress.isDefault,
//       });
//       const newId = response.data.id;
//       const updatedAddresses = newAddress.isDefault
//         ? addresses.map(addr => ({ ...addr, isDefault: false }))
//         : [...addresses];
//       setAddresses([
//         ...updatedAddresses,
//         {
//           ...newAddress,
//           id: newId,
//           street: `${house_no}${landmark ? `, ${landmark}` : ''}`.trim(),
//           isDefault: newAddress.isDefault,
//         }
//       ]);
//       setSelectedAddress(newId);
//       setNewAddress({
//         name: "",
//         type: "home",
//         street: "",
//         city: "",
//         state: "",
//         pincode: "",
//         phone: "",
//         isDefault: false,
//       });
//       setShowAddressDialog(false);
//       setError(null);
//     } catch (err) {
//       handleApiError(err, "Failed to add address");
//     }
//   };

//   const handleEditAddress = async () => {
//     const errors = validateAddress(editingAddress);
//     if (errors.length > 0) {
//       handleApiError(new Error(errors.join(", ")), errors.join(", "));
//       return;
//     }
//     try {
//       const [house_no = '', landmark = ''] = editingAddress.street.split(',').map(s => s.trim());
//       const response = await api.patch(`address/${editingAddress.id}/`, {
//         name: editingAddress.name.trim(),
//         house_no,
//         address_type: editingAddress.type,
//         city: editingAddress.city.trim(),
//         state: editingAddress.state.trim(),
//         pin_code: editingAddress.pincode,
//         mobile_number: editingAddress.phone,
//         landmark,
//         isDefault: editingAddress.isDefault,
//       });
//       const updatedAddresses = addresses.map(addr => {
//         if (addr.id === editingAddress.id) {
//           return {
//             ...editingAddress,
//             street: `${house_no}${landmark ? `, ${landmark}` : ''}`.trim(),
//           };
//         }
//         return { ...addr, isDefault: editingAddress.isDefault ? false : addr.isDefault };
//       });
//       setAddresses(updatedAddresses);
//       setEditingAddress(null);
//       setShowAddressDialog(false);
//       setError(null);
//     } catch (err) {
//       handleApiError(err, "Failed to update address");
//     }
//   };

//   const handleRemoveAddress = async (id) => {
//     try {
//       await api.delete(`address/${id}/`);
//       const updatedAddresses = addresses.filter(addr => addr.id !== id);
//       if (id === selectedAddress && updatedAddresses.length > 0) {
//         setSelectedAddress(updatedAddresses.find(addr => addr.isDefault)?.id || updatedAddresses[0].id);
//       } else if (updatedAddresses.length === 0) {
//         setSelectedAddress(null);
//       }
//       setAddresses(updatedAddresses);
//       setError(null);
//     } catch (err) {
//       handleApiError(err, "Failed to remove address");
//     }
//   };

//   const setDefaultAddress = async (id) => {
//     try {
//       await api.patch(`address/${id}/`, { isDefault: true });
//       const updatedAddresses = addresses.map(addr => ({
//         ...addr,
//         isDefault: addr.id === id ? true : false,
//       }));
//       setAddresses(updatedAddresses);
//       setSelectedAddress(id);
//       setError(null);
//     } catch (err) {
//       handleApiError(err, "Failed to set default address");
//       await fetchAddress();
//     }
//   };

//   const startEditAddress = (address) => {
//     setEditingAddress({
//       ...address,
//       street: address.street,
//     });
//     setShowAddressDialog(true);
//   };

//   const handlePlaceOrder = async () => {
//     if (!selectedAddress) {
//       handleApiError(new Error("Please select a shipping address"), "Please select a shipping address");
//       return;
//     }
//     if (selectedPayment === "card" && !isRazorpayLoaded) {
//       handleApiError(new Error("Payment service is loading"), "Payment service is loading. Please wait or try another payment method.");
//       return;
//     }
//     setIsPlacingOrder(true);
//     try {
//       const couponData = couponApplied && couponApplied.code ? { coupon_code: couponApplied.code } : {};
//       console.log('couponApplied:', couponApplied);
//       console.log('couponData:', couponData);

//       if (selectedPayment === "card") {
//         if (!window.Razorpay) {
//           handleApiError(new Error("Payment service unavailable"), "Payment service is unavailable. Please try another payment method.");
//           setIsPlacingOrder(false);
//           return;
//         }

//         const response = await api.post('cartapp/orders/razorpay/create/', {
//           address_id: selectedAddress,
//           payment_method: 'card',
//           ...couponData,
//         });
//         console.log('Full Razorpay create response:', response);

//         if (!response.data.order_id || !response.data.amount) {
//           throw new Error("Invalid Razorpay response: missing order_id or amount");
//         }
//         const { order_id: razorpayOrderId, amount, currency, key, order } = response.data;

//         const options = {
//           key: key,
//           amount: amount,
//           currency: currency,
//           name: 'Vishali Gold',
//           description: `Payment for Order #${order.order_number}`,
//           order_id: razorpayOrderId,
//           handler: async function (response) {
//             try {
//               const verifyResponse = await api.post('cartapp/orders/razorpay/verify/', {
//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_signature: response.razorpay_signature,
//               });
//               console.log('Payment verification response:', verifyResponse.data);
//               if (verifyResponse.data.order_id) {
//                 navigate(`/order-details/${verifyResponse.data.order_id}`, {
//                   state: { paymentStatus: 'success', order: verifyResponse.data.order_id },
//                 });
//               } else {
//                 await clearCart();
//               }
//               setIsPlacingOrder(false);
//             } catch (err) {
//               console.error('Payment verification error:', err.response?.data, err.message);
//               handleApiError(err, 'Payment verification failed. Please contact support.');
//               if (err.response?.data?.order_id) {
//                 navigate(`/order-details/${err.response.data.order_id}`, {
//                   state: { paymentStatus: 'failed', order: err.response?.data?.order_id },
//                 });
//               }
//             } finally {
//               setIsPlacingOrder(false);
//             }
//           },
//           prefill: {
//             name: addresses.find(addr => addr.id === selectedAddress)?.name || '',
//             email: 'customer@example.com',
//             contact: addresses.find(addr => addr.id === selectedAddress)?.phone || '',
//           },
//           notes: {
//             address_id: selectedAddress,
//             order_id: response.data.order.id,
//           },
//           theme: {
//             color: '#8B2131',
//           },
//           modal: {
//             ondismiss: async () => {
//               setIsPlacingOrder(false);
//               handleApiError(new Error('Payment cancelled'), 'Payment cancelled by user.');
//               try {
//                 await api.post('cartapp/orders/cancel/', { order_id: response.data.order.id });
//                 console.log('Pending order cancelled');
//               } catch (err) {
//                 console.error('Failed to cancel order:', err);
//                 handleApiError(err, 'Payment cancelled, but failed to update order status. Please contact support.');
//               }
//             },
//           },
//         };

//         try {
//           const rzp = new window.Razorpay(options);
//           rzp.on('payment.failed', async function (response) {
//             console.error('Razorpay payment failed:', response.error);
//             handleApiError(new Error(response.error.description), `Payment failed: ${response.error.description}`);
//             setIsPlacingOrder(false);
//             try {
//               await api.post('cartapp/orders/cancel/', { order_id: response.data.order.id });
//               console.log('Pending order cancelled');
//             } catch (err) {
//               console.error('Failed to cancel order:', err);
//               handleApiError(err, 'Payment failed, but failed to update order status. Please contact support.');
//             }
//           });
//           rzp.open();
//         } catch (err) {
//           console.error('Razorpay modal error:', err);
//           handleApiError(err, 'Failed to initialize payment. Please try again.');
//           setIsPlacingOrder(false);
//           try {
//             await api.post('cartapp/orders/cancel/', { order_id: response.data.order.id });
//             console.log('Pending order cancelled');
//           } catch (cancelErr) {
//             console.error('Failed to cancel order:', cancelErr);
//             handleApiError(cancelErr, 'Failed to cancel order. Please contact support.');
//           }
//         }
//       } else {
//         const response = await api.post('cartapp/orders/create/', {
//           address_id: selectedAddress,
//           payment_method: selectedPayment,
//           ...couponData,
//         });
//         console.log('Order create response:', response.data);
//         if (response.data.cart) {
//           setCart(response.data.cart);
//         } else {
//           await clearCart();
//         }
//         navigate(`/order-details/${response.data.order.id}`, {
//           state: { paymentStatus: 'success', order: response.data.order },
//         });
//         setIsPlacingOrder(false);
//       }
//     } catch (error) {
//       console.error('Place order error details:', error.response?.data, error.message);
//       handleApiError(error, "Failed to place order. Please try again.");
//       setIsPlacingOrder(false);
//     }
//   };

//   const IconArrowLeft = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="m12 19-7-7 7-7" />
//       <path d="M19 12H5" />
//     </svg>
//   );

//   const IconMapPin = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
//       <circle cx="12" cy="10" r="3" />
//     </svg>
//   );

//   const IconPlus = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M5 12h14" />
//       <path d="M12 5v14" />
//     </svg>
//   );

//   const IconHome = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="m3 81 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
//       <polyline points="9 22 9 12 15 12 15 22" />
//     </svg>
//   );

//   const IconBuilding = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
//       <path d="M9 22v-4h6v4" />
//       <path d="M8 6h.01" />
//       <path d="M16 6h.01" />
//       <path d="M8 10h.01" />
//       <path d="M16 10h.01" />
//       <path d="M8 14h.01" />
//       <path d="M16 14h.01" />
//     </svg>
//   );

//   const IconEdit = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
//       <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
//     </svg>
//   );

//   const IconTrash = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <polyline points="3 6 5 6 21 6" />
//       <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
//     </svg>
//   );

//   const IconTag = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
//       <line x1="7" y1="7" x2="7.01" y2="7" />
//     </svg>
//   );

//   const IconChevronRight = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <polyline points="9 18 15 12 9 6" />
//     </svg>
//   );

//   const IconShieldCheck = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
//       <path d="M9 12l2 2 4-4" />
//     </svg>
//   );

//   const IconCreditCard = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
//       <line x1="1" y1="10" x2="23" y2="10" />
//     </svg>
//   );

//   const IconWallet = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
//       <path d="M4 8v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4" />
//       <path d="M18 12h-4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1z" />
//     </svg>
//   );

//   const IconCopy = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
//       <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
//     </svg>
//   );

//   const Button = ({ children, className = "", onClick, variant = "default", disabled = false }) => {
//     const baseClass =
//       "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
//     let variantClass = "bg-[#8B2131] text-white hover:bg-[#6d1926]";
//     if (variant === "outline") {
//       variantClass = "border border-input bg-background hover:bg-accent hover:text-accent-foreground";
//     } else if (variant === "secondary") {
//       variantClass = "bg-secondary text-secondary-foreground hover:bg-secondary/80";
//     } else if (variant === "ghost") {
//       variantClass = "hover:bg-accent hover:text-accent-foreground";
//     }
//     return (
//       <button className={`${baseClass} ${variantClass} ${className}`} onClick={onClick} disabled={disabled}>
//         {children}
//       </button>
//     );
//   };

//   const Label = ({ children, htmlFor, className = "" }) => (
//     <label
//       htmlFor={htmlFor}
//       className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
//     >
//       {children}
//     </label>
//   );

//   const Input = ({ id, value, onChange, placeholder, className = "" }) => (
//     <input
//       id={id}
//       value={value}
//       onChange={onChange}
//       placeholder={placeholder}
//       className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
//     />
//   );

//   const Textarea = ({ id, value, onChange, placeholder, className = "" }) => (
//     <textarea
//       id={id}
//       value={value}
//       onChange={onChange}
//       placeholder={placeholder}
//       className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
//     />
//   );

//   const Separator = ({ className = "" }) => <div className={`h-[1px] w-full bg-border ${className}`}></div>;

//   const AddressDialog = () => {
//     if (!showAddressDialog) return null;

//     const isEditing = !!editingAddress;
//     const addressData = isEditing ? editingAddress : newAddress;
//     const setAddressData = isEditing
//       ? (data) => setEditingAddress({ ...editingAddress, ...data })
//       : (data) => setNewAddress({ ...newAddress, ...data });

//     return (
//       <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
//         <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
//           <div className="mb-4">
//             <h2 className="text-xl font-semibold">{isEditing ? "Edit Address" : "Add New Address"}</h2>
//             {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
//           </div>
//           <div className="grid gap-4 py-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="md:col-span-2">
//                 <Label htmlFor="name">Full Name</Label>
//                 <Input
//                   id="name"
//                   value={addressData.name}
//                   onChange={(e) => setAddressData({ name: e.target.value })}
//                   placeholder="Enter your full name"
//                 />
//               </div>
//               <div className="md:col-span-2">
//                 <Label>Address Type</Label>
//                 <div className="flex gap-4 mt-2">
//                   <div className="flex items-center space-x-2">
//                     <input
//                       type="radio"
//                       id="home"
//                       checked={addressData.type === "home"}
//                       onChange={() => setAddressData({ type: "home" })}
//                       className="h-4 w-4 text-[#8B2131] focus:ring-[#8B2131]"
//                     />
//                     <Label htmlFor="home" className="cursor-pointer">Home</Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <input
//                       type="radio"
//                       id="office"
//                       checked={addressData.type === "office"}
//                       onChange={() => setAddressData({ type: "office" })}
//                       className="h-4 w-4 text-[#8B2131] focus:ring-[#8B2131]"
//                     />
//                     <Label htmlFor="office" className="cursor-pointer">Office</Label>
//                   </div>
//                 </div>
//               </div>
//               <div className="md:col-span-2">
//                 <Label htmlFor="street">Street Address</Label>
//                 <Textarea
//                   id="street"
//                   value={addressData.street}
//                   onChange={(e) => setAddressData({ street: e.target.value })}
//                   placeholder="Enter your street address (e.g., House No, Landmark)"
//                   className="resize-none"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="city">City</Label>
//                 <Input
//                   id="city"
//                   value={addressData.city}
//                   onChange={(e) => setAddressData({ city: e.target.value })}
//                   placeholder="City"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="state">State</Label>
//                 <Input
//                   id="state"
//                   value={addressData.state}
//                   onChange={(e) => setAddressData({ state: e.target.value })}
//                   placeholder="State"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="pincode">PIN Code</Label>
//                 <Input
//                   id="pincode"
//                   value={addressData.pincode}
//                   onChange={(e) => setAddressData({ pincode: e.target.value })}
//                   placeholder="PIN Code"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="phone">Phone Number</Label>
//                 <Input
//                   id="phone"
//                   value={addressData.phone}
//                   onChange={(e) => setAddressData({ phone: e.target.value })}
//                   placeholder="Phone Number"
//                 />
//               </div>
//               <div className="md:col-span-2 flex items-center space-x-2">
//                 <input
//                   type="checkbox"
//                   id="default"
//                   checked={addressData.isDefault}
//                   onChange={(e) => setAddressData({ isDefault: e.target.checked })}
//                   className="h-4 w-4 text-[#8B2131] focus:ring-[#8B2131]"
//                 />
//                 <Label htmlFor="default" className="cursor-pointer">Set as default address</Label>
//               </div>
//             </div>
//           </div>
//           <div className="flex justify-end gap-3 mt-4">
//             <Button
//               variant="outline"
//               onClick={() => {
//                 setShowAddressDialog(false);
//                 setEditingAddress(null);
//                 setError(null);
//               }}
//               className="px-4 py-2"
//             >
//               Cancel
//             </Button>
//             <Button
//               className="bg-[#8B2131] hover:bg-[#6d1926] px-4 py-2 text-white"
//               onClick={isEditing ? handleEditAddress : handleAddAddress}
//               disabled={isEditing ? !editingAddress : !newAddress.name}
//             >
//               {isEditing ? "Update Address" : "Save Address"}
//             </Button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const CouponsDialog = () => {
//     if (!showCouponsDialog) return null;

//     return (
//       <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
//         <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
//           <div className="mb-4">
//             <h2 className="text-xl font-semibold">Available Coupons</h2>
//             {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
//           </div>
//           <div className="space-y-4 max-h-[60vh] overflow-y-auto">
//             {couponLoading ? (
//               <p>Loading coupons...</p>
//             ) : availableCoupons.length === 0 ? (
//               <p className="text-gray-500">No available coupons found.</p>
//             ) : (
//               availableCoupons.map((coupon) => (
//                 <div key={coupon.id} className="border rounded-lg p-4">
//                   <div className="flex justify-between items-center mb-2">
//                     <h3 className="text-sm font-medium">{coupon.coupon_code}</h3>
//                     <div className="flex gap-2">
//                       <Button
//                         variant="ghost"
//                         onClick={() => handleCopyCoupon(coupon.coupon_code)}
//                         className="text-[#8B2131] hover:text-[#6d1926]"
//                       >
//                         <span className="h-4 w-4 mr-1"><IconCopy /></span>
//                         Copy
//                       </Button>
//                       <Button
//                         variant="outline"
//                         onClick={() => handleApplyCouponFromModal(coupon.coupon_code)}
//                         className="text-[#8B2131] border-[#8B2131] hover:bg-[#f8ece9]"
//                         disabled={couponApplied?.code === coupon.coupon_code}
//                       >
//                         {couponApplied?.code === coupon.coupon_code ? "Applied" : "Apply"}
//                       </Button>
//                     </div>
//                   </div>
//                   <p className="text-sm text-gray-600">Discount: {formatPrice(coupon.discount)}</p>
//                   <p className="text-sm text-gray-600">Min Purchase: {formatPrice(coupon.min_amount)}</p>
//                   <p className="text-sm text-gray-600">Offer Amount: {formatPrice(coupon.min_offer_amount)}</p>
//                 </div>
//               ))
//             )}
//           </div>
//           <div className="flex justify-end mt-4">
//             <Button
//               variant="outline"
//               onClick={() => {
//                 setShowCouponsDialog(false);
//                 setError(null);
//               }}
//               className="px-4 py-2"
//             >
//               Close
//             </Button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-7xl">
//       <div className="mb-8">
//         <div className="flex items-center mb-4">
//           <Link to='/cart' className="flex items-center text-gray-600 hover:text-[#8B2131] transition-colors">
//             <span className="h-4 w-4 mr-2"><IconArrowLeft /></span>
//             <span>Back to Cart</span>
//           </Link>
//         </div>
//         <h1 className="text-3xl font-bold text-[#7a2828]">Checkout</h1>
//         <p className="text-gray-500 mt-1">Complete your purchase securely</p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         <div className="lg:col-span-2 space-y-8">
//           <div className="bg-[#f8ece9] rounded-xl shadow-sm border p-6">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-xl font-semibold flex items-center">
//                 <span className="h-5 w-5 mr-2 text-[#8B2131]"><IconMapPin /></span>
//                 Shipping Address
//               </h2>
//               <Button
//                 variant="outline"
//                 className="flex items-center gap-1 bg-[#7a2828] border-[#8B2131] text-white hover:bg-[#f8ece9] hover:text-[#8B2131] px-3 py-2"
//                 onClick={() => navigate('/addaddress')}
//                 disabled={showAddressDialog}
//               >
//                 <span className="h-5 w-5 mr-2"><IconPlus /></span>
//                 Add New Address
//               </Button>
//             </div>
//             <div className="space-y-4">
//               {(error || cartError) && <p className="text-red-600 text-sm">{error || cartError}</p>}
//               {loading || cartLoading ? (
//                 <p>Loading...</p>
//               ) : addresses.length === 0 ? (
//                 <div className="text-center py-8 text-gray-500">
//                   <p>No addresses found. Please add a new address.</p>
//                 </div>
//               ) : (
//                 addresses.map((address) => (
//                   <div
//                     key={address.id}
//                     className={`relative flex border rounded-lg p-4 transition-all duration-200 ${
//                       selectedAddress === address.id
//                         ? "border-[#8B2131] bg-[#f8ece9]/30"
//                         : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
//                     }`}
//                     onClick={() => setSelectedAddress(address.id)}
//                   >
//                     <div className="absolute top-5 left-4">
//                       <input
//                         type="radio"
//                         checked={selectedAddress === address.id}
//                         onChange={() => setSelectedAddress(address.id)}
//                         className="h-4 w-4 text-[#8B2131] focus:ring-[#8B2131]"
//                       />
//                     </div>
//                     <div className="ml-8 flex-1">
//                       <div className="flex items-center mb-1">
//                         <Label className="font-medium cursor-pointer">{address.name}</Label>
//                         {address.isDefault && (
//                           <span className="ml-2 text-xs bg-[#8B2131]/10 text-[#8B2131] px-2 py-0.5 rounded-full">
//                             Default
//                           </span>
//                         )}
//                         <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center">
//                           {address.type === "home" ? (
//                             <><span className="h-4 w-4 mr-1"><IconHome /></span>Home</>
//                           ) : (
//                             <><span className="h-4 w-4 mr-1"><IconBuilding /></span>Office</>
//                           )}
//                         </span>
//                       </div>
//                       <p className="text-sm text-gray-600 mb-1">{address.street}</p>
//                       <p className="text-sm text-gray-600 mb-1">{address.city}, {address.state} - {address.pincode}</p>
//                       <p className="text-sm text-gray-600">Phone: {address.phone}</p>
//                       <div className="flex mt-3 space-x-3 items-center">
//                         <Button
//                           variant="ghost"
//                           className="text-[#8B2131] hover:text-[#6d1926]"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             startEditAddress(address);
//                           }}
//                         >
//                           <span className="h-4 w-4 mr-1"><IconEdit /></span>
//                           Edit
//                         </Button>
//                         <Button
//                           variant="ghost"
//                           className="text-red-600 hover:text-red-700"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleRemoveAddress(address.id);
//                           }}
//                         >
//                           <span className="h-4 w-4 mr-1"><IconTrash /></span>
//                           Delete
//                         </Button>
//                         {!address.isDefault && (
//                           <Button
//                             variant="ghost"
//                             className="text-green-600 hover:text-green-700"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               setDefaultAddress(address.id);
//                             }}
//                           >
//                             Set as Default
//                           </Button>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm border p-6">
//             <h2 className="text-xl font-semibold flex items-center mb-6">
//               <span className="h-5 w-5 mr-2 text-[#8B2131]"><IconCreditCard /></span>
//               Payment Method
//             </h2>
//             <div className="space-y-4">
//               <div
//                 className={`relative flex border rounded-lg p-4 transition-all duration-200 ${
//                   selectedPayment === "card"
//                     ? "border-[#8B2131] bg-[#f8ece9]/30"
//                     : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
//                 }`}
//                 onClick={() => setSelectedPayment("card")}
//               >
//                 <div className="absolute top-5 left-4">
//                   <input
//                     type="radio"
//                     checked={selectedPayment === "card"}
//                     onChange={() => setSelectedPayment("card")}
//                     className="h-4 w-4 text-[#8B2131] focus:ring-[#8B2131]"
//                   />
//                 </div>
//                 <div className="ml-8">
//                   <Label className="font-medium cursor-pointer flex items-center">
//                     <span className="h-5 w-5 mr-2"><IconCreditCard /></span>
//                     Credit/Debit Card
//                   </Label>
//                   <p className="text-sm text-gray-500 mt-1">Pay securely with your card via Razorpay</p>
//                 </div>
//               </div>
//               <div
//                 className={`relative flex border rounded-lg p-4 transition-all duration-200 ${
//                   selectedPayment === "wallet"
//                     ? "border-[#8B2131] bg-[#f8ece9]/30"
//                     : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
//                 }`}
//                 onClick={() => setSelectedPayment("wallet")}
//               >
//                 <div className="absolute top-5 left-4">
//                   <input
//                     type="radio"
//                     checked={selectedPayment === "wallet"}
//                     onChange={() => setSelectedPayment("wallet")}
//                     className="h-4 w-4 text-[#8B2131] focus:ring-[#8B2131]"
//                   />
//                 </div>
//                 <div className="ml-8">
//                   <Label className="font-medium cursor-pointer flex items-center">
//                     <span className="h-5 w-5 mr-2"><IconWallet /></span>
//                     Wallet
//                   </Label>
//                   <p className="text-sm text-gray-500 mt-1">Pay using your wallet balance</p>
//                 </div>
//               </div>
//               <div
//                 className={`relative flex border rounded-lg p-4 transition-all duration-200 ${
//                   selectedPayment === "cod"
//                     ? "border-[#8B2131] bg-[#f8ece9]/30"
//                     : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
//                 }`}
//                 onClick={() => setSelectedPayment("cod")}
//               >
//                 <div className="absolute top-5 left-4">
//                   <input
//                     type="radio"
//                     checked={selectedPayment === "cod"}
//                     onChange={() => setSelectedPayment("cod")}
//                     className="h-4 w-4 text-[#8B2131] focus:ring-[#8B2131]"
//                   />
//                 </div>
//                 <div className="ml-8">
//                   <Label className="font-medium cursor-pointer flex items-center">
//                     <span className="h-5 w-5 mr-2"><IconCreditCard /></span>
//                     Cash on Delivery
//                   </Label>
//                   <p className="text-sm text-gray-500 mt-1">Pay when you receive your order</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="lg:col-span-1 space-y-8">
//           <div className="bg-[#f8ece9] rounded-xl shadow-sm border p-6 sticky top-6">
//             <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
//             <div className="space-y-6 mb-6">
//               {cart?.items?.length > 0 ? (
//                 cart.items.map((item) => (
//                   <div key={item.id} className="space-y-3">
//                     <div className="flex gap-4">
//                       <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
//                         <img
//                           src={item.primary_image ? `${BASE_URL}${item.primary_image}` : "/placeholder.svg"}
//                           alt={item.product.name}
//                           className="w-full h-full object-cover"
//                         />
//                       </div>
//                       <div className="flex-1">
//                         <h3 className="text-sm font-medium text-[#7a2828]">{item.product.name}</h3>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-sm font-semibold">{formatPrice(item.variant.total_price)}</p>
//                         <p className="text-xs text-gray-500 mt-1">Quantity: {item.quantity}</p>
//                         <p className="text-xs text-gray-500 mt-1">Item Total</p>
//                         <p className="text-sm font-semibold mt-2">{formatPrice(item.final_price)}</p>
//                       </div>
//                     </div>
//                     <div className="pl-24 space-y-1">
//                       {item.discount_amount > 0 && (
//                         <div className="flex justify-between text-sm">
//                           <span className="text-green-600 flex items-center">
//                             <span className="h-5 w-5 mr-1"><IconTag /></span>
//                             Discount
//                           </span>
//                           <span className="text-green-600">-{formatPrice(item.discount_amount)}</span>
//                         </div>
//                       )}
//                       {item.tax_amount > 0 && (
//                         <div className="flex justify-between text-sm">
//                           <span className="text-gray-600">Tax</span>
//                           <span>{formatPrice(item.tax_amount)}</span>
//                         </div>
//                       )}
//                     </div>
//                     <Separator />
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-8 text-gray-500">
//                   <p>Your cart is empty. <Link to="/cart" className="text-[#8B2131] hover:underline">Go to cart</Link></p>
//                 </div>
//               )}
//             </div>
//             <div className="space-y-3 text-sm">
//               <div className="flex gap-2">
//                 <Input
//                   id="coupon"
//                   value={couponCode}
//                   onChange={(e) => setCouponCode(e.target.value)}
//                   placeholder="Enter coupon code"
//                   className="flex-1"
//                   disabled={couponApplied}
//                 />
//                 {couponApplied ? (
//                   <Button
//                     variant="ghost"
//                     onClick={handleRemoveCoupon}
//                     className="px-4 py-2 text-red-600 hover:text-red-700"
//                   >
//                     Remove
//                   </Button>
//                 ) : (
//                   <Button
//                     onClick={handleApplyCoupon}
//                     disabled={!couponCode.trim() || couponApplied}
//                     className="px-4 py-2"
//                   >
//                     Apply
//                   </Button>
//                 )}
//               </div>
//               <Button
//                 variant="outline"
//                 onClick={() => {
//                   fetchAvailableCoupons();
//                   setShowCouponsDialog(true);
//                 }}
//                 className="w-full mt-2 border-[#8B2131] text-[#8B2131] hover:bg-[#f8ece9]"
//               >
//                 <span className="h-5 w-5 mr-2"><IconTag /></span>
//                 View Available Coupons
//               </Button>
//               {couponError && <p className="text-red-600 text-xs">{couponError}</p>}
//               {couponApplied && (
//                 <p className="text-green-600 text-xs">
//                   Coupon "{couponApplied.code}" applied! Saved {formatPrice(couponApplied.discount)}
//                 </p>
//               )}
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Item Total</span>
//                 <span>{formatPrice(subtotal)}</span>
//               </div>
//               {totalDiscount > 0 && (
//                 <div className="flex justify-between text-green-600">
//                   <span className="flex items-center">
//                     <span className="h-5 w-5 mr-1"><IconTag /></span>
//                     Discount
//                   </span>
//                   <span>-{formatPrice(totalDiscount)}</span>
//                 </div>
//               )}
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Tax</span>
//                 <span>{formatPrice(totalTax)}</span>
//               </div>
//               {couponApplied && (
//                 <div className="flex justify-between text-green-600">
//                   <span className="flex items-center">
//                     <span className="h-5 w-5 mr-1"><IconTag /></span>
//                     Coupon Discount
//                   </span>
//                   <span>-{formatPrice(couponApplied.discount)}</span>
//                 </div>
//               )}
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Shipping</span>
//                 <span>{formatPrice(shipping)}</span>
//               </div>
//               <Separator className="my-2" />
//               <div className="flex justify-between font-semibold text-base">
//                 <span>Total</span>
//                 <span>{formatPrice(total)}</span>
//               </div>
//             </div>
//             <Button
//               className="w-full mt-6 bg-[#8B2131] hover:bg-[#6d1926] text-white py-2 px-4"
//               disabled={addresses.length === 0 || !cart?.items?.length || isPlacingOrder || (selectedPayment === "card" && !isRazorpayLoaded)}
//               onClick={handlePlaceOrder}
//             >
//               {isPlacingOrder ? "Processing..." : `Proceed to Pay ${formatPrice(total)}`}
//               <span className="ml-2 h-4 w-4"><IconChevronRight /></span>
//             </Button>
//             <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
//               <span className="h-4 w-4 mr-1 text-green-600"><IconShieldCheck /></span>
//               <span>Secure checkout with 256-bit encryption</span>
//             </div>
//           </div>
//         </div>
//       </div>
//       <AddressDialog />
//       <CouponsDialog />
//     </div>
//   );
// }


"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/Context/CartContext"
import { Link, useNavigate } from "react-router-dom"
import api from "../../api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
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
} from "lucide-react"

export default function CheckoutPage() {
  const { cart, fetchCart, removeFromCart, clearCart, loading: cartLoading, error: cartError, setCart } = useCart()
  const navigate = useNavigate()
  const BASE_URL = "http://127.0.0.1:8000"

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
    street: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    isDefault: false,
  })
  const [showCouponsDialog, setShowCouponsDialog] = useState(false)
  const [availableCoupons, setAvailableCoupons] = useState([])
  const [couponLoading, setCouponLoading] = useState(false)

  const toast = ({ title, description, variant }) => {
    console.log(`Toast: ${title} - ${description} (${variant})`)
    setError(description)
  }

  const handleApiError = (err, defaultMessage) => {
    const message = err.response?.data?.message || err.response?.data?.error || defaultMessage
    setError(message)
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    })
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

  console.log("couponApplied:", couponApplied)

  useEffect(() => {
    fetchAddress()
  }, [])

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      setSelectedAddress(addresses.find((addr) => addr.isDefault)?.id || addresses[0].id)
    }
  }, [addresses, selectedAddress])

  const fetchAddress = async () => {
    setLoading(true)
    try {
      const response = await api.get("address/")
      const mappedAddresses = response.data.map((addr) => ({
        id: addr.id,
        name: addr.name,
        type: addr.address_type,
        street: `${addr.house_no || ""}${addr.landmark ? `, ${addr.landmark}` : ""}`.trim(),
        city: addr.city,
        state: addr.state,
        pincode: addr.pin_code,
        phone: addr.mobile_number,
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
  const final_coupon_discount = cart?.final_coupon_discount || 0

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
    if (!address.street.trim()) errors.push("Street address is required")
    if (!address.city.trim()) errors.push("City is required")
    if (!address.state.trim()) errors.push("State is required")
    if (!address.pincode || !/^\d{6}$/.test(address.pincode)) errors.push("Valid 6-digit PIN code is required")
    if (!address.phone || !/^\d{10}$/.test(address.phone)) errors.push("Valid 10-digit phone number is required")
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
      console.log("applied", response.data)
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
      const [house_no = "", landmark = ""] = newAddress.street.split(",").map((s) => s.trim())
      const response = await api.post("address/", {
        name: newAddress.name.trim(),
        house_no,
        address_type: newAddress.type,
        city: newAddress.city.trim(),
        state: newAddress.state.trim(),
        pin_code: newAddress.pincode,
        mobile_number: newAddress.phone,
        landmark,
        isDefault: newAddress.isDefault,
      })
      const newId = response.data.id
      const updatedAddresses = newAddress.isDefault
        ? addresses.map((addr) => ({ ...addr, isDefault: false }))
        : [...addresses]
      setAddresses([
        ...updatedAddresses,
        {
          ...newAddress,
          id: newId,
          street: `${house_no}${landmark ? `, ${landmark}` : ""}`.trim(),
          isDefault: newAddress.isDefault,
        },
      ])
      setSelectedAddress(newId)
      setNewAddress({
        name: "",
        type: "home",
        street: "",
        city: "",
        state: "",
        pincode: "",
        phone: "",
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
      const [house_no = "", landmark = ""] = editingAddress.street.split(",").map((s) => s.trim())
      const response = await api.patch(`address/${editingAddress.id}/`, {
        name: editingAddress.name.trim(),
        house_no,
        address_type: editingAddress.type,
        city: editingAddress.city.trim(),
        state: editingAddress.state.trim(),
        pin_code: editingAddress.pincode,
        mobile_number: editingAddress.phone,
        landmark,
        isDefault: editingAddress.isDefault,
      })
      const updatedAddresses = addresses.map((addr) => {
        if (addr.id === editingAddress.id) {
          return {
            ...editingAddress,
            street: `${house_no}${landmark ? `, ${landmark}` : ""}`.trim(),
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
      street: address.street,
    })
    setShowAddressDialog(true)
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
    setIsPlacingOrder(true)
    try {
      const couponData = couponApplied && couponApplied.code ? { coupon_code: couponApplied.code } : {}
      console.log("couponApplied:", couponApplied)
      console.log("couponData:", couponData)

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
        console.log("Full Razorpay create response:", response)

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
              console.log("Payment verification response:", verifyResponse.data)
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
              handleApiError(err, "Payment verification failed. Please contact support.")
              if (err.response?.data?.order_id) {
                navigate(`/order-details/${err.response.data.order_id}`, {
                  state: { paymentStatus: "failed", order: err.response?.data?.order_id },
                })
              }
            } finally {
              setIsPlacingOrder(false)
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
              handleApiError(new Error("Payment cancelled"), "Payment cancelled by user.")
              try {
                await api.post("cartapp/orders/cancel/", { order_id: response.data.order.id })
                console.log("Pending order cancelled")
              } catch (err) {
                console.error("Failed to cancel order:", err)
                handleApiError(err, "Payment cancelled, but failed to update order status. Please contact support.")
              }
            },
          },
        }

        try {
          const rzp = new window.Razorpay(options)
          rzp.on("payment.failed", async (response) => {
            console.error("Razorpay payment failed:", response.error)
            handleApiError(new Error(response.error.description), `Payment failed: ${response.error.description}`)
            setIsPlacingOrder(false)
            try {
              await api.post("cartapp/orders/cancel/", { order_id: response.data.order.id })
              console.log("Pending order cancelled")
            } catch (err) {
              console.error("Failed to cancel order:", err)
              handleApiError(err, "Payment failed, but failed to update order status. Please contact support.")
            }
          })
          rzp.open()
        } catch (err) {
          console.error("Razorpay modal error:", err)
          handleApiError(err, "Failed to initialize payment. Please try again.")
          setIsPlacingOrder(false)
          try {
            await api.post("cartapp/orders/cancel/", { order_id: response.data.order.id })
            console.log("Pending order cancelled")
          } catch (cancelErr) {
            console.error("Failed to cancel order:", cancelErr)
            handleApiError(cancelErr, "Failed to cancel order. Please contact support.")
          }
        }
      } else {
        const response = await api.post("cartapp/orders/create/", {
          address_id: selectedAddress,
          payment_method: selectedPayment,
          ...couponData,
        })
        console.log("Order create response:", response.data)
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

  const AddressDialog = () => {
    if (!showAddressDialog) return null

    const isEditing = !!editingAddress
    const addressData = isEditing ? editingAddress : newAddress
    const setAddressData = isEditing
      ? (data) => setEditingAddress({ ...editingAddress, ...data })
      : (data) => setNewAddress({ ...newAddress, ...data })

    return (
      <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-[#8B2131]">
              {isEditing ? "Edit Address" : "Add New Address"}
            </DialogTitle>
          </DialogHeader>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  value={addressData.name}
                  onChange={(e) => setAddressData({ name: e.target.value })}
                  placeholder="Enter your full name"
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <Label className="text-sm font-medium">Address Type *</Label>
                <RadioGroup
                  value={addressData.type}
                  onValueChange={(value) => setAddressData({ type: value })}
                  className="flex gap-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="home" id="home" />
                    <Label htmlFor="home" className="cursor-pointer flex items-center">
                      <Home className="h-4 w-4 mr-1" />
                      Home
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="office" id="office" />
                    <Label htmlFor="office" className="cursor-pointer flex items-center">
                      <Building className="h-4 w-4 mr-1" />
                      Office
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="street" className="text-sm font-medium">
                  Street Address *
                </Label>
                <Textarea
                  id="street"
                  value={addressData.street}
                  onChange={(e) => setAddressData({ street: e.target.value })}
                  placeholder="Enter your street address (e.g., House No, Landmark)"
                  className="mt-1 resize-none"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="city" className="text-sm font-medium">
                  City *
                </Label>
                <Input
                  id="city"
                  value={addressData.city}
                  onChange={(e) => setAddressData({ city: e.target.value })}
                  placeholder="City"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="state" className="text-sm font-medium">
                  State *
                </Label>
                <Input
                  id="state"
                  value={addressData.state}
                  onChange={(e) => setAddressData({ state: e.target.value })}
                  placeholder="State"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="pincode" className="text-sm font-medium">
                  PIN Code *
                </Label>
                <Input
                  id="pincode"
                  value={addressData.pincode}
                  onChange={(e) => setAddressData({ pincode: e.target.value })}
                  placeholder="PIN Code"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  value={addressData.phone}
                  onChange={(e) => setAddressData({ phone: e.target.value })}
                  placeholder="Phone Number"
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2 flex items-center space-x-2">
                <Checkbox
                  id="default"
                  checked={addressData.isDefault}
                  onCheckedChange={(checked) => setAddressData({ isDefault: checked })}
                />
                <Label htmlFor="default" className="cursor-pointer text-sm">
                  Set as default address
                </Label>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddressDialog(false)
                setEditingAddress(null)
                setError(null)
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#8B2131] hover:bg-[#6d1926]"
              onClick={isEditing ? handleEditAddress : handleAddAddress}
              disabled={!addressData.name.trim()}
            >
              {isEditing ? "Update Address" : "Save Address"}
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
        <DialogContent className="max-w-2xl bg-white">
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
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-[#8B2131] text-lg">{coupon.coupon_code}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Save {formatPrice(coupon.discount)} on orders above {formatPrice(coupon.min_amount)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyCoupon(coupon.coupon_code)}
                          className="text-[#8B2131] hover:text-[#6d1926] hover:bg-[#f8ece9]"
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApplyCouponFromModal(coupon.coupon_code)}
                          className="bg-[#8B2131] hover:bg-[#6d1926]"
                          disabled={couponApplied?.code === coupon.coupon_code}
                        >
                          {couponApplied?.code === coupon.coupon_code ? "Applied" : "Apply"}
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
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
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center text-gray-600 hover:text-[#8B2131] transition-colors mb-4 group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Cart</span>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[#8B2131] mb-2">Secure Checkout</h1>
              <p className="text-gray-600">Complete your purchase with confidence</p>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address Section */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-[#8B2131] text-white rounded-full p-2 mr-3">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <span className="text-xl font-semibold text-[#8B2131]">Shipping Address</span>
                  </div>
                  <Button
                    variant="outline"
                    className="border-[#8B2131] text-[#8B2131] hover:bg-[#8B2131] hover:text-white"
                    onClick={() => navigate('/addaddress')}
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
                              <div className="flex items-center gap-2 mb-2">
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
                                      Office
                                    </>
                                  )}
                                </Badge>
                              </div>
                              <p className="text-gray-600 text-sm mb-1">{address.street}</p>
                              <p className="text-gray-600 text-sm mb-1">
                                {address.city}, {address.state} - {address.pincode}
                              </p>
                              <p className="text-gray-600 text-sm">Phone: {address.phone}</p>

                              <div className="flex items-center gap-3 mt-3">
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

            {/* Payment Method Section */}
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
                      className={`relative border rounded-xl p-4 transition-all duration-200 cursor-pointer ${
                        selectedPayment === "wallet"
                          ? "border-[#8B2131] bg-gradient-to-r from-[#8B2131]/5 to-orange-50 shadow-md"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <RadioGroupItem value="wallet" id="wallet" />
                        <div className="flex-1">
                          <Label htmlFor="wallet" className="font-medium cursor-pointer flex items-center">
                            <Wallet className="h-5 w-5 mr-2 text-[#8B2131]" />
                            Wallet
                          </Label>
                          <p className="text-sm text-gray-500 mt-1">Pay using your wallet balance</p>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`relative border rounded-xl p-4 transition-all duration-200 cursor-pointer ${
                        selectedPayment === "cod"
                          ? "border-[#8B2131] bg-gradient-to-r from-[#8B2131]/5 to-orange-50 shadow-md"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <RadioGroupItem value="cod" id="cod" />
                        <div className="flex-1">
                          <Label htmlFor="cod" className="font-medium cursor-pointer flex items-center">
                            <Truck className="h-5 w-5 mr-2 text-[#8B2131]" />
                            Cash on Delivery
                          </Label>
                          <p className="text-sm text-gray-500 mt-1">Pay when you receive your order</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm sticky top-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-[#8B2131]">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Cart Items */}
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

                {/* Coupon Section */}
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
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    ) : (
                      <Button
                        onClick={handleApplyCoupon}
                        disabled={!couponCode.trim()}
                        className="bg-[#8B2131] hover:bg-[#6d1926]"
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

                {/* Price Breakdown */}
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

                {/* Place Order Button */}
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
                      <span>Places Order {formatPrice(total)}</span>
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </div>
                  )}
                </Button>

                {/* Security Badge */}
                <div className="flex items-center justify-center text-xs text-gray-500 pt-2">
                  <ShieldCheck className="h-4 w-4 mr-1 text-green-600" />
                  <span>Secured by 256-bit SSL encryption</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Dialogs */}
        <AddressDialog />
        <CouponsDialog />
      </div>
    </div>
  )
}


