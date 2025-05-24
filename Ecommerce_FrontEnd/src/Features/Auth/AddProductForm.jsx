

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { X, Upload, ZoomIn, ZoomOut, Crop, ArrowLeft } from "lucide-react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Slider } from "@/components/ui/slider";
// import api from "../../api";
// import Cropper from "react-easy-crop";

// const AddProductForm = () => {
//   const navigate = useNavigate();
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
//     gold_color: "yellow",
//     discount: "",
//     product_offer_Isactive: true,
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const [imageFiles, setImageFiles] = useState([]);
//   const [imagePreviews, setImagePreviews] = useState([]);

//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [currentImage, setCurrentImage] = useState(null);
//   const [currentImageIndex, setCurrentImageIndex] = useState(null);
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

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
//     fetchCategories();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProductData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageSelect = (e) => {
//     const files = Array.from(e.target.files);
//     files.forEach((file) => {
//       const imageUrl = URL.createObjectURL(file);
//       setImageFiles((prev) => [...prev, file]);
//       setImagePreviews((prev) => [...prev, imageUrl]);
//     });
//   };

//   const removeImage = (index) => {
//     URL.revokeObjectURL(imagePreviews[index]);
//     setImageFiles((prev) => prev.filter((_, i) => i !== index));
//     setImagePreviews((prev) => prev.filter((_, i) => i !== index));
//   };

