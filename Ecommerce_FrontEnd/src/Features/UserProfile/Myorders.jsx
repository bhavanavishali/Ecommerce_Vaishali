




"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import api from "../../api"
import { useNavigate } from "react-router-dom"

const MyOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeFilter, setActiveFilter] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const navigate=useNavigate()

  const filters = ["All", "Pending","Processing", "Shipped", "Delivered", "Cancelled"]

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("cartapp/userorders/")
        setOrders(response.data)
        setTotalPages(Math.ceil(response.data.length / 10)) // Assuming 10 items per page
      } catch (error) {
        console.error("Error fetching orders:", error)
        setError("Failed to load orders")
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const filteredOrders = () => {
    if (activeFilter === "All") return orders
    return orders.filter((order) => order.status.toLowerCase() === activeFilter.toLowerCase())
  }

  const paginatedOrders = () => {
    const filtered = filteredOrders()
    const startIndex = (currentPage - 1) * 10
    return filtered.slice(startIndex, startIndex + 10)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    })
  }

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      "payment failed": "bg-orange-100 text-orange-800",
    }

    const statusClass = statusStyles[status.toLowerCase()] || "bg-gray-100 text-gray-800"

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusClass}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  if (loading) {
    return <div className="w-full flex justify-center items-center min-h-[300px]">Loading your orders...</div>
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">My Orders</h1>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                className={`rounded-full ${activeFilter === filter ? "bg-purple-600 hover:bg-purple-700" : ""}`}
                onClick={() => {
                  setActiveFilter(filter)
                  setCurrentPage(1)
                }}
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-gray-500">ORDER ID</th>
                  <th className="text-left p-4 font-medium text-gray-500">DATE</th>
                  <th className="text-left p-4 font-medium text-gray-500">ITEMS</th>
                  <th className="text-left p-4 font-medium text-gray-500">AMOUNT</th>
                  
                  <th className="text-right p-4 font-medium text-gray-500"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders().map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{order.order_number}</td>
                    <td className="p-4 text-gray-600">{formatDate(order.created_at)}</td>
                    <td className="p-4">{order.items?.length || 0} items</td>
                    <td className="p-4 font-medium">₹{order.final_total}</td>
                    
                    <td className="p-4 text-right">
                    <Button variant="secondary" className="bg-red-800 text-white hover:bg-red-700"
                                        onClick={()=>navigate(`/user/view-order-details/${order.id}`)}>
                    View Details</Button>
                    </td>
                  </tr>
                ))}

                {paginatedOrders().length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center justify-center h-8 w-8 rounded-md bg-purple-600 text-white">
              {currentPage}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrders
