


import React from "react";
import { debounce } from "lodash";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Home, Building } from "lucide-react";
import api from '../../api'

const AddressDialog = React.memo(
  ({
    showAddressDialog,
    setShowAddressDialog,
    editingAddress,
    setEditingAddress,
    newAddress,
    setNewAddress,
    error,
    setError,
    handleAddAddress,
    handleEditAddress,
  }) => {
    const [localErrors, setLocalErrors] = React.useState({});
    const inputRefs = {
      name: React.useRef(null),
      street: React.useRef(null),
      city: React.useRef(null),
      state: React.useRef(null),
      pincode: React.useRef(null),
      phone: React.useRef(null),
      alternate_number: React.useRef(null),
    };
    const [activeInput, setActiveInput] = React.useState(null);

    // Debounced state update functions
    const debouncedSetNewAddress = debounce((data) => {
      setNewAddress((prev) => ({ ...prev, ...data }));
    }, 300);

    const debouncedSetEditingAddress = debounce((data) => {
      setEditingAddress((prev) => ({ ...prev, ...data }));
    }, 300);

    // Restore focus after render
    React.useEffect(() => {
      if (activeInput && inputRefs[activeInput]?.current) {
        inputRefs[activeInput].current.focus();
      }
    }, [activeInput]);

    // Reset local errors when dialog opens or closes
    React.useEffect(() => {
      if (showAddressDialog) {
        setLocalErrors({});
      }
    }, [showAddressDialog]);

    const validateField = (field, value) => {
      switch (field) {
        case "name":
          return value.trim() ? "" : "Full name is required";
        case "street":
          return value.trim() ? "" : "Street address is required";
        case "city":
          return value.trim() ? "" : "City is required";
        case "state":
          return value.trim() ? "" : "State is required";
        case "pincode":
          return /^\d{6}$/.test(value) ? "" : "Valid 6-digit PIN code is required";
        case "phone":
          return /^\d{10}$/.test(value) ? "" : "Valid 10-digit phone number is required";
        case "alternate_number":
          return !value || /^\d{10}$/.test(value) ? "" : "Valid 10-digit alternate number is required";
        default:
          return "";
      }
    };

    const handleFieldChange = (field, value) => {
      const error = validateField(field, value);
      setLocalErrors((prev) => ({ ...prev, [field]: error }));
      const setAddressData = editingAddress ? debouncedSetEditingAddress : debouncedSetNewAddress;
      setAddressData({ [field]: value });
    };

    if (!showAddressDialog) return null;

    const isEditing = !!editingAddress;
    const addressData = isEditing ? editingAddress : newAddress;

    return (
      <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
        <DialogContent className="max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-[#8B2131]">
              {isEditing ? "Edit Address" : "Add New Address"}
            </DialogTitle>
          </DialogHeader>
          {(error || Object.values(localErrors).some((e) => e)) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              {error && <p className="text-red-600 text-sm">{error}</p>}
              {Object.values(localErrors)
                .filter((e) => e)
                .map((e, idx) => (
                  <p key={idx} className="text-red-600 text-sm">{e}</p>
                ))}
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
                  ref={inputRefs.name}
                  value={addressData.name}
                  onFocus={() => setActiveInput("name")}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <Label className="text-sm font-medium">Address Type *</Label>
                <RadioGroup
                  value={addressData.type}
                  onValueChange={(value) => handleFieldChange("type", value)}
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
                    <RadioGroupItem value="work" id="work" />
                    <Label htmlFor="work" className="cursor-pointer flex items-center">
                      <Building className="h-4 w-4 mr-1" />
                      Work
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="house_no" className="text-sm font-medium">
                  House No *
                </Label>
                <Input
                  id="house_no"
                  ref={inputRefs.street}
                  value={addressData.house_no || ""}
                  onFocus={() => setActiveInput("street")}
                  onChange={(e) => handleFieldChange("house_no", e.target.value)}
                  placeholder="Enter house number"
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="landmark" className="text-sm font-medium">
                  Landmark
                </Label>
                <Textarea
                  id="landmark"
                  value={addressData.landmark || ""}
                  onChange={(e) => handleFieldChange("landmark", e.target.value)}
                  placeholder="Enter landmark "
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
                  ref={inputRefs.city}
                  value={addressData.city}
                  onFocus={() => setActiveInput("city")}
                  onChange={(e) => handleFieldChange("city", e.target.value)}
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
                  ref={inputRefs.state}
                  value={addressData.state}
                  onFocus={() => setActiveInput("state")}
                  onChange={(e) => handleFieldChange("state", e.target.value)}
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
                  ref={inputRefs.pincode}
                  value={addressData.pincode}
                  onFocus={() => setActiveInput("pincode")}
                  onChange={(e) => handleFieldChange("pincode", e.target.value)}
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
                  ref={inputRefs.phone}
                  value={addressData.phone}
                  onFocus={() => setActiveInput("phone")}
                  onChange={(e) => handleFieldChange("phone", e.target.value)}
                  placeholder="Phone Number"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="alternate_number" className="text-sm font-medium">
                  Alternate Phone Number
                </Label>
                <Input
                  id="alternate_number"
                  ref={inputRefs.alternate_number}
                  value={addressData.alternate_number || ""}
                  onFocus={() => setActiveInput("alternate_number")}
                  onChange={(e) => handleFieldChange("alternate_number", e.target.value)}
                  placeholder="Alternate Phone Number "
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2 flex items-center space-x-2">
                <Checkbox
                  id="default"
                  checked={addressData.isDefault}
                  onCheckedChange={(checked) => handleFieldChange("isDefault", checked)}
                />
                <Label htmlFor="default" className="cursor-pointer text-sm">
                  Set as default address
                </Label>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddressDialog(false);
                setEditingAddress(null);
                setError(null);
                setLocalErrors({});
              }}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              className="bg-[#8B2131] hover:bg-[#6d1926] w-full sm:w-auto"
              onClick={isEditing ? handleEditAddress : handleAddAddress}
              disabled={
                !addressData.name.trim() ||
                Object.values(localErrors).some((e) => e) ||
                !addressData.house_no?.trim() ||
                !addressData.city.trim() ||
                !addressData.state.trim() ||
                !addressData.pincode ||
                !addressData.phone
              }
            >
              {isEditing ? "Update Address" : "Save Address"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

export default AddressDialog;