"use client";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearAuthData } from "../../Redux/authslice";
import { useCart } from "@/Context/CartContext";
import LoginModal from "../Auth/LoginModal";

import {
  Heart,
  ShoppingBag,
  User,
  LogOut,
  LogIn,
  Home,
  Menu,
  Gem,
  Store,
  Shirt,
  Sparkles,
  Gift,
  Circle,
  Coins,
  Layers,
  Grid3X3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import api from "../../api";

const getCategoryIcon = (name) => {
  const n = (name || "").toLowerCase();
  if (n.includes("all") || n.includes("shop")) return Grid3X3;
  if (n.includes("gold")) return Coins;
  if (n.includes("diamond")) return Gem;
  if (n.includes("earring")) return Sparkles;
  if (n.includes("ring")) return Circle;
  if (n.includes("cloth") || n.includes("wear") || n.includes("saree") || n.includes("kurta")) return Shirt;
  if (n.includes("gift")) return Gift;
  if (n.includes("wedding") || n.includes("bridal")) return Layers;
  return Sparkles;
};

const Header = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = user && (user.username || user.email);

  const searchParams = new URLSearchParams(location.search);
  const activeType = searchParams.get("product_type");

  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const categoryScrollRef = useRef(null);

  const totalItems = isAuthenticated && cart?.items?.length ? cart.items.length : 0;

  const typeButtonClass = (type) =>
    activeType === type
      ? "bg-[#D4AF37]/20 text-[#023d12] font-semibold"
      : "bg-transparent text-[#023d12] font-medium hover:bg-[#D4AF37]/10";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 4);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("productapp/user/categories/");
        const names = response.data
          .filter((c) => c.is_active)
          .map((c) => c.name)
          .filter(Boolean);
        setCategories(names);
      } catch {
        try {
          const response = await api.get("productapp/productfilter/");
          const unique = [
            ...new Set(
              response.data.map((p) => p.productCategory || p.category_name).filter(Boolean)
            ),
          ];
          setCategories(unique);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      }
    };
    fetchCategories();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("logout/");
      dispatch(clearAuthData());
      navigate("/login/");
    } catch {
      navigate("/");
    }
  };

  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const getInitials = (name) => {
    if (!name) return "";
    return name.split(/[@\s]/)[0].charAt(0).toUpperCase();
  };

  const iconBtnClass =
    "p-1 text-[#023d12]  hover:opacity-70 transition-opacity relative";

  const renderTypeButtons = (className = "") => (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className="flex items-center px-2 py-2 rounded-full shadow-lg"
        style={{ 
          backgroundColor: '#FFFDF8',
          border: '2px solid #D4AF37',
          boxShadow: '0 4px 12px rgba(212, 175, 55, 0.15)'
        }}
      >
        {/* Clothing Button */}
        <button
          type="button"
          onClick={() => navigate("/category/all?product_type=clothing")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full transition-all duration-300 ${typeButtonClass("clothing")}`}
        >
          <Shirt className="h-4 w-4" strokeWidth={1.5} style={{ color: '#D4AF37' }} />
          <span className="text-xs tracking-widest uppercase">Clothing</span>
        </button>

        {/* Center Divider with Decorative Element */}
        <div className="flex items-center justify-center px-3">
          {/* <div className="h-8 w-px" style={{ backgroundColor: '#D4AF37' }}></div> */}
          <div className="mx-2 text-[#D4AF37]">
            <Sparkles className="h-4 w-4" strokeWidth={1.5} />
          </div>
          {/* <div className="h-8 w-px" style={{ backgroundColor: '#D4AF37' }}></div> */}
        </div>

        {/* Jewelry Button */}
        <button
          type="button"
          onClick={() => navigate("/category/all?product_type=imitation_jewelry")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full transition-all duration-300 ${typeButtonClass("imitation_jewelry")}`}
        >
          <Gem className="h-4 w-4" strokeWidth={1.5} style={{ color: '#D4AF37' }} />
          <span className="text-xs tracking-widest uppercase">Jewellery</span>
        </button>
      </div>
    </div>
  );

  const checkScroll = () => {
    if (categoryScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollCategories = (direction) => {
    if (categoryScrollRef.current) {
      const scrollAmount = 200;
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [categories]);

  return (
    <>
      <header
      className={`w-full sticky top-0 z-50 bg-[#FAF3E0] border-b border-[#D4AF37]/30 transition-shadow duration-300 ${
    isScrolled ? "shadow-lg" : "shadow-sm"
  }`}
      >
        {/* Tier 1 — Logo | Clothing/Jewellery | Icons */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-[72px] gap-4">
            {/* Logo */}
            <a
              href="/"
              className="flex-shrink-0 flex items-center"
              aria-label="Go to homepage"
            >
              <img
                src="/logo 1.png"
                alt="KeralaLooms Logo"
                className="h-16 lg:h-20 w-auto object-contain"
              />
            </a>

            {/* Center — Navigation Buttons */}
            <div className="hidden md:flex flex-1 justify-center px-6">
              {renderTypeButtons()}
            </div>

            {/* Right icons — Tanishq-style minimal line icons */}
            <div className="flex items-center gap-4 lg:gap-5 flex-shrink-0">
              {/* <button
                type="button"
                className={`${iconBtnClass} hidden sm:block`}
                onClick={() => navigate("/user/home?product_type=imitation_jewelry")}
                aria-label="Jewellery collection"
              >
                <Gem className="h-[22px] w-[22px]" strokeWidth={1.5} />
              </button> */}

              <button
                type="button"
                className={`${iconBtnClass} hidden sm:block`}
                onClick={() => navigate("/user/home")}
                aria-label="Shop"
              >
                <Store className="h-[22px] w-[22px]" strokeWidth={1.5} />
              </button>

              <button
                type="button"
                className={iconBtnClass}
                onClick={() => (isAuthenticated ? navigate("/wishlist") : setIsLoginModalOpen(true))}
                aria-label="Wishlist"
              >
                <Heart className="h-[22px] w-[22px]" strokeWidth={1.5} />
              </button>

              {/* Account */}
              <div className="hidden md:block">
                {isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium" style={{ color: '#0B3D2E' }}>
                      Welcome, {capitalizeFirstLetter(user.username || user.email)}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button type="button" className={iconBtnClass} aria-label="My account">
                          <User className="h-[22px] w-[22px]" strokeWidth={1.5} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuLabel className="text-[#023d12]">
                          {capitalizeFirstLetter(user.username || user.email)}
                        </DropdownMenuLabel>
                        {/* <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate("/userprofile")}>
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate("/myorders")}>
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          My Orders
                        </DropdownMenuItem>
                        <DropdownMenuSeparator /> */}
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <button
                    type="button"
                    className={iconBtnClass}
                    onClick={() => setIsLoginModalOpen(true)}
                    aria-label="Login"
                  >
                    <User className="h-[22px] w-[22px]" strokeWidth={1.5} />
                  </button>
                )}
              </div>

              {/* Cart */}
              <button
                type="button"
                className={iconBtnClass}
                onClick={() => (isAuthenticated ? navigate("/cart") : setIsLoginModalOpen(true))}
                aria-label="Shopping cart"
              >
                <ShoppingBag className="h-[22px] w-[22px]" strokeWidth={1.5} />
                <span className="absolute -top-1.5 -right-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                  {totalItems}
                </span>
              </button>

              {/* Mobile menu */}
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <button type="button" className={iconBtnClass} aria-label="Open menu">
                      <Menu className="h-[22px] w-[22px]" strokeWidth={1.5} />
                    </button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] p-0 bg-white">
                    <div className="flex flex-col h-full">
                      <div className="p-6 bg-[#023d12] text-white">
                        {isAuthenticated ? (
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-white/40">
                              <AvatarImage src={user.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="bg-white text-[#023d12]">
                                {getInitials(user.username || user.email)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold">
                                {capitalizeFirstLetter(user.username || user.email)}
                              </p>
                              <p className="text-xs text-white/80">Welcome back</p>
                            </div>
                          </div>
                        ) : (
                          <Button
                            className="w-full bg-white text-[#023d12] hover:bg-gray-100"
                            onClick={() => setIsLoginModalOpen(true)}
                          >
                            <LogIn className="h-4 w-4 mr-2" />
                            Sign In
                          </Button>
                        )}
                      </div>

                      <div className="p-4 border-b">{renderTypeButtons("gap-8")}</div>

                      <nav className="flex-1 overflow-auto p-3">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-[#023d12]"
                          onClick={() => navigate("/")}
                        >
                          <Home className="h-4 w-4 mr-3" />
                          Home
                        </Button>
                        {/* <Button
                          variant="ghost"
                          className="w-full justify-start text-[#023d12]"
                          onClick={() => navigate("/user/home")}
                        >
                          <Store className="h-4 w-4 mr-3" />
                          Shop All
                        </Button> */}
                        {isAuthenticated && (
                          <>
                            {/* <Button
                              variant="ghost"
                              className="w-full justify-start text-[#023d12]"
                              onClick={() => navigate("/userprofile")}
                            >
                              <User className="h-4 w-4 mr-3" />
                              Profile
                            </Button> */}
                            {/* <Button
                              variant="ghost"
                              className="w-full justify-start text-[#023d12]"
                              onClick={() => navigate("/myorders")}
                            >
                              <ShoppingBag className="h-4 w-4 mr-3" />
                              My Orders
                            </Button> */}
                          </>
                        )}
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-[#023d12]"
                          onClick={() =>
                            isAuthenticated ? navigate("/wishlist") : setIsLoginModalOpen(true)
                          }
                        >
                          <Heart className="h-4 w-4 mr-3" />
                          Wishlist
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-[#023d12]"
                          onClick={() =>
                            isAuthenticated ? navigate("/cart") : setIsLoginModalOpen(true)
                          }
                        >
                          <ShoppingBag className="h-4 w-4 mr-3" />
                          Cart
                          {totalItems > 0 && (
                            <Badge className="ml-auto bg-[#023d12]">{totalItems}</Badge>
                          )}
                        </Button>

                        {categories.length > 0 && (
                          <div className="mt-4 pt-4 border-t">
                            <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Categories
                            </p>
                            {categories.map((category) => {
                              const Icon = getCategoryIcon(category);
                              return (
                                <Button
                                  key={category}
                                  variant="ghost"
                                  className="w-full justify-start text-[#023d12] "
                                  onClick={() =>
                                    navigate(`/category/${encodeURIComponent(category)}`)
                                  }
                                >
                                  <Icon className="h-4 w-4 mr-3" strokeWidth={1.5} />
                                  {category}
                                </Button>
                              );
                            })}
                          </div>
                        )}
                      </nav>

                      {isAuthenticated && (
                        <div className="p-4 border-t">
                          <Button
                            variant="outline"
                            className="w-full border-red-200 text-red-600 hover:bg-red-50"
                            onClick={handleLogout}
                          >
                            <LogOut className="h-4 w-4 mr-2" />
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
        </div>

        {/* Mobile — Clothing / Jewellery below logo row */}
        <div className="md:hidden flex justify-center pb-3 -mt-1">
          {renderTypeButtons()}
        </div>

        {/* Tier 2 — Category navigation */}
        <div className="border-t border-gray-200 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <nav className="hidden md:flex items-center w-full py-3 overflow-x-auto scrollbar-hide gap-2">
              <button
                type="button"
                onClick={() => navigate("/category/all")}
                className="flex-shrink-0 flex items-center justify-center gap-2 px-4 transition-opacity hover:opacity-70"
              >
                <Grid3X3 className="h-5 w-5 text-[#023d12] flex-shrink-0" strokeWidth={1.5} />
                <span className="text-sm font-medium text-[#023d12] whitespace-nowrap">
                  All Products
                </span>
              </button>

              {categories.map((category) => {
                const Icon = getCategoryIcon(category);
                const categoryPath = `/category/${encodeURIComponent(category)}`;
                const isActive = location.pathname === categoryPath;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => navigate(categoryPath)}
                    className={`flex-shrink-0 flex items-center justify-center gap-2 px-4 transition-opacity hover:opacity-70 ${
                      isActive ? "opacity-100" : "opacity-90"
                    }`}
                  >
                    <Icon className="h-5 w-5 text-[#023d12] flex-shrink-0" strokeWidth={1.5} />
                    <span className="text-sm font-medium text-[#023d12] whitespace-nowrap capitalize">
                      {category}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Mobile category scroll */}
            <div className="md:hidden relative">
              <div className="flex items-center gap-6 py-3 overflow-x-auto scrollbar-hide" ref={categoryScrollRef} onScroll={checkScroll}>
                <button
                  type="button"
                  onClick={() => navigate("/category/all")}
                  className="flex items-center gap-2 flex-shrink-0"
                >
                  <Grid3X3 className="h-4 w-4 text-[#023d12]" strokeWidth={1.5} />
                  <span className="text-xs font-medium text-[#023d12] whitespace-nowrap">
                    All Products
                  </span>
                </button>
                {categories.map((category) => {
                  const Icon = getCategoryIcon(category);
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => navigate(`/category/${encodeURIComponent(category)}`)}
                      className="flex items-center gap-1.5 flex-shrink-0"
                    >
                      <Icon className="h-4 w-4 text-[#023d12]" strokeWidth={1.5} />
                      <span className="text-xs font-medium text-[#056022] whitespace-nowrap capitalize">
                        {category}
                      </span>
                    </button>
                  );
                })}
              </div>
              {/* Scroll indicators */}
              {canScrollLeft && (
                <button
                  type="button"
                  onClick={() => scrollCategories('left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center z-10"
                  style={{ border: '1px solid #ECE6DA' }}
                >
                  <ChevronLeft className="h-4 w-4 text-[#2E2E2E]" />
                </button>
              )}
              {canScrollRight && (
                <button
                  type="button"
                  onClick={() => scrollCategories('right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center z-10"
                  style={{ border: '1px solid #ECE6DA' }}
                >
                  <ChevronRight className="h-4 w-4 text-[#2E2E2E]" />
                </button>
              )}
            </div>
          </div>
        </div>
    </header>

    <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
};

export default Header;
