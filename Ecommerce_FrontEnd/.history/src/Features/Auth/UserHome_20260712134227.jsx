


"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Heart, ShoppingCart, ChevronLeft, ChevronRight, Filter, X, Search } from "lucide-react"
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
import { useNavigate, useSearchParams } from "react-router-dom"

import { useCart } from "@/Context/CartContext"
import { useWishlist } from "@/Context/WishlistContext"
import debounce from "lodash/debounce"
import HomeBanner from "../Home/HomeBanner"
import CollectionsSection from "../Home/CollectionsSection"
import LatestArrivals from "../Home/LatestArrivals"

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
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const productTypeFromUrl = searchParams.get("product_type") || ""
  const user = useSelector((state) => state.auth.user)
  const isAuthenticated = user && (user.username || user.email)

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
    product_type: productTypeFromUrl,
  })
  const [sortBy, setSortBy] = useState("")
  const [wishlistIds, setWishlistIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [hoveredProduct, setHoveredProduct] = useState(null)
  const [categoryCards, setCategoryCards] = useState([])
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
    if (isAuthenticated) {
      fetchWishlist()
    }
  }, [])

  const latestArrivals = useMemo(
    () =>
      [...allProducts]
        .filter((product) => product.is_active)
        .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
        .slice(0, 16),
    [allProducts]
  )

  useEffect(() => {
    const buildCategoryCards = async () => {
      let categoryNames = []
      try {
        const response = await api.get("productapp/user/categories/")
        categoryNames = response.data.filter((c) => c.is_active).map((c) => c.name)
      } catch {
        categoryNames = [
          ...new Set(
            allProducts.map((p) => p.productCategory || p.category_name).filter(Boolean)
          ),
        ]
      }

      const cards = categoryNames.map((name) => {
        const product = allProducts.find(
          (p) => (p.productCategory || p.category_name) === name
        )
        return {
          name,
          image:
            product?.image?.length > 0
              ? `${BASE_URL}${product.image[0].image}`
              : "/placeholder.svg",
        }
      })
      setCategoryCards(cards)
    }

    if (allProducts.length > 0) {
      buildCategoryCards()
    }
  }, [allProducts])

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
      product_type: productTypeFromUrl || "",
    }))
  }, [productTypeFromUrl])

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
      if (filters.product_type) {
        filteredProducts = filteredProducts.filter(
          (p) => p.product_type === filters.product_type
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
    setFilters({ gender: [], occasion: [], category_name: [], product_type: "" })
    setSortBy("")
    setSearchQuery("")
    setCurrentPage(1)
    setGoToPageInput("")
    navigate("/user/home")
  }

  const isFilterActive = (category, value) => {
    const apiCategory = category === "productCategory" ? "category_name" : category
    return filters[apiCategory].includes(value)
  }

  const hasActiveFilters = () => {
    return (
      filters.gender.length > 0 ||
      filters.occasion.length > 0 ||
      filters.category_name.length > 0 ||
      filters.product_type !== "" ||
      searchQuery !== ""
    )
  }

  const getActiveFilterCount = () => {
    return (
      filters.gender.length +
      filters.occasion.length +
      filters.category_name.length +
      (filters.product_type ? 1 : 0) +
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
    <>
      <HomeBanner />

      <CollectionsSection
        categories={categoryCards}
        onCategoryClick={(name) => navigate(`/category/${encodeURIComponent(name)}`)}
      />

      <LatestArrivals
        products={latestArrivals}
        onProductClick={(id) => navigate(`/productdetails/${id}`)}
        onViewAll={() => {
          setSortBy("new")
          document.getElementById("product-collection")?.scrollIntoView({ behavior: "smooth" })
        }}
      />

    {/* <div id="product-collection" className="mx-auto px-2 bg-[#fcf9f9]">
      <div className="text-sm mb-6 flex items-center">
        <span className="text-gray-500 hover:text-[#7a2828] transition-colors cursor-pointer">Home</span>
        <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <span className="text-[#7a2828] font-medium">Products</span>
      </div>

      {/* Title, Search, and Sort */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 flex items-center">
            Product Collection
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
                const { priceDisplay, basePrice, offerPercentage, variant, stock } = getPriceDisplay(product)
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
                        <button
                          onClick={(e) => handleAddToWishlist(product.id, e)}
                          className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg z-10"
                        >
                          <Heart
                            className={`w-5 h-5 transition-colors duration-300 ${
                              wishlistIds.includes(product.id)
                                ? "fill-[#7a2828] stroke-[#7a2828]"
                                : "stroke-gray-500 group-hover:stroke-[#7a2828]"
                            }`}
                          />
                        </button>
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

                          {variant && basePrice > 0 && Number(variant.total_price) < basePrice && (
                            <p className="text-sm text-gray-500 line-through">{formatPrice(Math.round(basePrice))}</p>
                          )}
                          <div className={`text-xs text-gray-500 mt-1 transition-all duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}>
                            {product.product_type === "clothing" ? "Fixed-price clothing" : "Fixed-price imitation jewelry"}
                          </div>
                        </div>
                        <button
                            onClick={(e) => handleAddToCart(product.id, quantity, e)}
                            className={`p-2 rounded-full bg-[#7a2828] text-white shadow-md transition-all duration-300 ${
                              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                            }`}
                            disabled={!product.available || stock === 0}
                          >
                            <ShoppingCart className="w-5 h-5" />
                          </button>
                      </div>
                      <Button
                        className="w-full mt-4 bg-[#7a2828] hover:bg-[#5a1d1d] text-white transition-all duration-300 group-hover:shadow-md flex items-center justify-center gap-2 transform group-hover:translate-y-0 translate-y-0"
                        disabled={!product.available || stock === 0}
                        onClick={(e) => handleAddToCart(product.id, quantity, e)}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {product.available && stock > 0 ? "Add to Cart" : "Out of Stock"}
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
    </div> */}
    </>
  )
}

export default UserHome
