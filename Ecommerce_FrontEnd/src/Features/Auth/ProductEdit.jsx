// "use client"

// import { useState, useEffect } from "react"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Textarea } from "@/components/ui/textarea"
// import { X, Upload, ZoomIn, ZoomOut, Crop } from "lucide-react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
// import { Slider } from "@/components/ui/slider"
// import Cropper from "react-easy-crop"
// import api from '../../api'
// import { useParams } from "react-router-dom"
// import { useNavigate } from "react-router-dom"

// const ProductEdit = () => {
//   const { id } = useParams();
//   const isEditMode = !!id;
//   const navigate=useNavigate()
//   const [categories, setCategories] = useState([]);
//   const [productData, setProductData] = useState({
//     name: "",
//     category: "",
//     description: "",
//     occasion: "",
//     gender: "",
//     is_active: true,
//     bis_hallmark: "",
//     size: "",
//     available: true,
//     gold_color: "",
//     offer: "",
//     variants: [{ gross_weight: "", stock: "", gold_price: "", making_charge: "", tax: "" }],
//     images: [], // Will store image objects from API (id, product, image)

//   });
//   const BASE_URL = "http://127.0.0.1:8000"
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isLoading, setIsLoading] = useState(isEditMode);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);

//   // Image-related state
//   const [imageFiles, setImageFiles] = useState([]); // New or edited image files
//   const [imagePreviews, setImagePreviews] = useState([]); // Previews for new or edited images
//   const [existingImages, setExistingImages] = useState([]); // Images from API
//   const [imagesToDelete, setImagesToDelete] = useState([]); // Track images to delete

//   // Image editing state
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [currentImage, setCurrentImage] = useState(null);
//   const [currentImageIndex, setCurrentImageIndex] = useState(null);
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
//   const [isExistingImage, setIsExistingImage] = useState(false); // Track if editing an existing image

//   // Fetch categories on component mount
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await api.get('productapp/user/categories/');
//         setCategories(response.data);
//         console.log('Categories loaded:', response.data);
//       } catch (error) {
//         console.error('Error fetching categories:', error);
//         setError('Failed to load categories. Please refresh the page.');
//       }
//     };

//     fetchCategories();
//   }, []);

//   // Fetch product data if in edit mode
//   useEffect(() => {
//     if (isEditMode) {
//       const fetchProductData = async () => {
//         setIsLoading(true);
//         try {
//           const response = await api.get(`productapp/products/${id}/`);
//           const product = response.data;

//           // Format the data for the form
//           setProductData({
//             name: product.name || "",
//             category: product.category ? product.category.toString() : "",
//             description: product.description || "",
//             occasion: product.occasion || "",
//             gender: product.gender || "",
//             is_active: product.is_active !== undefined ? product.is_active : true,
//             bis_hallmark: product.bis_hallmark || "",
//             size: product.size || "",
//             available: product.available !== undefined ? product.available : true,
//             gold_color: product.gold_color || "",
//             offer: product.offer || "",
//             variants: product.variants && product.variants.length > 0
//               ? product.variants.map(v => ({
//                   id: v.id,
//                   gross_weight: v.gross_weight?.toString() || "",
//                   stock: v.stock?.toString() || "",
//                   gold_price: v.gold_price?.toString() || "",
//                   making_charge: v.making_charge?.toString() || "",
//                   tax: v.tax?.toString() || ""
//                 }))
//               : [{ gross_weight: "", stock: "", gold_price: "", making_charge: "", tax: "" }],
//             images: product.image || [], // Store API images
//           });

        
//           setExistingImages(product.image || []);
//           setImagePreviews((product.image || []).map(img => img.image));

//           console.log('Product loaded:', product);
//         } catch (error) {
//           console.error('Error fetching product:', error);
//           setError('Failed to load product details. Please try again.');
//         } finally {
//           setIsLoading(false);
//         }
//       };

//       fetchProductData();
//     }
//   }, [id, isEditMode]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProductData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSelectChange = (name, value) => {
//     setProductData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleVariantChange = (index, e) => {
//     const { name, value } = e.target;
//     const updatedVariants = [...productData.variants];
//     updatedVariants[index][name] = value;
//     setProductData((prev) => ({ ...prev, variants: updatedVariants }));
//   };

//   const addVariant = () => {
//     setProductData((prev) => ({
//       ...prev,
//       variants: [...prev.variants, { gross_weight: "", stock: "", gold_price: "", making_charge: "", tax: "" }],
//     }));
//   };

//   const removeVariant = (index) => {
//     if (productData.variants.length > 1) {
//       setProductData((prev) => ({
//         ...prev,
//         variants: prev.variants.filter((_, i) => i !== index),
//       }));
//     }
//   };

//   // Image handling functions
//   const handleImageSelect = (e) => {
//     const files = Array.from(e.target.files);

//     if (files.length > 0) {
//       const file = files[0];
//       const imageUrl = URL.createObjectURL(file);
//       setCurrentImage({
//         file,
//         url: imageUrl,
//       });
//       setIsExistingImage(false); // This is a new image
//       setIsEditModalOpen(true);
//     }
//   };

//   const removeImage = (index) => {

//     if (index < existingImages.length) {
  
//       const imageToDelete = existingImages[index];
//       setImagesToDelete((prev) => [...prev, imageToDelete.id]);
//       setExistingImages((prev) => prev.filter((_, i) => i !== index));
//     } else {
   
//       const newImageIndex = index - existingImages.length;
//       URL.revokeObjectURL(imagePreviews[index]);
//       setImageFiles((prev) => prev.filter((_, i) => i !== newImageIndex));
//     }

//     setImagePreviews((prev) => prev.filter((_, i) => i !== index));
//     setProductData((prev) => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== index),
//     }));
//   };

//   const editImage = (index) => {
//     setCurrentImageIndex(index);
//     if (index < existingImages.length) {
//       // Editing an existing image
//       setCurrentImage({
//         file: null, // No file for existing image, just the URL
//         url: existingImages[index].image,
//       });
//       setIsExistingImage(true);
//     } else {
//       // Editing a new image
//       const newImageIndex = index - existingImages.length;
//       setCurrentImage({
//         file: imageFiles[newImageIndex],
//         url: imagePreviews[index],
//       });
//       setIsExistingImage(false);
//     }
//     setIsEditModalOpen(true);
//   };

//   const onCropComplete = (croppedArea, croppedAreaPixels) => {
//     setCroppedAreaPixels(croppedAreaPixels);
//   };

//   const createCroppedImage = async () => {
//     try {
//       const canvas = document.createElement("canvas");
//       const ctx = canvas.getContext("2d");
//       const image = new Image();

//       image.src = currentImage.url;

//       return new Promise((resolve) => {
//         image.onload = () => {
//           canvas.width = croppedAreaPixels.width;
//           canvas.height = croppedAreaPixels.height;

//           ctx.drawImage(
//             image,
//             croppedAreaPixels.x,
//             croppedAreaPixels.y,
//             croppedAreaPixels.width,
//             croppedAreaPixels.height,
//             0,
//             0,
//             croppedAreaPixels.width,
//             croppedAreaPixels.height,
//           );

//           canvas.toBlob((blob) => {
//             const croppedFile = new File([blob], `cropped-image-${Date.now()}.jpeg`, {
//               type: "image/jpeg",
//               lastModified: new Date().getTime(),
//             });

