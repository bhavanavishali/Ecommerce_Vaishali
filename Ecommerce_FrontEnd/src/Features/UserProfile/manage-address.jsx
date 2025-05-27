


"use client"

import { Plus, Home, Building, Edit, Trash, X, Check, MapPin, AlertCircle, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../api"

const ManageAddresses = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [addresses, setAddresses] = useState([])
  const [error, setError] = useState(null)
  const [editingAddressId, setEditingAddressId] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState(null)
  const [editForm, setEditForm] = useState({
    name: "",
    house_no: "",
    city: "",
    state: "",
    pin_code: "",
    landmark: "",
    mobile_number: "",
    type: "Home",
    isDefault: false,
  })

  useEffect(() => {
    fetchAddresses()
  }, [])

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  const fetchAddresses = async () => {
    setLoading(true)
    try {
      const response = await api.get("address/")
      setAddresses(response.data)
      setError(null)
    } catch (err) {
      setError(err.message || "Failed to fetch addresses")
      setAddresses([])
    } finally {
      setLoading(false)
    }
  }

  const updateAddress = async (id) => {
    setActionLoading(true)
    try {
      const response = await api.patch(`address/${id}/`, editForm)
      setAddresses((prev) => prev.map((addr) => (addr.id === id ? response.data : addr)))
      setEditingAddressId(null)
      setError(null)
      setSuccessMessage("Address updated successfully")
    } catch (err) {
      setError(err.message || "Failed to update address")
    } finally {
      setActionLoading(false)
    }
  }

  const deleteAddress = async (id) => {
    setActionLoading(true)
    try {
      await api.delete(`address/${id}/`)
      setAddresses((prev) => prev.filter((addr) => addr.id !== id))
      setShowDeleteConfirm(null)
      setError(null)
      setSuccessMessage("Address deleted successfully")
    } catch (err) {
      setError(err.message || "Failed to delete address")
    } finally {
      setActionLoading(false)
    }
  }

  const setDefaultAddress = async (id) => {
    setActionLoading(true)
    try {
      // Send PATCH request to set the address as default
      await api.patch(`address/${id}/`, { isDefault: true })

      // Update local state to reflect the new default address
      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          isDefault: addr.id === id,
        })),
      )

      setError(null)
      setSuccessMessage("Default address updated")
    } catch (err) {
      // Enhanced error logging to diagnose API issues
      console.error("Set default address error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      })
      setError(err.response?.data?.message || err.message || "Failed to set default address")

      // Optional: Refetch addresses to ensure state consistency
      await fetchAddresses()
    } finally {
      setActionLoading(false)
    }
  }

  const startEditing = (address) => {
    setEditingAddressId(address.id)
    setEditForm({
      name: address.name,
      house_no: address.house_no,
      city: address.city,
      state: address.state,
      pin_code: address.pin_code,
      landmark: address.landmark,
      mobile_number: address.mobile_number,
      type: address.type,
      isDefault: address.isDefault,
    })
  }

  const cancelEditing = () => {
    setEditingAddressId(null)
    setEditForm({
      name: "",
      house_no: "",
      city: "",
      state: "",
      pin_code: "",
      landmark: "",
      mobile_number: "",
      type: "Home",
      isDefault: false,
    })
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setEditForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleTypeChange = (value) => {
    setEditForm((prev) => ({ ...prev, type: value }))
  }

  const validateForm = () => {
    // Basic validation
    return (
      editForm.name &&
      editForm.house_no &&
      editForm.city &&
      editForm.state &&
      editForm.pin_code &&
      editForm.mobile_number
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff8f8] to-white py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <span className="hover:text-[#7a2828] cursor-pointer transition-colors">Home</span>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="hover:text-[#7a2828] cursor-pointer transition-colors">Account</span>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-[#7a2828] font-medium">Addresses</span>
        </div>

        <Card className="max-w-3xl mx-auto border-[#e6d2d2] shadow-md overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-[#7a2828]/5 to-transparent">
            <div>
              <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-[#7a2828]" />
                Manage Addresses
              </CardTitle>
              <CardDescription className="text-gray-500 mt-1">Add or edit your delivery addresses</CardDescription>
            </div>
            <Button
              className="bg-[#7a2828] hover:bg-[#5a1d1d] text-white transition-all duration-300 shadow-sm hover:shadow-md"
              type="button"
              onClick={() => navigate("/addaddress")}
            >
              <Plus className="mr-2 h-4 w-4" /> Add New Address
            </Button>
          </CardHeader>

          <CardContent className="p-6">
            {/* Success Message */}
            {successMessage && (
              <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
                <Check className="h-4 w-4 mr-2" />
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}

            {/* Error Message */}
            {error && (
              <Alert className="mb-4 bg-red-50 border-red-200 text-red-800">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7a2828]"></div>
              </div>
            ) : addresses.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No addresses found</h3>
                <p className="text-gray-500 mb-4">Add a new address to get started</p>
                <Button className="bg-[#7a2828] hover:bg-[#5a1d1d] text-white" onClick={() => navigate("/addaddress")}>
                  <Plus className="mr-2 h-4 w-4" /> Add New Address
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`border rounded-lg overflow-hidden transition-all duration-300 ${
                      address.isDefault
                        ? "border-[#7a2828] bg-[#7a2828]/5 shadow-sm"
                        : "border-gray-200 hover:border-[#7a2828]/30 hover:shadow-md"
                    }`}
                  >
                    {editingAddressId === address.id ? (
                      // Edit Form
                      <div className="p-5 space-y-4">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                          <h3 className="font-medium text-lg text-[#7a2828] flex items-center">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Address
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-full hover:bg-[#7a2828]/10 hover:text-[#7a2828] transition-colors"
                            onClick={cancelEditing}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-gray-700">
                              Full Name
                            </Label>
                            <Input
                              id="name"
                              name="name"
                              value={editForm.name}
                              onChange={handleFormChange}
                              placeholder="Enter full name"
                              className="border-gray-300 focus:border-[#7a2828] focus:ring-[#7a2828]"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="mobile_number" className="text-gray-700">
                              Mobile Number
                            </Label>
                            <Input
                              id="mobile_number"
                              name="mobile_number"
                              value={editForm.mobile_number}
                              onChange={handleFormChange}
                              placeholder="Enter mobile number"
                              className="border-gray-300 focus:border-[#7a2828] focus:ring-[#7a2828]"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="house_no" className="text-gray-700">
                              House No. / Building Name
                            </Label>
                            <Input
                              id="house_no"
                              name="house_no"
                              value={editForm.house_no}
                              onChange={handleFormChange}
                              placeholder="Enter house number or building name"
                              className="border-gray-300 focus:border-[#7a2828] focus:ring-[#7a2828]"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="landmark" className="text-gray-700">
                              Landmark (Optional)
                            </Label>
                            <Input
                              id="landmark"
                              name="landmark"
                              value={editForm.landmark}
                              onChange={handleFormChange}
                              placeholder="Enter nearby landmark"
                              className="border-gray-300 focus:border-[#7a2828] focus:ring-[#7a2828]"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="city" className="text-gray-700">
                              City
                            </Label>
                            <Input
                              id="city"
                              name="city"
                              value={editForm.city}
                              onChange={handleFormChange}
                              placeholder="Enter city"
                              className="border-gray-300 focus:border-[#7a2828] focus:ring-[#7a2828]"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="state" className="text-gray-700">
                              State
                            </Label>
                            <Input
                              id="state"
                              name="state"
                              value={editForm.state}
                              onChange={handleFormChange}
                              placeholder="Enter state"
                              className="border-gray-300 focus:border-[#7a2828] focus:ring-[#7a2828]"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="pin_code" className="text-gray-700">
                              Pin Code
                            </Label>
                            <Input
                              id="pin_code"
                              name="pin_code"
                              value={editForm.pin_code}
                              onChange={handleFormChange}
                              placeholder="Enter pin code"
                              className="border-gray-300 focus:border-[#7a2828] focus:ring-[#7a2828]"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="type" className="text-gray-700">
                              Address Type
                            </Label>
                            <Select value={editForm.type} onValueChange={handleTypeChange}>
                              <SelectTrigger
                                id="type"
                                className="border-gray-300 focus:border-[#7a2828] focus:ring-[#7a2828]"
                              >
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Home">Home</SelectItem>
                                <SelectItem value="Work">Work</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-3 pt-3 border-t border-gray-100 mt-4">
                          <Button
                            className="bg-[#7a2828] hover:bg-[#5a1d1d] text-white transition-all duration-300"
                            onClick={() => updateAddress(address.id)}
                            disabled={!validateForm() || actionLoading}
                          >
                            {actionLoading ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Saving...
                              </>
                            ) : (
                              <>
                                <Check className="mr-2 h-4 w-4" /> Save Changes
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={cancelEditing}
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : showDeleteConfirm === address.id ? (
                      // Delete Confirmation
                      <div className="p-5 space-y-4">
                        <div className="flex items-center text-red-600 mb-2">
                          <AlertCircle className="h-5 w-5 mr-2" />
                          <h3 className="font-medium">Confirm Deletion</h3>
                        </div>
                        <p className="text-gray-600">
                          Are you sure you want to delete this address? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 pt-2">
                          <Button
                            variant="destructive"
                            onClick={() => deleteAddress(address.id)}
                            disabled={actionLoading}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {actionLoading ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Deleting...
                              </>
                            ) : (
                              <>
                                <Trash className="mr-2 h-4 w-4" /> Delete
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setShowDeleteConfirm(null)}
                            className="border-gray-300"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // Address Display
                      <div className="group">
                        <div className="p-5">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <div
                                className={`p-2 rounded-full ${
                                  address.isDefault
                                    ? "bg-[#7a2828]/10 text-[#7a2828]"
                                    : "bg-gray-100 text-gray-600 group-hover:bg-[#7a2828]/5 group-hover:text-[#7a2828] transition-colors"
                                }`}
                              >
                                {address.type === "Home" ? (
                                  <Home className="h-5 w-5" />
                                ) : address.type === "Work" ? (
                                  <Building className="h-5 w-5" />
                                ) : (
                                  <MapPin className="h-5 w-5" />
                                )}
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-800">{address.type}</h3>
                                {address.isDefault && (
                                  <Badge
                                    variant="outline"
                                    className="mt-1 text-xs bg-[#7a2828]/5 text-[#7a2828] border-[#7a2828]/20"
                                  >
                                    Default Address
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 rounded-full opacity-70 hover:opacity-100 hover:bg-[#7a2828]/10 hover:text-[#7a2828] transition-all"
                                      onClick={() => startEditing(address)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Edit address</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 rounded-full opacity-70 hover:opacity-100 hover:bg-red-50 hover:text-red-600 transition-all"
                                      onClick={() => setShowDeleteConfirm(address.id)}
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Delete address</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                          <div className="mt-4 text-sm space-y-1 pl-9">
                            <p className="font-medium text-gray-800">{address.name}</p>
                            <p className="text-gray-600">{address.house_no}</p>
                            {address.landmark && <p className="text-gray-600">Landmark: {address.landmark}</p>}
                            <p className="text-gray-600">
                              {address.city}, {address.state} - {address.pin_code}
                            </p>
                            <p className="mt-2 text-gray-700">
                              <span className="font-medium">Phone:</span> {address.mobile_number}
                            </p>
                          </div>
                          {!address.isDefault && (
                            <div className="mt-4 pl-9">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs h-8 border-[#7a2828]/30 text-[#7a2828] hover:bg-[#7a2828]/5 hover:border-[#7a2828] transition-all"
                                onClick={() => setDefaultAddress(address.id)}
                                disabled={actionLoading}
                              >
                                {actionLoading ? (
                                  <div className="w-3 h-3 border-2 border-[#7a2828] border-t-transparent rounded-full animate-spin mr-1"></div>
                                ) : (
                                  <Check className="h-3 w-3 mr-1" />
                                )}
                                Set as Default
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>

          <CardFooter className="bg-gray-50 border-t border-gray-200 px-6 py-4">
            <div className="text-sm text-gray-500 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 text-[#7a2828]" />
              Your default address will be used for all deliveries unless specified otherwise.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default ManageAddresses
