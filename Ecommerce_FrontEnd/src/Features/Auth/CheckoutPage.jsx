
// import { useState, useEffect } from "react";
// import { useCart } from "@/Context/CartContext";
// import { Link, useNavigate } from "react-router-dom";
// import api from '../../api';

// export default function CheckoutPage() {
//   const { cart, fetchCart, removeFromCart, loading: cartLoading, error: cartError } = useCart();
//   const [loading, setLoading] = useState(true);
//   const [addresses, setAddresses] = useState([]);
//   const [error, setError] = useState(null);
//   const [isPlacingOrder, setIsPlacingOrder] = useState(false);
//   const [couponCode, setCouponCode] = useState("");
//   const [couponError, setCouponError] = useState(null);
//   const [couponApplied, setCouponApplied] = useState(null);
//   const navigate = useNavigate();
//   const BASE_URL = "http://127.0.0.1:8000";

//   // Load Razorpay script once on mount
//   useEffect(() => {
//     const script = document.createElement('script');
//     script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//     script.async = true;
//     document.body.appendChild(script);
//     return () => {
//       document.body.removeChild(script);
//     };
//   }, []);

//   // Fetch cart if not loaded
//   useEffect(() => {
//     if (!cart) {
//       fetchCart();
//     }
//   }, [cart, fetchCart]);

//   // Fetch addresses on mount
//   useEffect(() => {
//     fetchAddress();
//   }, []);

//   // Set default address when addresses change
//   useEffect(() => {
//     if (addresses.length > 0 && !selectedAddress) {
//       setSelectedAddress(addresses.find(addr => addr.isDefault)?.id || addresses[0].id);
//     }
//   }, [addresses]);

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
//       setError(err.message || "Failed to fetch addresses");
//       setAddresses([]);
//     } finally {
//       setLoading(false);
//     }
//   };

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

//   // Map cart items using backend data
//   const cartItems = cart?.items?.map(item => ({
//     id: item.id,
//     name: item.product.name,
//     price: item.variant.total_price, // Use backend price
//     quantity: item.quantity,
//     tax: item.tax_amount, // Use backend tax_amount
//     discount: item.discount_amount, // Use backend discount_amount
//     final_price: item.final_price, // Use backend final_price
//     image: item.primary_image,
//   })) || [];

//   // Use backend cart totals directly
//   const subtotal = cart?.final_subtotal || 0;
//   const totalTax = cart?.final_tax || 0;
//   const totalDiscount = (cart?.final_discount || 0) + (couponApplied?.discount || 0);
//   const total = cart?.final_total - (couponApplied?.discount || 0) || 0;
//   const shipping=cart?.shipping || 0;

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
//     } catch (err) {
//       setCouponError(err.response?.data?.error || "Invalid coupon code");
//       setCouponApplied(null);
//     }
//   };

//   const handleAddAddress = async () => {
//     const errors = validateAddress(newAddress);
//     if (errors.length > 0) {
//       setError(errors.join(", "));
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
//       setError(err.response?.data?.message || "Failed to add address");
//     }
//   };

//   const handleEditAddress = async () => {
//     const errors = validateAddress(editingAddress);
//     if (errors.length > 0) {
//       setError(errors.join(", "));
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
//       setError(err.response?.data?.message || "Failed to update address");
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
//       setError(err.response?.data?.message || "Failed to remove address");
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
//       setError(err.response?.data?.message || "Failed to set default address");
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
//       setError("Please select a shipping address");
//       return;
//     }

//     setIsPlacingOrder(true);
//     try {
//       if (selectedPayment === "card") {
//         if (!window.Razorpay) {
//           setError("Payment service is unavailable. Please try again later.");
//           return;
//         }
//         const response = await api.post('cartapp/orders/razorpay/create/', {
//           address_id: selectedAddress,
//           payment_method: 'card',
//           coupon_code: couponApplied?.code || null,
//         });
//         const { order_id, amount, currency, key, order } = response.data;

//         const options = {
//           key,
//           amount,
//           currency,
//           name: "Vaishali Gold",
//           description: "Order Payment",
//           order_id,
//           handler: async function (response) {
//             try {
//               const verifyResponse = await api.post('cartapp/orders/razorpay/verify/', {
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_signature: response.razorpay_signature,
//                 order_id: order.id
//               });
//               navigate(`/order-details/${order.id}`);
//             } catch (error) {
//               setError("Payment verification failed. Please try again.");
//             }
//           },
//           prefill: {
//             name: `${cart.user?.first_name || ''} ${cart.user?.last_name || ''}`.trim(),
//             email: cart.user?.email || '',
//             contact: cart.user?.phone_number || ''
//           },
//           theme: {
//             color: "#8B2131"
//           },
//           modal: {
//             ondismiss: () => {
//               setIsPlacingOrder(false);
//             }
//           }
//         };

//         const rzp = new window.Razorpay(options);
//         rzp.on('payment.failed', () => {
//           setError("Payment failed. Please try again.");
//           setIsPlacingOrder(false);
//         });
//         rzp.open();
//       } else {
//         const response = await api.post('cartapp/orders/create/', {
//           address_id: selectedAddress,
//           payment_method: selectedPayment,
//           coupon_code: couponApplied?.code || null,
//         });
//         navigate(`/order-details/${response.data.order.id}`);
//       }
//     } catch (error) {
//       setError(error.response?.data?.error || "Failed to place order. Please try again.");
//     } finally {
//       if (selectedPayment !== "card") {
//         setIsPlacingOrder(false);
//       }
//     }
//   };