//             resolve({
//               file: croppedFile,
//               url: URL.createObjectURL(blob),
//             });
//           }, "image/jpeg");
//         };
//       });
//     } catch (e) {
//       console.error("Error creating cropped image:", e);
//       return null;
//     }
//   };

//   const saveCroppedImage = async () => {
//     if (!croppedAreaPixels) return;

//     const croppedImage = await createCroppedImage();

//     if (croppedImage) {
//       if (currentImageIndex !== null) {
//         // Replace existing or new image
//         const newImagePreviews = [...imagePreviews];
//         URL.revokeObjectURL(imagePreviews[currentImageIndex]);

//         if (isExistingImage) {
//           // If editing an existing image, add to imageFiles for upload
//           setImageFiles((prev) => [...prev, croppedImage.file]);
//         } else {
//           // If editing a new image, replace in imageFiles
//           const newImageIndex = currentImageIndex - existingImages.length;
//           const newImageFiles = [...imageFiles];
//           newImageFiles[newImageIndex] = croppedImage.file;
//           setImageFiles(newImageFiles);
//         }

//         newImagePreviews[currentImageIndex] = croppedImage.url;
//         setImagePreviews(newImagePreviews);
//       } else {
//         // Add new image
//         setImageFiles((prev) => [...prev, croppedImage.file]);
//         setImagePreviews((prev) => [...prev, croppedImage.url]);
//       }
//     }

//     setCurrentImage(null);
//     setCurrentImageIndex(null);
//     setCrop({ x: 0, y: 0 });
//     setZoom(1);
//     setCroppedAreaPixels(null);
//     setIsEditModalOpen(false);
//     setIsExistingImage(false);
//   };

//   const cancelImageEdit = () => {
//     if (currentImage && currentImageIndex === null) {
//       URL.revokeObjectURL(currentImage.url);
//     }

//     setCurrentImage(null);
//     setCurrentImageIndex(null);
//     setCrop({ x: 0, y: 0 });
//     setZoom(1);
//     setCroppedAreaPixels(null);
//     setIsEditModalOpen(false);
//     setIsExistingImage(false);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!productData.name || !productData.category || !productData.description) {
//       setError('Please fill in all required fields');
//       return;
//     }

//     if (productData.variants.some(variant =>
//       !variant.gross_weight || !variant.stock || !variant.gold_price || !variant.making_charge)) {
//       setError('Please complete all variant details');
//       return;
//     }

//     setIsSubmitting(true);
//     setError(null);
//     setSuccess(false);

//     try {
//       // Format the data with proper types
//       const formattedData = {
//         ...productData,
//         category: parseInt(productData.category),
//         variants: productData.variants.map(variant => ({
//           ...(variant.id && { id: variant.id }),
//           gross_weight: parseFloat(variant.gross_weight),
//           stock: parseInt(variant.stock),
//           gold_price: parseFloat(variant.gold_price),
//           making_charge: parseFloat(variant.making_charge),
//           tax: variant.tax ? parseFloat(variant.tax) : 0,
//         })),
//       };

//       console.log('Sending data:', formattedData);

//       let response;

//       if (isEditMode) {
//         // Update existing product
//         response = await api.patch(`productapp/products/${id}/`, formattedData);
//         console.log('Update success:', response.data);
//         navigate('/dashboard')
        
//         if (imagesToDelete.length > 0) {
//           await Promise.all(
//             imagesToDelete.map(imageId =>
//               api.delete(`productapp/product-images/${imageId}/`)
//             )
//           );
//         }

//         // Upload new or edited images
//         if (imageFiles.length > 0) {
//           const formData = new FormData();
//           imageFiles.forEach((file) => {
//             formData.append("images", file);
//           });

//           await api.post(`productapp/products/${id}/images/`, formData, {
//             headers: {
//               "Content-Type": "multipart/form-data",
//             },
//           });
//         }

//         setSuccess(true);
//       } else {
//         // Create new product
//         response = await api.post('productapp/products/', formattedData);
//         console.log('Create success:', response.data);
//         const productId = response.data.id;

//         // Upload images if any
//         if (imageFiles.length > 0) {
//           const formData = new FormData();
//           imageFiles.forEach((file) => {
//             formData.append("images", file);
//           });

//           await api.post(`productapp/products/${productId}/images/`, formData, {
//             headers: {
//               "Content-Type": "multipart/form-data",
//             },
//           });
//         }

//         setSuccess(true);

//         // Reset the form after successful creation
//         setProductData({
//           name: "",
//           category: "",
//           description: "",
//           occasion: "",
//           gender: "",
//           is_active: true,
//           bis_hallmark: "",
//           size: "",
//           available: true,
//           gold_color: "",
//           offer: "",
//           variants: [{ gross_weight: "", stock: "", gold_price: "", making_charge: "", tax: "" }],
//           images: [],
//         });
//         setImageFiles([]);
//         setImagePreviews([]);
//         setExistingImages([]);
//         setImagesToDelete([]);
//       }

