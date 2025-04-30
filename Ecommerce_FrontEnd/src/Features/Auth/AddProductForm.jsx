

// import { useState, useEffect } from "react"
// import { useNavigate } from "react-router-dom" // Import useNavigate
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Textarea } from "@/components/ui/textarea"
// import { X, Upload, ZoomIn, ZoomOut, Crop ,ArrowLeft,} from "lucide-react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
// import { Slider } from "@/components/ui/slider"
// import api from "../../api"
// import Cropper from "react-easy-crop"

// const AddProductForm = () => {
//   const navigate = useNavigate() // Initialize navigate
//   const [categories, setCategories] = useState([])
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
//     product_offer: "",
//     product_offer_Isactive:true,

//     images: [],
//     variants: [
//       {
//         gross_weight: "",
//         stock: "",
//         gold_price: "",
//         making_charge: "",
//         stone_rate:""
//       },
//     ],
//   })

//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [error, setError] = useState(null)
//   const [success, setSuccess] = useState(false)

//   const [imageFiles, setImageFiles] = useState([])
//   const [imagePreviews, setImagePreviews] = useState([])

//   // Image editing state
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false)
//   const [currentImage, setCurrentImage] = useState(null)
//   const [currentImageIndex, setCurrentImageIndex] = useState(null)
//   const [crop, setCrop] = useState({ x: 0, y: 0 })
//   const [zoom, setZoom] = useState(1)
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

//   // Fetch categories on component mount
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await api.get("productapp/user/categories/")
//         setCategories(response.data)
//         console.log("Categories loaded:", response.data)
//       } catch (error) {
//         console.error("Error fetching categories:", error)
//         setError("Failed to load categories. Please refresh the page.")
//       }
//     }