//   // Icon Components (unchanged)
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
//       <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
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
//       <path d="M3 6h18" />
//       <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
//       <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
//     </svg>
//   );

//   const IconCreditCard = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <rect width="20" height="14" x="2" y="5" rx="2" />
//       <line x1="2" x2="22" y1="10" y2="10" />
//     </svg>
//   );

//   const IconWallet = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
//       <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
//       <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
//     </svg>
//   );

//   const IconChevronRight = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="m9 18 6-6-6-6" />
//     </svg>
//   );

//   const IconShieldCheck = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
//       <path d="m9 12 2 2 4-4" />
//     </svg>
//   );

//   const IconTag = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
//       <path d="M7 7h.01" />
//     </svg>
//   );

//   // UI Components
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
//             >
//               {isEditing ? "Update Address" : "Save Address"}
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
//                 onClick={() => 
//                   navigate('/addaddress')
//                 }
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
//                           <IconEdit className="h-4 w-4 mr-1" />
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
//                           <IconTrash className="h-4 w-4 mr-1" />
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
//                   <Label className="font-medium cursor-pointer">Cash on Delivery</Label>
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
//                             <span className="h-5 w-5 mr-1">
//                               <IconTag />
//                             </span>
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
//                 />
//                 <Button
//                   onClick={handleApplyCoupon}
//                   disabled={!couponCode.trim() || couponApplied}
//                   className="px-4 py-2"
//                 >
//                   Apply
//                 </Button>
//               </div>
//               {couponError && <p className="text-red-600 text-xs">{couponError}</p>}
//               {couponApplied && (
//                 <p className="text-green-600 text-xs">
//                   Coupon "{couponApplied.code}" applied! Saved {formatPrice(couponApplied.discount)}
//                 </p>
//               )}
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Subtotal</span>
//                 <span>{formatPrice(subtotal)}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Shipping</span>
//                 <span>+{formatPrice(shipping)}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Tax</span>
//                 <span>{formatPrice(totalTax)}</span>
//               </div>

//               <div className="flex justify-between text-green-600">
//                 <span className="flex items-center">
//                   <span className="h-5 w-5 mr-1">
//                     <IconTag />
//                   </span>
//                   Discount
//                 </span>
//                 <span>-{formatPrice(totalDiscount)}</span>
//               </div>
//               <Separator className="my-2" />
//               <div className="flex justify-between font-semibold text-base">
//                 <span>Total</span>
//                 <span>{formatPrice(total)}</span>
//               </div>
//             </div>
//             <Button
//               className="w-full mt-6 bg-[#8B2131] hover:bg-[#6d1926] text-white py-2 px-4"
//               disabled={addresses.length === 0 || !cart?.items?.length || isPlacingOrder}
//               onClick={handlePlaceOrder}
//             >
//               {isPlacingOrder ? "Processing..." : `Proceed to Pay ${formatPrice(total)}`}
//               <span className="ml-2 h-4 w-4">
//                 <IconChevronRight />
//               </span>
//             </Button>
//             <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
//               <span className="h-4 w-4 mr-1 text-green-600">
//                 <IconShieldCheck />
//               </span>
//               <span>Secure checkout with 256-bit encryption</span>
//             </div>
//           </div>
//         </div>
//       </div>
//       <AddressDialog />
//     </div>
//   );
// }

// import { useState, useEffect } from "react";
// import { useCart } from "@/Context/CartContext";
// import { Link, useNavigate } from "react-router-dom";
// import api from '../../api';

// export default function CheckoutPage() {
//   const { cart, fetchCart, removeFromCart, loading: cartLoading, error: cartError } = useCart();
//   const navigate = useNavigate();
//   const BASE_URL = "http://127.0.0.1:8000";

//   const [loading, setLoading] = useState(true);
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

//   useEffect(() => {
//     const script = document.createElement('script');
//     script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//     script.async = true;
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
//   console.log('Cart data:', cart);
//   if (cart?.coupon && cart?.final_coupon_discount > 0 && cart.coupon.coupon_code) {
//     setCouponApplied({
//       code: cart.coupon.coupon_code,
//       discount: cart.final_coupon_discount,
//     });
//     setCouponCode(cart.coupon.coupon_code);
//     console.log('couponApplied set:', { code: cart.coupon.coupon_code, discount: cart.final_coupon_discount });
//   }
//   else {
//   console.log('Coupon not applied: missing coupon_code or invalid cart data');
//   setCouponApplied(null);
//   setCouponCode("");
// }
// }, [cart]);

// console.log('couponApplied:', couponApplied);
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
//       setError(err.message || "Failed to fetch addresses");
//       setAddresses([]);
//     } finally {
//       setLoading(false);
//     }
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
//   const final_coupon_discount=cart?.final_coupon_discount || 0;


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
//       console.log("apllied",response.data)
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
//       setError(errors.join(", "));
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
//       setError(err.response?.data?.message || "Failed to add address");
//     }
//   };

//   const handleEditAddress = async () => {
//     const errors = validateAddress(editingAddress);
//     if (errors.length > 0) {
//       setError(errors.join(", "));
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
//       setError(err.response?.data?.message || "Failed to update address");
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
//       setError(err.response?.data?.message || "Failed to remove address");
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
//       setError(err.response?.data?.message || "Failed to set default address");
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
//         setError("Please select a shipping address");
//         return;
//     }
//     setIsPlacingOrder(true);
//     try {
//         const couponData = couponApplied && couponApplied.code ? { coupon_code: couponApplied.code } : {};
//         console.log('couponApplied:', couponApplied);
//         console.log('couponData:', couponData);
//         if (selectedPayment === "card") {
//             if (!window.Razorpay) {
//                 setError("Payment service is unavailable. Please try again later.");
//                 return;
//             }
//             const response = await api.post('cartapp/orders/razorpay/create/', {
//                 address_id: selectedAddress,
//                 payment_method: 'card',
//                 ...couponData,
//             });
//             console.log('Razorpay create response:', response.data); // Add this
//             // Rest unchanged
//         } else {
//             const response = await api.post('cartapp/orders/create/', {
//                 address_id: selectedAddress,
//                 payment_method: selectedPayment,
//                 ...couponData,
//             });
//             console.log('Order create response:', response.data); // Add this
//             navigate(`/order-details/${response.data.order.id}`);
//         }
//     } catch (error) {
//         console.error('Place order error details:', error.response?.data, error.message); // Add this
//         setError(error.response?.data?.error || "Failed to place order. Please try again.");
//     } finally {
//         if (selectedPayment !== "card") {
//             setIsPlacingOrder(false);
//         }
//     }
// };
//   // Icon Components
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

//   // UI Components
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

//  return (
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
//                 onClick={() => setShowAddressDialog(true)}
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
//               {couponError && <p className="text-red-600 text-xs">{couponError}</p>}
//               {couponApplied && (
//                 <p className="text-green-600 text-xs">
//                   Coupon "{couponApplied.code}" applied! Saved {formatPrice(couponApplied.discount)}
//                 </p>
//               )}
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Subtotal</span>
//                 <span>{formatPrice(subtotal)}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Shipping</span>
//                 <span>+{formatPrice(shipping)}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Tax</span>
//                 <span>{formatPrice(totalTax)}</span>
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
//               {couponApplied && (
//                 <div className="flex justify-between text-green-600">
//                   <span className="flex items-center">
//                     <span className="h-5 w-5 mr-1"><IconTag /></span>
//                     Coupon Discount
//                   </span>
//                   <span>-{formatPrice(couponApplied.discount)}</span>
//                 </div>
//               )}
//               <Separator className="my-2" />
//               <div className="flex justify-between font-semibold text-base">
//                 <span>Total</span>
//                 <span>{formatPrice(total)}</span>
//               </div>
//             </div>
//             <Button
//               className="w-full mt-6 bg-[#8B2131] hover:bg-[#6d1926] text-white py-2 px-4"
//               disabled={addresses.length === 0 || !cart?.items?.length || isPlacingOrder}
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
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useCart } from "@/Context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import api from '../../api';