//     } catch (err) {
//       console.error('Error:', err);
//       if (err.response) {
//         console.error('Response data:', err.response.data);
//         console.error('Response status:', err.response.status);
//         if (typeof err.response.data === 'object') {
//           const errorMessages = Object.entries(err.response.data)
//             .map(([key, value]) => `${key}: ${value}`)
//             .join(', ');
//           setError(`Validation error: ${errorMessages}`);
//         } else {
//           setError(err.response.data || 'Server rejected the data');
//         }
//       } else if (err.request) {
//         setError('No response from server. Please check your connection.');
//       } else {
//         setError('Error setting up request: ' + err.message);
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (isLoading) {
//     return <div className="flex justify-center items-center h-64">Loading product data...</div>;
//   }

//   return (
//     <div className="max-w-4xl mx-auto">
//       <h2 className="text-2xl font-semibold mb-6">{isEditMode ? 'Edit Product' : 'Add Product'}</h2>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       {success && (
//         <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
//           Product {isEditMode ? 'updated' : 'added'} successfully!
//         </div>
//       )}

//       <form className="space-y-6" onSubmit={handleSubmit}>
//         <div className="grid grid-cols-2 gap-6">
//           <Input
//             name="name"
//             value={productData.name}
//             onChange={handleChange}
//             placeholder="Product Name"
//             className="bg-gray-50"
//             required
//           />
//           <Input
//             name="bis_hallmark"
//             value={productData.bis_hallmark}
//             onChange={handleChange}
//             placeholder="BIS Hallmark ID"
//             className="bg-gray-50"
//           />
//         </div>

//         <div className="grid grid-cols-2 gap-6">
//           <Select
//             onValueChange={(val) => handleSelectChange("category", val)}
//             value={productData.category}
//             required
//           >
//             <SelectTrigger className="bg-gray-50">
//               <SelectValue placeholder="Category" />
//             </SelectTrigger>
//             <SelectContent className='bg-white'>
//               {categories.length > 0 ? (
//                 categories.map(category => (
//                   <SelectItem key={category.id} value={category.id.toString()}>
//                     {category.name}
//                   </SelectItem>
//                 ))
//               ) : (
//                 <>
//                   <SelectItem value="1">Rings</SelectItem>
//                   <SelectItem value="2">Necklaces</SelectItem>
//                   <SelectItem value="3">Bracelets</SelectItem>
//                 </>
//               )}
//             </SelectContent>
//           </Select>

//           <Input
//             name="gold_color"
//             value={productData.gold_color}
//             onChange={handleChange}
//             placeholder="Gold Color"
//             className="bg-gray-50"
//           />
//         </div>

//         <div className="grid grid-cols-2 gap-6">
//           <Input
//             name="size"
//             value={productData.size}
//             onChange={handleChange}
//             placeholder="Size"
//             className="bg-gray-50"
//           />
//           <Select
//             onValueChange={(val) => handleSelectChange("occasion", val)}
//             value={productData.occasion}
//           >
//             <SelectTrigger className="bg-gray-50">
//               <SelectValue placeholder="Occasion" />
//             </SelectTrigger>
//             <SelectContent className='bg-white'>
//               <SelectItem value="Wedding">Wedding</SelectItem>
//               <SelectItem value="Anniversary">Anniversary</SelectItem>
//               <SelectItem value="Birthday">Birthday</SelectItem>
//               <SelectItem value="Festival">Festival</SelectItem>
//               <SelectItem value="Casual">Casual</SelectItem>
//               <SelectItem value="Other">Other</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <div className="grid grid-cols-3 gap-6">
//           <Select
//             onValueChange={(val) => handleSelectChange("gender", val)}
//             value={productData.gender}
//           >
//             <SelectTrigger className="bg-gray-50">
//               <SelectValue placeholder="Gender" />
//             </SelectTrigger>
//             <SelectContent className='bg-white'>
//               <SelectItem value="Male">Male</SelectItem>
//               <SelectItem value="Female">Female</SelectItem>
//               <SelectItem value="Unisex">Unisex</SelectItem>
//             </SelectContent>
//           </Select>

//           <Input
//             name="offer"
//             value={productData.offer}
//             onChange={handleChange}
//             placeholder="Product Offer"
//             className="bg-gray-50"
//           />

//           <Select
//             onValueChange={(val) => handleSelectChange("available", val === "true")}
//             value={productData.available ? "true" : "false"}
//           >
//             <SelectTrigger className="bg-gray-50">
//               <SelectValue placeholder="Availability" />
//             </SelectTrigger>
//             <SelectContent className='bg-white'>
//               <SelectItem value="true">In Stock</SelectItem>
//               <SelectItem value="false">Out of Stock</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <Textarea
//           name="description"
//           value={productData.description}
//           onChange={handleChange}
//           placeholder="Description"
//           className="bg-gray-50 min-h-[100px]"
//           required
//         />

//         <div className="mt-6">
//           <h3 className="text-lg font-semibold mb-3">Product Images</h3>

//           <div className="flex flex-wrap gap-4 mb-4">
//             {imagePreviews.map((preview, index) => (
//               <div key={index} className="relative group">
//                 <img
//                   src={`${BASE_URL}${preview}` || "/placeholder.svg"}
//                   alt={`Preview ${index + 1}`}
//                   className="w-24 h-24 object-cover border rounded-md"
//                 />
//                 <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
//                   <button
//                     type="button"
//                     onClick={() => editImage(index)}
//                     className="bg-white text-gray-800 rounded-full p-1 mx-1"
//                   >
//                     <Crop size={16} />
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => removeImage(index)}
//                     className="bg-white text-red-500 rounded-full p-1 mx-1"
//                   >
//                     <X size={16} />
//                   </button>
//                 </div>
//               </div>
//             ))}

//             <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
//               <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                 <Upload className="w-8 h-8 text-gray-400" />
//                 <p className="text-xs text-gray-500 mt-1">Add Image</p>
//               </div>
//               <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} />
//             </label>
//           </div>
//         </div>

//         <h3 className="text-lg font-semibold">Variants</h3>
//         {productData.variants.map((variant, index) => (
//           <div key={index} className="grid grid-cols-5 gap-4 border p-4 rounded-lg">
//             <Input
//               name="gross_weight"
//               type="number"
//               value={variant.gross_weight}
//               onChange={(e) => handleVariantChange(index, e)}
//               placeholder="Gross Weight"
//               className="bg-gray-50"
//               required
//             />
//             <Input
//               name="gold_price"
//               type="number"
//               value={variant.gold_price}
//               onChange={(e) => handleVariantChange(index, e)}
//               placeholder="Gold Price"
//               className="bg-gray-50"
//               required
//             />
//             <Input
//               name="stock"
//               type="number"
//               value={variant.stock}
//               onChange={(e) => handleVariantChange(index, e)}
//               placeholder="Stock"
//               className="bg-gray-50"
//               required
//             />
//             <Input
//               name="making_charge"
//               type="number"
//               value={variant.making_charge}
//               onChange={(e) => handleVariantChange(index, e)}
//               placeholder="Making Charge"
//               className="bg-gray-50"
//               required
//             />
//             <Button
//               type="button"
//               onClick={() => removeVariant(index)}
//               className="bg-red-900 hover:bg-red-600 text-white"
//               disabled={productData.variants.length <= 1}
//             >
//               Remove
//             </Button>
//           </div>
//         ))}

//         <Button
//           type="button"
//           onClick={addVariant}
//           className="bg-gray-500 hover:bg-gray-600 text-white"
//         >
//           + Add Variant
//         </Button>

//         <Button
//           type="submit"
//           className="w-full bg-[#8c2a2a] hover:bg-[#7a2424] text-white"
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? (isEditMode ? 'Updating Product...' : 'Adding Product...') :
//             (isEditMode ? 'Update Product' : 'Add Product')}
//         </Button>
//       </form>

//       {/* Image Editor Modal */}
//       <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
//         <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col bg-white">
//           <DialogHeader>
//             <DialogTitle>Edit Image</DialogTitle>
//           </DialogHeader>

//           <div className="relative flex-grow my-4" style={{ height: "400px" }}>
//             {currentImage && (
//               <Cropper
//                 image={currentImage.url}
//                 crop={crop}
//                 zoom={zoom}
//                 aspect={1}
//                 onCropChange={setCrop}
//                 onCropComplete={onCropComplete}
//                 onZoomChange={setZoom}
//               />
//             )}
//           </div>

//           <div className="flex items-center gap-2 my-4">
//             <ZoomOut className="text-gray-500" />
//             <Slider
//               value={[zoom]}
//               min={1}
//               max={3}
//               step={0.1}
//               onValueChange={(value) => setZoom(value[0])}
//               className="flex-grow"
//             />
//             <ZoomIn className="text-gray-500" />
//           </div>

//           <DialogFooter>
//             <Button variant="outline" onClick={cancelImageEdit}>
//               Cancel
//             </Button>
//             <Button onClick={saveCroppedImage}>Save</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default ProductEdit;

// "use client";

// import { useState, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { X, Upload, ZoomIn, ZoomOut, Crop } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Slider } from "@/components/ui/slider";
// import Cropper from "react-easy-crop";
// import api from "../../api";
// import { useParams, useNavigate } from "react-router-dom";

