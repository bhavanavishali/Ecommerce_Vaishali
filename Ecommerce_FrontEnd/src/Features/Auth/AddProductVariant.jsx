

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter, // Added this import
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import api from "../../api";

const AddProductVariantForm = () => {
  const navigate = useNavigate();
  const { product_id } = useParams();
  const [variants, setVariants] = useState([
    {
      gross_weight: "",
      gold_price: "",
      stone_rate: "",
      making_charge: "",
      tax: "",
      stock: "",
      available: true,
      is_active: true,
    },
  ]);
  const [existingVariants, setExistingVariants] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);

  // Fetch taxes and existing variants
  useEffect(() => {
    const fetchTaxes = async () => {
      try {
        const response = await api.get("productapp/taxes/");
        setTaxes(response.data);
      } catch (error) {
        console.error("Error fetching taxes:", error);
        setError("Failed to load tax options.");
      }
    };

    const fetchVariants = async () => {
      try {
        const response = await api.get(`productapp/products/${product_id}/variants/`);
        setExistingVariants(response.data);
      } catch (error) {
        console.error("Error fetching variants:", error);
        setError("Failed to load existing variants.");
      }
    };

    fetchTaxes();
    fetchVariants();
  }, [product_id]);

  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVariants = [...variants];
    updatedVariants[index][name] = value;
    setVariants(updatedVariants);
  };

  const handleVariantSwitchChange = (index, name, checked) => {
    const updatedVariants = [...variants];
    updatedVariants[index][name] = checked;
    setVariants(updatedVariants);
  };

  const handleVariantSelectChange = (index, name, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index][name] = value;
    setVariants(updatedVariants);
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        gross_weight: "",
        gold_price: "",
        stone_rate: "",
        making_charge: "",
        tax: "",
        stock: "",
        available: true,
        is_active: true,
      },
    ]);
  };

  const removeVariant = (index) => {
    if (variants.length > 1) {
      setVariants((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleToggleActive = async (variantId, isActive) => {
    try {
      await api.patch(`productapp/variants/${variantId}/`, { is_active: !isActive });
      setExistingVariants((prev) =>
        prev.map((v) =>
          v.id === variantId ? { ...v, is_active: !isActive } : v
        )
      );
    } catch (error) {
      console.error("Error toggling variant status:", error);
      setError("Failed to update variant status.");
    }
  };

  const handleDeleteVariant = async (variantId) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await api.delete(`productapp/variants/${variantId}/`);
      setExistingVariants((prev) => prev.filter((v) => v.id !== variantId));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error deleting variant:", error);
      setError("Failed to delete variant.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditVariant = (variant) => {
    setEditingVariant({
      id: variant.id,
      gross_weight: variant.gross_weight.toString(),
      gold_price: variant.gold_price.toString(),
      stone_rate: variant.stone_rate.toString(),
      making_charge: variant.making_charge.toString(),
      tax: variant.tax.id ? variant.tax.id.toString() : variant.tax.toString(),
      stock: variant.stock.toString(),
      available: variant.available,
      is_active: variant.is_active,
    });
    setEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingVariant((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSwitchChange = (name, checked) => {
    setEditingVariant((prev) => ({ ...prev, [name]: checked }));
  };

  const handleEditSelectChange = (name, value) => {
    setEditingVariant((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate variants
    for (const variant of variants) {
      if (
        !variant.gross_weight ||
        !variant.gold_price ||
        !variant.making_charge ||
        !variant.tax ||
        !variant.stock
      ) {
        setError("All required variant fields (Gross Weight, Gold Price, Making Charge, Tax, Stock) must be filled.");
        return;
      }
      if (
        parseFloat(variant.gross_weight) <= 0 ||
        parseFloat(variant.gold_price) <= 0 ||
        parseFloat(variant.making_charge) < 0 ||
        parseFloat(variant.stone_rate) < 0 ||
        parseInt(variant.stock) < 0
      ) {
        setError("Variant values must be valid (Gross Weight and Gold Price > 0, Making Charge and Stone Rate >= 0, Stock >= 0).");
        return;
      }
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const formattedVariants = variants.map((variant) => ({
        gross_weight: parseFloat(variant.gross_weight) || 0,
        gold_price: parseFloat(variant.gold_price) || 0,
        stone_rate: parseFloat(variant.stone_rate) || 0,
        making_charge: parseFloat(variant.making_charge) || 0,
        tax: parseInt(variant.tax),
        stock: parseInt(variant.stock) || 0,
        available: variant.available,
        is_active: variant.is_active,
      }));

      await api.post(`productapp/products/${product_id}/variants/`, formattedVariants);

      setSuccess(true);
      setVariants([
        {
          gross_weight: "",
          gold_price: "",
          stone_rate: "",
          making_charge: "",
          tax: "",
          stock: "",
          available: true,
          is_active: true,
        },
      ]);
      const response = await api.get(`productapp/products/${product_id}/variants/`);
      setExistingVariants(response.data);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      console.error("Error:", err);
      if (err.response) {
        const errorMessages =
          typeof err.response.data === "object"
            ? Object.entries(err.response.data)
                .map(([key, value]) => `${key}: ${value}`)
                .join(", ")
            : err.response.data || "Server rejected the data";
        setError(`Validation error: ${errorMessages}`);
      } else if (err.request) {
        setError("No response from server. Please check your connection.");
      } else {
        setError("Error setting up request: " + err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (
      !editingVariant.gross_weight ||
      !editingVariant.gold_price ||
      !editingVariant.making_charge ||
      !editingVariant.tax ||
      !editingVariant.stock
    ) {
      setError("All required fields must be filled.");
      return;
    }

    if (
      parseFloat(editingVariant.gross_weight) <= 0 ||
      parseFloat(editingVariant.gold_price) <= 0 ||
      parseFloat(editingVariant.making_charge) < 0 ||
      parseFloat(editingVariant.stone_rate) < 0 ||
      parseInt(editingVariant.stock) < 0
    ) {
      setError("Values must be valid (Gross Weight and Gold Price > 0, Making Charge and Stone Rate >= 0, Stock >= 0).");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formattedVariant = {
        gross_weight: parseFloat(editingVariant.gross_weight) || 0,
        gold_price: parseFloat(editingVariant.gold_price) || 0,
        stone_rate: parseFloat(editingVariant.stone_rate) || 0,
        making_charge: parseFloat(editingVariant.making_charge) || 0,
        tax: parseInt(editingVariant.tax),
        stock: parseInt(editingVariant.stock) || 0,
        available: editingVariant.available,
        is_active: editingVariant.is_active,
      };

      await api.patch(`productapp/variants/${editingVariant.id}/`, formattedVariant);

      setSuccess(true);
      setEditModalOpen(false);
      const response = await api.get(`productapp/products/${product_id}/variants/`);
      setExistingVariants(response.data);
    } catch (err) {
      console.error("Error updating variant:", err);
      if (err.response) {
        const errorMessages =
          typeof err.response.data === "object"
            ? Object.entries(err.response.data)
                .map(([key, value]) => `${key}: ${value}`)
                .join(", ")
            : err.response.data || "Server rejected the data";
        setError(`Validation error: ${errorMessages}`);
      } else if (err.request) {
        setError("No response from server. Please check your connection.");
      } else {
        setError("Error setting up request: " + err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Add Product Variants</h2>
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 border-[#7a2828] text-[#7a2828] hover:bg-[#7a2828] hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Operation successful!
        </div>
      )}

      {/* Existing Variants Listing */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Existing Variants</h3>
        {existingVariants.length > 0 ? (
          <div className="border rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Weight (g)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gold Price (₹)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stone Rate (₹)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Making Charge (₹)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {existingVariants.map((variant) => (
                  <tr key={variant.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{variant.gross_weight}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{variant.gold_price}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{variant.stone_rate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{variant.making_charge}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{variant.tax.name} ({variant.tax.percentage}%)</td>
                    <td className="px-6 py-4 whitespace-nowrap">{variant.stock}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{variant.available ? "Yes" : "No"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Switch
                        checked={variant.is_active}
                        onCheckedChange={() => handleToggleActive(variant.id, variant.is_active)}
                        className={`${
                          variant.is_active
                            ? "bg-green-500 data-[state=checked]:bg-green-500"
                            : "bg-red-500 data-[state=unchecked]:bg-red-500"
                        }`}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditVariant(variant)}
                          className="flex items-center gap-1 px-2 py-1"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1 px-2 py-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-white">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the variant with gross weight {variant.gross_weight}g.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-600"
                                onClick={() => handleDeleteVariant(variant.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No variants found for this product.</p>
        )}
      </div>

      {/* Add/Edit Variant Form */}
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <h3 className="text-lg font-semibold mb-3">Add Variants</h3>
          {variants.map((variant, index) => (
            <div key={index} className="border p-4 rounded-lg mb-4">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Gross Weight (g)
                  </label>
                  <Input
                    name="gross_weight"
                    type="number"
                    value={variant.gross_weight}
                    onChange={(e) => handleVariantChange(index, e)}
                    placeholder="Gross Weight"
                    className="bg-gray-50"
                    required
                    min="0.01"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Gold Price (₹)
                  </label>
                  <Input
                    name="gold_price"
                    type="number"
                    value={variant.gold_price}
                    onChange={(e) => handleVariantChange(index, e)}
                    placeholder="Gold Price"
                    className="bg-gray-50"
                    required
                    min="0.01"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Stone Rate (₹)
                  </label>
                  <Input
                    name="stone_rate"
                    type="number"
                    value={variant.stone_rate}
                    onChange={(e) => handleVariantChange(index, e)}
                    placeholder="Stone Rate"
                    className="bg-gray-50"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Making Charge (₹)
                  </label>
                  <Input
                    name="making_charge"
                    type="number"
                    value={variant.making_charge}
                    onChange={(e) => handleVariantChange(index, e)}
                    placeholder="Making Charge"
                    className="bg-gray-50"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tax
                  </label>
                  <Select
                    onValueChange={(val) => handleVariantSelectChange(index, "tax", val)}
                    value={variant.tax}
                    required
                  >
                    <SelectTrigger className="bg-gray-50">
                      <SelectValue placeholder="Select Tax" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {taxes.length > 0 ? (
                        taxes.map((tax) => (
                          <SelectItem key={tax.id} value={tax.id.toString()}>
                            {tax.name} ({tax.percentage}%)
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="1">Default Tax (5%)</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Stock
                  </label>
                  <Input
                    name="stock"
                    type="number"
                    value={variant.stock}
                    onChange={(e) => handleVariantChange(index, e)}
                    placeholder="Stock"
                    className="bg-gray-50"
                    required
                    min="0"
                    step="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Available
                  </label>
                  <Switch
                    checked={variant.available}
                    onCheckedChange={(checked) =>
                      handleVariantSwitchChange(index, "available", checked)
                    }
                    className={`${
                      variant.available
                        ? "bg-green-500 data-[state=checked]:bg-green-500"
                        : "bg-red-500 data-[state=unchecked]:bg-red-500"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Active
                  </label>
                  <Switch
                    checked={variant.is_active}
                    onCheckedChange={(checked) =>
                      handleVariantSwitchChange(index, "is_active", checked)
                    }
                    className={`${
                      variant.is_active
                        ? "bg-green-500 data-[state=checked]:bg-green-500"
                        : "bg-red-500 data-[state=unchecked]:bg-red-500"
                    }`}
                  />
                </div>
              </div>
              <Button
                type="button"
                onClick={() => removeVariant(index)}
                className="mt-4 bg-red-900 hover:bg-red-600 text-white"
                disabled={variants.length <= 1}
              >
                Remove Variant
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={addVariant}
            className="bg-gray-500 hover:bg-gray-600 text-white"
          >
            + Add Variant
          </Button>
        </div>

        <Button
          type="submit"
          className="w-full bg-[#8c2a2a] hover:bg-[#7a2424] text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding Variants..." : "Add Variants"}
        </Button>
      </form>

      {/* Edit Variant Modal */}
      {editingVariant && (
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent className="sm:max-w-[600px] bg-white">
            <DialogHeader>
              <DialogTitle>Edit Variant</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Gross Weight (g)
                  </label>
                  <Input
                    name="gross_weight"
                    type="number"
                    value={editingVariant.gross_weight}
                    onChange={handleEditChange}
                    placeholder="Gross Weight"
                    required
                    min="0.01"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Gold Price (₹)
                  </label>
                  <Input
                    name="gold_price"
                    type="number"
                    value={editingVariant.gold_price}
                    onChange={handleEditChange}
                    placeholder="Gold Price"
                    required
                    min="0.01"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Stone Rate (₹)
                  </label>
                  <Input
                    name="stone_rate"
                    type="number"
                    value={editingVariant.stone_rate}
                    onChange={handleEditChange}
                    placeholder="Stone Rate"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Making Charge (₹)
                  </label>
                  <Input
                    name="making_charge"
                    type="number"
                    value={editingVariant.making_charge}
                    onChange={handleEditChange}
                    placeholder="Making Charge"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tax
                  </label>
                  <Select
                    onValueChange={(val) => handleEditSelectChange("tax", val)}
                    value={editingVariant.tax}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Tax" />
                    </SelectTrigger>
                    <SelectContent>
                      {taxes.length > 0 ? (
                        taxes.map((tax) => (
                          <SelectItem key={tax.id} value={tax.id.toString()}>
                            {tax.name} ({tax.percentage}%)
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="1">Default Tax (5%)</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Stock
                  </label>
                  <Input
                    name="stock"
                    type="number"
                    value={editingVariant.stock}
                    onChange={handleEditChange}
                    placeholder="Stock"
                    required
                    min="0"
                    step="1"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Available
                  </label>
                  <Switch
                    checked={editingVariant.available}
                    onCheckedChange={(checked) => handleEditSwitchChange("available", checked)}
                    className={`${
                      editingVariant.available
                        ? "bg-green-500 data-[state=checked]:bg-green-500"
                        : "bg-red-500 data-[state=unchecked]:bg-red-500"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Active
                  </label>
                  <Switch
                    checked={editingVariant.is_active}
                    onCheckedChange={(checked) => handleEditSwitchChange("is_active", checked)}
                    className={`${
                      editingVariant.is_active
                        ? "bg-green-500 data-[state=checked]:bg-green-500"
                        : "bg-red-500 data-[state=unchecked]:bg-red-500"
                    }`}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#8c2a2a] hover:bg-[#7a2424] text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update Variant"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AddProductVariantForm;