//   const editImage = (index) => {
//     setCurrentImageIndex(index);
//     setCurrentImage({ file: imageFiles[index], url: imagePreviews[index] });
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
//             const croppedFile = new File([blob], currentImage.file.name, {
//               type: "image/jpeg",
//               lastModified: new Date().getTime(),
//             });
//             resolve({ file: croppedFile, url: URL.createObjectURL(blob) });
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
//         const newImageFiles = [...imageFiles];
//         const newImagePreviews = [...imagePreviews];
//         URL.revokeObjectURL(imagePreviews[currentImageIndex]);
//         newImageFiles[currentImageIndex] = croppedImage.file;
//         newImagePreviews[currentImageIndex] = croppedImage.url;
//         setImageFiles(newImageFiles);
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
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (
//       !productData.name ||
//       !productData.category ||
//       !productData.bis_hallmark ||
//       !productData.gender ||
//       !productData.occasion ||
//       !productData.size
//     ) {
//       setError(
//         "Please fill in all required fields (Name, Category, BIS Hallmark, Gender, Occasion, Size)"
//       );
//       return;
//     }

//     setIsSubmitting(true);
//     setError(null);
//     setSuccess(false);

//     try {
//       const formattedData = {
//         ...productData,
//         category: Number.parseInt(productData.category),
//         discount: productData.discount ? Number.parseFloat(productData.discount) : 0,
//       };

//       const response = await api.post("productapp/products/", formattedData);
//       const productId = response.data.id;

//       if (imageFiles.length > 0) {
//         const formData = new FormData();
//         imageFiles.forEach((file) => {
//           formData.append("images", file);
//         });
//         await api.post(`productapp/products/${productId}/images/`, formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//       }

//       setSuccess(true);
//       setProductData({
//         name: "",
//         category: "",
//         description: "",
//         occasion: "",
//         gender: "",
//         is_active: true,
//         bis_hallmark: "",
//         size: "",
//         available: true,
//         gold_color: "yellow",
//         discount: "",
//         product_offer_Isactive: true,
//       });
//       setImageFiles([]);
//       setImagePreviews([]);
//       setTimeout(() => {
//         navigate("/dashboard");
//       }, 1500);
//     } catch (err) {
//       console.error("Error:", err);
//       if (err.response) {
//         const errorMessages =
//           typeof err.response.data === "object"
//             ? Object.entries(err.response.data)
//                 .map(([key, value]) => `${key}: ${value}`)
//                 .join(", ")
//             : err.response.data || "Server rejected the data";
//         setError(`Validation error: ${errorMessages}`);
//       } else if (err.request) {
//         setError("No response from server. Please check your connection.");
//       } else {
//         setError("Error setting up request: " + err.message);
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-semibold">Add Product</h2>
//         <Button
//           variant="outline"
//           onClick={() => navigate("/dashboard")}
//           className="flex items-center gap-2 border-[#7a2828] text-[#7a2828] hover:bg-[#7a2828] hover:text-white"
//         >
//           <ArrowLeft className="h-4 w-4" />
//           Back
//         </Button>
//       </div>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       {success && (
//         <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
//           Product added successfully!
//         </div>
//       )}

//       <form className="space-y-6" onSubmit={handleSubmit}>
//         <div className="grid grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium mb-1">Product Name *</label>
//             <Input
//               name="name"
//               value={productData.name}
//               onChange={handleChange}
//               placeholder="Enter product name"
//               className="bg-gray-50"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">BIS Hallmark ID *</label>
//             <Input
//               name="bis_hallmark"
//               value={productData.bis_hallmark}
//               onChange={handleChange}
//               placeholder="Enter BIS hallmark ID"
//               className="bg-gray-50"
//               required
//             />
//           </div>
//         </div>

//         <div className="grid grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium mb-1">Category *</label>
//             <Select
//               onValueChange={(val) => setProductData((prev) => ({ ...prev, category: val }))}
//               value={productData.category}
//               required
//             >
//               <SelectTrigger className="bg-gray-50">
//                 <SelectValue placeholder="Select category" />
//               </SelectTrigger>
//               <SelectContent className="bg-white">
//                 {categories.length > 0 ? (
//                   categories.map((category) => (
//                     <SelectItem key={category.id} value={category.id.toString()}>
//                       {category.name}
//                     </SelectItem>
//                   ))
//                 ) : (
//                   <SelectItem value="0">No categories available</SelectItem>
//                 )}
//               </SelectContent>
//             </Select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">Gold Color</label>
//             <Input
//               name="gold_color"
//               value={productData.gold_color}
//               onChange={handleChange}
//               placeholder="e.g., Yellow"
//               className="bg-gray-50"
//             />
//           </div>
//         </div>

//         <div className="grid grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium mb-1">Size *</label>
//             <Input
//               name="size"
//               value={productData.size}
//               onChange={handleChange}
//               placeholder="e.g., Small, Medium, 7"
//               className="bg-gray-50"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">Occasion *</label>
//             <Select
//               onValueChange={(val) => setProductData((prev) => ({ ...prev, occasion: val }))}
//               value={productData.occasion}
//               required
//             >
//               <SelectTrigger className="bg-gray-50">
//                 <SelectValue placeholder="Select occasion" />
//               </SelectTrigger>
//               <SelectContent className="bg-white">
//                 <SelectItem value="Wedding">Wedding</SelectItem>
//                 <SelectItem value="Anniversary">Anniversary</SelectItem>
//                 <SelectItem value="Birthday">Birthday</SelectItem>
//                 <SelectItem value="Festival">Festival</SelectItem>
//                 <SelectItem value="Casual">Casual</SelectItem>
//                 <SelectItem value="Other">Other</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         <div className="grid grid-cols-3 gap-6">
//           <div>
//             <label className="block text-sm font-medium mb-1">Gender *</label>
//             <Select
//               onValueChange={(val) => setProductData((prev) => ({ ...prev, gender: val }))}
//               value={productData.gender}
//               required
//             >
//               <SelectTrigger className="bg-gray-50">
//                 <SelectValue placeholder="Select gender" />
//               </SelectTrigger>
//               <SelectContent className="bg-white">
//                 <SelectItem value="Male">Male</SelectItem>
//                 <SelectItem value="Female">Female</SelectItem>
//                 <SelectItem value="Unisex">Unisex</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">Discount (%)</label>
//             <Input
//               name="discount"
//               type="number"
//               value={productData.discount}
//               onChange={handleChange}
//               placeholder="e.g., 10"
//               className="bg-gray-50"
//               min="0"
//               max="100"
//               step="0.01"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">Availability</label>
//             <Select
//               onValueChange={(val) => setProductData((prev) => ({ ...prev, available: val === "true" }))}
//               value={productData.available ? "true" : "false"}
//             >
//               <SelectTrigger className="bg-gray-50">
//                 <SelectValue placeholder="Select availability" />
//               </SelectTrigger>
//               <SelectContent className="bg-white">
//                 <SelectItem value="true">In Stock</SelectItem>
//                 <SelectItem value="false">Out of Stock</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Description</label>
//           <Textarea
//             name="description"
//             value={productData.description}
//             onChange={handleChange}
//             placeholder="Enter product description"
//             className="bg-gray-50 min-h-[100px]"
//           />
//         </div>

//         <div className="mt-6">
//           <h3 className="text-lg font-semibold mb-3">Product Images</h3>
//           <div className="flex flex-wrap gap-4 mb-4">
//             {imagePreviews.map((preview, index) => (
//               <div key={index} className="relative group">
//                 <img
//                   src={preview || "/placeholder.svg"}
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
//                 multiple
//               />
//             </label>
//           </div>
//         </div>

//         <Button
//           type="submit"
//           className="w-full bg-[#8c2a2a] hover:bg-[#7a2424] text-white"
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? "Adding Product..." : "Add Product"}
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