// const ProductEdit = () => {
//   const { id } = useParams();
//   const isEditMode = !!id;
//   const navigate = useNavigate();
//   const [categories, setCategories] = useState([]);
//   const [taxes, setTaxes] = useState([]); // New state for tax options
//   const [productData, setProductData] = useState({
//     name: "",
//     category: "",
//     description: "",
//     occasion: "",
//     gender: "",
//     is_active: true,
//     bis_hallmark: "",
//     size: "",
//     available: true,
//     gold_color: "",
//     offer: "",
//     variants: [
//       {
//         gross_weight: "",
//         stock: "",
//         gold_price: "",
//         making_charge: "",
//         tax: "", // Initialize tax field
//       },
//     ],
//     images: [],
//   });
//   const BASE_URL = "http://127.0.0.1:8000";
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isLoading, setIsLoading] = useState(isEditMode);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);

//   // Image-related state
//   const [imageFiles, setImageFiles] = useState([]);
//   const [imagePreviews, setImagePreviews] = useState([]);
//   const [existingImages, setExistingImages] = useState([]);
//   const [imagesToDelete, setImagesToDelete] = useState([]);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [currentImage, setCurrentImage] = useState(null);
//   const [currentImageIndex, setCurrentImageIndex] = useState(null);
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
//   const [isExistingImage, setIsExistingImage] = useState(false);

//   // Fetch categories and taxes on component mount
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await api.get("productapp/user/categories/");
//         setCategories(response.data);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//         setError("Failed to load categories. Please refresh the page.");
//       }
//     };

//     const fetchTaxes = async () => {
//       try {
//         const response = await api.get("productapp/taxes/");
//         setTaxes(response.data);
//       } catch (error) {
//         console.error("Error fetching taxes:", error);
//         setError("Failed to load tax options. Please refresh the page.");
//       }
//     };

//     fetchCategories();
//     fetchTaxes();
//   }, []);

//   // Fetch product data if in edit mode
//   useEffect(() => {
//     if (isEditMode) {
//       const fetchProductData = async () => {
//         setIsLoading(true);
//         try {
//           const response = await api.get(`productapp/products/${id}/`);
//           const product = response.data;

//           setProductData({
//             name: product.name || "",
//             category: product.category ? product.category.toString() : "",
//             description: product.description || "",
//             occasion: product.occasion || "",
//             gender: product.gender || "",
//             is_active: product.is_active !== undefined ? product.is_active : true,
//             bis_hallmark: product.bis_hallmark || "",
//             size: product.size || "",
//             available: product.available !== undefined ? product.available : true,
//             gold_color: product.gold_color || "",
//             offer: product.offer || "",
//             variants:
//               product.variants && product.variants.length > 0
//                 ? product.variants.map((v) => ({
//                     id: v.id,
//                     gross_weight: v.gross_weight?.toString() || "",
//                     stock: v.stock?.toString() || "",
//                     gold_price: v.gold_price?.toString() || "",
//                     making_charge: v.making_charge?.toString() || "",
//                     tax: v.tax?.toString() || "", // Map tax ID
//                   }))
//                 : [
//                     {
//                       gross_weight: "",
//                       stock: "",
//                       gold_price: "",
//                       making_charge: "",
//                       tax: "",
//                     },
//                   ],
//             images: product.image || [],
//           });

//           setExistingImages(product.image || []);
//           setImagePreviews((product.image || []).map((img) => img.image));
//         } catch (error) {
//           console.error("Error fetching product:", error);
//           setError("Failed to load product details. Please try again.");
//         } finally {
//           setIsLoading(false);
//         }
//       };

//       fetchProductData();
//     }
//   }, [id, isEditMode]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProductData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSelectChange = (name, value) => {
//     setProductData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleVariantChange = (index, e) => {
//     const { name, value } = e.target;
//     const updatedVariants = [...productData.variants];
//     updatedVariants[index][name] = value;
//     setProductData((prev) => ({ ...prev, variants: updatedVariants }));
//   };

//   const handleVariantSelectChange = (index, name, value) => {
//     const updatedVariants = [...productData.variants];
//     updatedVariants[index][name] = value;
//     setProductData((prev) => ({ ...prev, variants: updatedVariants }));
//   };

//   const addVariant = () => {
//     setProductData((prev) => ({
//       ...prev,
//       variants: [
//         ...prev.variants,
//         {
//           gross_weight: "",
//           stock: "",
//           gold_price: "",
//           making_charge: "",
//           tax: "",
//         },
//       ],
//     }));
//   };

//   const removeVariant = (index) => {
//     if (productData.variants.length > 1) {
//       setProductData((prev) => ({
//         ...prev,
//         variants: prev.variants.filter((_, i) => i !== index),
//       }));
//     }
//   };

//   // Image handling functions (unchanged)
//   const handleImageSelect = (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length > 0) {
//       const file = files[0];
//       const imageUrl = URL.createObjectURL(file);
//       setCurrentImage({ file, url: imageUrl });
//       setIsExistingImage(false);
//       setIsEditModalOpen(true);
//     }
//   };

//   const removeImage = (index) => {
//     if (index < existingImages.length) {
//       const imageToDelete = existingImages[index];
//       setImagesToDelete((prev) => [...prev, imageToDelete.id]);
//       setExistingImages((prev) => prev.filter((_, i) => i !== index));
//     } else {
//       const newImageIndex = index - existingImages.length;
//       URL.revokeObjectURL(imagePreviews[index]);
//       setImageFiles((prev) => prev.filter((_, i) => i !== newImageIndex));
//     }
//     setImagePreviews((prev) => prev.filter((_, i) => i !== index));
//     setProductData((prev) => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== index),
//     }));
//   };

//   const editImage = (index) => {
//     setCurrentImageIndex(index);
//     if (index < existingImages.length) {
//       setCurrentImage({
//         file: null,
//         url: existingImages[index].image,
//       });
//       setIsExistingImage(true);
//     } else {
//       const newImageIndex = index - existingImages.length;
//       setCurrentImage({
//         file: imageFiles[newImageIndex],
//         url: imagePreviews[index],
//       });
//       setIsExistingImage(false);
//     }
//     setIsEditModalOpen(true);
//   };

//   const onCropComplete = (croppedArea, croppedAreaPixels) => {
//     setCroppedAreaPixels(croppedAreaPixels);
//   };

//   const createCroppedImage = async () => {
//     try {
//       const canvas = document.createElement("canvas");
//       const ctx = canvas.getContext("2d");
//       const image = new Image();
//       image.src = currentImage.url;
//       return new Promise((resolve) => {
//         image.onload = () => {
//           canvas.width = croppedAreaPixels.width;
//           canvas.height = croppedAreaPixels.height;
//           ctx.drawImage(
//             image,
//             croppedAreaPixels.x,
//             croppedAreaPixels.y,
//             croppedAreaPixels.width,
//             croppedAreaPixels.height,
//             0,
//             0,
//             croppedAreaPixels.width,
//             croppedAreaPixels.height
//           );
//           canvas.toBlob((blob) => {
//             const croppedFile = new File(
//               [blob],
//               `cropped-image-${Date.now()}.jpeg`,
//               {
//                 type: "image/jpeg",
//                 lastModified: new Date().getTime(),
//               }
//             );
//             resolve({
//               file: croppedFile,
//               url: URL.createObjectURL(blob),
//             });
//           }, "image/jpeg");
//         };
//       });
//     } catch (e) {
//       console.error("Error creating cropped image:", e);
//       return null;
//     }
//   };

