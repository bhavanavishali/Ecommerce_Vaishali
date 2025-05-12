// "use client";

// import { useState, useEffect } from "react";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { toast } from "sonner";
// import api from "../../api";
// import { useNavigate } from "react-router-dom";
// import { Home, Building, MapPin } from "lucide-react";
// import addressSchema from "@/validators/addressValidation.js";

// const AddAddress = () => {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [errors, setErrors] = useState({});
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: "",
//     house_no: "",
//     city: "",
//     state: "",
//     pin_code: "",
//     address_type: "home",
//     landmark: "",
//     mobile_number: "",
//     alternate_number: "",
//   });

//   const indianStates = [
//     "Jharkhand",
//     "Karnataka",
//     "Kerala",
//     "Madhya Pradesh",
//     "Maharashtra",
//     "Manipur",
//     "Meghalaya",
//     "Mizoram",
//     "Nagaland",
//     "Odisha",
//     "Punjab",
//   ];

//   // Validate a single field
//   const validateField = (name, value) => {
//     const fieldSchema = addressSchema.extract(name);
//     const { error } = fieldSchema.validate(value);
//     return error ? error.details[0].message : null;
//   };

//   // Validate the entire form
//   const validateForm = () => {
//     const { error } = addressSchema.validate(formData, { abortEarly: false });
//     if (error) {
//       const formattedErrors = {};
//       error.details.forEach((err) => {
//         formattedErrors[err.path[0]] = err.message;
//       });
//       setErrors(formattedErrors);
//       return false;
//     }
//     setErrors({});
//     return true;
//   };

//   // Real-time validation for individual fields
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     // Validate the field immediately
//     const errorMessage = validateField(name, value);
//     setErrors((prev) => ({
//       ...prev,
//       [name]: errorMessage,
//     }));
//   };

//   const handleSelectChange = (value, name) => {
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     // Validate the select field
//     const errorMessage = validateField(name, value);
//     setErrors((prev) => ({
//       ...prev,
//       [name]: errorMessage,
//     }));
//   };

//   const handleRadioChange = (value) => {
//     setFormData((prev) => ({
//       ...prev,
//       address_type: value,
//     }));

//     // Validate radio field
//     const errorMessage = validateField("address_type", value);
//     setErrors((prev) => ({
//       ...prev,
//       address_type: errorMessage,
//     }));
//   };

//   // Check if the form has any errors
//   const hasErrors = () => Object.values(errors).some((error) => error !== null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrors({});

//     // Validate the entire form
//     if (!validateForm()) {
//       toast({
//         title: "Validation Error",
//         description: "Please fix the errors in the form before submitting.",
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const response = await api.post("address/", formData);
//       console.log("Address data:", response.data);
//       navigate("/userprofile");
//       toast({
//         title: "Address Added",
//         description: "Your address has been saved successfully",
//       });
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: error.response?.data?.message || "Failed to save address. Please try again.",
//         variant: "destructive",
//       });
//       console.error("Error saving address:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Card className="max-w-2xl mx-auto">
//       <CardHeader>
//         <CardTitle className="text-xl font-semibold">Add New Address</CardTitle>
//         <CardDescription>Fill in the details to add a new delivery address</CardDescription>
//       </CardHeader>

//       <form onSubmit={handleSubmit}>
//         <CardContent className="space-y-6">
//           {/* Address Type Selection */}
//           <div className="space-y-2">
//             <Label>Address Type</Label>
//             <RadioGroup
//               name="address_type"
//               className="flex flex-wrap gap-4"
//               value={formData.address_type}
//               onValueChange={handleRadioChange}
//             >
//               <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50 transition-colors">
//                 <RadioGroupItem value="home" id="home" />
//                 <Label htmlFor="home" className="flex items-center cursor-pointer">
//                   <Home className="mr-2 h-4 w-4 text-blue-500" />
//                   Home
//                 </Label>
//               </div>
//               {/* <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50 transition-colors">
//                 <RadioGroupItem value="work" id="work" />
//                 <Label htmlFor="work" className="flex items-center cursor-pointer">
//                   <Building className="mr-2 h-4 w-4 text-blue-500" />
//                   Work
//                 </Label>
//               </div>
//               <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50 transition-colors">
//                 <RadioGroupItem value="other" id="other" />
//                 <Label htmlFor="other" className="flex items-center cursor-pointer">
//                   <MapPin className="mr-2 h-4 w-4 text-blue-500" />
//                   Other
//                 </Label>
//               </div> */}
//             </RadioGroup>
//             {errors.address_type && <p className="text-red-500 text-sm mt-1">{errors.address_type}</p>}
//           </div>

//           {/* Contact Information */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <Label htmlFor="name">
//                 Full Name <span className="text-red-500">*</span>
//               </Label>
//               <Input
//                 id="name"
//                 name="name"
//                 placeholder="Enter your full name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className={errors.name ? "border-red-500" : ""}
//               />
//               {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="mobile_number">
//                 Mobile Number <span className="text-red-500">*</span>
//               </Label>
//               <Input
//                 id="mobile_number"
//                 name="mobile_number"
//                 placeholder="10-digit mobile number"
//                 value={formData.mobile_number}
//                 onChange={handleChange}
//                 className={errors.mobile_number ? "border-red-500" : ""}
//               />
//               {errors.mobile_number && <p className="text-red-500 text-sm mt-1">{errors.mobile_number}</p>}
//             </div>
//           </div>

//           {/* Alternate Number */}
//           <div className="space-y-2">
//             <Label htmlFor="alternate_number">Alternate Number (Optional)</Label>
//             <Input
//               id="alternate_number"
//               name="alternate_number"
//               placeholder="Alternate contact number"
//               value={formData.alternate_number}
//               onChange={handleChange}
//               className={errors.alternate_number ? "border-red-500" : ""}
//             />
//             {errors.alternate_number && <p className="text-red-500 text-sm mt-1">{errors.alternate_number}</p>}
//           </div>

//           {/* Address Details */}
//           <div className="space-y-2">
//             <Label htmlFor="house_no">
//               House No., Building Name <span className="text-red-500">*</span>
//             </Label>
//             <Input
//               id="house_no"
//               name="house_no"
//               placeholder="House no., Floor, Building name"
//               value={formData.house_no}
//               onChange={handleChange}
//               className={errors.house_no ? "border-red-500" : ""}
//             />
//             {errors.house_no && <p className="text-red-500 text-sm mt-1">{errors.house_no}</p>}
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="landmark">Landmark (Optional)</Label>
//             <Input
//               id="landmark"
//               name="landmark"
//               placeholder="Nearby landmark for easy navigation"
//               value={formData.landmark}
//               onChange={handleChange}
//               className={errors.landmark ? "border-red-500" : ""}
//             />
//             {errors.landmark && <p className="text-red-500 text-sm mt-1">{errors.landmark}</p>}
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <Label htmlFor="city">
//                 City <span className="text-red-500">*</span>
//               </Label>
//               <Input
//                 id="city"
//                 name="city"
//                 placeholder="Enter your city"
//                 value={formData.city}
//                 onChange={handleChange}
//                 className={errors.city ? "border-red-500" : ""}
//               />
//               {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="state">
//                 State <span className="text-red-500">*</span>
//               </Label>
//               <Select value={formData.state} onValueChange={(value) => handleSelectChange(value, "state")}>
//                 <SelectTrigger id="state" className={errors.state ? "border-red-500" : ""}>
//                   <SelectValue placeholder="Select state" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {indianStates.map((state) => (
//                     <SelectItem key={state} value={state}>
//                       {state}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="pin_code">
//               PIN Code <span className="text-red-500">*</span>
//             </Label>
//             <Input
//               id="pin_code"
//               name="pin_code"
//               placeholder="6-digit PIN code"
//               value={formData.pin_code}
//               onChange={handleChange}
//               className={errors.pin_code ? "border-red-500" : ""}
//             />
//             {errors.pin_code && <p className="text-red-500 text-sm mt-1">{errors.pin_code}</p>}
//           </div>
//         </CardContent>

//         <CardFooter className="flex justify-end gap-2 border-t pt-6">
//           <Button variant="outline" type="button" onClick={() => navigate("/userprofile")}>
//             Cancel
//           </Button>
//           <Button
//             type="submit"
//             className="bg-red-900 hover:bg-grey-900 text-white"
//             disabled={isSubmitting || hasErrors()}
//           >
//             {isSubmitting ? "Saving..." : "Save Address"}
//           </Button>
//         </CardFooter>
//       </form>
//     </Card>
//   );
// };

// export default AddAddress;


"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import api from "../../api"
import { useNavigate } from "react-router-dom"
import { Home, Building, MapPin, ArrowLeft, Save } from "lucide-react"
import addressSchema from "@/validators/addressValidation.js"