// export default AddProductForm;

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { X, Upload, ZoomIn, ZoomOut, Crop, ArrowLeft } from "lucide-react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Slider } from "@/components/ui/slider";
// import api from "../../api";
// import Cropper from "react-easy-crop";

// const AddProductForm = () => {
//   const navigate = useNavigate();
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
//     gold_color: "yellow",
//     discount: "",
//     product_offer_Isactive: true,
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const [imageFiles, setImageFiles] = useState([]);
//   const [imagePreviews, setImagePreviews] = useState([]);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [currentImage, setCurrentImage] = useState(null);
//   const [currentImageIndex, setCurrentImageIndex] = useState(null);
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

//   // Fetch categories
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
//     fetchCategories();
//   }, []);

//   // Cleanup object URLs on unmount
//   useEffect(() => {
//     return () => {
//       imagePreviews.forEach((url) => URL.revokeObjectURL(url));
//     };
//   }, [imagePreviews]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProductData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageSelect = (e) => {
//     const files = Array.from(e.target.files);
//     files.forEach((file) => {
//       const imageUrl = URL.createObjectURL(file);
//       setImageFiles((prev) => [...prev, file]);
//       setImagePreviews((prev) => [...prev, imageUrl]);
//     });
//   };

//   const removeImage = (index) => {
//     URL.revokeObjectURL(imagePreviews[index]);
//     setImageFiles((prev) => prev.filter((_, i) => i !== index));
//     setImagePreviews((prev) => prev.filter((_, i) => i !== index));
//   };

//   const editImage = (index) => {
//     console.log("Editing image:", { index, url: imagePreviews[index] });
//     setCurrentImageIndex(index);
//     setCurrentImage({ file: imageFiles[index], url: imagePreviews[index] });
//     setIsEditModalOpen(true);
//   };

//   const onCropComplete = (croppedArea, croppedAreaPixels) => {
//     console.log("Cropped Area Pixels:", croppedAreaPixels);
//     setCroppedAreaPixels(croppedAreaPixels);
//   };

//   const createCroppedImage = async () => {
//     if (!croppedAreaPixels) {
//       console.error("No cropped area defined");
//       setError("Please select a crop area before saving.");
//       return null;
//     }
//     try {
//       const canvas = document.createElement("canvas");
//       const ctx = canvas.getContext("2d");
//       const image = new Image();
//       image.src = currentImage.url;

//       return new Promise((resolve, reject) => {
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
//           canvas.toBlob(
//             (blob) => {
//               if (!blob) {
//                 console.error("Failed to create blob");
//                 return reject(new Error("Failed to create blob"));
//               }
//               const croppedFile = new File([blob], currentImage.file.name, {
//                 type: "image/jpeg",
//                 lastModified: new Date().getTime(),
//               });
//               console.log("Cropped image created:", croppedFile);
//               resolve({ file: croppedFile, url: URL.createObjectURL(blob) });
//             },
//             "image/jpeg",
//             0.9
//           );
//         };
//         image.onerror = () => reject(new Error("Failed to load image"));
//       });
//     } catch (e) {
//       console.error("Error creating cropped image:", e);
//       setError("Failed to crop image. Please try again.");
//       return null;
//     }
//   };

