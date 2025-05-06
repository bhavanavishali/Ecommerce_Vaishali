
// "use client";

// import { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Pencil, Trash2 } from "lucide-react";
// import { format, parse, isValid } from "date-fns";

// import api from "../../api";

// export default function CouponManagement() {
//   const [coupons, setCoupons] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [open, setOpen] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({
//     id: null,
//     coupon_name: "",
//     coupon_code: "",
//     discount: "",
//     valid_from: new Date(), // Initialize with valid Date
//     valid_to: new Date(), // Initialize with valid Date
//     max_uses: "",
//     used_count: 0,
//     min_amount: "",
//     is_active: true,
//     min_offer_amount:"",
//   });
  

//   useEffect(() => {
//     fetchCoupons();
//   }, []);

//   const fetchCoupons = async () => {
//     setLoading(true);
//     try {
//       const response = await api.get("offer/coupons/");
//       setCoupons(response.data);
//       setError(null);
//     } catch (err) {
//       setError(err.message || "Failed to fetch coupons");
//       setCoupons([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleCheckboxChange = (checked) => {
//     setFormData({
//       ...formData,
//       is_active: checked,
//     });
//   };

//   const handleValidFromChange = (date) => {
//     if (!date || !isValid(date)) {
//       setError("Invalid start date selected");
//       return;
//     }
//     setFormData((prev) => ({
//       ...prev,
//       valid_from: date,
//       // Ensure valid_to is not before valid_from
//       valid_to: prev.valid_to < date ? date : prev.valid_to,
//     }));
//   };

//   const handleValidToChange = (date) => {
//     console.log("wrking calendar");
//     if (!date || !isValid(date)) {
//       setError("Invalid expiry date selected");
//       return;
//     }
//     setFormData((prev) => ({
//       ...prev,
//       valid_to: date,
//     }));
//   };

//   const resetForm = () => {
//     setFormData({
//       id: null,
//       coupon_name: "",
//       coupon_code: "",
//       discount: "",
//       valid_from: new Date(),
//       valid_to: new Date(),
//       max_uses: "",
//       used_count: 0,
//       min_amount: "",
//       is_active: true,
//       min_offer_amount:"",
//     });
//     setIsEditing(false);
//     setError(null);
//   };

//   const handleCreateCoupon = async (e) => {
//     e.preventDefault();
//     try {
//       const dataToSubmit = {
//         ...formData,
//         valid_from: format(formData.valid_from, "yyyy-MM-dd"),
//         valid_to: format(formData.valid_to, "yyyy-MM-dd"),
//       };
//       console.log("Creating coupon with data:", dataToSubmit); // Debug
//       const response = await api.post("offer/coupons/", dataToSubmit);
//       setCoupons([...coupons, response.data]);
//       resetForm();
//       setOpen(false);
//     } catch (err) {
//       setError(err.response?.data?.detail || "Failed to create coupon");
//     }
//   };

//   const handleUpdateCoupon = async (e) => {
//     e.preventDefault();
//     try {
//       const dataToSubmit = {
//         ...formData,
//         valid_from: format(formData.valid_from, "yyyy-MM-dd"),
//         valid_to: format(formData.valid_to, "yyyy-MM-dd"),
//       };
//       console.log("Updating coupon with data:", dataToSubmit); // Debug
//       const response = await api.patch(
//         `offer/coupons/${formData.id}/`,
//         dataToSubmit
//       );
//       setCoupons(
//         coupons.map((coupon) =>
//           coupon.id === formData.id ? response.data : coupon
//         )
//       );
//       resetForm();
//       setOpen(false);
//     } catch (err) {
//       setError(err.response?.data?.detail || "Failed to update coupon");
//     }
//   };

//   const handleDeleteCoupon = async (id) => {
//     if (window.confirm("Are you sure you want to delete this coupon?")) {
//       try {
//         await api.delete(`offer/coupons/${id}/`);
//         setCoupons(coupons.filter((coupon) => coupon.id !== id));
//       } catch (err) {
//         setError(err.message || "Failed to delete coupon");
//       }
//     }
//   };

//   const handleEditCoupon = (coupon) => {
//     try {
//       // Parse YYYY-MM-DD strings into Date objects
//       const validFrom = coupon.valid_from
//         ? parse(coupon.valid_from, "yyyy-MM-dd", new Date())
//         : new Date();
//       const validTo = coupon.valid_to
//         ? parse(coupon.valid_to, "yyyy-MM-dd", new Date())
//         : new Date();

