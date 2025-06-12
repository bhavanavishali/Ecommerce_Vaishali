

// "use client"
// import { useState, useEffect } from "react"
// import {
//   ShoppingBag,
//   Search,
//   Menu,
//   User,
//   Heart,
//   MapPin,
//   Phone,
//   Mail,
//   Instagram,
//   Facebook,
//   Twitter,
//   Youtube,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
// import banner1 from "/landing_banner1.webp"
// import banner2 from "/landing_banner2.webp"
// import api from "../../api" 
// export default function Landingpage() {
//   const [products, setProducts] = useState([])

//   const BASE_URL =import.meta.env.VITE_BASE_URL
  
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await api.get("productapp/products/")
//         console.log("landing page ",response.data)
        
//         setProducts(response.data.slice(0, 4)) 

//       } catch (error) {
//         console.error("Error fetching products:", error)
//       }
//     }
//     fetchProducts()
//   }, [])

//   const promossion_banner = [
//     "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw8d40a0ea/homepage/posters/gifting-banner-desktop-wb.jpg"
//   ]

//   const genderImage = [
//     "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dwef4310c0/homepage/ShopByGender/Men.jpg",
//     "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw24db1907/homepage/ShopByGender/kid.jpg",
//     "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dwc0abe627/homepage/ShopByGender/Woman.jpg"
//   ]

//   return (
//     <div className="flex min-h-screen flex-col">
//       {/* Header */}
//       <main className="flex-1">
//         {/* Hero Banner */}
//         <section className="relative w-full">
//           <Carousel className="w-full">
//             <CarouselContent>
//               <CarouselItem>
//                 <div className="relative w-screen aspect-[2.5] overflow-hidden group">
//                   <img
//                     src={banner1}
//                     alt="String it with Diamonds"
//                     className="w-full h-full object-cover transition-transform duration-700 ease-in-out transform group-hover:scale-105"
//                   />
//                   <img
//                     src={banner2}
//                     alt="String it with Diamonds"
//                     className="w-full h-full object-cover transition-transform duration-700 ease-in-out transform group-hover:scale-105"
//                   />
//                 </div>
//               </CarouselItem>
//             </CarouselContent>
//             <CarouselPrevious className="left-4" />
//             <CarouselNext className="right-4" />
//           </Carousel>
//         </section>

//         {/* Recommended For You */}
//         <section className="py-12 container">
//           <h2 className="text-3xl font-serif text-center mb-8">Recommended For You</h2>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//             {products.map((item) => (
//               <Card key={item.id} className="overflow-hidden border-none shadow-sm group cursor-pointer transition-all duration-300 hover:shadow-xl">
//                 <CardContent className="p-0">
//                   <div className="aspect-square relative overflow-hidden">
                    
//                     <img
//                       src={item.image[0]?.image ? `${BASE_URL}${item.image[0].image}` : "https://via.placeholder.com/300"} // Use first image or fallback
//                       alt={item.name}
//                       className="w-full h-full object-cover transition-transform duration-700 transform group-hover:scale-110"
//                     />
//                     <div className="absolute bottom-0 left-0 right-0 bg-white/80 p-3 transition-all duration-500 group-hover:bg-white/90">
//                       <h3 className="text-sm font-medium transition-all duration-300 group-hover:text-amber-800">{item.name}</h3>
//                       <p className="text-xs text-gray-500 transition-all duration-300 group-hover:text-amber-700">
//                         ₹{parseFloat(item.price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
//                       </p>
//                     </div>
//                     <div className="absolute top-2 right-2 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
//                       <Button variant="ghost" size="icon" className="bg-white/80 hover:bg-white">
//                         <Heart className="h-4 w-4 text-amber-800" />
//                       </Button>
//                     </div>
//                     <div className="absolute inset-0 bg-gradient-to-t from-amber-800/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </section>