//   const saveCroppedImage = async () => {
//     if (!croppedAreaPixels) return;
//     const croppedImage = await createCroppedImage();
//     if (croppedImage) {
//       if (currentImageIndex !== null) {
//         const newImagePreviews = [...imagePreviews];
//         URL.revokeObjectURL(imagePreviews[currentImageIndex]);
//         if (isExistingImage) {
//           setImageFiles((prev) => [...prev, croppedImage.file]);
//         } else {
//           const newImageIndex = currentImageIndex - existingImages.length;
//           const newImageFiles = [...imageFiles];
//           newImageFiles[newImageIndex] = croppedImage.file;
//           setImageFiles(newImageFiles);
//         }
//         newImagePreviews[currentImageIndex] = croppedImage.url;
//         setImagePreviews(newImagePreviews);
//       } else {
//         setImageFiles((prev) => [...prev, croppedImage.file]);
//         setImagePreviews((prev) => [...prev, croppedImage.url]);
//       }
//     }
//     setCurrentImage(null);
//     setCurrentImageIndex(null);
//     setCrop({ x: 0, y: 0 });
//     setZoom(1);
//     setCroppedAreaPixels(null);
//     setIsEditModalOpen(false);
//     setIsExistingImage(false);
//   };

//   const cancelImageEdit = () => {
//     if (currentImage && currentImageIndex === null) {
//       URL.revokeObjectURL(currentImage.url);
//     }
//     setCurrentImage(null);
//     setCurrentImageIndex(null);
//     setCrop({ x: 0, y: 0 });
//     setZoom(1);
//     setCroppedAreaPixels(null);
//     setIsEditModalOpen(false);
//     setIsExistingImage(false);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (
//       !productData.name ||
//       !productData.category ||
//       !productData.description
//     ) {
//       setError("Please fill in all required fields");
//       return;
//     }

//     if (
//       productData.variants.some(
//         (variant) =>
//           !variant.gross_weight ||
//           !variant.stock ||
//           !variant.gold_price ||
//           !variant.making_charge ||
//           !variant.tax
//       )
//     ) {
//       setError("Please complete all variant details, including tax");
//       return;
//     }

//     setIsSubmitting(true);
//     setError(null);
//     setSuccess(false);

//     try {
//       const formattedData = {
//         ...productData,
//         category: parseInt(productData.category),
//         variants: productData.variants.map((variant) => ({
//           ...(variant.id && { id: variant.id }),
//           gross_weight: parseFloat(variant.gross_weight),
//           stock: parseInt(variant.stock),
//           gold_price: parseFloat(variant.gold_price),
//           making_charge: parseFloat(variant.making_charge),
//           tax: parseInt(variant.tax), // Ensure tax is sent as an integer ID
//         })),
//       };

//       console.log("Sending data:", formattedData);

//       let response;

//       if (isEditMode) {
//         response = await api.patch(`productapp/products/${id}/`, formattedData);
//         console.log("Update success:", response.data);
//         navigate("/dashboard");

//         if (imagesToDelete.length > 0) {
//           await Promise.all(
//             imagesToDelete.map((imageId) =>
//               api.delete(`productapp/product-images/${imageId}/`)
//             )
//           );
//         }

//         if (imageFiles.length > 0) {
//           const formData = new FormData();
//           imageFiles.forEach((file) => {
//             formData.append("images", file);
//           });
//           await api.post(`productapp/products/${id}/images/`, formData, {
//             headers: { "Content-Type": "multipart/form-data" },
//           });
//         }

//         setSuccess(true);
//       } else {
//         response = await api.post("productapp/products/", formattedData);
//         console.log("Create success:", response.data);
//         const productId = response.data.id;

//         if (imageFiles.length > 0) {
//           const formData = new FormData();
//           imageFiles.forEach((file) => {
//             formData.append("images", file);
//           });
//           await api.post(`productapp/products/${productId}/images/`, formData, {
//             headers: { "Content-Type": "multipart/form-data" },
//           });
//         }

//         setSuccess(true);

//         setProductData({
//           name: "",
//           category: "",
//           description: "",
//           occasion: "",
//           gender: "",
//           is_active: true,
//           bis_hallmark: "",
//           size: "",
//           available: true,
//           gold_color: "",
//           offer: "",
//           variants: [
//             {
//               gross_weight: "",
//               stock: "",
//               gold_price: "",
//               making_charge: "",
//               tax: "",
//             },
//           ],
//           images: [],
//         });
//         setImageFiles([]);
//         setImagePreviews([]);
//         setExistingImages([]);
//         setImagesToDelete([]);
//       }
//     } catch (err) {
//       console.error("Error:", err);
//       if (err.response) {
//         console.error("Response data:", err.response.data);
//         console.error("Response status:", err.response.status);
//         if (typeof err.response.data === "object") {
//           const errorMessages = Object.entries(err.response.data)
//             .map(([key, value]) => `${key}: ${value}`)
//             .join(", ");
//           setError(`Validation error: ${errorMessages}`);
//         } else {
//           setError(err.response.data || "Server rejected the data");
//         }
//       } else if (err.request) {
//         setError("No response from server. Please check your connection.");
//       } else {
//         setError("Error setting up request: " + err.message);
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         Loading product data...
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto">
//       <h2 className="text-2xl font-semibold mb-6">
//         {isEditMode ? "Edit Product" : "Add Product"}
//       </h2>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       {success && (
//         <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
//           Product {isEditMode ? "updated" : "added"} successfully!
//         </div>
//       )}

//       <form className="space-y-6" onSubmit={handleSubmit}>
//         <div className="grid grid-cols-2 gap-6">
//           <Input
//             name="name"
//             value={productData.name}
//             onChange={handleChange}
//             placeholder="Product Name"
//             className="bg-gray-50"
//             required
//           />
//           <Input
//             name="bis_hallmark"
//             value={productData.bis_hallmark}
//             onChange={handleChange}
//             placeholder="BIS Hallmark ID"
//             className="bg-gray-50"
//           />
//         </div>

//         <div className="grid grid-cols-2 gap-6">
//           <Select
//             onValueChange={(val) => handleSelectChange("category", val)}
//             value={productData.category}
//             required
//           >
//             <SelectTrigger className="bg-gray-50">
//               <SelectValue placeholder="Category" />
//             </SelectTrigger>
//             <SelectContent className="bg-white">
//               {categories.length > 0 ? (
//                 categories.map((category) => (
//                   <SelectItem
//                     key={category.id}
//                     value={category.id.toString()}
//                   >
//                     {category.name}
//                   </SelectItem>
//                 ))
//               ) : (
//                 <>
//                   <SelectItem value="1">Rings</SelectItem>
//                   <SelectItem value="2">Necklaces</SelectItem>
//                   <SelectItem value="3">Bracelets</SelectItem>
//                 </>
//               )}
//             </SelectContent>
//           </Select>

//           <Input
//             name="gold_color"
//             value={productData.gold_color}
//             onChange={handleChange}
//             placeholder="Gold Color"
//             className="bg-gray-50"
//           />
//         </div>