//       if (!isValid(validFrom) || !isValid(validTo)) {
//         throw new Error("Invalid date format from API");
//       }

//       setFormData({
//         ...coupon,
//         valid_from: validFrom,
//         valid_to: validTo,
//       });
//       setIsEditing(true);
//       setOpen(true);
//     } catch (error) {
//       console.error("Error processing dates:", error);
//       setError("Failed to load coupon dates. Please try again.");
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!isValid(formData.valid_from) || !isValid(formData.valid_to)) {
//       setError("Please select valid dates");
//       return;
//     }
//     if (formData.valid_from > formData.valid_to) {
//       setError("Expiry date must be after start date");
//       return;
//     }
//     isEditing ? handleUpdateCoupon(e) : handleCreateCoupon(e);
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Coupon Management</h1>
//         <Dialog
//           open={open}
//           onOpenChange={(isOpen) => {
//             setOpen(isOpen);
//             if (!isOpen) resetForm();
//           }}
//         >
//           <DialogTrigger asChild>
//             <Button className="bg-[#7a2828] hover:bg-red-600 text-white">
//               Create Coupon
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="bg-white sm:max-w-[550px]">
//             <DialogHeader>
//               <DialogTitle className="text-xl font-semibold text-gray-800">
//                 {isEditing ? "Edit Coupon" : "Create Coupon"}
//                 <div className="h-1 w-12 bg-[#7a2828] mt-1"></div>
//               </DialogTitle>
//             </DialogHeader>
//             <form onSubmit={handleSubmit} className="mt-4">
//   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//     <div className="space-y-2">
//       <label
//         htmlFor="coupon_name"
//         className="text-sm font-medium text-gray-700"
//       >
//         Coupon name*
//       </label>
//       <Input
//         id="coupon_name"
//         name="coupon_name"
//         value={formData.coupon_name}
//         onChange={handleInputChange}
//         required
//         className="w-full"
//       />
//     </div>

//     <div className="space-y-2">
//       <label
//         htmlFor="coupon_code"
//         className="text-sm font-medium text-gray-700"
//       >
//         Coupon code*
//       </label>
//       <Input
//         id="coupon_code"
//         name="coupon_code"
//         value={formData.coupon_code}
//         onChange={handleInputChange}
//         required
//         className="w-full"
//       />
//     </div>

//     <div className="space-y-2">
//       <label
//         htmlFor="min_amount"
//         className="text-sm font-medium text-gray-700"
//       >
//         Minimum purchase amount*
//       </label>
//       <Input
//         id="min_amount"
//         name="min_amount"
//         type="number"
//         value={formData.min_amount}
//         onChange={handleInputChange}
//         required
//         className="w-full"
//       />
//     </div>

//     <div className="space-y-2">
//       <label
//         htmlFor="discount"
//         className="text-sm font-medium text-gray-700"
//       >
//         Discount Amount*
//       </label>
//       <Input
//         id="discount"
//         name="discount"
//         type="number"
//         value={formData.discount}
//         onChange={handleInputChange}
//         required
//         className="w-full"
//       />
//     </div>

//     <div className="space-y-2">
//       <label
//         htmlFor="max_uses"
//         className="text-sm font-medium text-gray-700"
//       >
//         Maximum usage*
//       </label>
//       <Input
//         id="max_uses"
//         name="max_uses"
//         type="number"
//         value={formData.max_uses}
//         onChange={handleInputChange}
//         required
//         className="w-full"
//         placeholder="0"
//       />
//     </div>

//     <div className="space-y-2">
//       <label
//         htmlFor="min_offer_amount"
//         className="text-sm font-medium text-gray-700"
//       >
//         Minimum offer amount*
//       </label>
//       <Input
//         id="min_offer_amount"
//         name="min_offer_amount"
//         type="number"
//         value={formData.min_offer_amount}
//         onChange={handleInputChange}
//         required
//         className="w-full"
//       />
//     </div>

//     <div className="space-y-2">
//       <label
//         htmlFor="valid_from"
//         className="text-sm font-medium text-gray-700"
//       >
//         Valid from*
//       </label>
//       <Input
//         id="valid_from"
//         name="valid_from"
//         type="date"
//         value={
//           isValid(formData.valid_from)
//             ? format(formData.valid_from, "yyyy-MM-dd")
//             : ""
//         }
//         onChange={(e) => {
//           const date = e.target.value
//             ? parse(e.target.value, "yyyy-MM-dd", new Date())
//             : null;
//           if (date && isValid(date)) {
//             handleValidFromChange(date);
//           } else {
//             setError("Invalid start date selected");
//           }
//         }}
//         required
//         className="w-full"
//         min={format(new Date(), "yyyy-MM-dd")}
//       />
//     </div>

//     <div className="space-y-2">
//       <label
//         htmlFor="valid_to"
//         className="text-sm font-medium text-gray-700"
//       >
//         Expiry date*
//       </label>
//       <Input
//         id="valid_to"
//         name="valid_to"
//         type="date"
//         value={
//           isValid(formData.valid_to)
//             ? format(formData.valid_to, "yyyy-MM-dd")
//             : ""
//         }
//         onChange={(e) => {
//           const date = e.target.value
//             ? parse(e.target.value, "yyyy-MM-dd", new Date())
//             : null;
//           if (date && isValid(date)) {
//             handleValidToChange(date);
//           } else {
//             setError("Invalid expiry date selected");
//           }
//         }}
//         required
//         className="w-full"
//         min={
//           isValid(formData.valid_from)
//             ? format(formData.valid_from, "yyyy-MM-dd")
//             : format(new Date(), "yyyy-MM-dd")
//         }
//       />
//     </div>
//   </div>

//   <div className="flex items-center space-x-2 mt-4">
//     <Checkbox
//       id="is_active"
//       checked={formData.is_active}
//       onCheckedChange={handleCheckboxChange}
//       className="data-[state=checked]:bg-[#2F5E5E] data-[state=checked]:border-[#2F5E5E]"
//     />
//     <label
//       htmlFor="is_active"
//       className="text-sm font-medium text-gray-700"
//     >
//       Active
//     </label>
//   </div>

//   <div className="flex space-x-2 mt-4">
//     <Button
//       type="submit"
//       className="bg-[#7a2828] hover:bg-[#7a2828] text-white"
//     >
//       {isEditing ? "Update Coupon" : "Create Coupon"}
//     </Button>
//     <Button
//       type="button"
//       variant="outline"
//       onClick={() => setOpen(false)}
//       className="bg-gray-100 hover:bg-gray-200 text-gray-800 border-none"
//     >
//       Cancel
//     </Button>
//   </div>
// </form>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {error && <div className="text-red-500 mb-4">{error}</div>}

//       {loading ? (
//         <div className="text-center py-4">Loading coupons...</div>
//       ) : (
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           {coupons.length === 0 ? (
//             <div className="text-center py-8 text-gray-500">
//               No coupons found. Create your first coupon!
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Coupon Name</TableHead>
//                     <TableHead>Code</TableHead>
//                     <TableHead>Discount Amount</TableHead>
//                     <TableHead>Min Amount</TableHead>
//                     <TableHead>Expiry Date</TableHead>
//                     <TableHead>Usage</TableHead>
//                     <TableHead>Used</TableHead>
//                     <TableHead>Minimum offer Amount</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {coupons.map((coupon) => {
//                     const validToDate = coupon.valid_to
//                       ? parse(coupon.valid_to, "yyyy-MM-dd", new Date())
//                       : new Date();
//                     return (
//                       <TableRow key={coupon.id}>
//                         <TableCell className="font-medium">
//                           {coupon.coupon_name}
//                         </TableCell>
//                         <TableCell>
//                           <code className="bg-gray-100 px-2 py-1 rounded text-sm">
//                             {coupon.coupon_code}
//                           </code>
//                         </TableCell>
//                         <TableCell>{coupon.discount}</TableCell>
//                         <TableCell>RS.{coupon.min_amount}</TableCell>
//                         <TableCell>
//                           {isValid(validToDate)
//                             ? format(validToDate, "MMM dd, yyyy")
//                             : "Invalid Date"}
//                         </TableCell>
//                         <TableCell>
//                           {coupon.max_uses}
//                         </TableCell>
//                         <TableCell>
//                           {coupon.used_count}
//                         </TableCell>
//                         <TableCell>
//                           {  coupon.min_offer_amount}
//                         </TableCell>
//                         <TableCell>
//                           <Badge
//                             variant={coupon.is_active ? "default" : "secondary"}
//                             className={
//                               coupon.is_active
//                                 ? "bg-green-100 text-green-800"
//                                 : "bg-gray-100 text-gray-800"
//                             }
//                           >
//                             {coupon.is_active ? "Active" : "Inactive"}
//                           </Badge>
//                         </TableCell>
//                         <TableCell>
//                           <div className="flex space-x-2">
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => handleEditCoupon(coupon)}
//                               className="text-blue-600 hover:text-blue-800"
//                             >
//                               <Pencil className="h-4 w-4" />
//                             </Button>
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => handleDeleteCoupon(coupon.id)}
//                               className="text-red-600 hover:text-red-800"
//                             >
//                               <Trash2 className="h-4 w-4" />
//                             </Button>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     );
//                   })}
//                 </TableBody>
//               </Table>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Pencil, Trash2, AlertCircle } from "lucide-react";
import { format, parse, isValid } from "date-fns";

import api from "../../api";

// Simple client-side validation
const validateForm = (formData) => {
  const errors = {};
  if (!formData.coupon_name) errors.coupon_name = "Coupon name is required";
  if (!formData.coupon_code) errors.coupon_code = "Coupon code is required";
  if (!formData.discount || formData.discount <= 0)
    errors.discount = "Valid discount amount is required";
  if (!formData.min_amount || formData.min_amount <= 0)
    errors.min_amount = "Valid minimum purchase amount is required";
  if (!formData.min_offer_amount || formData.min_offer_amount <= 0)
    errors.min_offer_amount = "Valid minimum offer amount is required";
  if (!formData.max_uses || formData.max_uses < 0)
    errors.max_uses = "Valid maximum usage is required";
  if (!isValid(formData.valid_from))
    errors.valid_from = "Valid start date is required";
  if (!isValid(formData.valid_to))
    errors.valid_to = "Valid expiry date is required";
  if (isValid(formData.valid_from) && isValid(formData.valid_to) && formData.valid_from > formData.valid_to)
    errors.valid_to = "Expiry date must be after start date";
  return errors;
};

export default function CouponManagement() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // General error
  const [formErrors, setFormErrors] = useState({}); // Field-specific errors
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    coupon_name: "",
    coupon_code: "",
    discount: "",
    valid_from: new Date(),
    valid_to: new Date(),
    max_uses: "",
    used_count: 0,
    min_amount: "",
    is_active: true,
    min_offer_amount: "",
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await api.get("offer/coupons/");
      setCoupons(response.data);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch coupons");
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear field-specific error when user starts typing
    setFormErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleCheckboxChange = (checked) => {
    setFormData({
      ...formData,
      is_active: checked,
    });
  };

  const handleValidFromChange = (date) => {
    if (!date || !isValid(date)) {
      setFormErrors((prev) => ({ ...prev, valid_from: "Invalid start date selected" }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      valid_from: date,
      valid_to: prev.valid_to < date ? date : prev.valid_to,
    }));
    setFormErrors((prev) => ({ ...prev, valid_from: null }));
  };

  const handleValidToChange = (date) => {
    if (!date || !isValid(date)) {
      setFormErrors((prev) => ({ ...prev, valid_to: "Invalid expiry date selected" }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      valid_to: date,
    }));
    setFormErrors((prev) => ({ ...prev, valid_to: null }));
  };

  const resetForm = () => {
    setFormData({
      id: null,
      coupon_name: "",
      coupon_code: "",
      discount: "",
      valid_from: new Date(),
      valid_to: new Date(),
      max_uses: "",
      used_count: 0,
      min_amount: "",
      is_active: true,
      min_offer_amount: "",
    });
    setIsEditing(false);
    setError(null);
    setFormErrors({});
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        valid_from: format(formData.valid_from, "yyyy-MM-dd"),
        valid_to: format(formData.valid_to, "yyyy-MM-dd"),
      };
      const response = await api.post("offer/coupons/", dataToSubmit);
      setCoupons([...coupons, response.data]);
      resetForm();
      setOpen(false);
    } catch (err) {
      const errorDetail = err.response?.data?.detail;
      if (typeof errorDetail === "object") {
        setFormErrors(errorDetail); // API returns field-specific errors
      } else {
        setError(errorDetail || "Failed to create coupon");
      }
    }
  };

  const handleUpdateCoupon = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        valid_from: format(formData.valid_from, "yyyy-MM-dd"),
        valid_to: format(formData.valid_to, "yyyy-MM-dd"),
      };
      const response = await api.patch(`offer/coupons/${formData.id}/`, dataToSubmit);
      setCoupons(
        coupons.map((coupon) =>
          coupon.id === formData.id ? response.data : coupon
        )
      );
      resetForm();
      setOpen(false);
    } catch (err) {
      const errorDetail = err.response?.data?.detail;
      if (typeof errorDetail === "object") {
        setFormErrors(errorDetail);
      } else {
        setError(errorDetail || "Failed to update coupon");
      }
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        await api.delete(`offer/coupons/${id}/`);
        setCoupons(coupons.filter((coupon) => coupon.id !== id));
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to delete coupon");
      }
    }
  };

  const handleEditCoupon = (coupon) => {
    try {
      const validFrom = coupon.valid_from
        ? parse(coupon.valid_from, "yyyy-MM-dd", new Date())
        : new Date();
      const validTo = coupon.valid_to
        ? parse(coupon.valid_to, "yyyy-MM-dd", new Date())
        : new Date();

      if (!isValid(validFrom) || !isValid(validTo)) {
        throw new Error("Invalid date format from API");
      }

      setFormData({
        ...coupon,
        valid_from: validFrom,
        valid_to: validTo,
      });
      setIsEditing(true);
      setOpen(true);
      setError(null);
      setFormErrors({});
    } catch (error) {
      setError("Failed to load coupon dates. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }
    isEditing ? handleUpdateCoupon(e) : handleCreateCoupon(e);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Coupon Management</h1>
        <Dialog
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-[#7a2828] hover:bg-red-600 text-white">
              Create Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-800">
                {isEditing ? "Edit Coupon" : "Create Coupon"}
                <div className="h-1 w-12 bg-[#7a2828] mt-1"></div>
              </DialogTitle>
            </DialogHeader>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="coupon_name" className="text-sm font-medium text-gray-700">
                    Coupon name*
                  </label>
                  <Input
                    id="coupon_name"
                    name="coupon_name"
                    value={formData.coupon_name}
                    onChange={handleInputChange}
                    required
                    className={`w-full ${formErrors.coupon_name ? "border-red-500" : ""}`}
                  />
                  {formErrors.coupon_name && (
                    <p className="text-red-500 text-xs">{formErrors.coupon_name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="coupon_code" className="text-sm font-medium text-gray-700">
                    Coupon code*
                  </label>
                  <Input
                    id="coupon_code"
                    name="coupon_code"
                    value={formData.coupon_code}
                    onChange={handleInputChange}
                    required
                    className={`w-full ${formErrors.coupon_code ? "border-red-500" : ""}`}
                  />
                  {formErrors.coupon_code && (
                    <p className="text-red-500 text-xs">{formErrors.coupon_code}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="min_amount" className="text-sm font-medium text-gray-700">
                    Minimum purchase amount*
                  </label>
                  <Input
                    id="min_amount"
                    name="min_amount"
                    type="number"
                    value={formData.min_amount}
                    onChange={handleInputChange}
                    required
                    className={`w-full ${formErrors.min_amount ? "border-red-500" : ""}`}
                  />
                  {formErrors.min_amount && (
                    <p className="text-red-500 text-xs">{formErrors.min_amount}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="discount" className="text-sm font-medium text-gray-700">
                    Discount Amount*
                  </label>
                  <Input
                    id="discount"
                    name="discount"
                    type="number"
                    value={formData.discount}
                    onChange={handleInputChange}
                    required
                    className={`w-full ${formErrors.discount ? "border-red-500" : ""}`}
                  />
                  {formErrors.discount && (
                    <p className="text-red-500 text-xs">{formErrors.discount}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="max_uses" className="text-sm font-medium text-gray-700">
                    Maximum usage*
                  </label>
                  <Input
                    id="max_uses"
                    name="max_uses"
                    type="number"
                    value={formData.max_uses}
                    onChange={handleInputChange}
                    required
                    className={`w-full ${formErrors.max_uses ? "border-red-500" : ""}`}
                    placeholder="0"
                  />
                  {formErrors.max_uses && (
                    <p className="text-red-500 text-xs">{formErrors.max_uses}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="min_offer_amount" className="text-sm font-medium text-gray-700">
                    Minimum offer amount*
                  </label>
                  <Input
                    id="min_offer_amount"
                    name="min_offer_amount"
                    type="number"
                    value={formData.min_offer_amount}
                    onChange={handleInputChange}
                    required
                    className={`w-full ${formErrors.min_offer_amount ? "border-red-500" : ""}`}
                  />
                  {formErrors.min_offer_amount && (
                    <p className="text-red-500 text-xs">{formErrors.min_offer_amount}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="valid_from" className="text-sm font-medium text-gray-700">
                    Valid from*
                  </label>
                  <Input
                    id="valid_from"
                    name="valid_from"
                    type="date"
                    value={isValid(formData.valid_from) ? format(formData.valid_from, "yyyy-MM-dd") : ""}
                    onChange={(e) => {
                      const date = e.target.value
                        ? parse(e.target.value, "yyyy-MM-dd", new Date())
                        : null;
                      if (date && isValid(date)) {
                        handleValidFromChange(date);
                      } else {
                        setFormErrors((prev) => ({
                          ...prev,
                          valid_from: "Invalid start date selected",
                        }));
                      }
                    }}
                    required
                    className={`w-full ${formErrors.valid_from ? "border-red-500" : ""}`}
                    min={format(new Date(), "yyyy-MM-dd")}
                  />
                  {formErrors.valid_from && (
                    <p className="text-red-500 text-xs">{formErrors.valid_from}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="valid_to" className="text-sm font-medium text-gray-700">
                    Expiry date*
                  </label>
                  <Input
                    id="valid_to"
                    name="valid_to"
                    type="date"
                    value={isValid(formData.valid_to) ? format(formData.valid_to, "yyyy-MM-dd") : ""}
                    onChange={(e) => {
                      const date = e.target.value
                        ? parse(e.target.value, "yyyy-MM-dd", new Date())
                        : null;
                      if (date && isValid(date)) {
                        handleValidToChange(date);
                      } else {
                        setFormErrors((prev) => ({
                          ...prev,
                          valid_to: "Invalid expiry date selected",
                        }));
                      }
                    }}
                    required
                    className={`w-full ${formErrors.valid_to ? "border-red-500" : ""}`}
                    min={
                      isValid(formData.valid_from)
                        ? format(formData.valid_from, "yyyy-MM-dd")
                        : format(new Date(), "yyyy-MM-dd")
                    }
                  />
                  {formErrors.valid_to && (
                    <p className="text-red-500 text-xs">{formErrors.valid_to}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 mt-4">
                <Checkbox
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={handleCheckboxChange}
                  className="data-[state=checked]:bg-[#2F5E5E] data-[state=checked]:border-[#2F5E5E]"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>

              <div className="flex space-x-2 mt-4">
                <Button
                  type="submit"
                  className="bg-[#7a2828] hover:bg-[#7a2828] text-white"
                >
                  {isEditing ? "Update Coupon" : "Create Coupon"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 border-none"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-4">Loading coupons...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {coupons.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No coupons found. Create your first coupon!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Coupon Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Discount Amount</TableHead>
                    <TableHead>Min Amount</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Used</TableHead>
                    <TableHead>Minimum offer Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coupons.map((coupon) => {
                    const validToDate = coupon.valid_to
                      ? parse(coupon.valid_to, "yyyy-MM-dd", new Date())
                      : new Date();
                    return (
                      <TableRow key={coupon.id}>
                        <TableCell className="font-medium">
                          {coupon.coupon_name}
                        </TableCell>
                        <TableCell>
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                            {coupon.coupon_code}
                          </code>
                        </TableCell>
                        <TableCell>{coupon.discount}</TableCell>
                        <TableCell>RS.{coupon.min_amount}</TableCell>
                        <TableCell>
                          {isValid(validToDate)
                            ? format(validToDate, "MMM dd, yyyy")
                            : "Invalid Date"}
                        </TableCell>
                        <TableCell>{coupon.max_uses}</TableCell>
                        <TableCell>{coupon.used_count}</TableCell>
                        <TableCell>{coupon.min_offer_amount}</TableCell>
                        <TableCell>
                          <Badge
                            variant={coupon.is_active ? "default" : "secondary"}
                            className={
                              coupon.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {coupon.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditCoupon(coupon)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteCoupon(coupon.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}