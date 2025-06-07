

"use client"

import { useEffect, useState } from "react"
import { Bell, Heart, ShoppingCart, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import api from '../../api'

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null) // Added state for error handling

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    console.log("Searching for:", searchQuery)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const response = await api.get('productapp/categories/')
      console.log("data ssss",response.data)
      setCategories(response.data)
      setError(null) // Reset error state on success
    } catch (err) {
      console.error("Error fetching categories:", err)
      setError(err.message || "Failed to fetch categories")
      setCategories([]) // Reset categories on error
    } finally {
      setLoading(false)
    }
  }

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
       
        <nav className="mt-6">
          <ul className="flex justify-center space-x-10">
            <li>
              <a href="/all-jewellery" className="text-[#8B2131] hover:text-[#701A28] font-medium transition-colors">
                All Jewellery
              </a>
            </li>
            {loading ? (
              <li className="text-gray-500">Loading categories...</li>
            ) : error ? (
              <li className="text-red-500">{error}</li>
            ) : (
              categories.map((item, index) => (
                <li key={index}>
                  {/* <a href="/gold" className="text-gray-700 hover:text-[#8B2131] font-medium transition-colors">
                    {item}
                  </a> */}
                  {item.name}
                </li>
              ))
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