//         <div className="grid grid-cols-2 gap-6">
//           <Input
//             name="size"
//             value={productData.size}
//             onChange={handleChange}
//             placeholder="Size"
//             className="bg-gray-50"
//           />
//           <Select
//             onValueChange={(val) => handleSelectChange("occasion", val)}
//             value={productData.occasion}
//           >
//             <SelectTrigger className="bg-gray-50">
//               <SelectValue placeholder="Occasion" />
//             </SelectTrigger>
//             <SelectContent className="bg-white">
//               <SelectItem value="Wedding">Wedding</SelectItem>
//               <SelectItem value="Anniversary">Anniversary</SelectItem>
//               <SelectItem value="Birthday">Birthday</SelectItem>
//               <SelectItem value="Festival">Festival</SelectItem>
//               <SelectItem value="Casual">Casual</SelectItem>
//               <SelectItem value="Other">Other</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <div className="grid grid-cols-3 gap-6">
//           <Select
//             onValueChange={(val) => handleSelectChange("gender", val)}
//             value={productData.gender}
//           >
//             <SelectTrigger className="bg-gray-50">
//               <SelectValue placeholder="Gender" />
//             </SelectTrigger>
//             <SelectContent className="bg-white">
//               <SelectItem value="Male">Male</SelectItem>
//               <SelectItem value="Female">Female</SelectItem>
//               <SelectItem value="Unisex">Unisex</SelectItem>
//             </SelectContent>
//           </Select>

//           <Input
//             name="offer"
//             value={productData.offer}
//             onChange={handleChange}
//             placeholder="Product Offer"
//             className="bg-gray-50"
//           />

//           <Select
//             onValueChange={(val) =>
//               handleSelectChange("available", val === "true")
//             }
//             value={productData.available ? "true" : "false"}
//           >
//             <SelectTrigger className="bg-gray-50">
//               <SelectValue placeholder="Availability" />
//             </SelectTrigger>
//             <SelectContent className="bg-white">
//               <SelectItem value="true">In Stock</SelectItem>
//               <SelectItem value="false">Out of Stock</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <Textarea
//           name="description"
//           value={productData.description}
//           onChange={handleChange}
//           placeholder="Description"
//           className="bg-gray-50 min-h-[100px]"
//           required
//         />

//         <div className="mt-6">
//           <h3 className="text-lg font-semibold mb-3">Product Images</h3>
//           <div className="flex flex-wrap gap-4 mb-4">
//             {imagePreviews.map((preview, index) => (
//               <div key={index} className="relative group">
//                 <img
//                   src={`${BASE_URL}${preview}` || "/placeholder.svg"}
//                   alt={`Preview ${index + 1}`}
//                   className="w-24 h-24 object-cover border rounded-md"
//                 />
//                 <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
//                   <button
//                     type="button"
//                     onClick={() => editImage(index)}
//                     className="bg-white text-gray-800 rounded-full p-1 mx-1"
//                   >
//                     <Crop size={16} />
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => removeImage(index)}
//                     className="bg-white text-red-500 rounded-full p-1 mx-1"
//                   >
//                     <X size={16} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//             <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
//               <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                 <Upload className="w-8 h-8 text-gray-400" />
//                 <p className="text-xs text-gray-500 mt-1">Add Image</p>
//               </div>
//               <input
//                 type="file"
//                 className="hidden"
//                 accept="image/*"
//                 onChange={handleImageSelect}
//               />
//             </label>
//           </div>
//         </div>

//         <h3 className="text-lg font-semibold">Variants</h3>
//         {productData.variants.map((variant, index) => (
//           <div
//             key={index}
//             className="grid grid-cols-6 gap-4 border p-4 rounded-lg"
//           >
//             <Input
//               name="gross_weight"
//               type="number"
//               value={variant.gross_weight}
//               onChange={(e) => handleVariantChange(index, e)}
//               placeholder="Gross Weight"
//               className="bg-gray-50"
//               required
//             />
//             <Input
//               name="gold_price"
//               type="number"
//               value={variant.gold_price}
//               onChange={(e) => handleVariantChange(index, e)}
//               placeholder="Gold Price"
//               className="bg-gray-50"
//               required
//             />
//             <Input
//               name="stock"
//               type="number"
//               value={variant.stock}
//               onChange={(e) => handleVariantChange(index, e)}
//               placeholder="Stock"
//               className="bg-gray-50"
//               required
//             />
//             <Input
//               name="making_charge"
//               type="number"
//               value={variant.making_charge}
//               onChange={(e) => handleVariantChange(index, e)}
//               placeholder="Making Charge"
//               className="bg-gray-50"
//               required
//             />
//             <Select
//               onValueChange={(val) =>
//                 handleVariantSelectChange(index, "tax", val)
//               }
//               value={variant.tax}
//               required
//             >
//               <SelectTrigger className="bg-gray-50">
//                 <SelectValue placeholder="Tax" />
//               </SelectTrigger>
//               <SelectContent className="bg-white">
//                 {taxes.length > 0 ? (
//                   taxes.map((tax) => (
//                     <SelectItem key={tax.id} value={tax.id.toString()}>
//                       {tax.name} ({tax.percentage}%)
//                     </SelectItem>
//                   ))
//                 ) : (
//                   <SelectItem value="1">Default Tax (5%)</SelectItem>
//                 )}
//               </SelectContent>
//             </Select>
//             <Button
//               type="button"
//               onClick={() => removeVariant(index)}
//               className="bg-red-900 hover:bg-red-600 text-white"
//               disabled={productData.variants.length <= 1}
//             >
//               Remove
//             </Button>
//           </div>
//         ))}

//         <Button
//           type="button"
//           onClick={addVariant}
//           className="bg-gray-500 hover:bg-gray-600 text-white"
//         >
//           + Add Variant
//         </Button>

//         <Button
//           type="submit"
//           className="w-full bg-[#8c2a2a] hover:bg-[#7a2424] text-white"
//           disabled={isSubmitting}
//         >
//           {isSubmitting
//             ? isEditMode
//               ? "Updating Product..."
//               : "Adding Product..."
//             : isEditMode
//             ? "Update Product"
//             : "Add Product"}
//         </Button>
//       </form>

//       <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
//         <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col bg-white">
//           <DialogHeader>
//             <DialogTitle>Edit Image</DialogTitle>
//           </DialogHeader>
//           <div className="relative flex-grow my-4" style={{ height: "400px" }}>
//             {currentImage && (
//               <Cropper
//                 image={currentImage.url}
//                 crop={crop}
//                 zoom={zoom}
//                 aspect={1}
//                 onCropChange={setCrop}
//                 onCropComplete={onCropComplete}
//                 onZoomChange={setZoom}
//               />
//             )}
//           </div>
//           <div className="flex items-center gap-2 my-4">
//             <ZoomOut className="text-gray-500" />
//             <Slider
//               value={[zoom]}
//               min={1}
//               max={3}
//               step={0.1}
//               onValueChange={(value) => setZoom(value[0])}
//               className="flex-grow"
//             />
//             <ZoomIn className="text-gray-500" />
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={cancelImageEdit}>
//               Cancel
//             </Button>
//             <Button onClick={saveCroppedImage}>Save</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default ProductEdit;


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
import { X, Upload, ZoomIn, ZoomOut, Crop } from "lucide-react";
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

