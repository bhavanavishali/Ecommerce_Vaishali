
// "use client"

// import { useEffect, useState } from "react"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Pencil, Eye, EyeOff, Search,Lock, Unlock } from "lucide-react"

// import api from '../../api'

// function CategoryTable() {
//   const [categories, setCategories] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [currentPage, setCurrentPage] = useState(1)
//   const [newCategory, setNewCategory] = useState("")
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
//     }
//     catch (err) {
//       setError(err.message || "Failed to fetch categories")
//       setCategories([])
//     }
//     finally {
//       setLoading(false)
//     }
//   }

//   const toggleActiveStatus = async (categoryId, currentIsActive) => {
//     try {
//       await api.patch(`productapp/categories/${categoryId}/`, { is_active: !currentIsActive })
//       setCategories(categories.map(category =>
//         category.id === categoryId ? { ...category, is_active: !currentIsActive } : category
//       ))
//     }
//     catch (err) {
//       console.error("Error updating category status:", err)
//     }
//   }

//   const handleEditCategory = (categoryId) => {
//     const categoryToEdit = categories.find(category => category.id === categoryId)
//     if (categoryToEdit) {
//       setEditingCategory(categoryToEdit)
//       setNewCategory(categoryToEdit.name)
//     }
//   }

//   const handleAddCategory = async () => {
//     if (!newCategory.trim()) return
    
//     try {
//       if (editingCategory) {
//         // Update existing category
//         await api.patch(`productapp/categories/${editingCategory.id}/`, { name: newCategory })
//         setCategories(categories.map(category =>
//           category.id === editingCategory.id ? { ...category, name: newCategory } : category
//         ))
//         setEditingCategory(null)
//       } else {
//         // Add new category
//         const response = await api.post('productapp/categories/', { name: newCategory })
//         setCategories([...categories, response.data])
//       }
//       setNewCategory("")
//     }
//     catch (err) {
//       console.error("Error saving category:", err)
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
//               <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
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
//             <p className="text-red-500">{error}</p>
//           ) : (
//             <>
//               <div className="rounded-md overflow-hidden">
//                 <Table>
//                   <TableHeader className="bg-gray-400">
//                     <TableRow>
//                       <TableHead className="w-20 text-black font-semibold">S.No</TableHead>
//                       <TableHead className="text-black font-semibold">Category</TableHead>
//                       <TableHead className="text-black font-semibold">Status</TableHead>
//                       <TableHead className="text-black font-semibold">Block/Unblock</TableHead>
//                       <TableHead className="text-black font-semibold text-right">Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {currentCategories.length > 0 ? (
//                       currentCategories.map((category, index) => (
//                         <TableRow key={category.id} className="bg-gray-200 even:bg-gray-100">
//                           <TableCell className="font-medium">{indexOfFirstCategory + index + 1}</TableCell>
//                           <TableCell>{category.name}</TableCell>
//                           <TableCell className="py-4">
//                       <span className={`px-2 py-1 rounded-full text-xs ${
//                           category.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//                             }`}>
//                             {category.is_active ? "Active" : "Blocked"}
//                       </span>
//                       </TableCell>
//                           <TableCell>
//                             <div className="flex items-center space-x-2">
//                               <Button 
//                             variant="ghost" 
//                               size="icon"
//                               onClick={() => toggleActiveStatus(category.id, category.is_active)}
//                               title={category.is_active ? "Block category" : "Unblock category"}
//                             >
//                               {!category.is_active ? 
//                                 <Lock className="h-4 w-4 text-red-600" /> : 
//                                 <Unlock className="h-4 w-4 text-green-600" />
//                               }
//                             </Button>
                              
//                             </div>
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
//                         <TableCell colSpan={4} className="text-center py-4">No categories found</TableCell>
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
//                 <div className="bg-gray-200 p-6 rounded-md flex items-center gap-4">
//                   <Input
//                     placeholder="Enter category name"
//                     value={newCategory}
//                     onChange={(e) => setNewCategory(e.target.value)}
//                     className="bg-white"
//                   />
//                   <Button 
//                     className="bg-[#9b2c2c] hover:bg-[#822424] text-white px-8" 
//                     onClick={handleAddCategory}
//                   >
//                     {editingCategory ? "Update" : "Save"}
//                   </Button>
//                   {editingCategory && (
//                     <Button 
//                       variant="outline" 
//                       onClick={() => {
//                         setEditingCategory(null)
//                         setNewCategory("")
//                       }}
//                     >
//                       Cancel
//                     </Button>
//                   )}
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
import { Pencil, Lock, Unlock } from "lucide-react"

