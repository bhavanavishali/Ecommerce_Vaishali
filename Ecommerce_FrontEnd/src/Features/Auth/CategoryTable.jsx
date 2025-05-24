

// "use client"

// import { useEffect, useState } from "react"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Pencil, Lock, Unlock } from "lucide-react"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert" // Assuming you have an Alert component

// import api from '../../api'

// function CategoryTable() {
//   const [categories, setCategories] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [formErrors, setFormErrors] = useState({}) // New state for form-specific errors
//   const [searchTerm, setSearchTerm] = useState("")
//   const [currentPage, setCurrentPage] = useState(1)
//   const [newCategory, setNewCategory] = useState({
//     name: "",
//     category_offer: 0,
//     category_offer_Isactive: true
//   })
//   const [editingCategory, setEditingCategory] = useState(null)

//   useEffect(() => {
//     fetchCategories()
//   }, [])

//   const fetchCategories = async () => {
//     setLoading(true)
//     try {
//       const response = await api.get('productapp/categories/')
//       setCategories(response.data)
//       setError(null)
//     } catch (err) {
//       const errorMessage = err.response?.data?.detail || err.message || "Failed to fetch categories"
//       setError(errorMessage)
//       setCategories([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   const toggleActiveStatus = async (categoryId, currentIsActive) => {
//     try {
//       await api.patch(`productapp/categories/${categoryId}/`, { is_active: !currentIsActive })
//       setCategories(categories.map(category =>
//         category.id === categoryId ? { ...category, is_active: !currentIsActive } : category
//       ))
//       setError(null)
//     } catch (err) {
//       const errorMessage = err.response?.data?.detail || "Error updating category status"
//       setError(errorMessage)
//     }
//   }

//   const toggleOfferActiveStatus = async (categoryId, currentOfferIsActive) => {
//     try {
//       await api.patch(`productapp/categories/${categoryId}/`, { category_offer_Isactive: !currentOfferIsActive })
//       setCategories(categories.map(category =>
//         category.id === categoryId ? { ...category, category_offer_Isactive: !currentOfferIsActive } : category
//       ))
//       setError(null)
//     } catch (err) {
//       const errorMessage = err.response?.data?.detail || "Error updating offer status"
//       setError(errorMessage)
//     }
//   }

//   const handleAddCategory = async () => {
//     if (!newCategory.name.trim()) {
//       setFormErrors({ name: "Category name is required" })
//       return
//     }

//     try {
//       if (editingCategory) {
//         // Update existing category
//         await api.patch(`productapp/categories/${editingCategory.id}/`, newCategory)
//         setCategories(categories.map(category =>
//           category.id === editingCategory.id ? { ...category, ...newCategory } : category
//         ))
//         setEditingCategory(null)
//       } else {
//         // Add new category
//         const response = await api.post('productapp/categories/', newCategory)
//         setCategories([...categories, response.data])
//       }
//       setNewCategory({ name: "", category_offer: 0, category_offer_Isactive: true })
//       setFormErrors({})
//       setError(null)
//     } catch (err) {
//       const errors = err.response?.data || { non_field_errors: ["Failed to save category"] }
//       setFormErrors(errors) // Store field-specific or non-field errors
//     }
//   }

//   const filteredCategories = categories.filter((category) =>
//     category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     (category.id && category.id.toString().includes(searchTerm))
//   )

//   const categoriesPerPage = 7
//   const indexOfLastCategory = currentPage * categoriesPerPage
//   const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage
//   const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory)
//   const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage)

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber)
//   }

//   const pageNumbers = []
//   for (let i = 1; i <= totalPages; i++) {
//     pageNumbers.push(i)
//   }

//   return (
//     <div className="container mx-auto py-6 max-w-4xl">
//       <Card className="bg-white shadow-sm">
//         <CardHeader className="pb-0">
//           <div className="flex justify-between items-center">
//             <CardTitle className="text-xl font-bold text-[#1a365d]">Category</CardTitle>
//             <div className="relative w-64">
//               <Input
//                 placeholder="Search"
//                 className="pl-8 bg-gray-100 border-0"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent className="pt-4">
//           {loading ? (
//             <p>Loading categories...</p>
//           ) : error ? (
//             <Alert variant="destructive" className="mb-4">
//               <AlertTitle>Error</AlertTitle>
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           ) : (
//             <>
//               <div className="rounded-md overflow-hidden">
//                 <Table>
//                   <TableHeader className="bg-gray-400">
//                     <TableRow>
//                       <TableHead className="w-20 text-black font-semibold">S.No</TableHead>
//                       <TableHead className="text-black font-semibold">Category</TableHead>
//                       <TableHead className="text-black font-semibold">Offer</TableHead>
//                       <TableHead className="text-black font-semibold">Offer Status</TableHead>
//                       <TableHead className="text-black font-semibold">Status</TableHead>
//                       <TableHead className="text-black font-semibold">Block/Unblock</TableHead>
//                       <TableHead className="text-black font-semibold">Offer Block/Unblock</TableHead>
//                       <TableHead className="text-black font-semibold text-right">Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {currentCategories.length > 0 ? (
//                       currentCategories.map((category, index) => (
//                         <TableRow key={category.id} className="bg-gray-200 even:bg-gray-100">
//                           <TableCell className="font-medium">{indexOfFirstCategory + index + 1}</TableCell>
//                           <TableCell>{category.name}</TableCell>
//                           <TableCell>{category.category_offer}%</TableCell>
//                           <TableCell>
//                             <span className={`px-2 py-1 rounded-full text-xs ${category.category_offer_Isactive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
//                               {category.category_offer_Isactive ? "Active" : "Inactive"}
//                             </span>
//                           </TableCell>
//                           <TableCell>
//                             <span className={`px-2 py-1 rounded-full text-xs ${category.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
//                               {category.is_active ? "Active" : "Blocked"}
//                             </span>
//                           </TableCell>
//                           <TableCell>
//                             <Button 
//                               variant="ghost" 
//                               size="icon"
//                               onClick={() => toggleActiveStatus(category.id, category.is_active)}
//                               title={category.is_active ? "Block category" : "Unblock category"}
//                             >
//                               {category.is_active ? 
//                                 <Unlock className="h-4 w-4 text-green-600" /> : 
//                                 <Lock className="h-4 w-4 text-red-600" />
//                               }
//                             </Button>
//                           </TableCell>
//                           <TableCell>
//                             <Button 
//                               variant="ghost" 
//                               size="icon"
//                               onClick={() => toggleOfferActiveStatus(category.id, category.category_offer_Isactive)}
//                               title={category.category_offer_Isactive ? "Deactivate offer" : "Activate offer"}
//                             >
//                               {category.category_offer_Isactive ? 
//                                 <Unlock className="h-4 w-4 text-green-600" /> : 
//                                 <Lock className="h-4 w-4 text-red-600" />
//                               }
//                             </Button>
//                           </TableCell>
//                           <TableCell className="text-right">
//                             <Button
//                               variant="outline"
//                               size="icon"
//                               className="h-8 w-8 bg-white"
//                               onClick={() => handleEditCategory(category.id)}
//                             >
//                               <Pencil className="h-4 w-4" />
//                             </Button>
//                           </TableCell>
//                         </TableRow>
//                       ))
//                     ) : (
//                       <TableRow>
//                         <TableCell colSpan={8} className="text-center py-4">No categories found</TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </div>

//               {totalPages > 1 && (
//                 <div className="flex justify-center mt-4 gap-2">
//                   {pageNumbers.map(number => (
//                     <Button
//                       key={number}
//                       variant={currentPage === number ? "default" : "outline"}
//                       size="sm"
//                       onClick={() => handlePageChange(number)}
//                     >
//                       {number}
//                     </Button>
//                   ))}
//                 </div>
//               )}

//               <div className="mt-8">
//                 <h3 className="text-lg font-medium mb-4">
//                   {editingCategory ? "Edit Category" : "Add New Category"}
//                 </h3>
//                 {formErrors.non_field_errors && (
//                   <Alert variant="destructive" className="mb-4">
//                     <AlertTitle>Error</AlertTitle>
//                     <AlertDescription>
//                       {Array.isArray(formErrors.non_field_errors)
//                         ? formErrors.non_field_errors.join(", ")
//                         : formErrors.non_field_errors}
//                     </AlertDescription>
//                   </Alert>
//                 )}
//                 <div className="bg-gray-200 p-6 rounded-md flex flex-col gap-4">
//                   <div className="flex items-center gap-4">
//                     <label className="w-32 text-sm font-medium">Category Name</label>
//                     <div className="flex-1">
//                       <Input
//                         placeholder="Enter category name"
//                         value={newCategory.name}
//                         onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
//                         className={`bg-white ${formErrors.name ? "border-red-500" : ""}`}
//                       />
//                       {formErrors.name && (
//                         <p className="text-red-500 text-sm mt-1">
//                           {Array.isArray(formErrors.name) ? formErrors.name.join(", ") : formErrors.name}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-4">
//                     <label className="w-32 text-sm font-medium">Category Offer (%)</label>
//                     <div className="flex-1">
//                       <Input
//                         type="number"
//                         step="0.01"
//                         min="0"
//                         max="100"
//                         placeholder="Enter offer percentage"
//                         value={newCategory.category_offer}
//                         onChange={(e) => setNewCategory({ ...newCategory, category_offer: parseFloat(e.target.value) || 0 })}
//                         className={`bg-white ${formErrors.category_offer ? "border-red-500" : ""}`}
//                       />
//                       {formErrors.category_offer && (
//                         <p className="text-red-500 text-sm mt-1">
//                           {Array.isArray(formErrors.category_offer) ? formErrors.category_offer.join(", ") : formErrors.category_offer}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-4">
//                     <label className="w-32 text-sm font-medium">Offer Active</label>
//                     <Checkbox
//                       checked={newCategory.category_offer_Isactive}
//                       onCheckedChange={(checked) => setNewCategory({ ...newCategory, category_offer_Isactive: checked })}
//                     />
//                   </div>
//                   <div className="flex gap-4">
//                     <Button 
//                       className="bg-[#9b2c2c] hover:bg-[#822424] text-white px-8" 
//                       onClick={handleAddCategory}
//                     >
//                       {editingCategory ? "Update" : "Save"}
//                     </Button>
//                     {editingCategory && (
//                       <Button 
//                         variant="outline" 
//                         onClick={() => {
//                           setEditingCategory(null)
//                           setNewCategory({ name: "", category_offer: 0, category_offer_Isactive: true })
//                           setFormErrors({})
//                         }}
//                       >
//                         Cancel
//                       </Button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// export default CategoryTable

"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Pencil, Lock, Unlock, Trash2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import api from '../../api'

function CategoryTable() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formErrors, setFormErrors] = useState({})
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [newCategory, setNewCategory] = useState({
    name: "",
    category_offer: 0,
    category_offer_Isactive: true
  })
  const [editingCategory, setEditingCategory] = useState(null)

  useEffect(() => {
    console.log('useEffect triggered - Page:', currentPage, 'Search:', searchTerm, 'Loading:', loading)
    fetchCategories()
  }, [currentPage, searchTerm])

  const fetchCategories = async () => {
    setLoading(true)
    console.log('Fetching categories for page:', currentPage, 'search:', searchTerm)
    try {
      const response = await api.get(`productapp/categories/?page=${currentPage}&search=${encodeURIComponent(searchTerm)}`)
      console.log('API Response:', response.data)
      const results = response.data.results || []
      const count = response.data.count || 0
      const pageSize = 7 // Must match backend page_size
      setCategories(results)
      setTotalPages(Math.max(1, Math.ceil(count / pageSize)))
      console.log('Categories set:', results.length, 'Total Pages:', Math.max(1, Math.ceil(count / pageSize)))
      setError(null)
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || "Failed to fetch categories"
      console.error('Fetch Error:', err, 'Response:', err.response?.data)
      setError(errorMessage)
      setCategories([])
      setTotalPages(1)
    } finally {
      setLoading(false)
      console.log('Loading set to false')
    }
  }

  const toggleActiveStatus = async (categoryId, currentIsActive) => {
    try {
      await api.patch(`productapp/categories/${categoryId}/`, { is_active: !currentIsActive })
      setCategories(categories.map(category =>
        category.id === categoryId ? { ...category, is_active: !currentIsActive } : category
      ))
      setError(null)
    } catch (err) {
      const errorMessage = err.response?.data?.detail || "Error updating category status"
      setError(errorMessage)
    }
  }

  const toggleOfferActiveStatus = async (categoryId, currentOfferIsActive) => {
    try {
      await api.patch(`productapp/categories/${categoryId}/`, { category_offer_Isactive: !currentOfferIsActive })
      setCategories(categories.map(category =>
        category.id === categoryId ? { ...category, category_offer_Isactive: !currentOfferIsActive } : category
      ))
      setError(null)
    } catch (err) {
      const errorMessage = err.response?.data?.detail || "Error updating offer status"
      setError(errorMessage)
    }
  }

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await api.delete(`productapp/categories/${categoryId}/`)
        setCategories(categories.filter(category => category.id !== categoryId))
        setError(null)
        if (categories.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1)
        } else {
          fetchCategories()
        }
      } catch (err) {
        const errorMessage = err.response?.data?.detail || "Error deleting category"
        setError(errorMessage)
      }
    }
  }

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      setFormErrors({ name: "Category name is required" })
      return
    }

    try {
      if (editingCategory) {
        await api.patch(`productapp/categories/${editingCategory.id}/`, newCategory)
        setCategories(categories.map(category =>
          category.id === editingCategory.id ? { ...category, ...newCategory } : category
        ))
        setEditingCategory(null)
      } else {
        const response = await api.post('productapp/categories/', newCategory)
        setCategories([response.data, ...categories])
        setCurrentPage(1)
      }
      setNewCategory({ name: "", category_offer: 0, category_offer_Isactive: true })
      setFormErrors({})
      setError(null)
      fetchCategories()
    } catch (err) {
      const errors = err.response?.data || { non_field_errors: ["Failed to save category"] }
      setFormErrors(errors)
    }
  }

  const handleEditCategory = (category) => {
    setEditingCategory(category)
    setNewCategory({
      name: category.name,
      category_offer: category.category_offer,
      category_offer_Isactive: category.category_offer_Isactive
    })
    setFormErrors({})
  }

  const handleClearSearch = () => {
    console.log('Clearing search')
    setSearchTerm("")
    setCurrentPage(1)
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      console.log('Navigating to previous page:', currentPage - 1)
      setCurrentPage(currentPage - 1)
    } else {
      console.log('Cannot navigate to previous page - already on page 1')
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      console.log('Navigating to next page:', currentPage + 1)
      setCurrentPage(currentPage + 1)
    } else {
      console.log('Cannot navigate to next page - already on last page or no pages')
    }
  }

  const handlePageClick = (pageNumber) => {
    console.log('Page button clicked:', pageNumber)
    setCurrentPage(pageNumber)
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-0">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold text-[#1a365d]">Category</CardTitle>
            <div className="relative w-64 flex items-center gap-2">
              <Input
                placeholder="Search"
                className="pl-8 bg-gray-100 border-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearSearch}
                  className="h-8"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {loading ? (
            <p>Loading categories...</p>
          ) : error ? (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="rounded-md overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-400">
                    <TableRow>
                      <TableHead className="w-20 text-black font-semibold">S.No</TableHead>
                      <TableHead className="text-black font-semibold">Category</TableHead>
                      <TableHead className="text-black font-semibold">Offer</TableHead>
                      <TableHead className="text-black font-semibold">Offer Status</TableHead>
                      <TableHead className="text-black font-semibold">Status</TableHead>
                      <TableHead className="text-black font-semibold">Block/Unblock</TableHead>
                      <TableHead className="text-black font-semibold">Offer Block/Unblock</TableHead>
                      <TableHead className="text-black font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.length > 0 ? (
                      categories.map((category, index) => (
                        <TableRow key={category.id} className="bg-gray-200 even:bg-gray-100">
                          <TableCell className="font-medium">{(currentPage - 1) * 7 + index + 1}</TableCell>
                          <TableCell>{category.name}</TableCell>
                          <TableCell>{category.category_offer}%</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${category.category_offer_Isactive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                              {category.category_offer_Isactive ? "Active" : "Inactive"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${category.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                              {category.is_active ? "Active" : "Blocked"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => toggleActiveStatus(category.id, category.is_active)}
                              title={category.is_active ? "Block category" : "Unblock category"}
                            >
                              {category.is_active ? 
                                <Unlock className="h-4 w-4 text-green-600" /> : 
                                <Lock className="h-4 w-4 text-red-600" />
                              }
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => toggleOfferActiveStatus(category.id, category.category_offer_Isactive)}
                              title={category.category_offer_Isactive ? "Deactivate offer" : "Activate offer"}
                            >
                              {category.category_offer_Isactive ? 
                                <Unlock className="h-4 w-4 text-green-600" /> : 
                                <Lock className="h-4 w-4 text-red-600" />
                              }
                            </Button>
                          </TableCell>
                          <TableCell className="text-right flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-white"
                              onClick={() => handleEditCategory(category)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-white"
                              onClick={() => handleDeleteCategory(category.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4">No categories found</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-center mt-4 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    console.log('Previous button clicked, Current Page:', currentPage)
                    handlePreviousPage()
                  }}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                  <Button
                    key={number}
                    variant={currentPage === number ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageClick(number)}
                  >
                    {number}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    console.log('Next button clicked, Current Page:', currentPage, 'Total Pages:', totalPages)
                    handleNextPage()
                  }}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  Next
                </Button>
              </div>
              <div className="text-center mt-2 text-sm text-gray-600">
                Page {currentPage} of {totalPages} (Total Categories: {categories.length})
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h3>
                {formErrors.non_field_errors && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      {Array.isArray(formErrors.non_field_errors)
                        ? formErrors.non_field_errors.join(", ")
                        : formErrors.non_field_errors}
                    </AlertDescription>
                  </Alert>
                )}
                <div className="bg-gray-200 p-6 rounded-md flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <label className="w-32 text-sm font-medium">Category Name</label>
                    <div className="flex-1">
                      <Input
                        placeholder="Enter category name"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                        className={`bg-white ${formErrors.name ? "border-red-500" : ""}`}
                      />
                      {formErrors.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {Array.isArray(formErrors.name) ? formErrors.name.join(", ") : formErrors.name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-32 text-sm font-medium">Category Offer (%)</label>
                    <div className="flex-1">
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        placeholder="Enter offer percentage"
                        value={newCategory.category_offer}
                        onChange={(e) => setNewCategory({ ...newCategory, category_offer: parseFloat(e.target.value) || 0 })}
                        className={`bg-white ${formErrors.category_offer ? "border-red-500" : ""}`}
                      />
                      {formErrors.category_offer && (
                        <p className="text-red-500 text-sm mt-1">
                          {Array.isArray(formErrors.category_offer) ? formErrors.category_offer.join(", ") : formErrors.category_offer}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-32 text-sm font-medium">Offer Active</label>
                    <Checkbox
                      checked={newCategory.category_offer_Isactive}
                      onCheckedChange={(checked) => setNewCategory({ ...newCategory, category_offer_Isactive: checked })}
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button 
                      className="bg-[#9b2c2c] hover:bg-[#822424] text-white px-8" 
                      onClick={handleAddCategory}
                    >
                      {editingCategory ? "Update" : "Save"}
                    </Button>
                    {editingCategory && (
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setEditingCategory(null)
                          setNewCategory({ name: "", category_offer: 0, category_offer_Isactive: true })
                          setFormErrors({})
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default CategoryTable