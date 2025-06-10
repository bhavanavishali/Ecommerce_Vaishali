


"use client"

import { useState, useEffect } from "react"
import { useDebounce } from "use-debounce"
import { useNavigate } from "react-router-dom"
import { Search, Pencil, Plus, Lock, Unlock, Percent, Filter, Package, TrendingUp, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import api from "../../api"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function ProductTable() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [productsPerPage, setProductsPerPage] = useState(7)
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300)
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState(null)
  const [offerPercentage, setOfferPercentage] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchTerm, productsPerPage])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await api.get("productapp/products/")
      console.log("product response",response.data)
      setProducts(response.data)
      setError(null)
    } catch (err) {
      console.error("Error fetching products:", err)
      setError(err.message || "Failed to fetch products")
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const toggleActiveStatus = async (productId, currentIsActive) => {
    try {
      await api.patch(`productapp/products/${productId}/`, { is_active: !currentIsActive })
      setProducts(
        products.map((product) => (product.id === productId ? { ...product, is_active: !currentIsActive } : product)),
      )
    } catch (err) {
      console.error("Error updating product status:", err)
    }
  }

  const handleOfferSubmit = async (e) => {
    e.preventDefault()
    if (!selectedProductId || !offerPercentage) return

    try {
      const parsedPercentage = Number.parseFloat(offerPercentage)
      if (isNaN(parsedPercentage) || parsedPercentage < 0 || parsedPercentage > 100) {
        alert("Please enter a valid percentage between 0 and 100.")
        return
      }

      await api.patch(`productapp/products/${selectedProductId}/`, {
        discount: parsedPercentage,
      })
      setProducts(
        products.map((product) =>
          product.id === selectedProductId ? { ...product, discount: parsedPercentage } : product,
        ),
      )
      setIsOfferModalOpen(false)
      setOfferPercentage("")
      setSelectedProductId(null)
    } catch (err) {
      console.error("Error updating product discount:", err)
      alert("Failed to update discount. Please try again.")
    }
  }

  const openOfferModal = (productId) => {
    const product = products.find((p) => p.id === productId)
    setSelectedProductId(productId)
    setOfferPercentage(product.discount ? product.discount.toString() : "")
    setIsOfferModalOpen(true)
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      product.id?.toString().includes(debouncedSearchTerm.toLowerCase()) ||
      product.category_name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
  )

  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  const maxVisiblePages = 5
  const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
  const visiblePageNumbers = []
  for (let i = startPage; i <= endPage; i++) {
    visiblePageNumbers.push(i)
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const getStatusBadge = (isActive) => {
    return (
      <Badge
        variant={isActive ? "default" : "destructive"}
        className={`${
          isActive ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200" : "bg-red-100 text-red-800 hover:bg-red-200"
        }`}
      >
        {isActive ? "Active" : "Blocked"}
      </Badge>
    )
  }

  const getAvailabilityBadge = (available) => {
    return (
      <Badge
        variant={available ? "default" : "secondary"}
        className={`${
          available
            ? "bg-green-100 text-green-800 hover:bg-green-200"
            : "bg-orange-100 text-orange-800 hover:bg-orange-200"
        }`}
      >
        {available ? "In Stock" : "Out of Stock"}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="text-center">
                <Package className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Products</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <Button
                  onClick={fetchProducts}
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-100"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Package className="h-8 w-8 text-[#8B1D24]" />
              Product Management
            </h1>
            <p className="text-gray-600">Manage your product inventory and settings</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="bg-[#8B1D24] hover:bg-[#6B171C] text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
              onClick={() => navigate("/addproduct")}
            >
              <Plus className="h-4 w-4" />
              Add New Product
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Products</p>
                  <p className="text-2xl font-bold text-blue-900">{products.length}</p>
                </div>
                <Package className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-r from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Active Products</p>
                  <p className="text-2xl font-bold text-green-900">{products.filter((p) => p.is_active).length}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-r from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">With Discounts</p>
                  <p className="text-2xl font-bold text-purple-900">{products.filter((p) => p.discount > 0).length}</p>
                </div>
                <Percent className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, ID, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-[#8B1D24] focus:ring-[#8B1D24]"
                  />
                </div>

                <Select value={productsPerPage.toString()} onValueChange={(value) => setProductsPerPage(Number(value))}>
                  <SelectTrigger className="w-full sm:w-[180px] border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 per page</SelectItem>
                    <SelectItem value="7">7 per page</SelectItem>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="20">20 per page</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Filter className="h-4 w-4" />
                Showing {currentProducts.length} of {filteredProducts.length} products
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Table/Cards */}
        <Card className="border-0 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Product</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Category</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Availability</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Discount</th>
                    <th className="text-right py-4 px-6 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentProducts.length > 0 ? (
                    currentProducts.map((product, index) => (
                      <tr
                        key={product.id}
                        className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#8B1D24] to-[#6B171C] rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                              {product.name?.charAt(0)?.toUpperCase() || "P"}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-500">ID: {product.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <Badge variant="outline" className="bg-gray-50">
                            {product.category_name}
                          </Badge>
                        </td>
                        <td className="py-4 px-6">{getAvailabilityBadge(product.available)}</td>
                        <td className="py-4 px-6">{getStatusBadge(product.is_active)}</td>
                        <td className="py-4 px-6">
                          {product.discount ? (
                            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                              {product.discount}% OFF
                            </Badge>
                          ) : (
                            <span className="text-gray-400 text-sm">No discount</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleActiveStatus(product.id, product.is_active)}
                              className="h-8 w-8 p-0 hover:bg-gray-100"
                              title={product.is_active ? "Block Product" : "Unblock Product"}
                            >
                              {product.is_active ? (
                                <Lock className="h-4 w-4 text-red-500" />
                              ) : (
                                <Unlock className="h-4 w-4 text-green-500" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/admin/editproduct/${product.id}`)}
                              className="h-8 w-8 p-0 hover:bg-gray-100"
                              title="Edit Product"
                            >
                              <Pencil className="h-4 w-4 text-blue-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/admin/addvariant/${product.id}`)}
                              className="h-8 w-8 p-0 hover:bg-gray-100"
                              title="Add Variant"
                            >
                              <Plus className="h-4 w-4 text-green-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openOfferModal(product.id)}
                              className="h-8 w-8 p-0 hover:bg-gray-100"
                              title="Add/Edit Discount"
                            >
                              <Percent className="h-4 w-4 text-purple-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center">
                        <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No products found</p>
                        <p className="text-gray-400 text-sm">Try adjusting your search criteria</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4 p-4">
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <Card key={product.id} className="border border-gray-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#8B1D24] to-[#6B171C] rounded-lg flex items-center justify-center text-white font-semibold">
                            {product.name?.charAt(0)?.toUpperCase() || "P"}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{product.name}</h3>
                            <p className="text-sm text-gray-500">ID: {product.id}</p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => toggleActiveStatus(product.id, product.is_active)}>
                              {product.is_active ? (
                                <>
                                  <Lock className="h-4 w-4 mr-2" />
                                  Block Product
                                </>
                              ) : (
                                <>
                                  <Unlock className="h-4 w-4 mr-2" />
                                  Unblock Product
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/admin/editproduct/${product.id}`)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit Product
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/admin/addvariant/${product.id}`)}>
                              <Plus className="h-4 w-4 mr-2" />
                              Add Variant
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openOfferModal(product.id)}>
                              <Percent className="h-4 w-4 mr-2" />
                              Add/Edit Discount
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-500 mb-1">Category</p>
                          <Badge variant="outline" className="bg-gray-50">
                            {product.category_name}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">Availability</p>
                          {getAvailabilityBadge(product.available)}
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">Status</p>
                          {getStatusBadge(product.is_active)}
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">Discount</p>
                          {product.discount ? (
                            <Badge className="bg-purple-100 text-purple-800">{product.discount}% OFF</Badge>
                          ) : (
                            <span className="text-gray-400">No discount</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No products found</p>
                  <p className="text-gray-400 text-sm">Try adjusting your search criteria</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={`${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-gray-100"}`}
                  />
                </PaginationItem>
                {visiblePageNumbers.map((number) => (
                  <PaginationItem key={number}>
                    <PaginationLink
                      isActive={currentPage === number}
                      onClick={() => handlePageChange(number)}
                      className={`cursor-pointer ${
                        currentPage === number ? "bg-[#8B1D24] text-white hover:bg-[#6B171C]" : "hover:bg-gray-100"
                      }`}
                    >
                      {number}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    className={`${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-gray-100"}`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {/* Discount Modal */}
        <Dialog open={isOfferModalOpen} onOpenChange={setIsOfferModalOpen}>
          <DialogContent className="sm:max-w-md bg-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Percent className="h-5 w-5 text-purple-600" />
                Product Discount
              </DialogTitle>
              <DialogDescription>Set a discount percentage for the selected product (0-100%).</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleOfferSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="offerPercentage" className="text-sm font-medium">
                    Discount Percentage
                  </Label>
                  <Input
                    id="offerPercentage"
                    type="number"
                    value={offerPercentage}
                    onChange={(e) => setOfferPercentage(e.target.value)}
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="Enter percentage (0-100)"
                    className="border-gray-200 focus:border-[#8B1D24] focus:ring-[#8B1D24]"
                  />
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={() => setIsOfferModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#8B1D24] hover:bg-[#6B171C] text-white">
                  Save Discount
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