//     fetchCategories()
//   }, [])

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setProductData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleVariantChange = (index, e) => {
//     const { name, value } = e.target
//     const updatedVariants = [...productData.variants]
//     updatedVariants[index][name] = value
//     setProductData((prev) => ({ ...prev, variants: updatedVariants }))
//   }

//   const addVariant = () => {
//     setProductData((prev) => ({
//       ...prev,
//       variants: [
//         ...prev.variants,
//         {
//           gross_weight: "",
//           stock: "",
//           stone_rate:"",
//           gold_price: "",
//           making_charge: "",
          
//         },
//       ],
//     }))
//   }

//   const removeVariant = (index) => {
//     if (productData.variants.length > 1) {
//       setProductData((prev) => ({
//         ...prev,
//         variants: prev.variants.filter((_, i) => i !== index),
//       }))
//     }
//   }

//   const handleImageSelect = (e) => {
//     const files = Array.from(e.target.files)

//     if (files.length > 0) {
//       const file = files[0]
//       const imageUrl = URL.createObjectURL(file)
//       setCurrentImage({
//         file,
//         url: imageUrl,
//       })
//       setIsEditModalOpen(true)
//     }
//   }

//   const removeImage = (index) => {
//     URL.revokeObjectURL(imagePreviews[index])
//     setImageFiles((prev) => prev.filter((_, i) => i !== index))
//     setImagePreviews((prev) => prev.filter((_, i) => i !== index))
//     setProductData((prev) => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== index),
//     }))
//   }

//   const editImage = (index) => {
//     setCurrentImageIndex(index)
//     setCurrentImage({
//       file: imageFiles[index],
//       url: imagePreviews[index],
//     })
//     setIsEditModalOpen(true)
//   }

//   const onCropComplete = (croppedArea, croppedAreaPixels) => {
//     setCroppedAreaPixels(croppedAreaPixels)
//   }

//   const createCroppedImage = async () => {
//     try {
//       const canvas = document.createElement("canvas")
//       const ctx = canvas.getContext("2d")
//       const image = new Image()

//       image.src = currentImage.url

//       return new Promise((resolve) => {
//         image.onload = () => {
//           canvas.width = croppedAreaPixels.width
//           canvas.height = croppedAreaPixels.height

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
//           )

//           canvas.toBlob((blob) => {
//             const croppedFile = new File([blob], currentImage.file.name, {
//               type: "image/jpeg",
//               lastModified: new Date().getTime(),
//             })

//             resolve({
//               file: croppedFile,
//               url: URL.createObjectURL(blob),
//             })
//           }, "image/jpeg")
//         }
//       })
//     } catch (e) {
//       console.error("Error creating cropped image:", e)
//       return null
//     }
//   }

//   const saveCroppedImage = async () => {
//     if (!croppedAreaPixels) return

//     const croppedImage = await createCroppedImage()

//     if (croppedImage) {
//       if (currentImageIndex !== null) {
//         const newImageFiles = [...imageFiles]
//         const newImagePreviews = [...imagePreviews]
//         URL.revokeObjectURL(imagePreviews[currentImageIndex])
//         newImageFiles[currentImageIndex] = croppedImage.file
//         newImagePreviews[currentImageIndex] = croppedImage.url
//         setImageFiles(newImageFiles)
//         setImagePreviews(newImagePreviews)
//       } else {
//         setImageFiles((prev) => [...prev, croppedImage.file])
//         setImagePreviews((prev) => [...prev, croppedImage.url])
//         setProductData((prev) => ({
//           ...prev,
//           images: [...prev.images, croppedImage.file.name],
//         }))
//       }
//     }

//     setCurrentImage(null)
//     setCurrentImageIndex(null)
//     setCrop({ x: 0, y: 0 })
//     setZoom(1)
//     setCroppedAreaPixels(null)
//     setIsEditModalOpen(false)
//   }

//   const cancelImageEdit = () => {
//     if (currentImage && currentImageIndex === null) {
//       URL.revokeObjectURL(currentImage.url)
//     }

//     setCurrentImage(null)
//     setCurrentImageIndex(null)
//     setCrop({ x: 0, y: 0 })
//     setZoom(1)
//     setCroppedAreaPixels(null)
//     setIsEditModalOpen(false)
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     if (!productData.name || !productData.category || !productData.description) {
//       setError("Please fill in all required fields")
//       return
//     }

//     if (
//       productData.variants.some(
//         (variant) => !variant.gross_weight || !variant.stock || !variant.gold_price || !variant.making_charge,
//       )
//     ) {
//       setError("Please complete all variant details")
//       return
//     }

//     setIsSubmitting(true)
//     setError(null)
//     setSuccess(false)

//     try {
//       const formattedData = {
//         ...productData,
//         category: Number.parseInt(productData.category),
//         variants: productData.variants.map((variant) => ({
//           gross_weight: Number.parseFloat(variant.gross_weight),
//           stock: Number.parseInt(variant.stock),
//           gold_price: Number.parseFloat(variant.gold_price),
//           making_charge: Number.parseFloat(variant.making_charge),
//           stone_rate: variant.stone_rate ? Number.parseFloat(variant.stone_rate) : 0,
//         })),
//       }

//       console.log("Sending data:", formattedData)

//       const response = await api.post("productapp/products/", formattedData)
//       console.log("Response:", response.data)
//       const productId = response.data.id

//       if (imageFiles.length > 0) {
//         const formData = new FormData()
//         imageFiles.forEach((file) => {
//           formData.append("images", file)
//         })

//         await api.post(`productapp/products/${productId}/images/`, formData, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         })
//       }

//       console.log("Success:", response.data)
//       setSuccess(true)

//       // Reset the form
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
//         gold_color: "",
//         product_offer: "",
//         product_offer_Isactive:true,
//         images: [],
//         variants: [
//           {
//             gross_weight: "",
//             stock: "",
//             gold_price: "",
//             making_charge: "",
//             stone_rate:"",
//           },
//         ],
//       })

//       setImageFiles([])
//       setImagePreviews([])

//       // Redirect to homepage after a brief delay
//       setTimeout(() => {
//         navigate('/dashboard') // Redirect using useNavigate
//       }, 1500) // 1.5-second delay to show success message
//     } catch (err) {
//       console.error("Error:", err)
//       if (err.response) {
//         console.error("Response data:", err.response.data)
//         console.error("Response status:", err.response.status)
//         if (typeof err.response.data === "object") {
//           const errorMessages = Object.entries(err.response.data)
//             .map(([key, value]) => `${key}: ${value}`)
//             .join(", ")
//           setError(`Validation error: ${errorMessages}`)
//         } else {
//           setError(err.response.data || "Server rejected the data")
//         }
//       } else if (err.request) {
//         setError("No response from server. Please check your connection.")
//       } else {
//         setError("Error setting up request: " + err.message)
//       }
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <div className="max-w-4xl mx-auto">
//       <h2 className="text-2xl font-semibold mb-6">Add Product</h2>
//       <Button
//             variant="outline"
//             onClick={() => navigate("/dashboard")}
//             className="flex items-center gap-2 border-[#7a2828] text-[#7a2828] hover:bg-[#7a2828] hover:text-white"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             Back
//           </Button>

//       {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

//       {success && (
//         <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
//           Product added successfully!
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
//             onValueChange={(val) => setProductData((prev) => ({ ...prev, category: val }))}
//             value={productData.category}
            
//           >
//             <SelectTrigger className="bg-gray-50">
//               <SelectValue placeholder="Category" />
//             </SelectTrigger>
//             <SelectContent className="bg-white">
//               {categories.length > 0 ? (
//                 categories.map((category) => (
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
//             onValueChange={(val) => setProductData((prev) => ({ ...prev, occasion: val }))}
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
//             onValueChange={(val) => setProductData((prev) => ({ ...prev, gender: val }))}
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
//             value={productData.product_offer}
//             onChange={handleChange}
//             placeholder="Product Offer"
//             className="bg-gray-50"
//           />

//           <Select
//             onValueChange={(val) => setProductData((prev) => ({ ...prev, available: val === "true" }))}
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
          
//         />

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
              
//             />
//             <Input
//               name="stock"
//               type="number"
//               value={variant.stock}
//               onChange={(e) => handleVariantChange(index, e)}
//               placeholder="Stock"
//               className="bg-gray-50"
              
//             />
//             <Input
//               name="making_charge"
//               type="number"
//               value={variant.making_charge}
//               onChange={(e) => handleVariantChange(index, e)}
//               placeholder="Making Charge"
//               className="bg-gray-50"
              
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

//         <Button type="button" onClick={addVariant} className="bg-gray-500 hover:bg-gray-600 text-white">
//           + Add Variant
//         </Button>

//         <Button type="submit" className="w-full bg-[#8c2a2a] hover:bg-[#7a2424] text-white" disabled={isSubmitting}>
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
//   )
// }

// export default AddProductForm


import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { X, Upload, ZoomIn, ZoomOut, Crop, ArrowLeft } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import api from "../../api"
import Cropper from "react-easy-crop"

const AddProductForm = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
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
    product_offer: "",
    product_offer_Isactive: true,
    images: [],
    variants: [
      {
        gross_weight: "",
        stock: "",
        gold_price: "",
        making_charge: "",
        stone_rate: "",
        tax: "",
        shipping: ""
      },
    ],
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])

  // Image editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("productapp/user/categories/")
        setCategories(response.data)
        console.log("Categories loaded:", response.data)
      } catch (error) {
        console.error("Error fetching categories:", error)
        setError("Failed to load categories. Please refresh the page.")
      }
    }

    fetchCategories()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProductData((prev) => ({ ...prev, [name]: value }))
  }

  const handleVariantChange = (index, e) => {
    const { name, value } = e.target
    const updatedVariants = [...productData.variants]
    updatedVariants[index][name] = value
    setProductData((prev) => ({ ...prev, variants: updatedVariants }))
  }

  const addVariant = () => {
    setProductData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          gross_weight: "",
          stock: "",
          gold_price: "",
          making_charge: "",
          stone_rate: "",
          tax: "",
          shipping: ""
        },
      ],
    }))
  }

  const removeVariant = (index) => {
    if (productData.variants.length > 1) {
      setProductData((prev) => ({
        ...prev,
        variants: prev.variants.filter((_, i) => i !== index),
      }))
    }
  }

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      const file = files[0]
      const imageUrl = URL.createObjectURL(file)
      setCurrentImage({ file, url: imageUrl })
      setIsEditModalOpen(true)
    }
  }

  const removeImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index])
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
    setProductData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const editImage = (index) => {
    setCurrentImageIndex(index)
    setCurrentImage({ file: imageFiles[index], url: imagePreviews[index] })
    setIsEditModalOpen(true)
  }

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const createCroppedImage = async () => {
    try {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const image = new Image()
      image.src = currentImage.url

      return new Promise((resolve) => {
        image.onload = () => {
          canvas.width = croppedAreaPixels.width
          canvas.height = croppedAreaPixels.height
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
          )
          canvas.toBlob((blob) => {
            const croppedFile = new File([blob], currentImage.file.name, {
              type: "image/jpeg",
              lastModified: new Date().getTime(),
            })
            resolve({ file: croppedFile, url: URL.createObjectURL(blob) })
          }, "image/jpeg")
        }
      })
    } catch (e) {
      console.error("Error creating cropped image:", e)
      return null
    }
  }

  const saveCroppedImage = async () => {
    if (!croppedAreaPixels) return
    const croppedImage = await createCroppedImage()
    if (croppedImage) {
      if (currentImageIndex !== null) {
        const newImageFiles = [...imageFiles]
        const newImagePreviews = [...imagePreviews]
        URL.revokeObjectURL(imagePreviews[currentImageIndex])
        newImageFiles[currentImageIndex] = croppedImage.file
        newImagePreviews[currentImageIndex] = croppedImage.url
        setImageFiles(newImageFiles)
        setImagePreviews(newImagePreviews)
      } else {
        setImageFiles((prev) => [...prev, croppedImage.file])
        setImagePreviews((prev) => [...prev, croppedImage.url])
        setProductData((prev) => ({
          ...prev,
          images: [...prev.images, croppedImage.file.name],
        }))
      }
    }
    setCurrentImage(null)
    setCurrentImageIndex(null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
    setIsEditModalOpen(false)
  }

  const cancelImageEdit = () => {
    if (currentImage && currentImageIndex === null) {
      URL.revokeObjectURL(currentImage.url)
    }
    setCurrentImage(null)
    setCurrentImageIndex(null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
    setIsEditModalOpen(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!productData.name || !productData.category || !productData.description) {
      setError("Please fill in all required fields")
      return
    }
    if (
      productData.variants.some(
        (variant) =>
          !variant.gross_weight ||
          !variant.stock ||
          !variant.gold_price ||
          !variant.making_charge ||
          !variant.tax ||
          !variant.shipping
      )
    ) {
      setError("Please complete all variant details")
      return
    }

    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const formattedData = {
        ...productData,
        category: Number.parseInt(productData.category),
        variants: productData.variants.map((variant) => ({
          gross_weight: Number.parseFloat(variant.gross_weight),
          stock: Number.parseInt(variant.stock),
          gold_price: Number.parseFloat(variant.gold_price),
          making_charge: Number.parseFloat(variant.making_charge),
          stone_rate: variant.stone_rate ? Number.parseFloat(variant.stone_rate) : 0,
          tax: Number.parseFloat(variant.tax),
          shipping: Number.parseFloat(variant.shipping)
        })),
      }

      console.log("Sending data:", formattedData)
      const response = await api.post("productapp/products/", formattedData)
      console.log("Response:", response.data)
      const productId = response.data.id

      if (imageFiles.length > 0) {
        const formData = new FormData()
        imageFiles.forEach((file) => {
          formData.append("images", file)
        })
        await api.post(`productapp/products/${productId}/images/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      }

      console.log("Success:", response.data)
      setSuccess(true)
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
        product_offer: "",
        product_offer_Isactive: true,
        images: [],
        variants: [
          {
            gross_weight: "",
            stock: "",
            gold_price: "",
            making_charge: "",
            stone_rate: "",
            tax: "",
            shipping: ""
          },
        ],
      })
      setImageFiles([])
      setImagePreviews([])
      setTimeout(() => {
        navigate('/dashboard')
      }, 1500)
    } catch (err) {
      console.error("Error:", err)
      if (err.response) {
        console.error("Response data:", err.response.data)
        console.error("Response status:", err.response.status)
        if (typeof err.response.data === "object") {
          const errorMessages = Object.entries(err.response.data)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ")
          setError(`Validation error: ${errorMessages}`)
        } else {
          setError(err.response.data || "Server rejected the data")
        }
      } else if (err.request) {
        setError("No response from server. Please check your connection.")
      } else {
        setError("Error setting up request: " + err.message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Add Product</h2>
      <Button
        variant="outline"
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2 border-[#7a2828] text-[#7a2828] hover:bg-[#7a2828] hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

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
          <Input
            name="name"
            value={productData.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="bg-gray-50"
            required
          />
          <Input
            name="bis_hallmark"
            value={productData.bis_hallmark}
            onChange={handleChange}
            placeholder="BIS Hallmark ID"
            className="bg-gray-50"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Select
            onValueChange={(val) => setProductData((prev) => ({ ...prev, category: val }))}
            value={productData.category}
            required
          >
            <SelectTrigger className="bg-gray-50">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))
              ) : (
                <>
                  <SelectItem value="1">Rings</SelectItem>
                  <SelectItem value="2">Necklaces</SelectItem>
                  <SelectItem value="3">Bracelets</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
          <Input
            name="gold_color"
            value={productData.gold_color}
            onChange={handleChange}
            placeholder="Gold Color"
            className="bg-gray-50"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Input
            name="size"
            value={productData.size}
            onChange={handleChange}
            placeholder="Size"
            className="bg-gray-50"
          />
          <Select
            onValueChange={(val) => setProductData((prev) => ({ ...prev, occasion: val }))}
            value={productData.occasion}
          >
            <SelectTrigger className="bg-gray-50">
              <SelectValue placeholder="Occasion" />
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

        <div className="grid grid-cols-3 gap-6">
          <Select
            onValueChange={(val) => setProductData((prev) => ({ ...prev, gender: val }))}
            value={productData.gender}
          >
            <SelectTrigger className="bg-gray-50">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Unisex">Unisex</SelectItem>
            </SelectContent>
          </Select>
          <Input
            name="product_offer"
            type="number"
            value={productData.product_offer}
            onChange={handleChange}
            placeholder="Product Offer (%)"
            className="bg-gray-50"
            min="0"
            max="100"
          />
          <Select
            onValueChange={(val) => setProductData((prev) => ({ ...prev, available: val === "true" }))}
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

        <Textarea
          name="description"
          value={productData.description}
          onChange={handleChange}
          placeholder="Description"
          className="bg-gray-50 min-h-[100px]"
          required
        />

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
              />
            </label>
          </div>
        </div>

        <h3 className="text-lg font-semibold">Variants</h3>
        {productData.variants.map((variant, index) => (
          <div key={index} className="grid grid-cols-4 gap-4 border p-4 rounded-lg">
            <Input
              name="gross_weight"
              type="number"
              value={variant.gross_weight}
              onChange={(e) => handleVariantChange(index, e)}
              placeholder="Gross Weight (g)"
              className="bg-gray-50"
              required
              min="0"
              step="0.01"
            />
            <Input
              name="gold_price"
              type="number"
              value={variant.gold_price}
              onChange={(e) => handleVariantChange(index, e)}
              placeholder="Gold Price"
              className="bg-gray-50"
              required
              min="0"
              step="0.01"
            />
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
            <Input
              name="tax"
              type="number"
              value={variant.tax}
              onChange={(e) => handleVariantChange(index, e)}
              placeholder="Tax (%)"
              className="bg-gray-50"
              required
              min="0"
              step="0.01"
            />
            <Input
              name="shipping"
              type="number"
              value={variant.shipping}
              onChange={(e) => handleVariantChange(index, e)}
              placeholder="Shipping Cost"
              className="bg-gray-50"
              required
              min="0"
              step="0.01"
            />
            <Button
              type="button"
              onClick={() => removeVariant(index)}
              className="bg-red-900 hover:bg-red-600 text-white"
              disabled={productData.variants.length <= 1}
            >
              Remove
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
          {isSubmitting ? "Adding Product..." : "Add Product"}
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
  )
}

export default AddProductForm