const ProductEdit = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [productData, setProductData] = useState({
    name: "",
    category: "",
    description: "",
    occasion: "",
    gender: "",
    is_active: true,
    bis_hallmark: "",
    size: "",
    available: true,
    gold_color: "",
    discount: "",
    product_offer_Isactive: true,
    variants: [
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
    ],
    images: [],
  });
  const BASE_URL = "http://127.0.0.1:8000";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Image-related state
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isExistingImage, setIsExistingImage] = useState(false);

  // Fetch categories and taxes
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("productapp/user/categories/");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories.");
      }
    };

    const fetchTaxes = async () => {
      try {
        const response = await api.get("productapp/taxes/");
        setTaxes(response.data);
      } catch (error) {
        console.error("Error fetching taxes:", error);
        setError("Failed to load tax options.");
      }
    };

    fetchCategories();
    fetchTaxes();
  }, []);

  // Fetch product data in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchProductData = async () => {
        setIsLoading(true);
        try {
          const response = await api.get(`productapp/products/${id}/`);
          const product = response.data;

          setProductData({
            name: product.name || "",
            category: product.category ? product.category.toString() : "",
            description: product.description || "",
            occasion: product.occasion || "",
            gender: product.gender || "",
            is_active: product.is_active !== undefined ? product.is_active : true,
            bis_hallmark: product.bis_hallmark || "",
            size: product.size || "",
            available: product.available !== undefined ? product.available : true,
            gold_color: product.gold_color || "",
            discount: product.discount ? product.discount.toString() : "",
            product_offer_Isactive:
              product.product_offer_Isactive !== undefined
                ? product.product_offer_Isactive
                : true,
            variants:
              product.variants && product.variants.length > 0
                ? product.variants.map((v) => ({
                    id: v.id,
                    gross_weight: v.gross_weight?.toString() || "",
                    gold_price: v.gold_price?.toString() || "",
                    stone_rate: v.stone_rate?.toString() || "",
                    making_charge: v.making_charge?.toString() || "",
                    tax: v.tax?.toString() || "",
                    stock: v.stock?.toString() || "",
                    available: v.available !== undefined ? v.available : true,
                    is_active: v.is_active !== undefined ? v.is_active : true,
                  }))
                : [
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
                  ],
            images: product.image || [],
          });

          setExistingImages(product.image || []);
          setImagePreviews((product.image || []).map((img) => img.image));
        } catch (error) {
          console.error("Error fetching product:", error);
          setError("Failed to load product details.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchProductData();
    }
  }, [id, isEditMode]);

  // Handlers for form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name, checked) => {
    setProductData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (name, value) => {
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVariants = [...productData.variants];
    updatedVariants[index][name] = value;
    setProductData((prev) => ({ ...prev, variants: updatedVariants }));
  };

  const handleVariantSwitchChange = (index, name, checked) => {
    const updatedVariants = [...productData.variants];
    updatedVariants[index][name] = checked;
    setProductData((prev) => ({ ...prev, variants: updatedVariants }));
  };

  const handleVariantSelectChange = (index, name, value) => {
    const updatedVariants = [...productData.variants];
    updatedVariants[index][name] = value;
    setProductData((prev) => ({ ...prev, variants: updatedVariants }));
  };

  const addVariant = () => {
    setProductData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
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
      ],
    }));
  };

  const removeVariant = (index) => {
    if (productData.variants.length > 1) {
      setProductData((prev) => ({
        ...prev,
        variants: prev.variants.filter((_, i) => i !== index),
      }));
    }
  };

  // Image handling
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      setCurrentImage({ file, url: imageUrl });
      setIsExistingImage(false);
      setIsEditModalOpen(true);
    }
  };

  const removeImage = (index) => {
    if (index < existingImages.length) {
      const imageToDelete = existingImages[index];
      setImagesToDelete((prev) => [...prev, imageToDelete.id]);
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      const newImageIndex = index - existingImages.length;
      URL.revokeObjectURL(imagePreviews[index]);
      setImageFiles((prev) => prev.filter((_, i) => i !== newImageIndex));
    }
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setProductData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const editImage = (index) => {
    setCurrentImageIndex(index);
    if (index < existingImages.length) {
      setCurrentImage({
        file: null,
        url: existingImages[index].image,
      });
      setIsExistingImage(true);
    } else {
      const newImageIndex = index - existingImages.length;
      setCurrentImage({
        file: imageFiles[newImageIndex],
        url: imagePreviews[index],
      });
      setIsExistingImage(false);
    }
    setIsEditModalOpen(true);
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const createCroppedImage = async () => {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const image = new Image();
      image.src = currentImage.url;
      return new Promise((resolve) => {
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
            const croppedFile = new File(
              [blob],
              `cropped-image-${Date.now()}.jpeg`,
              {
                type: "image/jpeg",
                lastModified: new Date().getTime(),
              }
            );
            resolve({
              file: croppedFile,
              url: URL.createObjectURL(blob),
            });
          }, "image/jpeg");
        };
      });
    } catch (e) {
      console.error("Error creating cropped image:", e);
      return null;
    }
  };

  const saveCroppedImage = async () => {
    if (!croppedAreaPixels) return;
    const croppedImage = await createCroppedImage();
    if (croppedImage) {
      if (currentImageIndex !== null) {
        const newImagePreviews = [...imagePreviews];
        URL.revokeObjectURL(imagePreviews[currentImageIndex]);
        if (isExistingImage) {
          setImageFiles((prev) => [...prev, croppedImage.file]);
        } else {
          const newImageIndex = currentImageIndex - existingImages.length;
          const newImageFiles = [...imageFiles];
          newImageFiles[newImageIndex] = croppedImage.file;
          setImageFiles(newImageFiles);
        }
        newImagePreviews[currentImageIndex] = croppedImage.url;
        setImagePreviews(newImagePreviews);
      } else {
        setImageFiles((prev) => [...prev, croppedImage.file]);
        setImagePreviews((prev) => [...prev, croppedImage.url]);
      }
    }
    setCurrentImage(null);
    setCurrentImageIndex(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setIsEditModalOpen(false);
    setIsExistingImage(false);
  };

  const cancelImageEdit = () => {
    if (currentImage && currentImageIndex === null) {
      URL.revokeObjectURL(currentImage.url);
    }
    setCurrentImage(null);
    setCurrentImageIndex(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setIsEditModalOpen(false);
    setIsExistingImage(false);
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate product fields
    if (!productData.name || !productData.category || !productData.description) {
      setError("Please fill in all required product fields.");
      return;
    }

    // Validate discount
    const discountValue = parseFloat(productData.discount);
    if (productData.discount && (isNaN(discountValue) || discountValue < 0 || discountValue > 100)) {
      setError("Discount must be a number between 0 and 100.");
      return;
    }

    // Validate variants
    for (const variant of productData.variants) {
      if (
        !variant.gross_weight ||
        !variant.gold_price ||
        !variant.making_charge ||
        !variant.tax ||
        !variant.stock
      ) {
        setError("All variant fields are required.");
        return;
      }
      if (
        parseFloat(variant.gross_weight) <= 0 ||
        parseFloat(variant.gold_price) <= 0 ||
        parseFloat(variant.making_charge) < 0 ||
        parseFloat(variant.stone_rate) < 0 ||
        parseInt(variant.stock) < 0
      ) {
        setError("Variant values must be valid (positive numbers, stock non-negative).");
        return;
      }
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const formattedData = {
        ...productData,
        category: parseInt(productData.category),
        discount: productData.discount ? parseFloat(productData.discount) : 0,
        variants: productData.variants.map((variant) => ({
          ...(variant.id && { id: variant.id }),
          gross_weight: parseFloat(variant.gross_weight) || 0,
          gold_price: parseFloat(variant.gold_price) || 0,
          stone_rate: parseFloat(variant.stone_rate) || 0,
          making_charge: parseFloat(variant.making_charge) || 0,
          tax: parseInt(variant.tax),
          stock: parseInt(variant.stock) || 0,
          available: variant.available,
          is_active: variant.is_active,
        })),
      };

      console.log("Sending data:", formattedData);

      let response;

      if (isEditMode) {
        response = await api.patch(`productapp/products/${id}/`, formattedData);
        console.log("Update success:", response.data);

        if (imagesToDelete.length > 0) {
          await Promise.all(
            imagesToDelete.map((imageId) =>
              api.delete(`productapp/product-images/${imageId}/`)
            )
          );
        }

        if (imageFiles.length > 0) {
          const formData = new FormData();
          imageFiles.forEach((file) => {
            formData.append("images", file);
          });
          await api.post(`productapp/products/${id}/images/`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }

        setSuccess(true);
        navigate("/dashboard");
      } else {
        response = await api.post("productapp/products/", formattedData);
        console.log("Create success:", response.data);
        const productId = response.data.id;

        if (imageFiles.length > 0) {
          const formData = new FormData();
          imageFiles.forEach((file) => {
            formData.append("images", file);
          });
          await api.post(`productapp/products/${productId}/images/`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }

        setSuccess(true);
        setProductData({
          name: "",
          category: "",
          description: "",
          occasion: "",
          gender: "",
          is_active: true,
          bis_hallmark: "",
          size: "",
          available: true,
          gold_color: "",
          discount: "",
          product_offer_Isactive: true,
          variants: [
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
          ],
          images: [],
        });
        setImageFiles([]);
        setImagePreviews([]);
        setExistingImages([]);
        setImagesToDelete([]);
      }
    } catch (err) {
      console.error("Error:", err);
      if (err.response) {
        console.error("Response data:", err.response.data);
        const errorMessages = Object.entries(err.response.data)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ");
        setError(`Validation error: ${errorMessages}`);
      } else {
        setError("Failed to save product. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">
        {isEditMode ? "Edit Product" : "Add Product"}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Product {isEditMode ? "updated" : "added"} successfully!
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Product Fields */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <Input
              name="name"
              value={productData.name}
              onChange={handleChange}
              placeholder="Product Name"
              className="bg-gray-50"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">BIS Hallmark</label>
            <Input
              name="bis_hallmark"
              value={productData.bis_hallmark}
              onChange={handleChange}
              placeholder="BIS Hallmark ID"
              className="bg-gray-50"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <Select
              onValueChange={(val) => handleSelectChange("category", val)}
              value={productData.category}
              required
            >
              <SelectTrigger className="bg-gray-50">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="1">Rings</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Gold Color</label>
            <Input
              name="gold_color"
              value={productData.gold_color}
              onChange={handleChange}
              placeholder="Gold Color"
              className="bg-gray-50"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Size</label>
            <Input
              name="size"
              value={productData.size}
              onChange={handleChange}
              placeholder="Size"
              className="bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Occasion</label>
            <Select
              onValueChange={(val) => handleSelectChange("occasion", val)}
              value={productData.occasion}
            >
              <SelectTrigger className="bg-gray-50">
                <SelectValue placeholder="Select Occasion" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="Wedding">Wedding</SelectItem>
                <SelectItem value="Anniversary">Anniversary</SelectItem>
                <SelectItem value="Birthday">Birthday</SelectItem>
                <SelectItem value="Festival">Festival</SelectItem>
                <SelectItem value="Casual">Casual</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <Select
              onValueChange={(val) => handleSelectChange("gender", val)}
              value={productData.gender}
            >
              <SelectTrigger className="bg-gray-50">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Unisex">Unisex</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
            <Input
              name="discount"
              type="number"
              value={productData.discount}
              onChange={handleChange}
              placeholder="Discount"
              className="bg-gray-50"
              min="0"
              max="100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Availability</label>
            <Select
              onValueChange={(val) => handleSelectChange("available", val === "true")}
              value={productData.available ? "true" : "false"}
            >
              <SelectTrigger className="bg-gray-50">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="true">In Stock</SelectItem>
                <SelectItem value="false">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Active</label>
            <Switch
              checked={productData.is_active}
              onCheckedChange={(checked) => handleSwitchChange("is_active", checked)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Offer Active</label>
            <Switch
              checked={productData.product_offer_Isactive}
              onCheckedChange={(checked) =>
                handleSwitchChange("product_offer_Isactive", checked)
              }
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <Textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            placeholder="Description"
            className="bg-gray-50 min-h-[100px]"
            required
          />
        </div>

        {/* Product Images */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Product Images</h3>
          <div className="flex flex-wrap gap-4 mb-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview.startsWith("http") ? preview : `${BASE_URL}${preview}`}
                  alt={`Preview ${index + 1}`}
                  className="w-24 h-24 object-cover border rounded-md"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => editImage(index)}
                    className="bg-white text-gray-800 rounded-full p-1 mx-1"
                  >
                    <Crop size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="bg-white text-red-500 rounded-full p-1 mx-1"
                  >
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
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageSelect}
              />
            </label>
          </div>
        </div>

        {/* Variants */}
        <h3 className="text-lg font-semibold">Variants</h3>
        {productData.variants.map((variant, index) => (
          <div key={index} className="border p-4 rounded-lg mb-4">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Gross Weight (g)</label>
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
                <label className="block text-sm font-medium text-gray-700">Gold Price (₹)</label>
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
                <label className="block text-sm font-medium text-gray-700">Stone Rate (₹)</label>
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
                <label className="block text-sm font-medium text-gray-700">Making Charge (₹)</label>
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
                <label className="block text-sm font-medium text-gray-700">Tax</label>
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
                <label className="block text-sm font-medium text-gray-700">Stock</label>
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
                <label className="block text-sm font-medium text-gray-700">Available</label>
                <Switch
                  checked={variant.available}
                  onCheckedChange={(checked) =>
                    handleVariantSwitchChange(index, "available", checked)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Active</label>
                <Switch
                  checked={variant.is_active}
                  onCheckedChange={(checked) =>
                    handleVariantSwitchChange(index, "is_active", checked)
                  }
                />
              </div>
            </div>
            <Button
              type="button"
              onClick={() => removeVariant(index)}
              className="mt-4 bg-red-900 hover:bg-red-600 text-white"
              disabled={productData.variants.length <= 1}
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

        <Button
          type="submit"
          className="w-full bg-[#8c2a2a] hover:bg-[#7a2424] text-white"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? isEditMode
              ? "Updating Product..."
              : "Adding Product..."
            : isEditMode
            ? "Update Product"
            : "Add Product"}
        </Button>
      </form>

      {/* Image Editor Modal */}
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
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={(value) => setZoom(value[0])}
              className="flex-grow"
            />
            <ZoomIn className="text-gray-500" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={cancelImageEdit}>
              Cancel
            </Button>
            <Button onClick={saveCroppedImage}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductEdit;