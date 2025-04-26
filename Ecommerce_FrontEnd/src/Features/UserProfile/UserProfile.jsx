"use client"

import { useState } from "react"
import { User, Package, MapPin, Wallet, Camera } from "lucide-react"
import { cn } from "@/lib/utils"
import ProfileInfo from './ProfileInfo'
import MyOrders from "./Myorders"
import ManageAddresses from "./manage-address"
import WalletPage from "./wallets"



const UserProfile= () => {
  const [activePage, setActivePage] = useState("profile")

  const menuItems = [
    { id: "profile", label: "Profile Information", icon: User },
    { id: "myorders", label: "My Orders", icon: Package },
    { id: "addresses", label: "Manage Addresses", icon: MapPin },
    { id: "wallet", label: "Wallet", icon: Wallet },
  ]

  const renderPage = () => {
    switch (activePage) {
      case "profile":
        return <ProfileInfo />
      case "myorders":
        return <MyOrders />
      case "addresses":
        return <ManageAddresses />
      case "wallet":
        return <WalletPage />
      default:
        return <ProfileInfo />
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-64 border-r bg-white">
        <div className="flex flex-col items-center p-6 border-b">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-12 w-12 text-gray-400" />
            </div>
            <button className="absolute bottom-0 right-0 bg-[#7a2828] text-white p-1.5 rounded-full">
              <Camera className="h-4 w-4" />
            </button>
          </div>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActivePage(item.id)}
                  className={cn(
                    "flex items-center w-full px-4 py-2.5 rounded-md text-sm font-medium transition-colors",
                    activePage === item.id ? "bg-[#7a2828] text-white" : "text-gray-600 hover:bg-gray-100",
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">{renderPage()}</div>
    </div>
  )
}

export default UserProfile

