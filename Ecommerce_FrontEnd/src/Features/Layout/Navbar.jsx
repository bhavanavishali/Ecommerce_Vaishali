// "use client"

// import { useEffect, useState } from "react"
// import { Bell, Heart, ShoppingCart, User } from "lucide-react"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import Logo from '/logo 1.png'
// import api from '../../api'

// const Header = () => {
//   const [searchQuery, setSearchQuery] = useState("")
//   const [categories,setCategories]=useState([])
//   const [loading,setLoading]=useState(false)
//   const [error, setError] = useState(null);

//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value)
//   }

//   const handleSearchSubmit = (e) => {
//     e.preventDefault()
   
//     console.log("Searching for:", searchQuery)
//   }
// useEffect(()=>{
//   fetchcategories()
// },[]
// )
// const fetchcategories = async () => {
//   setLoading(true)
//   try {
    
//     const response = await api.get('categories/')
//     setCategories(response.data)
//     setError(null)
//   } catch (err) {
//     console.error("Error fetching categories:", err)
//     setError(err.message || "Failed to fetch categories")
//     setCategories([])
//   } finally {
//     setLoading(false)
//   }
// }

//   return (
//     <header className="w-full bg-white shadow-sm">
//       <div className="container mx-auto px-4 py-4">
//         {/* Top section with logo, search, and icons */}
//         <div className="flex items-center justify-between">
//           {/* Logo */}
//           <div className="flex-shrink-0">
//             <a href="/" className="flex items-center">
//               <img
//                 src={Logo}
//                 alt="Vaishali Gold Logo"
//                 className="h-16 w-auto object-contain"
//               />
//             </a>
//           </div>

//           {/* Search Bar */}
//           <form onSubmit={handleSearchSubmit} className="flex-grow max-w-xl mx-4">
//             <div className="relative flex items-center">
//               <Input
//                 type="text"
//                 placeholder="Search"
//                 value={searchQuery}
//                 onChange={handleSearchChange}
//                 className="w-full rounded-full border-2 border-gray-300 pl-4 pr-12 py-2 focus-visible:ring-0 focus-visible:ring-offset-0"
//               />
//               <Button
//                 type="submit"
//                 className="absolute right-0 rounded-r-full bg-[#8B2131] hover:bg-[#701A28] text-white px-6"
//               >
//                 Search
//               </Button>
//             </div>
//           </form>

//           {/* Icons */}
//           <div className="flex items-center space-x-6">
//             <button className="text-gray-700 hover:text-[#8B2131] transition-colors">
//               <Bell className="h-6 w-6" />
//             </button>
//             <button className="text-gray-700 hover:text-[#8B2131] transition-colors">
//               <ShoppingCart className="h-6 w-6" />
//             </button>
//             <button className="text-gray-700 hover:text-[#8B2131] transition-colors">
//               <Heart className="h-6 w-6" />
//             </button>
//             <button className="text-gray-700 hover:text-[#8B2131] transition-colors">
//               <User className="h-6 w-6" />
//             </button>
//           </div>
//         </div>

//         {/* Navigation Menu */}
//         <nav className="mt-6">
//           <ul className="flex justify-center space-x-10">
//             <li>
//               <a href="/all-jewellery" className="text-[#8B2131] hover:text-[#701A28] font-medium transition-colors">
//                 All Jewellery
//               </a>
//             </li>
//             {loading ? (
//               <li className="text-gray-500">Loading categories...</li>
//             ) : error ? (
//               <li className="text-red-500">{error}</li>
//             ) : (
//               categories.map((item, index) => (
//                 <li key={index}>
//                   <a href="/gold" className="text-gray-700 hover:text-[#8B2131] font-medium transition-colors">
//                     {item}
//                   </a>
//                 </li>
//               ))
//             )}
//           </ul>
//         </nav>
//       </div>
//     </header>
//   )
// }

// export default Header

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