//   const saveCroppedImage = async () => {
//     if (!croppedAreaPixels) {
//       console.error("No cropped area pixels available");
//       setError("Please select a crop area before saving.");
//       return;
//     }
//     const croppedImage = await createCroppedImage();
//     if (croppedImage) {
//       if (currentImageIndex !== null) {
//         const newImageFiles = [...imageFiles];
//         const newImagePreviews = [...imagePreviews];
//         URL.revokeObjectURL(imagePreviews[currentImageIndex]);
//         newImageFiles[currentImageIndex] = croppedImage.file;
//         newImagePreviews[currentImageIndex] = croppedImage.url;
//         setImageFiles(newImageFiles);
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
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (
//       !productData.name ||
//       !productData.category ||
//       !productData.bis_hallmark ||
//       !productData.gender ||
//       !productData.occasion ||
//       !productData.size
//     ) {
//       setError(
//         "Please fill in all required fields (Name, Category, BIS Hallmark, Gender, Occasion, Size)"
//       );
//       return;
//     }

//     setIsSubmitting(true);
//     setError(null);
//     setSuccess(false);

//     try {
//       const formattedData = {
//         ...productData,
//         category: Number.parseInt(productData.category),
//         discount: productData.discount ? Number.parseFloat(productData.discount) : 0,
//       };

//       const response = await api.post("productapp/products/", formattedData);
//       const productId = response.data.id;

//       if (imageFiles.length > 0) {
//         const formData = new FormData();
//         imageFiles.forEach((file) => {
//           formData.append("images", file);
//         });
//         await api.post(`productapp/products/${productId}/images/`, formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//       }

//       setSuccess(true);
//       setProductData({
//         name: "",
//         category: "",
//         description: "",
//         occasion: "",
//         gender: "",
//         is_active: true,
//         bis_hallmark: "",
//         size: "",
//         available: true,
//         gold_color: "yellow",
//         discount: "",
//         product_offer_Isactive: true,
//       });
//       setImageFiles([]);
//       setImagePreviews([]);
//       setTimeout(() => {
//         navigate("/dashboard");
//       }, 1500);
//     } catch (err) {
//       console.error("Error:", err);
//       if (err.response) {
//         const errorMessages =
//           typeof err.response.data === "object"
//             ? Object.entries(err.response.data)
//                 .map(([key, value]) => `${key}: ${value}`)
//                 .join(", ")
//             : err.response.data || "Server rejected the data";
//         setError(`Validation error: ${errorMessages}`);
//       } else if (err.request) {
//         setError("No response from server. Please check your connection.");
//       } else {
//         setError("Error setting up request: " + err.message);
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-semibold">Add Product</h2>
//         <Button
//           variant="outline"
//           onClick={() => navigate("/dashboard")}
//           className="flex items-center gap-2 border-[#7a2828] text-[#7a2828] hover:bg-[#7a2828] hover:text-white"
//         >
//           <ArrowLeft className="h-4 w-4" />
//           Back
//         </Button>
//       </div>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       {success && (
//         <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
//           Product added successfully!
//         </div>
//       )}

//       <form className="space-y-6" onSubmit={handleSubmit}>
//         <div className="grid grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium mb-1">Product Name *</label>
//             <Input
//               name="name"
//               value={productData.name}
//               onChange={handleChange}
//               placeholder="Enter product name"
//               className="bg-gray-50"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">BIS Hallmark ID *</label>
//             <Input
//               name="bis_hallmark"
//               value={productData.bis_hallmark}
//               onChange={handleChange}
//               placeholder="Enter BIS hallmark ID"
//               className="bg-gray-50"
//               required
//             />
//           </div>
//         </div>

//         <div className="grid grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium mb-1">Category *</label>
//             <Select
//               onValueChange={(val) => setProductData((prev) => ({ ...prev, category: val }))}
//               value={productData.category}
//               required
//             >
//               <SelectTrigger className="bg-gray-50">
//                 <SelectValue placeholder="Select category" />
//               </SelectTrigger>
//               <SelectContent className="bg-white">
//                 {categories.length > 0 ? (
//                   categories.map((category) => (
//                     <SelectItem key={category.id} value={category.id.toString()}>
//                       {category.name}
//                     </SelectItem>
//                   ))
//                 ) : (
//                   <SelectItem value="0">No categories available</SelectItem>
//                 )}
//               </SelectContent>
//             </Select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">Gold Color</label>
//             <Input
//               name="gold_color"
//               value={productData.gold_color}
//               onChange={handleChange}
//               placeholder="e.g., Yellow"
//               className="bg-gray-50"
//             />
//           </div>
//         </div>

//         <div className="grid grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium mb-1">Size *</label>
//             <Input
//               name="size"
//               value={productData.size}
//               onChange={handleChange}
//               placeholder="e.g., Small, Medium, 7"
//               className="bg-gray-50"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">Occasion *</label>
//             <Select
//               onValueChange={(val) => setProductData((prev) => ({ ...prev, occasion: val }))}
//               value={productData.occasion}
//               required
//             >
//               <SelectTrigger className="bg-gray-50">
//                 <SelectValue placeholder="Select occasion" />
//               </SelectTrigger>
//               <SelectContent className="bg-white">
//                 <SelectItem value="Wedding">Wedding</SelectItem>
//                 <SelectItem value="Anniversary">Anniversary</SelectItem>
//                 <SelectItem value="Birthday">Birthday</SelectItem>
//                 <SelectItem value="Festival">Festival</SelectItem>
//                 <SelectItem value="Casual">Casual</SelectItem>
//                 <SelectItem value="Other">Other</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         <div className="grid grid-cols-3 gap-6">
//           <div>
//             <label className="block text-sm font-medium mb-1">Gender *</label>
//             <Select
//               onValueChange={(val) => setProductData((prev) => ({ ...prev, gender: val }))}
//               value={productData.gender}
//               required
//             >
//               <SelectTrigger className="bg-gray-50">
//                 <SelectValue placeholder="Select gender" />
//               </SelectTrigger>
//               <SelectContent className="bg-white">
//                 <SelectItem value="Male">Male</SelectItem>
//                 <SelectItem value="Female">Female</SelectItem>
//                 <SelectItem value="Unisex">Unisex</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">Discount (%)</label>
//             <Input
//               name="discount"
//               type="number"
//               value={productData.discount}
//               onChange={handleChange}
//               placeholder="e.g., 10"
//               className="bg-gray-50"
//               min="0"
//               max="100"
//               step="0.01"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">Availability</label>
//             <Select
//               onValueChange={(val) => setProductData((prev) => ({ ...prev, available: val === "true" }))}
//               value={productData.available ? "true" : "false"}
//             >
//               <SelectTrigger className="bg-gray-50">
//                 <SelectValue placeholder="Select availability" />
//               </SelectTrigger>
//               <SelectContent className="bg-white">
//                 <SelectItem value="true">In Stock</SelectItem>
//                 <SelectItem value="false">Out of Stock</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Description</label>
//           <Textarea
//             name="description"
//             value={productData.description}
//             onChange={handleChange}
//             placeholder="Enter product description"
//             className="bg-gray-50 min-h-[100px]"
//           />
//         </div>

//         <div className="mt-6">
//           <h3 className="text-lg font-semibold mb-3">Product Images</h3>
//           <div className="flex flex-wrap gap-4 mb-4">
//             {imagePreviews.map((preview, index) => (
//               <div key={index} className="relative group">
//                 <img
//                   src={preview || "/placeholder.svg"}
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
//                 multiple
//               />
//             </label>
//           </div>
//         </div>

//         <Button
//           type="submit"
//           className="w-full bg-[#8c2a2a] hover:bg-[#7a2424] text-white"
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? "Adding Product..." : "Add Product"}
//         </Button>
//       </form>

