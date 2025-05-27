

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
import { Home, Building, ArrowLeft, Save } from "lucide-react"
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
   
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const handleSelectChange = (value, name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const handleRadioChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      address_type: value,
    }))
    
    if (errors.address_type) {
      setErrors((prev) => ({ ...prev, address_type: null }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setError(null)

    const { error: validationError } = addressSchema.validate(formData, { abortEarly: false })
    if (validationError) {
      const formattedErrors = {}
      validationError.details.forEach((err) => {
        formattedErrors[err.path[0]] = err.message
      })
      setErrors(formattedErrors)
      console.log("Frontend validation errors:", formattedErrors)
      return
    }

    setIsSubmitting(true)
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
      console.log("Raw backend error response:", error.response?.data)
      const backendErrors = error.response?.data
      if (backendErrors && typeof backendErrors === "object") {
        const formattedBackendErrors = {}
        Object.keys(backendErrors).forEach((key) => {
          if (Array.isArray(backendErrors[key]) && backendErrors[key].length > 0) {
            formattedBackendErrors[key] = backendErrors[key][0]
          } else if (typeof backendErrors[key] === "string") {
            formattedBackendErrors[key] = backendErrors[key]
          } else {
            formattedBackendErrors[key] = "Invalid input"
          }
        })
        setErrors(formattedBackendErrors)
        console.log("Formatted backend errors:", formattedBackendErrors)
      } else {
        const generalError = error.response?.data?.message || "Failed to save address. Please try again."
        setError(generalError)
        toast({
          title: "Error",
          description: generalError,
          variant: "destructive",
        })
      }
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
          
            {error && (
              <div className="bg-[#7a2828]/10 border border-[#7a2828] p-4 rounded-md">
                <p className="text-[#7a2828] text-sm">{error}</p>
              </div>
            )}

            {/* Address Type Selection */}
            <div className="space-y-2">
              <Label className="text-[#7a2828] font-medium">Address Type <span className="text-[#7a2828]">*</span></Label>
              <RadioGroup
                value={formData.address_type}
                onValueChange={handleRadioChange}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="home" id="home" />
                  <Label htmlFor="home" className="flex items-center text-[#7a2828]">
                    <Home className="w-4 h-4 mr-1" /> Home
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="work" id="work" />
                  <Label htmlFor="work" className="flex items-center text-[#7a2828]">
                    <Building className="w-4 h-4 mr-1" /> Work
                  </Label>
                </div>
              </RadioGroup>
              {errors?.address_type && <p className="text-[#7a2828] text-sm mt-1">{errors.address_type}</p>}
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
                  className={`border-[#e9d9b6] focus:border-[#7a2828] focus:ring-[#7a2828]/20 transition-all duration-300 hover:border-[#d4b78c] ${errors.name ? 'border-[#7a2828]' : ''}`}
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
                  className={`border-[#e9d9b6] focus:border-[#7a2828] focus:ring-[#7a2828]/20 transition-all duration-300 hover:border-[#d4b78c] ${errors.mobile_number ? 'border-[#7a2828]' : ''}`}
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
                className={`border-[#e9d9b6] focus:border-[#7a2828] focus:ring-[#7a2828]/20 transition-all duration-300 hover:border-[#d4b78c] ${errors.alternate_number ? 'border-[#7a2828]' : ''}`}
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
                className={`border-[#e9d9b6] focus:border-[#7a2828] focus:ring-[#7a2828]/20 transition-all duration-300 hover:border-[#d4b78c] ${errors.house_no ? 'border-[#7a2828]' : ''}`}
              />
              {errors?.house_no && <p className="text-[#7a2828] text-sm mt-1">{errors.house_no}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="landmark" className="text-[#7a2828] font-medium">
                Landmark 
              </Label>
              <Input
                id="landmark"
                name="landmark"
                placeholder="Nearby landmark for easy navigation"
                value={formData.landmark}
                onChange={handleChange}
                className={`border-[#e9d9b6] focus:border-[#7a2828] focus:ring-[#7a2828]/20 transition-all duration-300 hover:border-[#d4b78c] ${errors.landmark ? 'border-[#7a2828]' : ''}`}
              />
              {errors?.landmark && <p className="text-[#7a2828] text-sm mt-1">{errors.landmark}</p>}
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
                  className={`border-[#e9d9b6] focus:border-[#7a2828] focus:ring-[#7a2828]/20 transition-all duration-300 hover:border-[#d4b78c] ${errors.city ? 'border-[#7a2828]' : ''}`}
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
                    className={`border-[#e9d9b6] focus:border-[#7a2828] focus:ring-[#7a2828]/20 transition-all duration-300 hover:border-[#d4b78c] ${errors.state ? 'border-[#7a2828]' : ''}`}
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
                className={`border-[#e9d9b6] focus:border-[#7a2828] focus:ring-[#7a2828]/20 transition-all duration-300 hover:border-[#d4b78c] ${errors.pin_code ? 'border-[#7a2828]' : ''}`}
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