const AddAddress = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    house_no: "",
    city: "",
    state: "",
    pin_code: "",
    address_type: "home",
    landmark: "",
    mobile_number: "",
    alternate_number: "",
  })

  const indianStates = [
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (value, name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRadioChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      address_type: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    const { error } = addressSchema.validate(formData, { abortEarly: false })

    if (error) {
      const formattedErrors = {}
      error.details.forEach((err) => {
        formattedErrors[err.path[0]] = err.message
      })
      setErrors(formattedErrors)
      return
    }

    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await api.post("address/", formData)
      setSuccess(true)
      navigate("/userprofile")
      toast({
        title: "Address Added",
        description: "Your address has been saved successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save address. Please try again.",
        variant: "destructive",
      })
      console.error("Error saving address:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="py-8 px-4 max-w-3xl mx-auto">
      <Card className="border border-[#e9d9b6] shadow-lg overflow-hidden bg-gradient-to-b from-[#fffbf0] to-[#fff9e6]">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#7a2828]"></div>

        <CardHeader className="pb-6 border-b border-[#e9d9b6]">
          <CardTitle className="text-2xl font-serif text-[#7a2828]">Add New Address</CardTitle>
          <CardDescription className="text-[#a67c52]">
            Fill in the details to add a new delivery address
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-8 pt-8">
            {/* Address Type Selection */}
            <div className="space-y-3">
              <Label className="text-[#7a2828] font-medium">Address Type</Label>
              <RadioGroup
                defaultValue="home"
                name="address_type"
                className="flex flex-wrap gap-4"
                value={formData.address_type}
                onValueChange={handleRadioChange}
              >
                <div
                  className={`flex items-center space-x-2 border border-[#e9d9b6] rounded-md p-4 cursor-pointer transition-all duration-300 ${formData.address_type === "home" ? "bg-[#7a2828]/10 border-[#7a2828]" : "hover:bg-[#f8f0dd] hover:border-[#d4b78c]"}`}
                >
                  <RadioGroupItem value="home" id="home" className="text-[#7a2828]" />
                  <Label htmlFor="home" className="flex items-center cursor-pointer">
                    <Home
                      className={`mr-2 h-5 w-5 ${formData.address_type === "home" ? "text-[#7a2828]" : "text-[#a67c52]"}`}
                    />
                    <span
                      className={`${formData.address_type === "home" ? "text-[#7a2828] font-medium" : "text-[#a67c52]"}`}
                    >
                      Home
                    </span>
                  </Label>
                </div>

                <div
                  className={`flex items-center space-x-2 border border-[#e9d9b6] rounded-md p-4 cursor-pointer transition-all duration-300 ${formData.address_type === "work" ? "bg-[#7a2828]/10 border-[#7a2828]" : "hover:bg-[#f8f0dd] hover:border-[#d4b78c]"}`}
                >
                  <RadioGroupItem value="work" id="work" className="text-[#7a2828]" />
                  <Label htmlFor="work" className="flex items-center cursor-pointer">
                    <Building
                      className={`mr-2 h-5 w-5 ${formData.address_type === "work" ? "text-[#7a2828]" : "text-[#a67c52]"}`}
                    />
                    <span
                      className={`${formData.address_type === "work" ? "text-[#7a2828] font-medium" : "text-[#a67c52]"}`}
                    >
                      Work
                    </span>
                  </Label>
                </div>

                <div
                  className={`flex items-center space-x-2 border border-[#e9d9b6] rounded-md p-4 cursor-pointer transition-all duration-300 ${formData.address_type === "other" ? "bg-[#7a2828]/10 border-[#7a2828]" : "hover:bg-[#f8f0dd] hover:border-[#d4b78c]"}`}
                >
                  <RadioGroupItem value="other" id="other" className="text-[#7a2828]" />
                  <Label htmlFor="other" className="flex items-center cursor-pointer">
                    <MapPin
                      className={`mr-2 h-5 w-5 ${formData.address_type === "other" ? "text-[#7a2828]" : "text-[#a67c52]"}`}
                    />
                    <span
                      className={`${formData.address_type === "other" ? "text-[#7a2828] font-medium" : "text-[#a67c52]"}`}
                    >
                      Other
                    </span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#7a2828] font-medium">
                  Full Name <span className="text-[#7a2828]">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border-[#e9d9b6] focus:border-[#7a2828] focus:ring-[#7a2828]/20 transition-all duration-300 hover:border-[#d4b78c]"
                />
                {errors?.name && <p className="text-[#7a2828] text-sm mt-1">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile_number" className="text-[#7a2828] font-medium">
                  Mobile Number <span className="text-[#7a2828]">*</span>
                </Label>
                <Input
                  id="mobile_number"
                  name="mobile_number"
                  placeholder="10-digit mobile number"
                  value={formData.mobile_number}
                  onChange={handleChange}
                  className="border-[#e9d9b6] focus:border-[#7a2828] focus:ring-[#7a2828]/20 transition-all duration-300 hover:border-[#d4b78c]"
                />
                {errors?.mobile_number && <p className="text-[#7a2828] text-sm mt-1">{errors.mobile_number}</p>}
              </div>
            </div>

            {/* Alternate Number */}
            <div className="space-y-2">
              <Label htmlFor="alternate_number" className="text-[#7a2828] font-medium">
                Alternate Number 
              </Label>
              <Input
                id="alternate_number"
                name="alternate_number"
                placeholder="Alternate contact number"
                value={formData.alternate_number}
                onChange={handleChange}
                className="border-[#e9d9b6] focus:border-[#7a2828] focus:ring-[#7a2828]/20 transition-all duration-300 hover:border-[#d4b78c]"
              />
              {errors?.alternate_number && <p className="text-[#7a2828] text-sm mt-1">{errors.alternate_number}</p>}
            </div>

            {/* Address Details */}
            <div className="space-y-2">
              <Label htmlFor="house_no" className="text-[#7a2828] font-medium">
                House No., Building Name <span className="text-[#7a2828]">*</span>
              </Label>
              <Input
                id="house_no"
                name="house_no"
                placeholder="House no., Floor, Building name"
                value={formData.house_no}
                onChange={handleChange}
                className="border-[#e9d9b6] focus:border-[#7a2828] focus:ring-[#7a2828]/20 transition-all duration-300 hover:border-[#d4b78c]"
              />
              {errors?.house_no && <p className="text-[#7a2828] text-sm mt-1">{errors.house_no}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="landmark" className="text-[#7a2828] font-medium">
                Landmark (Optional)
              </Label>
              <Input
                id="landmark"
                name="landmark"
                placeholder="Nearby landmark for easy navigation"
                value={formData.landmark}
                onChange={handleChange}
                className="border-[#e9d9b6] focus:border-[#7a2828] focus:ring-[#7a2828]/20 transition-all duration-300 hover:border-[#d4b78c]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-[#7a2828] font-medium">
                  City <span className="text-[#7a2828]">*</span>
                </Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="Enter your city"
                  value={formData.city}
                  onChange={handleChange}
                  className="border-[#e9d9b6] focus:border-[#7a2828] focus:ring-[#7a2828]/20 transition-all duration-300 hover:border-[#d4b78c]"
                />
                {errors?.city && <p className="text-[#7a2828] text-sm mt-1">{errors.city}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state" className="text-[#7a2828] font-medium">
                  State <span className="text-[#7a2828]">*</span>
                </Label>
                <Select value={formData.state} onValueChange={(value) => handleSelectChange(value, "state")}>
                  <SelectTrigger
                    id="state"
                    className="border-[#e9d9b6] focus:border-[#7a2828] focus:ring-[#7a2828]/20 transition-all duration-300 hover:border-[#d4b78c]"
                  >
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent className="border-[#e9d9b6] bg-[#fffbf0]">
                    {indianStates.map((state) => (
                      <SelectItem
                        key={state}
                        value={state}
                        className="hover:bg-[#7a2828]/10 focus:bg-[#7a2828]/10 cursor-pointer"
                      >
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors?.state && <p className="text-[#7a2828] text-sm mt-1">{errors.state}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pin_code" className="text-[#7a2828] font-medium">
                PIN Code <span className="text-[#7a2828]">*</span>
              </Label>
              <Input
                id="pin_code"
                name="pin_code"
                placeholder="6-digit PIN code"
                value={formData.pin_code}
                onChange={handleChange}
                className="border-[#e9d9b6] focus:border-[#7a2828] focus:ring-[#7a2828]/20 transition-all duration-300 hover:border-[#d4b78c]"
              />
              {errors?.pin_code && <p className="text-[#7a2828] text-sm mt-1">{errors.pin_code}</p>}
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-4 border-t border-[#e9d9b6] pt-6 pb-6 bg-[#fffdf7]">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate(-1)}
              className="border-[#d4b78c] text-[#a67c52] hover:bg-[#f8f0dd] hover:text-[#7a2828] transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#7a2828] hover:bg-[#5e1e1e] text-white transition-all duration-300 shadow-md hover:shadow-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                <span className="flex items-center">
                  <Save className="w-4 h-4 mr-2" />
                  Save Address
                </span>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default AddAddress
