
"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { clearAuthData } from "../../Redux/authslice"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import AddProductForm from "./AddProductForm"
import TaxConfiguration from "../TaxConfig/TaxConfig"
import ProductTable from "./ProductTable"
import CategoryTable from "./CategoryTable"
import UserTable from "./UserTable"
import OrderTable from "./OrderTable"
import CouponManagement from "./CouponAddTable"
import SalesReport from "../SalesReport/SalesReport"
import AdminDashboard from '../Dashboard/Dashboardchart';
// import BannerManagement from "../Banner/Banner"
import Logo from "/logo 1.png"
import api from '../../api'
import {
  LayoutGrid,
  Package,
  Tag,
  ShoppingCart,
  Users,
  Star,
  MessageCircle,
  Gift,
  Ticket,
  Bell,
  Settings,
  ImageIcon,
  LogOut,
  Search,
  Upload,
  FileText 
} from "lucide-react"

// Sidebar Component
const Sidebar = ({ activeItem, setActiveItem }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
    { id: "products", label: "Products", icon: Package },
    { id: "category", label: "Category", icon: Tag },
    { id: "customers", label: "Customers", icon: Users },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "coupons", label: "Coupons", icon: Ticket },
    { id: "salesReport", label: "SalesReport", icon: FileText },
    
    // { id: "enquiry", label: "Enquiry", icon: MessageCircle },
    // { id: "offers", label: "Offers", icon: Gift },
   
    // { id: "notifications", label: "Notifications", icon: Bell },
     { id: "taxConfig", label: "Tax Config", icon: Settings },
    // { id: "bannerManagement", label: "Banner management",  icon: ImageIcon },
  ]

  return (
    <div className="bg-rose-510 w-64 h-screen fixed left-0 top-0 bg-white border-r">
      <div className="p-4">
        <img
          src={Logo}
          alt="Vaishali Gold Logo"
          className="w-48 mx-auto mb-8"
        />
      </div>
      <nav className="px-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg mb-1 text-sm ${
                activeItem === item.id ? "bg-[#8c2a2a] text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          )
        })}
      </nav>
    </div>
  )
}

// Main Dashboard Component
function Dashboard() {
  const [activeItem, setActiveItem] = useState("products")
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await api.post("admin/logout/")

      dispatch(clearAuthData())
      console.log("logout!!!")
      navigate("/adminLogin")
    } catch (error) {
      navigate("/dashboard")
    } finally {
      setIsLoggingOut(false)
    }
  }

  const renderContent = () => {
    switch (activeItem) {
      case "dashboard":
        return <AdminDashboard />
      case "products":
        return <ProductTable />
      case "category":
        return <CategoryTable />
      case "customers":
        return <UserTable />
      case "orders":
        return <OrderTable />
      case "coupons":
        return <CouponManagement/>
      case "salesReport":
          return <SalesReport/>
      case "taxConfig":
          return <TaxConfiguration/>
      // case "bannerManagement":
      //     return <BannerManagement/>
      default:
        return <div>Select a menu item</div>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />

      <div className="ml-64 min-h-screen">
        <header className="bg-white p-4 border-b sticky top-0 z-10">
          <div className="max-w-4xl mx-auto flex  items-center">
          <div className="ml-auto">
            <Button
              variant="ghost"
              className="text-[#8c2a2a] hover:text-[#7a2424] hover:bg-red-50"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut className="mr-2" size={18} />
              {isLoggingOut ? "Logging out..." : "Log out"}
            </Button>
            </div>
          </div>
        </header>

        <main className="p-8">{renderContent()}</main>
      </div>
    </div>
  )
}

export default Dashboard