//       <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
//         <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col bg-white z-[1000]">
//           <DialogHeader>
//             <DialogTitle>Edit Image</DialogTitle>
//           </DialogHeader>
//           <div className="relative flex-grow my-4" style={{ height: "400px", width: "100%" }}>
//             {currentImage ? (
//               <Cropper
//                 image={currentImage.url}
//                 crop={crop}
//                 zoom={zoom}
//                 aspect={1}
//                 onCropChange={setCrop}
//                 onCropComplete={onCropComplete}
//                 onZoomChange={(value) => {
//                   console.log("Zoom value:", value);
//                   setZoom(value);
//                 }}
//                 onMediaLoaded={() => console.log("Cropper image loaded")}
//                 onError={(e) => console.error("Cropper error:", e)}
//               />
//             ) : (
//               <p className="text-red-500">No image selected for cropping</p>
//             )}
//           </div>
//           <div className="flex items-center gap-2 my-4">
//             <ZoomOut className="text-gray-500" />
//             <Slider
//               value={[zoom]}
//               min={1}
//               max={3}
//               step={0.1}
//               onValueChange={(value) => {
//                 console.log("Slider zoom value:", value[0]);
//                 setZoom(value[0]);
//               }}
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

// export default AddProductForm;


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
    gold_color: "yellow",
    discount: "",
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
  const [pendingImages, setPendingImages] = useState([]); // Queue for images to be cropped

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("productapp/user/categories/");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories. Please refresh the page.");
      }
    };
    fetchCategories();
  }, []);

  // Cleanup object URLs on unmount
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
      // Start cropping the first pending image
      setCurrentImage(newPendingImages[0]);
      setCurrentImageIndex(null); // Not editing an existing image
      setIsEditModalOpen(true);
    }
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const editImage = (index) => {
    console.log("Editing image:", { index, url: imagePreviews[index] });
    setCurrentImageIndex(index);
    setCurrentImage({ file: imageFiles[index], url: imagePreviews[index] });
    setIsEditModalOpen(true);
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    console.log("Cropped Area Pixels:", croppedAreaPixels);
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const createCroppedImage = async () => {
    if (!croppedAreaPixels) {
      console.error("No cropped area defined");
      setError("Please select a crop area before saving.");
      return null;
    }
    try {
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
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                console.error("Failed to create blob");
                return reject(new Error("Failed to create blob"));
              }
              const croppedFile = new File([blob], currentImage.file.name, {
                type: "image/jpeg",
                lastModified: new Date().getTime(),
              });
              console.log("Cropped image created:", croppedFile);
              resolve({ file: croppedFile, url: URL.createObjectURL(blob) });
            },
            "image/jpeg",
            0.9
          );
        };
        image.onerror = () => reject(new Error("Failed to load image"));
      });
    } catch (e) {
      console.error("Error creating cropped image:", e);
      setError("Failed to crop image. Please try again.");
      return null;
    }
  };

  const saveCroppedImage = async () => {
    if (!croppedAreaPixels) {
      console.error("No cropped area pixels available");
      setError("Please select a crop area before saving.");
      return;
    }
    const croppedImage = await createCroppedImage();
    if (croppedImage) {
      if (currentImageIndex !== null) {
        // Editing an existing image
        const newImageFiles = [...imageFiles];
        const newImagePreviews = [...imagePreviews];
        URL.revokeObjectURL(imagePreviews[currentImageIndex]);
        newImageFiles[currentImageIndex] = croppedImage.file;
        newImagePreviews[currentImageIndex] = croppedImage.url;
        setImageFiles(newImageFiles);
        setImagePreviews(newImagePreviews);
      } else {
        // New image from pending queue
        setImageFiles((prev) => [...prev, croppedImage.file]);
        setImagePreviews((prev) => [...prev, croppedImage.url]);
      }
      // Remove the processed image from pendingImages and move to the next
      setPendingImages((prev) => {
        const remaining = prev.slice(1);
        if (remaining.length > 0) {
          // Open cropper for the next image
          setCurrentImage(remaining[0]);
          setCurrentImageIndex(null);
          setCrop({ x: 0, y: 0 });
          setZoom(1);
          setCroppedAreaPixels(null);
          return remaining;
        } else {
          // Close modal if no more images to crop
          setIsEditModalOpen(false);
          setCurrentImage(null);
          setCurrentImageIndex(null);
          setCrop({ x: 0, y: 0 });
          setZoom(1);
          setCroppedAreaPixels(null);
          return [];
        }
      });
    }
  };

  const cancelImageEdit = () => {
    if (currentImage) {
      URL.revokeObjectURL(currentImage.url);
    }
    // Remove the current image from pendingImages if it's a new image
    if (currentImageIndex === null) {
      setPendingImages((prev) => {
        const remaining = prev.slice(1);
        if (remaining.length > 0) {
          // Open cropper for the next image
          setCurrentImage(remaining[0]);
          setCrop({ x: 0, y: 0 });
          setZoom(1);
          setCroppedAreaPixels(null);
          return remaining;
        } else {
          // Close modal if no more images
          setIsEditModalOpen(false);
          setCurrentImage(null);
          return [];
        }
      });
    } else {
      // Reset for existing image edit
      setIsEditModalOpen(false);
      setCurrentImage(null);
      setCurrentImageIndex(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !productData.name ||
      !productData.category ||
      !productData.bis_hallmark ||
      !productData.gender ||
      !productData.occasion ||
      !productData.size
    ) {
      setError(
        "Please fill in all required fields (Name, Category, BIS Hallmark, Gender, Occasion, Size)"
      );
      return;
    }
    if (pendingImages.length > 0) {
      setError("Please crop all selected images before submitting.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const formattedData = {
        ...productData,
        category: Number.parseInt(productData.category),
        discount: productData.discount ? Number.parseFloat(productData.discount) : 0,
      };

      const response = await api.post("productapp/products/", formattedData);
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
        gold_color: "yellow",
        discount: "",
        product_offer_Isactive: true,
      });
      setImageFiles([]);
      setImagePreviews([]);
      setPendingImages([]);
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Add Product</h2>
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
          Product added successfully!
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Product Name *</label>
            <Input
              name="name"
              value={productData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className="bg-gray-50"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">BIS Hallmark ID *</label>
            <Input
              name="bis_hallmark"
              value={productData.bis_hallmark}
              onChange={handleChange}
              placeholder="Enter BIS hallmark ID"
              className="bg-gray-50"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <Select
              onValueChange={(val) => setProductData((prev) => ({ ...prev, category: val }))}
              value={productData.category}
              required
            >
              <SelectTrigger className="bg-gray-50">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="0">No categories available</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Gold Color</label>
            <Input
              name="gold_color"
              value={productData.gold_color}
              onChange={handleChange}
              placeholder="e.g., Yellow"
              className="bg-gray-50"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Size *</label>
            <Input
              name="size"
              value={productData.size}
              onChange={handleChange}
              placeholder="e.g., Small, Medium, 7"
              className="bg-gray-50"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Occasion *</label>
            <Select
              onValueChange={(val) => setProductData((prev) => ({ ...prev, occasion: val }))}
              value={productData.occasion}
              required
            >
              <SelectTrigger className="bg-gray-50">
                <SelectValue placeholder="Select occasion" />
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
            <label className="block text-sm font-medium mb-1">Gender *</label>
            <Select
              onValueChange={(val) => setProductData((prev) => ({ ...prev, gender: val }))}
              value={productData.gender}
              required
            >
              <SelectTrigger className="bg-gray-50">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Unisex">Unisex</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Discount (%)</label>
            <Input
              name="discount"
              type="number"
              value={productData.discount}
              onChange={handleChange}
              placeholder="e.g., 10"
              className="bg-gray-50"
              min="0"
              max="100"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Availability</label>
            <Select
              onValueChange={(val) => setProductData((prev) => ({ ...prev, available: val === "true" }))}
              value={productData.available ? "true" : "false"}
            >
              <SelectTrigger className="bg-gray-50">
                <SelectValue placeholder="Select availability" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="true">In Stock</SelectItem>
                <SelectItem value="false">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            placeholder="Enter product description"
            className="bg-gray-50 min-h-[100px]"
          />
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Product Images</h3>
          <div className="flex flex-wrap gap-4 mb-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview || "/placeholder.svg"}
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
                multiple
              />
            </label>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-[#8c2a2a] hover:bg-[#7a2424] text-white"
          disabled={isSubmitting || pendingImages.length > 0}
        >
          {isSubmitting ? "Adding Product..." : "Add Product"}
        </Button>
      </form>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col bg-white z-[1000]">
          <DialogHeader>
            <DialogTitle>Edit Image</DialogTitle>
          </DialogHeader>
          <div className="relative flex-grow my-4" style={{ height: "400px", width: "100%" }}>
            {currentImage ? (
              <Cropper
                image={currentImage.url}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={(value) => {
                  console.log("Zoom value:", value);
                  setZoom(value);
                }}
                onMediaLoaded={() => console.log("Cropper image loaded")}
                onError={(e) => console.error("Cropper error:", e)}
              />
            ) : (
              <p className="text-red-500">No image selected for cropping</p>
            )}
          </div>
          <div className="flex items-center gap-2 my-4">
            <ZoomOut className="text-gray-500" />
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={(value) => {
                console.log("Slider zoom value:", value[0]);
                setZoom(value[0]);
              }}
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

export default AddProductForm;