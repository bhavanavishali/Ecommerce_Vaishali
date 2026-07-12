


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
import TrendingNow from "../Home/TrendingNow"
import Featured from "../Home/Featured"

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

      <TrendingNow
        onProductClick={(id) => navigate(`/productdetails/${id}`)}
      />

      <Featured
        onItemClick={(id) => navigate(`/productdetails/${id}`)}
      />

    </>
  )
}

export default UserHome
