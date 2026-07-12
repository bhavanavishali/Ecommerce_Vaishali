import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { X, Upload, ZoomIn, ZoomOut, Crop, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import api from "../../api";
import Cropper from "react-easy-crop";

const AddProductForm = () => {
  const navigate = useNavigate();
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
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [pendingImages, setPendingImages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, taxRes] = await Promise.all([
          api.get("productapp/user/categories/"),
          api.get("productapp/taxes/"),
        ]);
        setCategories(catRes.data);
        setTaxes(taxRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load categories or taxes.");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
      pendingImages.forEach(({ url }) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews, pendingImages]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const newPendingImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setPendingImages((prev) => [...prev, ...newPendingImages]);
    if (newPendingImages.length > 0 && !isEditModalOpen) {
      setCurrentImage(newPendingImages[0]);
      setCurrentImageIndex(null);
      setIsEditModalOpen(true);
    }
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const editImage = (index) => {
    setCurrentImageIndex(index);
    setCurrentImage({ file: imageFiles[index], url: imagePreviews[index] });
    setIsEditModalOpen(true);
  };

  const onCropComplete = (_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const createCroppedImage = async () => {
    if (!croppedAreaPixels) return null;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.src = currentImage.url;

    return new Promise((resolve, reject) => {
      image.onload = () => {
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;
        ctx.drawImage(
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
          if (!blob) return reject(new Error("Failed to create blob"));
          const croppedFile = new File([blob], currentImage.file.name, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
          resolve({ file: croppedFile, url: URL.createObjectURL(blob) });
        }, "image/jpeg", 0.9);
      };
      image.onerror = () => reject(new Error("Failed to load image"));
    });
  };

  const saveCroppedImage = async () => {
    const croppedImage = await createCroppedImage();
    if (!croppedImage) return;

    if (currentImageIndex !== null) {
      const newFiles = [...imageFiles];
      const newPreviews = [...imagePreviews];
      URL.revokeObjectURL(imagePreviews[currentImageIndex]);
      newFiles[currentImageIndex] = croppedImage.file;
      newPreviews[currentImageIndex] = croppedImage.url;
      setImageFiles(newFiles);
      setImagePreviews(newPreviews);
    } else {
      setImageFiles((prev) => [...prev, croppedImage.file]);
      setImagePreviews((prev) => [...prev, croppedImage.url]);
    }

    setPendingImages((prev) => {
      const remaining = prev.slice(1);
      if (remaining.length > 0) {
        setCurrentImage(remaining[0]);
        setCurrentImageIndex(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
        return remaining;
      }
      setIsEditModalOpen(false);
      setCurrentImage(null);
      setCurrentImageIndex(null);
      return [];
    });
  };

  const cancelImageEdit = () => {
    if (currentImage) URL.revokeObjectURL(currentImage.url);
    setIsEditModalOpen(false);
    setCurrentImage(null);
    setCurrentImageIndex(null);
    setPendingImages([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !productData.name ||
      !productData.category ||
      !productData.product_type ||
      !productData.fixed_price ||
      productData.stock === "" ||
      !productData.tax
    ) {
      setError("Please fill required fields: Name, Category, Type, Fixed Price, Stock, Tax");
      return;
    }

    if (pendingImages.length > 0) {
      setError("Please crop all selected images before submitting.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        ...productData,
        category: Number(productData.category),
        tax: Number(productData.tax),
        fixed_price: Number.parseFloat(productData.fixed_price),
        stock: Number.parseInt(productData.stock, 10),
        discount: productData.discount ? Number.parseFloat(productData.discount) : 0,
      };

      const response = await api.post("productapp/products/", payload);
      const productId = response.data.id;

      if (imageFiles.length > 0) {
        const formData = new FormData();
        imageFiles.forEach((file) => formData.append("images", file));
        await api.post(`productapp/products/${productId}/images/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      const errorMessages =
        err.response?.data && typeof err.response.data === "object"
          ? Object.entries(err.response.data).map(([k, v]) => `${k}: ${v}`).join(", ")
          : "Failed to add product";
      setError(errorMessages);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isClothing = productData.product_type === "clothing";
  const isJewelry = productData.product_type === "imitation_jewelry";

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Add Product</h2>
        <Button variant="outline" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">Product added successfully!</div>}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Product Name *</label>
            <Input name="name" value={productData.name} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Product Type *</label>
            <Select
              value={productData.product_type}
              onValueChange={(val) => setProductData((prev) => ({ ...prev, product_type: val }))}
            >
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
            <Select
              value={productData.category}
              onValueChange={(val) => setProductData((prev) => ({ ...prev, category: val }))}
            >
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <Select
              value={productData.gender}
              onValueChange={(val) => setProductData((prev) => ({ ...prev, gender: val }))}
            >
              <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Unisex">Unisex</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Fixed Price (₹) *</label>
            <Input name="fixed_price" type="number" min="1" step="0.01" value={productData.fixed_price} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock *</label>
            <Input name="stock" type="number" min="0" value={productData.stock} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tax *</label>
            <Select
              value={productData.tax}
              onValueChange={(val) => setProductData((prev) => ({ ...prev, tax: val }))}
            >
              <SelectTrigger><SelectValue placeholder="Select tax" /></SelectTrigger>
              <SelectContent>
                {taxes.map((t) => (
                  <SelectItem key={t.id} value={t.id.toString()}>{t.name} ({t.percentage}%)</SelectItem>
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
            <Input name="discount" type="number" min="0" max="100" value={productData.discount} onChange={handleChange} />
          </div>
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
          <Textarea name="description" value={productData.description} onChange={handleChange} />
        </div>

        {/* Image upload section - keep your existing preview/crop UI */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Product Images</h3>
          <div className="flex flex-wrap gap-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <img src={preview} alt="" className="w-24 h-24 object-cover border rounded-md" />
                <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-white rounded-full p-1">
                  <X size={14} />
                </button>
                <button type="button" onClick={() => editImage(index)} className="absolute bottom-1 right-1 bg-white rounded-full p-1">
                  <Crop size={14} />
                </button>
              </div>
            ))}
            <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed rounded-md cursor-pointer">
              <Upload className="w-6 h-6" />
              <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageSelect} />
            </label>
          </div>
        </div>

        <Button type="submit" className="w-full bg-[#8c2a2a] hover:bg-[#7a2424] text-white" disabled={isSubmitting}>
          {isSubmitting ? "Adding Product..." : "Add Product"}
        </Button>
      </form>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader><DialogTitle>Crop Image</DialogTitle></DialogHeader>
          <div className="relative h-[400px]">
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
          <div className="flex items-center gap-2">
            <ZoomOut /><Slider value={[zoom]} min={1} max={3} step={0.1} onValueChange={(v) => setZoom(v[0])} /><ZoomIn />
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

export default AddProductForm;