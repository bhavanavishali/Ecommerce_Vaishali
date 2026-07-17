"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Heart, ShoppingCart, ChevronLeft, ChevronRight, Filter, X, Search, Shield, Gem, Truck } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { useSelector } from "react-redux"
import api from "../../api"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { useCart } from "@/Context/CartContext"
import { useWishlist } from "@/Context/WishlistContext"
import debounce from "lodash/debounce"

const sortOptions = [
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Name: A to Z", value: "name-asc" },
  { label: "Name: Z to A", value: "name-desc" },
  { label: "New Arrivals", value: "new" },
]

const BASE_URL = import.meta.env.VITE_BASE_URL
const formatPrice = (price) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price || 0);

const showToast = (message, type = "success") => {
  const toast = document.createElement("div")
  const isError = type === "error"
  toast.className = `fixed bottom-4 right-4 p-4 rounded shadow-lg transform transition-transform duration-500 ease-in-out z-50 ${
    isError
      ? "bg-red-100 border-l-4 border-red-500 text-red-700"
      : "bg-green-100 border-l-4 border-green-500 text-green-700"
  }`
  toast.innerHTML = message
  document.body.appendChild(toast)

  setTimeout(() => {
    toast.classList.add("translate-y-20", "opacity-0")
    setTimeout(() => document.body.removeChild(toast), 500)
  }, 3000)
}

function CategoryBasedProducts() {
  const navigate = useNavigate()
  const { categoryName } = useParams()
  const [searchParams] = useSearchParams()
  const decodedCategoryName = decodeURIComponent(categoryName || "")
  const productTypeFromUrl = searchParams.get("product_type") || ""
  const user = useSelector((state) => state.auth.user)
  const isAuthenticated = user && (user.username || user.email)

  const [allProducts, setAllProducts] = useState([])
  const [displayedProducts, setDisplayedProducts] = useState([])
  const [filterCategories, setFilterCategories] = useState({
    gender: [],
    occasion: [],
  })
  const [filters, setFilters] = useState({
    gender: [],
    occasion: [],
    category_name: decodedCategoryName ? [decodedCategoryName] : [],
    product_type: productTypeFromUrl,
  })
  const [sortBy, setSortBy] = useState("")
  const [wishlistIds, setWishlistIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [hoveredProduct, setHoveredProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const { wishlist, fetchWishlist, addToWishlist } = useWishlist()
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] = useState(12)
  const [goToPageInput, setGoToPageInput] = useState("")

  const handleAddToCart = async (productId, quantity, event) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      showToast("Please login to add items to cart", "error")
      navigate("/login")
      return
    }

    const product = displayedProducts.find((item) => item.id === productId)
    const variant = getPrimaryVariant(product)
    const stock = Number(product?.stock ?? variant?.stock ?? 0)

    if (!product || stock === 0) {
      showToast("This item is out of stock", "error")
      return
    }

    if (quantity > stock) {
      showToast(`Insufficient stock! Only ${stock} items available.`, "error")
      return
    }

    try {
      await addToCart({ productId }, quantity)
      showToast("Item added to cart successfully!")
    } catch (error) {
      console.error("Add to cart failed:", error)
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to add item to cart. Please try again."
      showToast(errorMessage, "error")
    }
  }

  const handleAddToWishlist = async (productId, event) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      showToast("Please login to add items to wishlist", "error")
      navigate("/login")
      return
    }

    try {
      await addToWishlist({ productId })
      setWishlistIds((prev) => (prev.includes(productId) ? prev : [...prev, productId]))
      showToast("Item added to wishlist successfully!")
    } catch (error) {
      console.error("Add to wishlist failed:", error)
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to add item to wishlist. Please try again."
      showToast(errorMessage, "error")
    }
  }

  const getPrimaryVariant = (product) =>
    product?.variants?.find((variant) => variant.is_default) || product?.variants?.[0] || null

  const getEffectivePrice = (product) => {
    const variant = getPrimaryVariant(product)
    return Number(product?.price ?? variant?.total_price ?? product?.fixed_price ?? 0)
  }

  const getPriceDisplay = (product) => {
    const variant = getPrimaryVariant(product)
    const finalPrice = Number(product?.price ?? variant?.total_price ?? product?.fixed_price ?? 0)
    const basePrice = Number(variant?.base_price ?? product?.fixed_price ?? finalPrice)
    const offerPercentage = Number(variant?.applied_offer?.offer_percentage || 0)
    const stock = Number(product?.stock ?? variant?.stock ?? 0)

    return {
      priceDisplay: stock > 0 ? formatPrice(finalPrice) : "Out of stock",
      basePrice,
      offerPercentage,
      variant,
      stock,
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchWishlist()
  }, [categoryName])

  useEffect(() => {
    const ids =
      wishlist?.items
        ?.map((item) => item?.product?.id || item?.variant?.product?.id)
        .filter(Boolean) || []
    setWishlistIds(ids)
  }, [wishlist])

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category_name: decodedCategoryName ? [decodedCategoryName] : [],
      product_type: productTypeFromUrl,
    }))
  }, [decodedCategoryName, productTypeFromUrl])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await api.get("productapp/productfilter/")
      const products = response.data.filter((product) => product.is_active)
      const categories = {
        gender: [...new Set(products.map((p) => p.gender).filter(Boolean))],
        occasion: [...new Set(products.map((p) => p.occasion).filter(Boolean))],
      }
      setFilterCategories(categories)
      setAllProducts(products)
      setDisplayedProducts(products)
    } catch (error) {
      console.error("Error fetching products:", error)
      showToast("Failed to load products. Please try again.", "error")
    } finally {
      setLoading(false)
    }
  }

  const debouncedApplyFiltersAndSort = useCallback(
    debounce(() => {
      setSearchLoading(true)
      let filteredProducts = [...allProducts]

      // Apply category filter (only if not "all")
      if (decodedCategoryName && decodedCategoryName !== "all") {
        filteredProducts = filteredProducts.filter((p) =>
          (p.productCategory || p.category_name) === decodedCategoryName
        )
      }

      // Apply product_type filter
      if (filters.product_type) {
        filteredProducts = filteredProducts.filter((p) => p.product_type === filters.product_type)
      }

      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        filteredProducts = filteredProducts.filter((product) => {
          const matchesName = product.name.toLowerCase().includes(query)
          const matchesGender = product.gender?.toLowerCase().includes(query)
          const matchesOccasion = product.occasion?.toLowerCase().includes(query)
          return matchesName || matchesGender || matchesOccasion
        })
      }

      // Apply additional filters
      if (filters.gender.length > 0) {
        filteredProducts = filteredProducts.filter((p) => filters.gender.includes(p.gender))
      }
      if (filters.occasion.length > 0) {
        filteredProducts = filteredProducts.filter((p) => filters.occasion.includes(p.occasion))
      }

      // Apply sorting
      if (sortBy) {
        filteredProducts.sort((a, b) => {
          switch (sortBy) {
            case "price-desc":
              return getEffectivePrice(b) - getEffectivePrice(a)
            case "price-asc":
              return getEffectivePrice(a) - getEffectivePrice(b)
            case "name-asc":
              return a.name.localeCompare(b.name)
            case "name-desc":
              return b.name.localeCompare(a.name)
            case "new":
              return new Date(b.created_at || 0) - new Date(a.created_at || 0)
            default:
              return 0
          }
        })
      }

      setDisplayedProducts(filteredProducts)
      setCurrentPage(1)
      setSearchLoading(false)
    }, 300),
    [allProducts, filters, sortBy, searchQuery, decodedCategoryName, productTypeFromUrl]
  )

  useEffect(() => {
    debouncedApplyFiltersAndSort()
  }, [filters, sortBy, allProducts, searchQuery, debouncedApplyFiltersAndSort])

  const handleFilterChange = (category, value) => {
    setFilters((prev) => {
      const currentValues = prev[category]
      const newValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value]
      return { ...prev, [category]: newValues }
    })
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilters({
      gender: [],
      occasion: [],
      category_name: decodedCategoryName ? [decodedCategoryName] : [],
      product_type: productTypeFromUrl,
    })
    setSortBy("")
    setSearchQuery("")
    setCurrentPage(1)
    setGoToPageInput("")
  }

  const isFilterActive = (category, value) => {
    return filters[category].includes(value)
  }

  const hasActiveFilters = () => {
    return (
      filters.gender.length > 0 ||
      filters.occasion.length > 0 ||
      searchQuery !== ""
    )
  }

  const getActiveFilterCount = () => {
    return (
      filters.gender.length +
      filters.occasion.length +
      (searchQuery ? 1 : 0)
    )
  }

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = displayedProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(displayedProducts.length / productsPerPage)

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
      setGoToPageInput(pageNumber.toString())
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      setGoToPageInput((currentPage - 1).toString())
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
      setGoToPageInput((currentPage + 1).toString())
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleGoToPage = (e) => {
    e.preventDefault()
    const pageNumber = parseInt(goToPageInput, 10)
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      showToast("Please enter a valid page number", "error")
      setGoToPageInput(currentPage.toString())
    }
  }

  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1)
    }

    if (startPage > 1) {
      pageNumbers.push(1)
      if (startPage > 2) {
        pageNumbers.push("...")
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push("...")
      }
      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-10 max-w-[1400px] bg-[#fcf9f9]">
      {/* Breadcrumb */}
      <div className="text-sm pt-6 mb-4 flex items-center">
        <span
          className="text-gray-500 hover:text-[#023d12]  transition-colors cursor-pointer"
          onClick={() => navigate("/user/home")}
        >
          Home
        </span>
        <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
        <span className="text-[#023d12]  font-medium">
          {decodedCategoryName === "all" ? "All Products" : decodedCategoryName}
          {productTypeFromUrl && (
            <span className="ml-2 text-gray-500">
              - {productTypeFromUrl === "clothing" ? "Clothing" : "Jewelry"}
            </span>
          )}
        </span>
      </div>

      {/* Title, Search, and Sort */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 flex items-center">
            {decodedCategoryName === "all" ? "All Products" : decodedCategoryName}
            {productTypeFromUrl && (
              <span className="ml-2 text-gray-500 text-lg">
                ({productTypeFromUrl === "clothing" ? "Clothing" : "Jewelry"})
              </span>
            )}
            <span className="text-sm text-gray-500 ml-3 font-normal">
              ({displayedProducts.length} items)
            </span>
          </h1>
          {hasActiveFilters() && (
            <Button
              variant="link"
              className="p-0 text-[#023d12]  hover:text-[#5a1d1d] transition-colors mt-1 font-medium"
              onClick={clearFilters}
            >
              Clear all filters
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-300 focus:ring-[#023d12]  focus:border-[#023d12]  w-full md:w-[200px]"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>

          <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="md:hidden flex items-center gap-2 border-[#023d12]  text-[#023d12] "
                onClick={() => setShowMobileFilters(true)}
              >
                <Filter className="h-4 w-4" />
                Filters
                {getActiveFilterCount() > 0 && <Badge className="ml-1 bg-[#023d12] ">{getActiveFilterCount()}</Badge>}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px]">
              <SheetHeader>
                <SheetTitle className="text-xl font-semibold flex justify-between items-center">
                  Filters
                  {hasActiveFilters() && (
                    <Button
                      variant="link"
                      className="text-[#023d12]  hover:text-[#5a1d1d] text-sm font-medium"
                      onClick={clearFilters}
                    >
                      Clear all
                    </Button>
                  )}
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <Accordion type="multiple" className="w-full">
                  {Object.entries(filterCategories).map(([category, options]) =>
                    options.length > 0 ? (
                      <AccordionItem key={category} value={category}>
                        <AccordionTrigger className="text-lg capitalize">
                          {category.replace(/([A-Z])/g, " $1").trim()}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            {options.map((option) => (
                              <div key={option} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`mobile-${category}-${option}`}
                                  checked={isFilterActive(category, option)}
                                  onCheckedChange={() => handleFilterChange(category, option)}
                                  className="text-[#023d12]  border-gray-300 data-[state=checked]:bg-[#023d12]  data-[state=checked]:border-[#023d12] "
                                />
                                <Label
                                  htmlFor={`mobile-${category}-${option}`}
                                  className="cursor-pointer text-gray-700 hover:text-[#023d12]  transition-colors"
                                >
                                  {option}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ) : null
                  )}
                </Accordion>
              </div>
            </SheetContent>
          </Sheet>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] border-gray-300 focus:ring-[#023d12]  focus:border-[#023d12] ">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar - Desktop */}
        <div className="hidden md:block w-64 shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-5 sticky top-4">
            <h2 className="text-lg font-medium mb-4 text-gray-900 flex items-center justify-between">
              Filters
              {hasActiveFilters() && (
                <Button
                  variant="link"
                  className="p-0 text-[#023d12]  hover:text-[#5a1d1d] text-sm font-medium"
                  onClick={clearFilters}
                >
                  Clear all
                </Button>
              )}
            </h2>
            <Accordion type="multiple" className="w-full">
              {Object.entries(filterCategories).map(([category, options]) =>
                options.length > 0 ? (
                  <AccordionItem key={category} value={category} className="border-b border-gray-200">
                    <AccordionTrigger className="text-base capitalize py-3 hover:text-[#023d12]  hover:no-underline">
                      {category.replace(/([A-Z])/g, " $1").trim()}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 py-1">
                        {options.map((option) => (
                          <div key={option} className="flex items-center space-x-2 group">
                            <Checkbox
                              id={`${category}-${option}`}
                              checked={isFilterActive(category, option)}
                              onCheckedChange={() => handleFilterChange(category, option)}
                              className="text-[#023d12]  border-gray-300 data-[state=checked]:bg-[#023d12]  data-[state=checked]:border-[#023d12] "
                            />
                            <Label
                              htmlFor={`${category}-${option}`}
                              className="cursor-pointer text-gray-700 group-hover:text-[#023d12]  transition-colors"
                            >
                              {option}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ) : null
              )}
            </Accordion>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {loading || searchLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#023d12] "></div>
            </div>
          ) : currentProducts.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64 bg-white rounded-lg shadow-sm p-8">
              <div className="text-[#023d12]  mb-4">
                <X className="h-12 w-12 mx-auto" />
              </div>
              <p className="text-lg text-gray-700 text-center">No products found in this category.</p>
              <Button
                variant="outline"
                className="mt-4 border-[#023d12]  text-[#023d12]  hover:bg-[#023d12]  hover:text-white transition-all duration-300"
                onClick={() => navigate("/user/home")}
              >
                Browse All Products
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {currentProducts.map((product) => {
                const { priceDisplay, basePrice, offerPercentage, variant, stock } = getPriceDisplay(product)
                const isHovered = hoveredProduct === product.id

                return (
                  <div
                    key={product.id}
                    className="w-full bg-white rounded-3xl shadow-lg border border-[#E8DFC6] overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl group relative"
                    onMouseEnter={() => setHoveredProduct(product.id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                    onClick={() => navigate(`/productdetails/${product.id}`)}
                  >
                    <div className="relative overflow-hidden aspect-[3/4] bg-[#FCF8F1]">
                      <img
                        src={
                          product.image && product.image.length > 0
                            ? `${BASE_URL}${product.image[0].image}`
                            : "/placeholder.svg"
                        }
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      
                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => handleAddToWishlist(product.id, e)}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-[#E8DFC6] flex items-center justify-center transition-all duration-300 hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-white z-10"
                      >
                        <Heart
                          className={`w-5 h-5 transition-colors ${
                            wishlistIds.includes(product.id)
                              ? "fill-[#D4AF37] text-[#D4AF37]"
                              : "text-gray-600"
                          }`}
                        />
                      </button>

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-[#0B3D2E] text-[#D4AF37] hover:bg-[#0B3D2E]">
                          {product.productCategory || product.category_name}
                        </Badge>
                      </div>

                      {/* Quick View Overlay */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/productdetails/${product.id}`)
                          }}
                          className="px-6 py-3 bg-white/90 backdrop-blur-sm border border-[#E8DFC6] rounded-full flex items-center gap-2 text-[#0B3D2E] font-medium hover:bg-[#0B3D2E] hover:text-white hover:border-[#0B3D2E] transition-all duration-300"
                        >
                          Quick View
                        </button>
                      </div>
                    </div>

                    <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                      <h3 className="font-serif text-sm sm:text-base font-semibold text-[#1E2C24] line-clamp-1">
                        {product.name}
                      </h3>

                      <p className="text-[10px] sm:text-xs text-[#4B4B4B]">
                        {product.gender} • {product.occasion}
                      </p>

                      <div className="flex items-baseline gap-1 sm:gap-2 flex-wrap">
                        <span className="text-base sm:text-lg font-bold text-[#0B3D2E]">{priceDisplay}</span>
                        {variant && basePrice > 0 && Number(variant.total_price) < basePrice && (
                          <span className="text-xs sm:text-sm text-gray-400 line-through">{formatPrice(Math.round(basePrice))}</span>
                        )}
                        {offerPercentage > 0 && (
                          <span className="px-2 py-0.5 bg-[#14532D] text-white text-[10px] font-semibold rounded-full whitespace-nowrap">
                            {offerPercentage}% OFF
                          </span>
                        )}
                      </div>

                      {/* Feature Icons */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#E8DFC6]">
                        {/* <div className="flex items-center gap-0.5 text-[#4B4B4B]">
                          <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#0B3D2E]" />
                          <span className="text-[8px] sm:text-[10px]">Pure Handloom</span>
                        </div> */}
                        {/* <div className="flex items-center gap-0.5 text-[#4B4B4B]">
                          <Gem className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#0B3D2E]" />
                          <span className="text-[8px] sm:text-[10px]">Premium</span>
                        </div> */}
                        {/* <div className="flex items-center gap-0.5 text-[#4B4B4B]">
                          <Truck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#0B3D2E]" />
                          <span className="text-[8px] sm:text-[10px]">Fast Delivery</span>
                        </div> */}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={(e) => handleAddToWishlist(product.id, e)}
                          className="flex-1 py-1.5 sm:py-2 border-2 border-[#E8DFC6] rounded-xl flex items-center justify-center gap-1 text-[#0B3D2E] font-medium text-[10px] sm:text-xs hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-white transition-all duration-300"
                        >
                          <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${wishlistIds.includes(product.id) ? "fill-current" : ""}`} />
                        </button>
                        <button
                          onClick={(e) => handleAddToCart(product.id, quantity, e)}
                          className="flex-1 py-1.5 sm:py-2 bg-gradient-to-r from-[#0B3D2E] to-[#14532D] rounded-xl flex items-center justify-center gap-1 text-white font-medium text-[10px] sm:text-xs hover:from-[#14532D] hover:to-[#0B3D2E] transition-all duration-300"
                          disabled={!product.available || stock === 0}
                        >
                          <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Pagination */}
          {displayedProducts.length > 0 && (
            <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="border-gray-300 hover:border-[#023d12]  hover:text-[#023d12] "
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {getPageNumbers().map((page, index) =>
                  page === "..." ? (
                    <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                      ...
                    </span>
                  ) : (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      className={`${
                        currentPage === page
                          ? "bg-[#023d12]  hover:bg-[#5a1d1d] text-white border-[#023d12] "
                          : "border-gray-300 hover:border-[#023d12]  hover:text-[#023d12] "
                      }`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  )
                )}
                <Button
                  variant="outline"
                  size="icon"
                  className="border-gray-300 hover:border-[#023d12]  hover:text-[#023d12] "
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <form onSubmit={handleGoToPage} className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Go to page:</span>
                <Input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={goToPageInput}
                  onChange={(e) => setGoToPageInput(e.target.value)}
                  className="w-16 h-8 text-center border-gray-300 focus:ring-[#023d12]  focus:border-[#023d12] "
                />
                <Button type="submit" size="sm" className="bg-[#023d12]  hover:bg-[#5a1d1d]">
                  Go
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CategoryBasedProducts