//         {/* Connect With Us */}
//         <section className="py-12 bg-gray-50">
//           <div className="container">
//             <h2 className="text-3xl font-serif text-center mb-8">Connect With Us</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
//               <Card className="text-center p-6 transition-all duration-500 hover:shadow-xl hover:bg-amber-50 group cursor-pointer">
//                 <MapPin className="h-8 w-8 mx-auto mb-4 transition-all duration-500 text-amber-800 group-hover:scale-110" />
//                 <h3 className="font-medium mb-2 transition-all duration-300 group-hover:text-amber-800">Find a Store</h3>
//                 <p className="text-sm text-gray-500">Locate our stores near you</p>
//               </Card>
//               <Card className="text-center p-6 transition-all duration-500 hover:shadow-xl hover:bg-amber-50 group cursor-pointer">
//                 <Phone className="h-8 w-8 mx-auto mb-4 transition-all duration-500 text-amber-800 group-hover:scale-110" />
//                 <h3 className="font-medium mb-2 transition-all duration-300 group-hover:text-amber-800">Call Us</h3>
//                 <p className="text-sm text-gray-500">1800-123-4567</p>
//               </Card>
//               <Card className="text-center p-6 transition-all duration-500 hover:shadow-xl hover:bg-amber-50 group cursor-pointer">
//                 <Mail className="h-8 w-8 mx-auto mb-4 transition-all duration-500 text-amber-800 group-hover:scale-110" />
//                 <h3 className="font-medium mb-2 transition-all duration-300 group-hover:text-amber-800">Email Us</h3>
//                 <p className="text-sm text-gray-500">care@tanishq.com</p>
//               </Card>
//             </div>
//           </div>
//         </section>
//       </main>
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { Heart, MapPin, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import banner1 from "/landing_banner1.webp"
import banner2 from "/landing_banner2.webp"
import api from "../../api"

// Loader Component
const PageLoader = () => (
  <div className="fixed inset-0 bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center z-50">
    <div className="text-center">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-[#7a2828]/20 rounded-full animate-spin border-t-[#7a2828]"></div>
        <div className="absolute inset-0 w-20 h-20 border-4 border-transparent rounded-full animate-pulse border-t-amber-400"></div>
      </div>
      <p className="mt-4 text-[#7a2828] font-serif text-lg animate-pulse">Loading Exquisite Jewelry...</p>
      <div className="flex justify-center mt-2 space-x-1">
        <div className="w-2 h-2 bg-[#7a2828] rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
        <div className="w-2 h-2 bg-[#7a2828] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
      </div>
    </div>
  </div>
)

export default function Landingpage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)

  const BASE_URL = import.meta.env.VITE_BASE_URL

  // Banner images for rotation
  const bannerImages = [
    banner1,
    banner2,
    
  ]

  // Auto-rotate banner
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex === bannerImages.length - 1 ? 0 : prevIndex + 1))
    }, 4000) // Change every 4 seconds

    return () => clearInterval(interval)
  }, [bannerImages.length])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Simulate loading time for better UX
        await new Promise((resolve) => setTimeout(resolve, 1500))

        const response = await api.get("productapp/products/")
        console.log("landing page ", response.data)

        setProducts(response.data.slice(0, 4))
        setLoading(false)
      } catch (error) {
        console.error("Error fetching products:", error)
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const genderImage = [
    "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dwef4310c0/homepage/ShopByGender/Men.jpg",
    "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw24db1907/homepage/ShopByGender/kid.jpg",
    "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dwc0abe627/homepage/ShopByGender/Woman.jpg",
  ]

  if (loading) {
    return <PageLoader />
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-amber-50/30 to-white">
      <main className="flex-1">
        {/* Hero Banner with Auto-Rotation */}
        <section className="relative w-full overflow-hidden">
          <div className="relative w-full aspect-[16/6] sm:aspect-[16/7] md:aspect-[16/8] lg:aspect-[2.5]">
            {bannerImages.map((banner, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                  index === currentBannerIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
                }`}
              >
                <img
                  src={banner || "/placeholder.svg"}
                  alt={`Banner ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#7a2828]/20 to-transparent"></div>
              </div>
            ))}

            {/* Banner Navigation Dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {bannerImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBannerIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentBannerIndex ? "bg-[#7a2828] scale-125" : "bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>

           
          </div>
        </section>

        {/* Recommended For You */}
        <section className="py-16 container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-[#7a2828] mb-4">Recommended For You</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#7a2828] to-amber-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((item, index) => (
              <Card
                key={item.id}
                className="overflow-hidden border-none shadow-lg group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-white rounded-2xl"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-0">
                  <div className="aspect-square relative overflow-hidden rounded-t-2xl">
                    <img
                      src={
                        item.image[0]?.image ? `${BASE_URL}${item.image[0].image}` : "https://via.placeholder.com/300"
                      }
                      alt={item.name}
                      className="w-full h-full object-cover transition-all duration-700 transform group-hover:scale-110"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#7a2828]/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

                    {/* Heart Icon */}
                    <div className="absolute top-3 right-3 opacity-0 transition-all duration-500 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-white/90 hover:bg-white rounded-full shadow-lg backdrop-blur-sm"
                      >
                        <Heart className="h-4 w-4 text-[#7a2828] hover:fill-current transition-all duration-300" />
                      </Button>
                    </div>

                    {/* Quick View Button */}
                    <div className="absolute inset-x-4 bottom-4 opacity-0 transition-all duration-500 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0">
                      <Button className="w-full bg-[#7a2828] hover:bg-[#5a1f1f] text-white rounded-full transition-all duration-300 hover:scale-105">
                        Quick View
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-b from-white to-amber-50/30">
                    <h3 className="text-sm md:text-base font-medium transition-all duration-300 group-hover:text-[#7a2828] mb-2">
                      {item.name}
                    </h3>
                    <p className="text-lg font-bold text-[#7a2828] transition-all duration-300 group-hover:scale-105">
                      ₹{Number.parseFloat(item.price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </p>
                    
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Connect With Us */}
        <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif text-[#7a2828] mb-4">Connect With Us</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-[#7a2828] to-amber-500 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  icon: MapPin,
                  title: "Find a Store",
                  desc: "Locate our stores near you",
                  color: "from-red-500 to-[#7a2828]",
                },
                { icon: Phone, title: "Call Us", desc: "1800-123-4567", color: "from-amber-500 to-orange-500" },
                { icon: Mail, title: "Email Us", desc: "care@tanishq.com", color: "from-[#7a2828] to-red-600" },
              ].map((item, index) => (
                <Card
                  key={index}
                  className="text-center p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 group cursor-pointer bg-white rounded-2xl border-none relative overflow-hidden"
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
                    <div className={`w-full h-full bg-gradient-to-br ${item.color}`}></div>
                  </div>

                  <div className="relative z-10">
                    <div
                      className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-12`}
                    >
                      <item.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-3 transition-all duration-300 group-hover:text-[#7a2828]">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 transition-all duration-300 group-hover:text-gray-800">{item.desc}</p>
                  </div>

                  {/* Hover Border Effect */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#7a2828]/20 transition-all duration-500"></div>
                </Card>
              ))}
            </div>
          </div>
        </section>

       
      </main>
    </div>
  )
}
