


"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Heart, ShoppingCart, ChevronLeft, ChevronRight, Star, Filter, X, Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import api from "../../api"
import { useNavigate } from "react-router-dom"
import banner2 from "/banner2.jpeg"
import banner3 from "/banner3.png"
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

const BASE_URL =import.meta.env.VITE_BASE_URL
const formatPrice = (price) => {
  if (price === null || price === undefined) return "Price unavailable"
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price)
}

const bannerImages = [banner2, banner3]

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

function UserHome() {
  const [allProducts, setAllProducts] = useState([])
  const [displayedProducts, setDisplayedProducts] = useState([])
  const [filterCategories, setFilterCategories] = useState({
    gender: [],
    occasion: [],
    productCategory: [],
  })
  const [filters, setFilters] = useState({
    gender: [],
    occasion: [],
    category_name: [],
  })
  const [sortBy, setSortBy] = useState("")
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [currentBanner, setCurrentBanner] = useState(0)
  const [hoveredProduct, setHoveredProduct] = useState(null)
  const bannerIntervalRef = useRef(null)
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const { addToWishlist } = useWishlist()
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] = useState(12)
  const [goToPageInput, setGoToPageInput] = useState("")

  const handleAddToCart = async (variantId, quantity, event) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }

    const product = displayedProducts.find((p) => p.variants && p.variants.some((v) => v.id === variantId))
    const variant = product?.variants.find((v) => v.id === variantId)

    if (variant && variant.stock === 0) {
      showToast("This item is out of stock", "error")
      return
    }

    if (variant && variant.stock !== undefined && quantity > variant.stock) {
      showToast(`Insufficient stock! Only ${variant.stock} items available.`, "error")
      return
    }

    try {
      await addToCart(variantId, quantity)
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

  const handleAddToWishlist = async (variantId, event) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }

    try {
      await addToWishlist(variantId)
      setWishlist((prev) => {
        const productId = displayedProducts.find((p) => p.variants && p.variants.some((v) => v.id === variantId))?.id
        if (productId) {
          return prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
        }
        return prev
      })
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

  const getEffectivePrice = (product) => {
    if (!product.variants || product.variants.length === 0) {
      return product.price || 0
    }
    const availableVariants = product.variants.filter((v) => v.available)
    if (availableVariants.length === 0) {
      return product.price || 0
    }
    const prices = availableVariants.map((v) => v.total_price).filter(Boolean)
    return prices.length > 0 ? Math.max(...prices) : product.price || 0
  }

  const getPriceDisplay = (product) => {
    if (!product.variants || product.variants.length === 0) {
      return {
        priceDisplay: formatPrice(product.price),
        basePrice: product.price,
        offerPercentage: 0,
        variant: null,
      }
    }
    const availableVariants = product.variants.filter((v) => v.available)
    if (availableVariants.length === 0) {
      return {
        priceDisplay: "Out of stock",
        basePrice: null,
        offerPercentage: 0,
        variant: null,
      }
    }
    const prices = availableVariants.map((v) => v.total_price).filter(Boolean)
    if (prices.length === 0) {
      return {
        priceDisplay: formatPrice(product.price),
        basePrice: product.price,
        offerPercentage: 0,
        variant: null,
      }
    }
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const selectedPrice = minPrice === maxPrice ? minPrice : maxPrice
    const selectedVariant = availableVariants.find((v) => v.total_price === selectedPrice) || availableVariants[0]

    const basePrice = selectedVariant
      ? selectedVariant.gold_price * selectedVariant.gross_weight +
        (selectedVariant.stone_rate || 0) +
        (selectedVariant.making_charge || 0)
      : 0

    const offerPercentage =
      selectedVariant && selectedVariant.applied_offer ? selectedVariant.applied_offer.offer_percentage || 0 : 0

    return {
      priceDisplay: formatPrice(selectedPrice),
      basePrice: basePrice,
      offerPercentage: offerPercentage,
      variant: selectedVariant,
    }
  }

  useEffect(() => {
    fetchProducts()
    bannerIntervalRef.current = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerImages.length)
    }, 5000)
    return () => {
      if (bannerIntervalRef.current) clearInterval(bannerIntervalRef.current)
    }
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await api.get("productapp/productfilter/")
      const products = response.data.filter((product) => product.is_active)
      const categories = {
        gender: [...new Set(products.map((p) => p.gender).filter(Boolean))],
        occasion: [...new Set(products.map((p) => p.occasion).filter(Boolean))],
        productCategory: [...new Set(products.map((p) => p.productCategory || p.category_name).filter(Boolean))],
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

      // Apply search filter (product name and categories)
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        filteredProducts = filteredProducts.filter((product) => {
          const matchesName = product.name.toLowerCase().includes(query)
          const matchesGender = product.gender?.toLowerCase().includes(query)
          const matchesOccasion = product.occasion?.toLowerCase().includes(query)
          const matchesCategory = (product.productCategory || product.category_name)?.toLowerCase().includes(query)
          return matchesName || matchesGender || matchesOccasion || matchesCategory
        })
      }

      // Apply category filters
      if (filters.gender.length > 0) {
        filteredProducts = filteredProducts.filter((p) => filters.gender.includes(p.gender))
      }
      if (filters.occasion.length > 0) {
        filteredProducts = filteredProducts.filter((p) => filters.occasion.includes(p.occasion))
      }
      if (filters.category_name.length > 0) {
        filteredProducts = filteredProducts.filter((p) =>
          filters.category_name.includes(p.productCategory || p.category_name)
        )
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
      setCurrentPage(1) // Reset to first page when filters or search change
      setSearchLoading(false)
    }, 300),
    [allProducts, filters, sortBy, searchQuery]
  )

  useEffect(() => {
    debouncedApplyFiltersAndSort()
  }, [filters, sortBy, allProducts, searchQuery, debouncedApplyFiltersAndSort])

  const handleFilterChange = (category, value) => {
    const apiCategory = category === "productCategory" ? "category_name" : category
    setFilters((prev) => {
      const currentValues = prev[apiCategory]
      const newValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value]
      return { ...prev, [apiCategory]: newValues }
    })
    setCurrentPage(1) // Reset page when filters change
  }

  const clearFilters = () => {
    setFilters({ gender: [], occasion: [], category_name: [] })
    setSortBy("")
    setSearchQuery("")
    setCurrentPage(1)
    setGoToPageInput("")
  }

  const toggleWishlist = (productId) => {
    setWishlist((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const isFilterActive = (category, value) => {
    const apiCategory = category === "productCategory" ? "category_name" : category
    return filters[apiCategory].includes(value)
  }

  const hasActiveFilters = () => {
    return Object.values(filters).some((arr) => arr.length > 0) || searchQuery !== ""
  }

  const changeBanner = (direction) => {
    setCurrentBanner((prev) =>
      direction === "next" ? (prev + 1) % bannerImages.length : (prev - 1 + bannerImages.length) % bannerImages.length
    )
    if (bannerIntervalRef.current) {
      clearInterval(bannerIntervalRef.current)
      bannerIntervalRef.current = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % bannerImages.length)
      }, 5000)
    }
  }

  const getActiveFilterCount = () => {
    return Object.values(filters).reduce((count, filterArray) => count + filterArray.length, 0) + (searchQuery ? 1 : 0)
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

  // Generate page numbers for display with ellipses
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
    <div className="mx-auto px-2 bg-[#fcf9f9]">
      {/* Sliding Banner */}
      <div className="mb-8 w-full overflow-hidden px-0 mx-0 relative rounded-lg shadow-md">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentBanner * 100}%)` }}
        >
          {bannerImages.map((image, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <div className="relative w-full aspect-[1794/584]">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Jewellery Collection Banner ${index + 1}`}
                  className="w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent pointer-events-none" />
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => changeBanner("prev")}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-md transition-all duration-300 hover:scale-110"
          aria-label="Previous banner"
        >
          <ChevronLeft className="h-6 w-6 text-[#7a2828]" />
        </button>
        <button
          onClick={() => changeBanner("next")}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-md transition-all duration-300 hover:scale-110"
          aria-label="Next banner"
        >
          <ChevronRight className="h-6 w-6 text-[#7a2828]" />
        </button>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-3">
          {bannerImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentBanner === index ? "bg-[#7a2828] scale-125" : "bg-white hover:bg-white/80"
              }`}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="text-sm mb-6 flex items-center">
        <span className="text-gray-500 hover:text-[#7a2828] transition-colors cursor-pointer">Home</span>
        <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
        <span className="text-[#7a2828] font-medium">Jewellery</span>
      </div>

      {/* Title, Search, and Sort */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 flex items-center">
            Jewellery Collection
            <span className="text-sm text-gray-500 ml-3 font-normal">
              ({displayedProducts.length} of {allProducts.length} items)
            </span>
          </h1>
          {hasActiveFilters() && (
            <Button
              variant="link"
              className="p-0 text-[#7a2828] hover:text-[#5a1d1d] transition-colors mt-1 font-medium"
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
              placeholder="Search by name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-300 focus:ring-[#7a2828] focus:border-[#7a2828] w-full md:w-[200px]"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>

          <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="md:hidden flex items-center gap-2 border-[#7a2828] text-[#7a2828]"
                onClick={() => setShowMobileFilters(true)}
              >
                <Filter className="h-4 w-4" />
                Filters
                {getActiveFilterCount() > 0 && <Badge className="ml-1 bg-[#7a2828]">{getActiveFilterCount()}</Badge>}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px]">
              <SheetHeader>
                <SheetTitle className="text-xl font-semibold flex justify-between items-center">
                  Filters
                  {hasActiveFilters() && (
                    <Button
                      variant="link"
                      className="text-[#7a2828] hover:text-[#5a1d1d] text-sm font-medium"
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
                                  className="text-[#7a2828] border-gray-300 data-[state=checked]:bg-[#7a2828] data-[state=checked]:border-[#7a2828]"
                                />
                                <Label
                                  htmlFor={`mobile-${category}-${option}`}
                                  className="cursor-pointer text-gray-700 hover:text-[#7a2828] transition-colors"
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
            <SelectTrigger className="w-[180px] border-gray-300 focus:ring-[#7a2828] focus:border-[#7a2828]">
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
                  className="p-0 text-[#7a2828] hover:text-[#5a1d1d] text-sm font-medium"
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
                    <AccordionTrigger className="text-base capitalize py-3 hover:text-[#7a2828] hover:no-underline">
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
                              className="text-[#7a2828] border-gray-300 data-[state=checked]:bg-[#7a2828] data-[state=checked]:border-[#7a2828]"
                            />
                            <Label
                              htmlFor={`${category}-${option}`}
                              className="cursor-pointer text-gray-700 group-hover:text-[#7a2828] transition-colors"
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
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7a2828]"></div>
            </div>
          ) : currentProducts.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64 bg-white rounded-lg shadow-sm p-8">
              <div className="text-[#7a2828] mb-4">
                <X className="h-12 w-12 mx-auto" />
              </div>
              <p className="text-lg text-gray-700 text-center">No products match your filters or search.</p>
              <Button
                variant="outline"
                className="mt-4 border-[#7a2828] text-[#7a2828] hover:bg-[#7a2828] hover:text-white transition-all duration-300"
                onClick={clearFilters}
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentProducts.map((product) => {
                const { priceDisplay, basePrice, offerPercentage, variant } = getPriceDisplay(product)
                const selectedVariantId = variant
                  ? variant.id
                  : product.variants && product.variants.length > 0
                    ? product.variants[0].id
                    : null
                const isHovered = hoveredProduct === product.id

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl group relative"
                    onMouseEnter={() => setHoveredProduct(product.id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                    onClick={() => navigate(`/productdetails/${product.id}`)}
                  >
                    <div className="relative overflow-hidden">
                      <div className="cursor-pointer aspect-square">
                        <img
                          src={
                            product.image && product.image.length > 0
                              ? `${BASE_URL}${product.image[0].image}`
                              : "/placeholder.svg"
                          }
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="text-white font-medium px-4 py-2 rounded-md bg-black/50 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            Quick View
                          </span>
                        </div>
                      </div>
                      {selectedVariantId && (
                        <button
                          onClick={(e) => handleAddToWishlist(selectedVariantId, e)}
                          className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg z-10"
                        >
                          <Heart
                            className={`w-5 h-5 transition-colors duration-300 ${
                              wishlist.includes(product.id)
                                ? "fill-[#7a2828] stroke-[#7a2828]"
                                : "stroke-gray-500 group-hover:stroke-[#7a2828]"
                            }`}
                          />
                        </button>
                      )}
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-white text-[#7a2828] hover:bg-white">
                          {product.productCategory || product.category_name}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            {product.gender} • {product.occasion}
                          </p>
                          <h3 className="font-semibold text-lg group-hover:text-[#7a2828] transition-colors line-clamp-1">
                            {product.name}
                          </h3>
                        </div>
                        
                      </div>

                      <div className="mt-2 flex justify-between items-end">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-lg font-bold text-[#7a2828]">{priceDisplay}</p>
                            {offerPercentage > 0 && (
                              <Badge variant="secondary" className="bg-green-100 text-green-700">
                                {offerPercentage}% OFF
                              </Badge>
                            )}
                          </div>

                          {variant && basePrice > 0 && variant.total_price < basePrice && (
                            <p className="text-sm text-gray-500 line-through">{formatPrice(Math.round(basePrice))}</p>
                          )}

                          <div
                            className={`text-xs text-gray-500 mt-1 transition-all duration-300 ${
                              isHovered ? "opacity-100" : "opacity-0"
                            }`}
                          >
                            {variant && variant.available && (
                              <>
                                Base: {formatPrice(Math.round(variant.gold_price * variant.gross_weight))}
                                {variant.making_charge > 0 && ` + Making: ${formatPrice(variant.making_charge)}`}
                                {variant.stone_rate > 0 && ` + Stone: ${formatPrice(variant.stone_rate)}`}
                              </>
                            )}
                          </div>
                        </div>
                        {selectedVariantId && (
                          <button
                            onClick={(e) => handleAddToCart(selectedVariantId, quantity, e)}
                            className={`p-2 rounded-full bg-[#7a2828] text-white shadow-md transition-all duration-300 ${
                              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                            }`}
                            disabled={!product.available || (variant && variant.stock === 0)}
                          >
                            <ShoppingCart className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                      <Button
                        className="w-full mt-4 bg-[#7a2828] hover:bg-[#5a1d1d] text-white transition-all duration-300 group-hover:shadow-md flex items-center justify-center gap-2 transform group-hover:translate-y-0 translate-y-0"
                        disabled={!product.available || !selectedVariantId || (variant && variant.stock === 0)}
                        onClick={(e) => handleAddToCart(selectedVariantId, quantity, e)}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {product.available && variant && variant.stock > 0 ? "Add to Cart" : "Out of Stock"}
                      </Button>
                    </div>
                    <div className="absolute inset-0 border-2 border-[#7a2828] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
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
                  className="border-gray-300 hover:border-[#7a2828] hover:text-[#7a2828]"
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
                      className={
                        currentPage === page
                          ? "border-gray-300 bg-[#7a2828] text-white hover:bg-[#5a1d1d]"
                          : "border-gray-300 hover:border-[#7a2828] hover:text-[#7a2828]"
                      }
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  )
                )}
                <Button
                  variant="outline"
                  size="icon"
                  className="border-gray-300 hover:border-[#7a2828] hover:text-[#7a2828]"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Page"
                  value={goToPageInput}
                  onChange={(e) => setGoToPageInput(e.target.value)}
                  className="w-20 border-gray-300 focus:ring-[#7a2828] focus:border-[#7a2828]"
                />
                <Button
                  variant="outline"
                  className="border-[#7a2828] text-[#7a2828] hover:bg-[#7a2828] hover:text-white"
                  onClick={handleGoToPage}
                >
                  Go
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserHome
