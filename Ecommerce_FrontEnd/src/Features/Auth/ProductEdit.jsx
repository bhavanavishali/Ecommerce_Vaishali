
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { X, Upload, ZoomIn, ZoomOut, Crop, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import Cropper from "react-easy-crop";
import api from "../../api";
import { useParams, useNavigate } from "react-router-dom";

const getImageUrl = (image, baseUrl) => {
  if (!image) return "";
  if (typeof image === "string") return image.startsWith("http") ? image : `${baseUrl}${image}`;
  const value = image.url || image.image || image.path || "";
  return value.startsWith("http") ? value : `${baseUrl}${value}`;
};

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [categories, setCategories] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [productData, setProductData] = useState({
    name: "",
    category: "",
    product_type: "clothing",
    description: "",
    gender: "",
    occasion: "",
    size: "",
    color: "",
    fabric: "",
    material: "",
    fixed_price: "",
    stock: "",
    tax: "",
    discount: "",
    available: true,
    is_active: true,
    product_offer_Isactive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [existingImages, setExistingImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isExistingImage, setIsExistingImage] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [categoryRes, taxRes, productRes] = await Promise.all([
          api.get("productapp/user/categories/"),
          api.get("productapp/taxes/"),
          api.get(`productapp/products/${id}/`),
        ]);

        const product = productRes.data;
        const defaultVariant = product.variants?.find((variant) => variant.is_default) || product.variants?.[0];

        setCategories(categoryRes.data);
        setTaxes(taxRes.data);
        setProductData({
          name: product.name || "",
          category: product.category?.toString() || "",
          product_type: product.product_type || "clothing",
          description: product.description || "",
          gender: product.gender || "",
          occasion: product.occasion || "",
          size: product.size || "",
          color: product.color || product.gold_color || "",
          fabric: product.fabric || "",
          material: product.material || "",
          fixed_price: (product.fixed_price ?? defaultVariant?.fixed_price ?? "").toString(),
          stock: (product.stock ?? defaultVariant?.stock ?? "").toString(),
          tax: (product.tax ?? defaultVariant?.tax ?? "").toString(),
          discount: (product.discount ?? 0).toString(),
          available: product.available ?? true,
          is_active: product.is_active ?? true,
          product_offer_Isactive: product.product_offer_Isactive ?? true,
        });

        const images = Array.isArray(product.image) ? product.image : [];
        setExistingImages(images);
        setImagePreviews(images.map((image) => getImageUrl(image, BASE_URL)));
      } catch (err) {
        console.error("Error fetching product edit data:", err);
        setError("Failed to load product details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [BASE_URL, id]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview, index) => {
        if (index >= existingImages.length && preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [existingImages.length, imagePreviews]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name, checked) => {
    setProductData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const file = files[0];
    setCurrentImage({ file, url: URL.createObjectURL(file) });
    setCurrentImageIndex(null);
    setIsExistingImage(false);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setIsEditModalOpen(true);
  };

  const removeImage = (index) => {
    if (index < existingImages.length) {
      const imageToDelete = existingImages[index];
      if (imageToDelete?.id) {
        setImagesToDelete((prev) => [...prev, imageToDelete.id]);
      }
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      const localIndex = index - existingImages.length;
      const preview = imagePreviews[index];
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
      setImageFiles((prev) => prev.filter((_, i) => i !== localIndex));
    }
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const editImage = (index) => {
    setCurrentImageIndex(index);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);

    if (index < existingImages.length) {
      setCurrentImage({ file: null, url: imagePreviews[index] });
      setIsExistingImage(true);
    } else {
      const localIndex = index - existingImages.length;
      setCurrentImage({ file: imageFiles[localIndex], url: imagePreviews[index] });
      setIsExistingImage(false);
    }

    setIsEditModalOpen(true);
  };

  const onCropComplete = (_, pixels) => {
    setCroppedAreaPixels(pixels);
  };

  const createCroppedImage = async () => {
    if (!currentImage || !croppedAreaPixels) return null;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const image = new Image();
    image.src = currentImage.url;

    return new Promise((resolve, reject) => {
      image.onload = () => {
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;
        context.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );

        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("Failed to crop image"));
            return;
          }

          const fileName = currentImage.file?.name || `cropped-${Date.now()}.jpg`;
          resolve({
            file: new File([blob], fileName, {
              type: "image/jpeg",
              lastModified: Date.now(),
            }),
            url: URL.createObjectURL(blob),
          });
        }, "image/jpeg", 0.9);
      };
      image.onerror = () => reject(new Error("Failed to load image"));
    });
  };

  const saveCroppedImage = async () => {
    try {
      const croppedImage = await createCroppedImage();
      if (!croppedImage) return;

      if (currentImageIndex !== null) {
        const nextPreviews = [...imagePreviews];
        const oldPreview = nextPreviews[currentImageIndex];
        if (oldPreview?.startsWith("blob:")) {
          URL.revokeObjectURL(oldPreview);
        }
        nextPreviews[currentImageIndex] = croppedImage.url;
        setImagePreviews(nextPreviews);

        if (isExistingImage) {
          setImageFiles((prev) => [...prev, croppedImage.file]);
          const existingImage = existingImages[currentImageIndex];
          if (existingImage?.id) {
            setImagesToDelete((prev) => [...prev, existingImage.id]);
          }
          setExistingImages((prev) => prev.filter((_, index) => index !== currentImageIndex));
        } else {
          const localIndex = currentImageIndex - existingImages.length;
          setImageFiles((prev) => {
            const next = [...prev];
            next[localIndex] = croppedImage.file;
            return next;
          });
        }
      } else {
        setImageFiles((prev) => [...prev, croppedImage.file]);
        setImagePreviews((prev) => [...prev, croppedImage.url]);
      }
    } catch (err) {
      console.error("Error saving cropped image:", err);
      setError("Failed to crop image.");
    } finally {
      setCurrentImage(null);
      setCurrentImageIndex(null);
      setIsExistingImage(false);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
      setIsEditModalOpen(false);
    }
  };

  const cancelImageEdit = () => {
    if (currentImage?.url?.startsWith("blob:")) {
      URL.revokeObjectURL(currentImage.url);
    }
    setCurrentImage(null);
    setCurrentImageIndex(null);
    setIsExistingImage(false);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setIsEditModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!productData.name || !productData.category || !productData.fixed_price || productData.stock === "" || !productData.tax) {
      setError("Please fill the required fields: Name, Category, Fixed Price, Stock, and Tax.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...productData,
        category: Number(productData.category),
        tax: Number(productData.tax),
        fixed_price: Number.parseFloat(productData.fixed_price),
        stock: Number.parseInt(productData.stock, 10),
        discount: productData.discount ? Number.parseFloat(productData.discount) : 0,
      };

      await api.patch(`productapp/products/${id}/`, payload);

      if (imagesToDelete.length > 0) {
        await Promise.all(imagesToDelete.map((imageId) => api.delete(`productapp/product-images/${imageId}/`)));
      }

      if (imageFiles.length > 0) {
        const formData = new FormData();
        imageFiles.forEach((file) => formData.append("images", file));
        await api.post(`productapp/products/${id}/images/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      console.error("Error updating product:", err);
      if (err.response?.data && typeof err.response.data === "object") {
        setError(
          Object.entries(err.response.data)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ")
        );
      } else {
        setError("Failed to update product.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  const isClothing = productData.product_type === "clothing";
  const isJewelry = productData.product_type === "imitation_jewelry";

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Edit Product</h2>
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 border-[#023d12]  text-[#023d12]  hover:bg-[#023d12]  hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">Product updated successfully!</div>}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Product Name *</label>
            <Input name="name" value={productData.name} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Product Type *</label>
            <Select value={productData.product_type} onValueChange={(value) => handleSelectChange("product_type", value)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="imitation_jewelry">Imitation Jewelry</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <Select value={productData.category} onValueChange={(value) => handleSelectChange("category", value)}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent className="bg-white">
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <Select value={productData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
              <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Unisex">Unisex</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Fixed Price (£) *</label>
            <Input name="fixed_price" type="number" min="1" step="0.01" value={productData.fixed_price} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock *</label>
            <Input name="stock" type="number" min="0" value={productData.stock} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tax *</label>
            <Select value={productData.tax} onValueChange={(value) => handleSelectChange("tax", value)}>
              <SelectTrigger><SelectValue placeholder="Select tax" /></SelectTrigger>
              <SelectContent className="bg-white">
                {taxes.map((tax) => (
                  <SelectItem key={tax.id} value={tax.id.toString()}>
                    {tax.name} ({tax.percentage}%)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Size</label>
            <Input name="size" value={productData.size} onChange={handleChange} placeholder="S, M, L, 32..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Color</label>
            <Input name="color" value={productData.color} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Discount (%)</label>
            <Input name="discount" type="number" min="0" max="100" step="0.01" value={productData.discount} onChange={handleChange} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Availability</label>
            <Select value={productData.available ? "true" : "false"} onValueChange={(value) => handleSelectChange("available", value === "true")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="true">In Stock</SelectItem>
                <SelectItem value="false">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <span className="text-sm font-medium">Product Active</span>
            <Switch checked={productData.is_active} onCheckedChange={(checked) => handleSwitchChange("is_active", checked)} />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-md border p-3">
          <span className="text-sm font-medium">Offer Active</span>
          <Switch checked={productData.product_offer_Isactive} onCheckedChange={(checked) => handleSwitchChange("product_offer_Isactive", checked)} />
        </div>

        {isClothing && (
          <div>
            <label className="block text-sm font-medium mb-1">Fabric</label>
            <Input name="fabric" value={productData.fabric} onChange={handleChange} placeholder="Cotton, Silk..." />
          </div>
        )}

        {isJewelry && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Material</label>
              <Input name="material" value={productData.material} onChange={handleChange} placeholder="Alloy, Brass..." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Occasion</label>
              <Input name="occasion" value={productData.occasion} onChange={handleChange} />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea name="description" value={productData.description} onChange={handleChange} className="min-h-[100px]" />
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Product Images</h3>
          <div className="flex flex-wrap gap-4 mb-4">
            {imagePreviews.map((preview, index) => (
              <div key={`${preview}-${index}`} className="relative group">
                <img src={preview || "/placeholder.svg"} alt={`Preview ${index + 1}`} className="w-24 h-24 object-cover border rounded-md" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button type="button" onClick={() => editImage(index)} className="bg-white text-gray-800 rounded-full p-1 mx-1">
                    <Crop size={16} />
                  </button>
                  <button type="button" onClick={() => removeImage(index)} className="bg-white text-red-500 rounded-full p-1 mx-1">
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
            <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 text-gray-400" />
                <p className="text-xs text-gray-500 mt-1">Add Image</p>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} />
            </label>
          </div>
        </div>

        <Button type="submit" className="w-full bg-[#8c2a2a] hover:bg-[#7a2424] text-white" disabled={isSubmitting}>
          {isSubmitting ? "Updating Product..." : "Update Product"}
        </Button>
      </form>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col bg-white">
          <DialogHeader>
            <DialogTitle>Edit Image</DialogTitle>
          </DialogHeader>
          <div className="relative flex-grow my-4" style={{ height: "400px" }}>
            {currentImage && (
              <Cropper
                image={currentImage.url}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            )}
          </div>
          <div className="flex items-center gap-2 my-4">
            <ZoomOut className="text-gray-500" />
            <Slider value={[zoom]} min={1} max={3} step={0.1} onValueChange={(value) => setZoom(value[0])} className="flex-grow" />
            <ZoomIn className="text-gray-500" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={cancelImageEdit}>Cancel</Button>
            <Button onClick={saveCroppedImage}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductEdit;