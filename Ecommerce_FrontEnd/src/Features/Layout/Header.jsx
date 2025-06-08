

"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { clearAuthData } from "../../Redux/authslice"
import { useCart } from "@/Context/CartContext"


import {
  Bell,
  Heart,
  ShoppingCart,
  User,
  LogOut,
  LogIn,
  Home,
  Search,
  Menu,
  X,
  ChevronDown,
  Settings,
  ShoppingBag,
  HelpCircle,
} from "lucide-react"


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

import api from "../../api"

const Header = () => {
  const { cart } = useCart()
  const isuser = localStorage.getItem("user");
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Your order has shipped!", time: "Just now", read: false },
    { id: 2, title: "New collection available", time: "2 hours ago", read: true },
    { id: 3, title: "Special offer: 20% off", time: "Yesterday", read: true },
  ])

  const totalItems = user && cart?.items?.length ? cart.items.length : 0
  const unreadNotifications = notifications.filter((n) => !n.read).length


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = async () => {
    try {
      await api.post("logout/")
      dispatch(clearAuthData())
      navigate("/login/")
    } catch (error) {
      console.log("Failed the logout")
      navigate("/")
    }
  }

  const capitalizeFirstLetter = (string) => {
    if (!string) return ""
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const handleLogin = () => {
    navigate("/login/")
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const getInitials = (name) => {
    if (!name) return "U"
    const parts = name.split(/[@\s]/)
    return parts[0].charAt(0).toUpperCase()
  }

  return (
    <header
      className={`w-full sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-gradient-to-r from-[#f8ece9] to-[#f9f1ef]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 group">
            <a
              href="/"
              className="flex items-center transition-transform duration-300 hover:scale-105"
              aria-label="Go to homepage"
            >
              <img src="/logo 1.png" alt="Vaishali Gold Logo" className="h-16 w-auto object-contain" />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
           

            {/* Welcome Message */}
            {user && (
              <div className="hidden lg:flex items-center px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-amber-100 shadow-sm">
                <span className="text-[#7a2828] font-medium">
                  Welcome, {capitalizeFirstLetter(user.username || user.email)}
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {user ? (
                <>
                  {/* Home Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm text-[#7a2828] hover:bg-[#7a2828] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                    onClick={() => navigate("/user/home")}
                    aria-label="Home"
                  >
                    <Home className="h-5 w-5" />
                  </Button>

                    {/* Shopping Cart Button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm text-[#7a2828] hover:bg-[#7a2828] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md relative"
                onClick={() => navigate("/cart")}
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {user && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7a2828] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-[#7a2828] text-white text-xs font-bold items-center justify-center">
                      {totalItems}
                    </span>
                  </span>
                )}
              </Button>

              {/* Wishlist Button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm text-[#7a2828] hover:bg-[#7a2828] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                onClick={() => navigate("/wishlist")}
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
              </Button>

                  {/* User Profile Dropdown */}
                  

                  <DropdownMenu >
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm text-[#7a2828] hover:bg-[#7a2828] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md relative group"
                        aria-label="User Profile"
                      >
                        <Avatar className="h-7 w-7 border border-amber-200 group-hover:border-white transition-all duration-300">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-amber-100 text-[#7a2828] text-sm font-medium">
                            {getInitials(user.username || user.email)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white w-56 p-2 rounded-xl border-amber-200">
                      <DropdownMenuLabel className="flex items-center gap-2 text-[#7a2828]">
                        <User className="h-4 w-4" />
                        My Account
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-amber-100" />
                      <DropdownMenuItem
                        className="rounded-lg cursor-pointer hover:bg-amber-50 focus:bg-amber-50 transition-all duration-200"
                        onClick={() => navigate("/userprofile")}
                      >
                        <User className="h-4 w-4 mr-2 text-[#7a2828]" />
                        Profile
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator className="bg-amber-100" />
                      <DropdownMenuItem
                        className="rounded-lg cursor-pointer hover:bg-red-50 focus:bg-red-50 transition-all duration-200"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-2 text-red-600" />
                        <span className="text-red-600">Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm text-[#7a2828] hover:bg-[#7a2828] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                  onClick={handleLogin}
                  aria-label="Login"
                >
                  <LogIn className="h-5 w-5" />
                </Button>
              )}

           

            
                {/* Login button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm text-[#7a2828] hover:bg-[#7a2828] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                onClick={() => navigate("/login")}
                aria-label="Wishlist"
              >
                <LogIn className="h-5 w-5" />
                
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm text-[#7a2828] hover:bg-[#7a2828] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md relative"
              onClick={() => navigate("/cart")}
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {user && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7a2828] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-[#7a2828] text-white text-xs font-bold items-center justify-center">
                    {totalItems}
                  </span>
                </span>
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm text-[#7a2828] hover:bg-[#7a2828] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-white w-[300px] sm:w-[350px] p-0">
                <div className="h-full flex flex-col">
                  <div className="p-6 bg-gradient-to-r from-[#7a2828] to-[#9a3a3a] text-white">
                    <div className="flex items-center gap-4 mb-6">
                      <Avatar className="h-12 w-12 border-2 border-white/50">
                        <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-amber-100 text-[#7a2828] text-lg font-medium">
                          {user ? getInitials(user.username || user.email) : "G"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        {user ? (
                          <>
                            <h3 className="font-bold text-lg">{capitalizeFirstLetter(user.username || user.email)}</h3>
                            <p className="text-amber-100 text-sm">Member</p>
                          </>
                        ) : (
                          <Button
                            className="bg-white text-[#7a2828] hover:bg-amber-100 hover:text-[#7a2828]"
                            onClick={handleLogin}
                          >
                            Sign In
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        <span>{unreadNotifications} new</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        <span>{totalItems} items</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-auto py-4">
                    <div className="px-6 py-2">
                      <Input
                        type="text"
                        placeholder="Search products..."
                        className="rounded-full border-amber-200 focus:border-[#7a2828] focus:ring-[#7a2828]/20"
                      />
                    </div>

                    <nav className="mt-4">
                      <div className="px-3">
                        <Button
                          variant="ghost"
                          className="w-full justify-start rounded-lg mb-1 hover:bg-amber-50 hover:text-[#7a2828]"
                          onClick={() => navigate("/")}
                        >
                          <Home className="h-5 w-5 mr-3" />
                          Home
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start rounded-lg mb-1 hover:bg-amber-50 hover:text-[#7a2828]"
                          onClick={() => navigate("/user/home")}
                        >
                          <LayoutDashboard className="h-5 w-5 mr-3" />
                          Dashboard
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start rounded-lg mb-1 hover:bg-amber-50 hover:text-[#7a2828]"
                          onClick={() => navigate("/userprofile")}
                        >
                          <User className="h-5 w-5 mr-3" />
                          Profile
                        </Button>
                        
                        <Button
                          variant="ghost"
                          className="w-full justify-start rounded-lg mb-1 hover:bg-amber-50 hover:text-[#7a2828]"
                          onClick={() => navigate("/wishlist")}
                        >
                          <Heart className="h-5 w-5 mr-3" />
                          Wishlist
                        </Button>
                        
                        <Button
                          variant="ghost"
                          className="w-full justify-start rounded-lg mb-1 hover:bg-amber-50 hover:text-[#7a2828]"
                          onClick={() => navigate("/cart")}
                        >
                          <ShoppingCart className="h-5 w-5 mr-3" />
                          Cart
                          {totalItems > 0 && <Badge className="ml-auto bg-[#7a2828]">{totalItems}</Badge>}
                        </Button>
                        
                      </div>
                    </nav>
                  </div>

                  {user && (
                    <div className="p-6 border-t border-amber-100">
                      <Button
                        variant="outline"
                        className="w-full justify-start rounded-lg border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-5 w-5 mr-3" />
                        Logout
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Optional: Second navigation row for categories/menu items */}
      <div
        className={`border-t border-amber-100 bg-white transition-all duration-300 ${
          isScrolled ? "opacity-100" : "opacity-95"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-center h-12 text-sm">
            <ul className="flex space-x-8">
              <li>
                <a
                  href="/"
                  className="text-gray-700 hover:text-[#7a2828] font-medium transition-all duration-300 hover:underline decoration-[#7a2828] decoration-2 underline-offset-8"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/user/home"
                  className="text-gray-700 hover:text-[#7a2828] font-medium transition-all duration-300 hover:underline decoration-[#7a2828] decoration-2 underline-offset-8"
                >
                  Shop
                </a>
              </li>
              
        
            
        
              <li>
                <a
                  href="/about"
                  className="text-gray-700 hover:text-[#7a2828] font-medium transition-all duration-300 hover:underline decoration-[#7a2828] decoration-2 underline-offset-8"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-gray-700 hover:text-[#7a2828] font-medium transition-all duration-300 hover:underline decoration-[#7a2828] decoration-2 underline-offset-8"
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}

// Import the missing LayoutDashboard icon at the top of the file
// with the other Lucide icons
const LayoutDashboard = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  )
}

export default Header