import api from '../../api'

function CategoryTable() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [newCategory, setNewCategory] = useState({
    name: "",
    category_offer: 0,
    category_offer_Isactive: true
  })
  const [editingCategory, setEditingCategory] = useState(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const response = await api.get('productapp/categories/')
      setCategories(response.data)
      setError(null)
    }
    catch (err) {
      setError(err.message || "Failed to fetch categories")
      setCategories([])
    }
    finally {
      setLoading(false)
    }
  }

  const toggleActiveStatus = async (categoryId, currentIsActive) => {
    try {
      await api.patch(`productapp/categories/${categoryId}/`, { is_active: !currentIsActive })
      setCategories(categories.map(category =>
        category.id === categoryId ? { ...category, is_active: !currentIsActive } : category
      ))
    }
    catch (err) {
      console.error("Error updating category status:", err)
    }
  }

  const toggleOfferActiveStatus = async (categoryId, currentOfferIsActive) => {
    try {
      await api.patch(`productapp/categories/${categoryId}/`, { category_offer_Isactive: !currentOfferIsActive })
      setCategories(categories.map(category =>
        category.id === categoryId ? { ...category, category_offer_Isactive: !currentOfferIsActive } : category
      ))
    }
    catch (err) {
      console.error("Error updating offer status:", err)
    }
  }

  const handleEditCategory = (categoryId) => {
    const categoryToEdit = categories.find(category => category.id === categoryId)
    if (categoryToEdit) {
      setEditingCategory(categoryToEdit)
      setNewCategory({
        name: categoryToEdit.name,
        category_offer: categoryToEdit.category_offer,
        category_offer_Isactive: categoryToEdit.category_offer_Isactive
      })
    }
  }

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) return
    
    try {
      if (editingCategory) {
        // Update existing category
        await api.patch(`productapp/categories/${editingCategory.id}/`, newCategory)
        setCategories(categories.map(category =>
          category.id === editingCategory.id ? { ...category, ...newCategory } : category
        ))
        setEditingCategory(null)
      } else {
        // Add new category
        const response = await api.post('productapp/categories/', newCategory)
        setCategories([...categories, response.data])
      }
      setNewCategory({ name: "", category_offer: 0, category_offer_Isactive: true })
    }
    catch (err) {
      console.error("Error saving category:", err)
    }
  }

  const filteredCategories = categories.filter((category) =>
    category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.id && category.id.toString().includes(searchTerm))
  )

  const categoriesPerPage = 7
  const indexOfLastCategory = currentPage * categoriesPerPage
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage
  const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory)
  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-0">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold text-[#1a365d]">Category</CardTitle>
            <div className="relative w-64">
              <Input
                placeholder="Search"
                className="pl-8 bg-gray-100 border-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {loading ? (
            <p>Loading categories...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
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
                    {currentCategories.length > 0 ? (
                      currentCategories.map((category, index) => (
                        <TableRow key={category.id} className="bg-gray-200 even:bg-gray-100">
                          <TableCell className="font-medium">{indexOfFirstCategory + index + 1}</TableCell>
                          <TableCell>{category.name}</TableCell>
                          <TableCell>{category.category_offer}%</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              category.category_offer_Isactive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}>
                              {category.category_offer_Isactive ? "Active" : "Inactive"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              category.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}>
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
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-white"
                              onClick={() => handleEditCategory(category.id)}
                            >
                              <Pencil className="h-4 w-4" />
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

              {totalPages > 1 && (
                <div className="flex justify-center mt-4 gap-2">
                  {pageNumbers.map(number => (
                    <Button
                      key={number}
                      variant={currentPage === number ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(number)}
                    >
                      {number}
                    </Button>
                  ))}
                </div>
              )}

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h3>
                <div className="bg-gray-200 p-6 rounded-md flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <label className="w-32 text-sm font-medium">Category Name</label>
                    <Input
                      placeholder="Enter category name"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      className="bg-white"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-32 text-sm font-medium">Category Offer (%)</label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      placeholder="Enter offer percentage"
                      value={newCategory.category_offer}
                      onChange={(e) => setNewCategory({ ...newCategory, category_offer: parseFloat(e.target.value) || 0 })}
                      className="bg-white"
                    />
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