export default function CheckoutPage() {
  const { cart, fetchCart, removeFromCart, clearCart , loading: cartLoading, error: cartError } = useCart();
  const navigate = useNavigate();
  const BASE_URL = "http://127.0.0.1:8000";

  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [error, setError] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState(null);
  const [couponApplied, setCouponApplied] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    name: "",
    type: "home",
    street: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    isDefault: false,
  });

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => console.log('Razorpay script loaded');
    script.onerror = () => console.error('Failed to load Razorpay script');
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!cart) {
      fetchCart();
    }
  }, [cart, fetchCart]);

  useEffect(() => {
    console.log('Cart data:', cart);
    if (cart?.coupon && cart?.final_coupon_discount > 0 && cart.coupon.coupon_code) {
      setCouponApplied({
        code: cart.coupon.coupon_code,
        discount: cart.final_coupon_discount,
      });
      setCouponCode(cart.coupon.coupon_code);
      console.log('couponApplied set:', { code: cart.coupon.coupon_code, discount: cart.final_coupon_discount });
    } else {
      console.log('Coupon not applied: missing coupon_code or invalid cart data');
      setCouponApplied(null);
      setCouponCode("");
    }
  }, [cart]);

  console.log('couponApplied:', couponApplied);

  useEffect(() => {
    fetchAddress();
  }, []);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      setSelectedAddress(addresses.find(addr => addr.isDefault)?.id || addresses[0].id);
    }
  }, [addresses, selectedAddress]);

  const fetchAddress = async () => {
    setLoading(true);
    try {
      const response = await api.get('address/');
      const mappedAddresses = response.data.map(addr => ({
        id: addr.id,
        name: addr.name,
        type: addr.address_type,
        street: `${addr.house_no || ''}${addr.landmark ? `, ${addr.landmark}` : ''}`.trim(),
        city: addr.city,
        state: addr.state,
        pincode: addr.pin_code,
        phone: addr.mobile_number,
        isDefault: addr.isDefault || false,
      }));
      setAddresses(mappedAddresses);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch addresses");
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  const cartItems = cart?.items?.map(item => ({
    id: item.id,
    name: item.product.name,
    price: item.variant.total_price,
    quantity: item.quantity,
    tax: item.tax_amount,
    discount: item.discount_amount,
    final_price: item.final_price,
    image: item.primary_image,
  })) || [];

  const subtotal = cart?.final_subtotal || 0;
  const totalTax = cart?.final_tax || 0;
  const totalDiscount = cart?.final_discount || 0;
  const total = cart?.final_total || 0;
  const shipping = cart?.shipping || 0;
  const final_coupon_discount = cart?.final_coupon_discount || 0;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const validateAddress = (address) => {
    const errors = [];
    if (!address.name.trim()) errors.push("Full name is required");
    if (!address.street.trim()) errors.push("Street address is required");
    if (!address.city.trim()) errors.push("City is required");
    if (!address.state.trim()) errors.push("State is required");
    if (!address.pincode || !/^\d{6}$/.test(address.pincode)) errors.push("Valid 6-digit PIN code is required");
    if (!address.phone || !/^\d{10}$/.test(address.phone)) errors.push("Valid 10-digit phone number is required");
    return errors;
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }
    try {
      const response = await api.post('cartapp/apply-coupon/', { code: couponCode.trim() });
      setCouponApplied({ code: couponCode, discount: response.data.discount });
      setCouponError(null);
      setError(null);
      await fetchCart();
      console.log("applied", response.data);
    } catch (err) {
      setCouponError(err.response?.data?.error || "Invalid coupon code");
      setCouponApplied(null);
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      await api.post('cartapp/remove-coupon/');
      setCouponApplied(null);
      setCouponCode("");
      setCouponError(null);
      fetchCart();
    } catch (err) {
      setCouponError("Failed to remove coupon");
    }
  };

  const handleAddAddress = async () => {
    const errors = validateAddress(newAddress);
    if (errors.length > 0) {
      setError(errors.join(", "));
      return;
    }
    try {
      const [house_no = '', landmark = ''] = newAddress.street.split(',').map(s => s.trim());
      const response = await api.post('address/', {
        name: newAddress.name.trim(),
        house_no,
        address_type: newAddress.type,
        city: newAddress.city.trim(),
        state: newAddress.state.trim(),
        pin_code: newAddress.pincode,
        mobile_number: newAddress.phone,
        landmark,
        isDefault: newAddress.isDefault,
      });
      const newId = response.data.id;
      const updatedAddresses = newAddress.isDefault
        ? addresses.map(addr => ({ ...addr, isDefault: false }))
        : [...addresses];
      setAddresses([
        ...updatedAddresses,
        {
          ...newAddress,
          id: newId,
          street: `${house_no}${landmark ? `, ${landmark}` : ''}`.trim(),
          isDefault: newAddress.isDefault,
        }
      ]);
      setSelectedAddress(newId);
      setNewAddress({
        name: "",
        type: "home",
        street: "",
        city: "",
        state: "",
        pincode: "",
        phone: "",
        isDefault: false,
      });
      setShowAddressDialog(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add address");
    }
  };

  const handleEditAddress = async () => {
    const errors = validateAddress(editingAddress);
    if (errors.length > 0) {
      setError(errors.join(", "));
      return;
    }
    try {
      const [house_no = '', errs = ''] = editingAddress.street.split(',').map(s => s.trim());
      const response = await api.patch(`address/${editingAddress.id}/`, {
        name: editingAddress.name.trim(),
        house_no,
        address_type: editingAddress.type,
        city: editingAddress.city.trim(),
        state: editingAddress.state.trim(),
        pin_code: editingAddress.pincode,
        mobile_number: editingAddress.phone,
        landmark: errs,
        isDefault: editingAddress.isDefault,
      });
      const updatedAddresses = addresses.map(addr => {
        if (addr.id === editingAddress.id) {
          return {
            ...editingAddress,
            street: `${house_no}${errs ? `, ${errs}` : ''}`.trim(),
          };
        }
        return { ...addr, isDefault: editingAddress.isDefault ? false : addr.isDefault };
      });
      setAddresses(updatedAddresses);
      setEditingAddress(null);
      setShowAddressDialog(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update address");
    }
  };

  const handleRemoveAddress = async (id) => {
    try {
      await api.delete(`address/${id}/`);
      const updatedAddresses = addresses.filter(addr => addr.id !== id);
      if (id === selectedAddress && updatedAddresses.length > 0) {
        setSelectedAddress(updatedAddresses.find(addr => addr.isDefault)?.id || updatedAddresses[0].id);
      } else if (updatedAddresses.length === 0) {
        setSelectedAddress(null);
      }
      setAddresses(updatedAddresses);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove address");
    }
  };

  const setDefaultAddress = async (id) => {
    try {
      await api.patch(`address/${id}/`, { isDefault: true });
      const updatedAddresses = addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === id ? true : false,
      }));
      setAddresses(updatedAddresses);
      setSelectedAddress(id);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to set default address");
      await fetchAddress();
    }
  };

  const startEditAddress = (address) => {
    setEditingAddress({
      ...address,
      street: address.street,
    });
    setShowAddressDialog(true);
  };

  // const handlePlaceOrder = async () => {
  //   if (!selectedAddress) {
  //     setError("Please select a shipping address");
  //     return;
  //   }
  //   setIsPlacingOrder(true);
  //   try {
  //     const couponData = couponApplied && couponApplied.code ? { coupon_code: couponApplied.code } : {};
  //     console.log('couponApplied:', couponApplied);
  //     console.log('couponData:', couponData);

  //     if (selectedPayment === "card") {
  //       if (!window.Razorpay) {
  //         setError("Payment service is unavailable. Please ensure the Razorpay script is loaded.");
  //         console.error("Razorpay SDK not available");
  //         setIsPlacingOrder(false);
  //         return;
  //       }

  //       // Make API call to create Razorpay order
  //       const response = await api.post('cartapp/orders/razorpay/create/', {
  //         address_id: selectedAddress,
  //         payment_method: 'card',
  //         ...couponData,
  //       });
  //       console.log('Razorpay create response:', response.data);

  //       // Validate response
  //       if (!response.data.order_id || !response.data.amount) {
  //         throw new Error("Invalid Razorpay response: missing order_id or amount");
  //       }
  //       const { order_id: razorpayOrderId, amount, currency, key, order } = response.data;
        
  //       const options = {
  //         key: key,
  //         amount: amount, 
  //         currency: currency,
  //         name: 'Vishali Gold',
  //        description: `Payment for Order #${order.order_number}`,
  //         image: 'https://your-logo-url.com/logo.png', 
  //         order_id: razorpayOrderId, 
  //         handler: async function (response) {
  //           try {
  //             const verifyResponse = await api.post('cartapp/orders/razorpay/verify/', {
  //               razorpay_order_id: response.razorpay_order_id,
  //               razorpay_payment_id: response.razorpay_payment_id,
  //               razorpay_signature: response.razorpay_signature,
  //             });
  //             console.log('Payment verification response:', verifyResponse.data);
  //             navigate(`/order-details/${verifyResponse.data.order.id}`);
  //           } catch (err) {
  //             console.error('Payment verification error:', err.response?.data, err.message);
  //             setError('Payment verification failed. Please contact support.');
  //             navigate(`/user/view-order-details/${verifyResponse.data.order.id}`);
             
  //           } finally {
  //             setIsPlacingOrder(false);
  //           }
  //         },
  //         prefill: {
  //           name: addresses.find(addr => addr.id === selectedAddress)?.name || '',
  //           email: 'customer@example.com', // Replace with actual user email if available
  //           contact: addresses.find(addr => addr.id === selectedAddress)?.phone || '',
  //         },
  //         notes: {
  //           address_id: selectedAddress,
  //           order_id: response.data.order.id, // Include order_id for reference
  //         },
  //         theme: {
  //           color: '#8B2131',
  //         },
  //         modal: {
  //           ondismiss: async () => {
  //             setIsPlacingOrder(false);
  //             setError('Payment cancelled by user.');
  //             try {
  //               await api.post('cartapp/orders/cancel/', { order_id: response.data.order.id });
  //               console.log('Pending order cancelled');
  //             } catch (err) {
  //               console.error('Failed to cancel order:', err);
  //             }
  //           },
  //         },
  //       };

  //       try {
  //         const rzp = new window.Razorpay(options);
  //         rzp.on('payment.failed', async function (response) {
  //           console.error('Razorpay payment failed:', response.error);
  //           setError(`Payment failed: ${response.error.description}`);
  //           setIsPlacingOrder(false);
  //           try {
  //             await api.post('cartapp/orders/cancel/', { order_id: response.data.order.id });
  //             console.log('Pending order cancelled');
  //           } catch (err) {
  //             console.error('Failed to cancel order:', err);
  //           }
  //         });
  //         rzp.open();
  //       } catch (err) {
  //         console.error('Razorpay modal error:', err);
  //         setError('Failed to initialize payment. Please try again.');
  //         setIsPlacingOrder(false);
  //         // Cancel the pending order
  //         try {
  //           await api.post('cartapp/orders/cancel/', { order_id: response.data.order.id });
  //           console.log('Pending order cancelled');
  //         } catch (cancelErr) {
  //           console.error('Failed to cancel order:', cancelErr);
  //         }
  //       }
  //     } else {
  //       const response = await api.post('cartapp/orders/create/', {
  //         address_id: selectedAddress,
  //         payment_method: selectedPayment,
  //         ...couponData,
  //       });
  //       console.log('Order create response:', response.data);
  //       navigate(`/order-details/${response.data.order.id}`);
  //       setIsPlacingOrder(false);
  //     }
  //   } catch (error) {
  //     console.error('Place order error details:', error.response?.data, error.message);
  //     setError(error.response?.data?.error || error.message || "Failed to place order. Please try again.");
  //     setIsPlacingOrder(false);
  //   }
  // };



  const handlePlaceOrder = async () => {
  if (!selectedAddress) {
    setError("Please select a shipping address");
    return;
  }
  setIsPlacingOrder(true);
  try {
    const couponData = couponApplied && couponApplied.code ? { coupon_code: couponApplied.code } : {};
    console.log('couponApplied:', couponApplied);
    console.log('couponData:', couponData);

    if (selectedPayment === "card") {
      if (!window.Razorpay) {
        setError("Payment service is unavailable. Please ensure the Razorpay script is loaded.");
        console.error("Razorpay SDK not available");
        setIsPlacingOrder(false);
        return;
      }

      const response = await api.post('cartapp/orders/razorpay/create/', {
        address_id: selectedAddress,
        payment_method: 'card',
        ...couponData,
      });
      console.log('Razorpay create response:', response.data);

      if (!response.data.order_id || !response.data.amount) {
        throw new Error("Invalid Razorpay response: missing order_id or amount");
      }
      const { order_id: razorpayOrderId, amount, currency, key, order } = response.data;

      const options = {
        key: key,
        amount: amount,
        currency: currency,
        name: 'Vishali Gold',
        description: `Payment for Order #${order.order_number}`,
        image: 'https://your-logo-url.com/logo.png',
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            const verifyResponse = await api.post('cartapp/orders/razorpay/verify/', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            console.log('Payment verification response:', verifyResponse.data);
            if (verifyResponse.data.cart) {
              setCart(verifyResponse.data.cart);
            } else {
              await clearCart();
            }
            navigate(`/order-details/${verifyResponse.data.order.id}`);
          } catch (err) {
            console.error('Payment verification error:', err.response?.data, err.message);
            setError('Payment verification failed. Please contact support.');
            navigate(`/user/view-order-details/${verifyResponse.data.order.id}`);
          } finally {
            setIsPlacingOrder(false);
          }
        },
        prefill: {
          name: addresses.find(addr => addr.id === selectedAddress)?.name || '',
          email: 'customer@example.com',
          contact: addresses.find(addr => addr.id === selectedAddress)?.phone || '',
        },
        notes: {
          address_id: selectedAddress,
          order_id: response.data.order.id,
        },
        theme: {
          color: '#8B2131',
        },
        modal: {
          ondismiss: async () => {
            setIsPlacingOrder(false);
            setError('Payment cancelled by user.');
            try {
              await api.post('cartapp/orders/cancel/', { order_id: response.data.order.id });
              console.log('Pending order cancelled');
            } catch (err) {
              console.error('Failed to cancel order:', err);
            }
          },
        },
      };

      try {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', async function (response) {
          console.error('Razorpay payment failed:', response.error);
          setError(`Payment failed: ${response.error.description}`);
          setIsPlacingOrder(false);
          try {
            await api.post('cartapp/orders/cancel/', { order_id: response.data.order.id });
            console.log('Pending order cancelled');
          } catch (err) {
            console.error('Failed to cancel order:', err);
          }
        });
        rzp.open();
      } catch (err) {
        console.error('Razorpay modal error:', err);
        setError('Failed to initialize payment. Please try again.');
        setIsPlacingOrder(false);
        try {
          await api.post('cartapp/orders/cancel/', { order_id: response.data.order.id });
          console.log('Pending order cancelled');
        } catch (cancelErr) {
          console.error('Failed to cancel order:', cancelErr);
        }
      }
    } else {
      const response = await api.post('cartapp/orders/create/', {
        address_id: selectedAddress,
        payment_method: selectedPayment,
        ...couponData,
      });
      console.log('Order create response:', response.data);
      if (response.data.cart) {
        setCart(response.data.cart);
      } else {
        await clearCart();
      }
      navigate(`/order-details/${response.data.order.id}`);
      setIsPlacingOrder(false);
    }
  } catch (error) {
    console.error('Place order error details:', error.response?.data, error.message);
    setError(error.response?.data?.error || error.message || "Failed to place order. Please try again.");
    setIsPlacingOrder(false);
  }
};

  // Icon Components
  const IconArrowLeft = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );

  const IconMapPin = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );

  const IconPlus = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );

  const IconHome = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 81 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );

  const IconBuilding = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M8 10h.01" />
      <path d="M16 10h.01" />
      <path d="M8 14h.01" />
      <path d="M16 14h.01" />
    </svg>
  );

  const IconEdit = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );

  const IconTrash = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 Introducing 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );

  const IconTag = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );

  const IconChevronRight = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );

  const IconShieldCheck = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );

  const IconCreditCard = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );

  const IconWallet = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
      <path d="M4 8v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4" />
      <path d="M18 12h-4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1z" />
    </svg>
  );

  // UI Components
  const Button = ({ children, className = "", onClick, variant = "default", disabled = false }) => {
    const baseClass =
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
    let variantClass = "bg-[#8B2131] text-white hover:bg-[#6d1926]";
    if (variant === "outline") {
      variantClass = "border border-input bg-background hover:bg-accent hover:text-accent-foreground";
    } else if (variant === "secondary") {
      variantClass = "bg-secondary text-secondary-foreground hover:bg-secondary/80";
    } else if (variant === "ghost") {
      variantClass = "hover:bg-accent hover:text-accent-foreground";
    }
    return (
      <button className={`${baseClass} ${variantClass} ${className}`} onClick={onClick} disabled={disabled}>
        {children}
      </button>
    );
  };

  const Label = ({ children, htmlFor, className = "" }) => (
    <label
      htmlFor={htmlFor}
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    >
      {children}
    </label>
  );

  const Input = ({ id, value, onChange, placeholder, className = "" }) => (
    <input
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    />
  );

  const Textarea = ({ id, value, onChange, placeholder, className = "" }) => (
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    />
  );

  const Separator = ({ className = "" }) => <div className={`h-[1px] w-full bg-border ${className}`}></div>;

  const AddressDialog = () => {
    if (!showAddressDialog) return null;

    const isEditing = !!editingAddress;
    const addressData = isEditing ? editingAddress : newAddress;
    const setAddressData = isEditing
      ? (data) => setEditingAddress({ ...editingAddress, ...data })
      : (data) => setNewAddress({ ...newAddress, ...data });

    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">{isEditing ? "Edit Address" : "Add New Address"}</h2>
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          </div>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={addressData.name}
                  onChange={(e) => setAddressData({ name: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="md:col-span-2">
                <Label>Address Type</Label>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="home"
                      checked={addressData.type === "home"}
                      onChange={() => setAddressData({ type: "home" })}
                      className="h-4 w-4 text-[#8B2131] focus:ring-[#8B2131]"
                    />
                    <Label htmlFor="home" className="cursor-pointer">Home</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="office"
                      checked={addressData.type === "office"}
                      onChange={() => setAddressData({ type: "office" })}
                      className="h-4 w-4 text-[#8B2131] focus:ring-[#8B2131]"
                    />
                    <Label htmlFor="office" className="cursor-pointer">Office</Label>
                  </div>
                </div>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="street">Street Address</Label>
                <Textarea
                  id="street"
                  value={addressData.street}
                  onChange={(e) => setAddressData({ street: e.target.value })}
                  placeholder="Enter your street address (e.g., House No, Landmark)"
                  className="resize-none"
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={addressData.city}
                  onChange={(e) => setAddressData({ city: e.target.value })}
                  placeholder="City"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={addressData.state}
                  onChange={(e) => setAddressData({ state: e.target.value })}
                  placeholder="State"
                />
              </div>
              <div>
                <Label htmlFor="pincode">PIN Code</Label>
                <Input
                  id="pincode"
                  value={addressData.pincode}
                  onChange={(e) => setAddressData({ pincode: e.target.value })}
                  placeholder="PIN Code"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={addressData.phone}
                  onChange={(e) => setAddressData({ phone: e.target.value })}
                  placeholder="Phone Number"
                />
              </div>
              <div className="md:col-span-2 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="default"
                  checked={addressData.isDefault}
                  onChange={(e) => setAddressData({ isDefault: e.target.checked })}
                  className="h-4 w-4 text-[#8B2131] focus:ring-[#8B2131]"
                />
                <Label htmlFor="default" className="cursor-pointer">Set as default address</Label>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddressDialog(false);
                setEditingAddress(null);
                setError(null);
              }}
              className="px-4 py-2"
            >
              Cancel
            </Button>
            <Button
              className="bg-[#8B2131] hover:bg-[#6d1926] px-4 py-2 text-white"
              onClick={isEditing ? handleEditAddress : handleAddAddress}
              disabled={isEditing ? !editingAddress : !newAddress.name}
            >
              {isEditing ? "Update Address" : "Save Address"}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link to='/cart' className="flex items-center text-gray-600 hover:text-[#8B2131] transition-colors">
            <span className="h-4 w-4 mr-2"><IconArrowLeft /></span>
            <span>Back to Cart</span>
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-[#7a2828]">Checkout</h1>
        <p className="text-gray-500 mt-1">Complete your purchase securely</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#f8ece9] rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center">
                <span className="h-5 w-5 mr-2 text-[#8B2131]"><IconMapPin /></span>
                Shipping Address
              </h2>
              <Button
                variant="outline"
                className="flex items-center gap-1 bg-[#7a2828] border-[#8B2131] text-white hover:bg-[#f8ece9] hover:text-[#8B2131] px-3 py-2"
                onClick={() => setShowAddressDialog(true)}
                disabled={showAddressDialog}
              >
                <span className="h-5 w-5 mr-2"><IconPlus /></span>
                Add New Address
              </Button>
            </div>
            <div className="space-y-4">
              {(error || cartError) && <p className="text-red-600 text-sm">{error || cartError}</p>}
              {loading || cartLoading ? (
                <p>Loading...</p>
              ) : addresses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No addresses found. Please add a new address.</p>
                </div>
              ) : (
                addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`relative flex border rounded-lg p-4 transition-all duration-200 ${
                      selectedAddress === address.id
                        ? "border-[#8B2131] bg-[#f8ece9]/30"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedAddress(address.id)}
                  >
                    <div className="absolute top-5 left-4">
                      <input
                        type="radio"
                        checked={selectedAddress === address.id}
                        onChange={() => setSelectedAddress(address.id)}
                        className="h-4 w-4 text-[#8B2131] focus:ring-[#8B2131]"
                      />
                    </div>
                    <div className="ml-8 flex-1">
                      <div className="flex items-center mb-1">
                        <Label className="font-medium cursor-pointer">{address.name}</Label>
                        {address.isDefault && (
                          <span className="ml-2 text-xs bg-[#8B2131]/10 text-[#8B2131] px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                        <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center">
                          {address.type === "home" ? (
                            <><span className="h-4 w-4 mr-1"><IconHome /></span>Home</>
                          ) : (
                            <><span className="h-4 w-4 mr-1"><IconBuilding /></span>Office</>
                          )}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{address.street}</p>
                      <p className="text-sm text-gray-600 mb-1">{address.city}, {address.state} -justification - {address.pincode}</p>
                      <p className="text-sm text-gray-600">Phone: {address.phone}</p>
                      <div className="flex mt-3 space-x-3 items-center">
                        <Button
                          variant="ghost"
                          className="text-[#8B2131] hover:text-[#6d1926]"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditAddress(address);
                          }}
                        >
                          <span className="h-4 w-4 mr-1"><IconEdit /></span>
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveAddress(address.id);
                          }}
                        >
                          <span className="h-4 w-4 mr-1"><IconTrash /></span>
                          Delete
                        </Button>
                        {!address.isDefault && (
                          <Button
                            variant="ghost"
                            className="text-green-600 hover:text-green-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDefaultAddress(address.id);
                            }}
                          >
                            Set as Default
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold flex items-center mb-6">
              <span className="h-5 w-5 mr-2 text-[#8B2131]"><IconCreditCard /></span>
              Payment Method
            </h2>
            <div className="space-y-4">
              <div
                className={`relative flex border rounded-lg p-4 transition-all duration-200 ${
                  selectedPayment === "card"
                    ? "border-[#8B2131] bg-[#f8ece9]/30"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => setSelectedPayment("card")}
              >
                <div className="absolute top-5 left-4">
                  <input
                    type="radio"
                    checked={selectedPayment === "card"}
                    onChange={() => setSelectedPayment("card")}
                    className="h-4 w-4 text-[#8B2131] focus:ring-[#8B2131]"
                  />
                </div>
                <div className="ml-8">
                  <Label className="font-medium cursor-pointer flex items-center">
                    <span className="h-5 w-5 mr-2"><IconCreditCard /></span>
                    Credit/Debit Card
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">Pay securely with your card via Razorpay</p>
                </div>
              </div>
              <div
                className={`relative flex border rounded-lg p-4 transition-all duration-200 ${
                  selectedPayment === "wallet"
                    ? "border-[#8B2131] bg-[#f8ece9]/30"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => setSelectedPayment("wallet")}
              >
                <div className="absolute top-5 left-4">
                  <input
                    type="radio"
                    checked={selectedPayment === "wallet"}
                    onChange={() => setSelectedPayment("wallet")}
                    className="h-4 w-4 text-[#8B2131] focus:ring-[#8B2131]"
                  />
                </div>
                <div className="ml-8">
                  <Label className="font-medium cursor-pointer flex items-center">
                    <span className="h-5 w-5 mr-2"><IconWallet /></span>
                    Wallet
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">Pay using your wallet balance</p>
                </div>
              </div>
              <div
                className={`relative flex border rounded-lg p-4 transition-all duration-200 ${
                  selectedPayment === "cod"
                    ? "border-[#8B2131] bg-[#f8ece9]/30"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => setSelectedPayment("cod")}
              >
                <div className="absolute top-5 left-4">
                  <input
                    type="radio"
                    checked={selectedPayment === "cod"}
                    onChange={() => setSelectedPayment("cod")}
                    className="h-4 w-4 text-[#8B2131] focus:ring-[#8B2131]"
                  />
                </div>
                <div className="ml-8">
                  <Label className="font-medium cursor-pointer flex items-center">
                    <span className="h-5 w-5 mr-2"><IconCreditCard /></span>
                    Cash on Delivery
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">Pay when you receive your order</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-8">
          <div className="bg-[#f8ece9] rounded-xl shadow-sm border p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            <div className="space-y-6 mb-6">
              {cart?.items?.length > 0 ? (
                cart.items.map((item) => (
                  <div key={item.id} className="space-y-3">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                        <img
                          src={item.primary_image ? `${BASE_URL}${item.primary_image}` : "/placeholder.svg"}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-[#7a2828]">{item.product.name}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{formatPrice(item.variant.total_price)}</p>
                        <p className="text-xs text-gray-500 mt-1">Quantity: {item.quantity}</p>
                        <p className="text-xs text-gray-500 mt-1">Item Total</p>
                        <p className="text-sm font-semibold mt-2">{formatPrice(item.final_price)}</p>
                      </div>
                    </div>
                    <div className="pl-24 space-y-1">
                      {item.discount_amount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-green-600 flex items-center">
                            <span className="h-5 w-5 mr-1"><IconTag /></span>
                            Discount
                          </span>
                          <span className="text-green-600">-{formatPrice(item.discount_amount)}</span>
                        </div>
                      )}
                      {item.tax_amount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Tax</span>
                          <span>{formatPrice(item.tax_amount)}</span>
                        </div>
                      )}
                    </div>
                    <Separator />
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Your cart is empty. <Link to="/cart" className="text-[#8B2131] hover:underline">Go to cart</Link></p>
                </div>
              )}
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex gap-2">
                <Input
                  id="coupon"
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
                    className="px-4 py-2 text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                ) : (
                  <Button
                    onClick={handleApplyCoupon}
                    disabled={!couponCode.trim() || couponApplied}
                    className="px-4 py-2"
                  >
                    Apply
                  </Button>
                )}
              </div>
              {couponError && <p className="text-red-600 text-xs">{couponError}</p>}
              {couponApplied && (
                <p className="text-green-600 text-xs">
                  Coupon "{couponApplied.code}" applied! Saved {formatPrice(couponApplied.discount)}
                </p>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Item Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              
              {totalDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center">
                    <span className="h-5 w-5 mr-1"><IconTag /></span>
                    Discount
                  </span>
                  <span>-{formatPrice(totalDiscount)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>{formatPrice(totalTax)}</span>
              </div>
              {couponApplied && (
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center">
                    <span className="h-5 w-5 mr-1"><IconTag /></span>
                    Coupon Discount
                  </span>

                  <span>-{formatPrice(couponApplied.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>{formatPrice(shipping)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <Button
              className="w-full mt-6 bg-[#8B2131] hover:bg-[#6d1926] text-white py-2 px-4"
              disabled={addresses.length === 0 || !cart?.items?.length || isPlacingOrder}
              onClick={handlePlaceOrder}
            >
              {isPlacingOrder ? "Processing..." : `Proceed to Pay ${formatPrice(total)}`}
              <span className="ml-2 h-4 w-4"><IconChevronRight /></span>
            </Button>
            <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
              <span className="h-4 w-4 mr-1 text-green-600"><IconShieldCheck /></span>
              <span>Secure checkout with 256-bit encryption</span>
            </div>
          </div>
        </div>
      </div>
      <AddressDialog />
    </div>
  );
}