// "use client"
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
// import banner2 from "/landing_banner11.png";

// export default function Landingpage() {

//     const promossion_banner = [
//         "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw8d40a0ea/homepage/posters/gifting-banner-desktop-wb.jpg"
//     ]

//     const recommandImage=[
//         "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dwd7aad357/homepage/NewForYou/new-arrivals-diamond.jpg",
//         "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw8e2fdba5/homepage/NewForYou/mangalsutra-diamond.jpg",
//         "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw53407355/homepage/NewForYou/rainbow-rhythm-diamond.jpg",
//         "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Sites-Tanishq-product-catalog/default/dw68bbae49/images/hi-res/50D4FFBCKAA02_1.jpg?sw=640&sh=640"
//     ]  
//     const genderImage=[
//         "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dwef4310c0/homepage/ShopByGender/Men.jpg",
//         "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw24db1907/homepage/ShopByGender/kid.jpg",
//         "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dwc0abe627/homepage/ShopByGender/Woman.jpg"
//     ] 
//   return (
//     <div className="flex min-h-screen flex-col">
//       {/* Header */}
      

//       <main className="flex-1">
//         {/* Hero Banner */}
//         <section className="relative w-full">
//   <Carousel className="w-full">
//     <CarouselContent>
//       <CarouselItem>
//         <div className="relative w-screen aspect-[2.5] overflow-hidden group">
//           <img
//             src={banner2}
//             alt="String it with Diamonds"
//             className="w-full h-full object-cover transition-transform duration-700 ease-in-out transform group-hover:scale-105"
//           />
//         </div>
//       </CarouselItem>
//     </CarouselContent>
//     <CarouselPrevious className="left-4" />
//     <CarouselNext className="right-4" />
//   </Carousel>
// </section>

//         {/* Shop By Gender */}
//         {/* <section className="py-12 container">
//           <h2 className="text-3xl font-serif text-center mb-8">Shop By Gender</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {genderImage.map((gender) => (
//               <Card key={gender} className="overflow-hidden border-none shadow-sm group cursor-pointer transition-all duration-300 hover:shadow-xl">
//                 <CardContent className="p-0">
//                   <div className="aspect-[4/5] relative overflow-hidden">
//                     <img
//                       src={gender}
//                       alt={gender}
//                       className="w-full h-full object-cover transition-transform duration-700 transform group-hover:scale-110"
//                     />
//                     <div className="absolute bottom-0 left-0 right-0 bg-white/80 p-3 text-center transition-all duration-500 group-hover:bg-white/90">
//                       <h3 className="text-sm font-medium mb-2 transition-all duration-300 group-hover:text-amber-800">Gender</h3>
//                       <Button size="sm" variant="outline" className="bg-white transition-all duration-300 hover:bg-amber-800 hover:text-white transform scale-90 group-hover:scale-100">
//                         SHOP NOW
//                       </Button>
//                     </div>
//                     <div className="absolute inset-0 bg-gradient-to-t from-amber-800/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </section> */}


     

//         {/* Recommended For You */}
//         <section className="py-12 container">
//           <h2 className="text-3xl font-serif text-center mb-8">Recommended For You</h2>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//             {recommandImage.map((item) => (
//               <Card key={item} className="overflow-hidden border-none shadow-sm group cursor-pointer transition-all duration-300 hover:shadow-xl">
//                 <CardContent className="p-0">
//                   <div className="aspect-square relative overflow-hidden">
//                     <img
//                       src={item}
//                       alt={`Recommended item ${item}`}
//                       className="w-full h-full object-cover transition-transform duration-700 transform group-hover:scale-110"
//                     />
//                     <div className="absolute bottom-0 left-0 right-0 bg-white/80 p-3 transition-all duration-500 group-hover:bg-white/90">
//                       <h3 className="text-sm font-medium transition-all duration-300 group-hover:text-amber-800">Diamond Pendant</h3>
//                       <p className="text-xs text-gray-500 transition-all duration-300 group-hover:text-amber-700">₹24,999</p>
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
//       </div>

// )}

"use client"
import { useState, useEffect } from "react"
import {
  ShoppingBag,
  Search,
  Menu,
  User,
  Heart,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import banner2 from "/landing_banner11.png"
import api from "../../api" // Assuming you have an API client setup

export default function Landingpage() {
  const [products, setProducts] = useState([])

  const BASE_URL =import.meta.env.VITE_BASE_URL
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("productapp/products/")
        console.log("landing page ",response.data)
        // Assuming the API returns an array of products
        setProducts(response.data.slice(0, 4)) 

      } catch (error) {
        console.error("Error fetching products:", error)
      }
    }
    fetchProducts()
  }, [])

  const promossion_banner = [
    "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw8d40a0ea/homepage/posters/gifting-banner-desktop-wb.jpg"
  ]

  const genderImage = [
    "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dwef4310c0/homepage/ShopByGender/Men.jpg",
    "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw24db1907/homepage/ShopByGender/kid.jpg",
    "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dwc0abe627/homepage/ShopByGender/Woman.jpg"
  ]

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <main className="flex-1">
        {/* Hero Banner */}
        <section className="relative w-full">
          <Carousel className="w-full">
            <CarouselContent>
              <CarouselItem>
                <div className="relative w-screen aspect-[2.5] overflow-hidden group">
                  <img
                    src={banner2}
                    alt="String it with Diamonds"
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out transform group-hover:scale-105"
                  />
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </section>

        {/* Recommended For You */}
        <section className="py-12 container">
          <h2 className="text-3xl font-serif text-center mb-8">Recommended For You</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((item) => (
              <Card key={item.id} className="overflow-hidden border-none shadow-sm group cursor-pointer transition-all duration-300 hover:shadow-xl">
                <CardContent className="p-0">
                  <div className="aspect-square relative overflow-hidden">
                    {/* <img
                      // src={item.image[0]?.url || "https://via.placeholder.com/300"} // Fallback image if item.image[0].url is unavailable
                      src={`${BASE_URL}${item.image[0]}`}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 transform group-hover:scale-110"
                    /> */}

                    <img
                      src={item.image[0]?.image ? `${BASE_URL}${item.image[0].image}` : "https://via.placeholder.com/300"} // Use first image or fallback
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 transform group-hover:scale-110"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-white/80 p-3 transition-all duration-500 group-hover:bg-white/90">
                      <h3 className="text-sm font-medium transition-all duration-300 group-hover:text-amber-800">{item.name}</h3>
                      <p className="text-xs text-gray-500 transition-all duration-300 group-hover:text-amber-700">
                        ₹{parseFloat(item.price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <Button variant="ghost" size="icon" className="bg-white/80 hover:bg-white">
                        <Heart className="h-4 w-4 text-amber-800" />
                      </Button>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-800/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Connect With Us */}
        <section className="py-12 bg-gray-50">
          <div className="container">
            <h2 className="text-3xl font-serif text-center mb-8">Connect With Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <Card className="text-center p-6 transition-all duration-500 hover:shadow-xl hover:bg-amber-50 group cursor-pointer">
                <MapPin className="h-8 w-8 mx-auto mb-4 transition-all duration-500 text-amber-800 group-hover:scale-110" />
                <h3 className="font-medium mb-2 transition-all duration-300 group-hover:text-amber-800">Find a Store</h3>
                <p className="text-sm text-gray-500">Locate our stores near you</p>
              </Card>
              <Card className="text-center p-6 transition-all duration-500 hover:shadow-xl hover:bg-amber-50 group cursor-pointer">
                <Phone className="h-8 w-8 mx-auto mb-4 transition-all duration-500 text-amber-800 group-hover:scale-110" />
                <h3 className="font-medium mb-2 transition-all duration-300 group-hover:text-amber-800">Call Us</h3>
                <p className="text-sm text-gray-500">1800-123-4567</p>
              </Card>
              <Card className="text-center p-6 transition-all duration-500 hover:shadow-xl hover:bg-amber-50 group cursor-pointer">
                <Mail className="h-8 w-8 mx-auto mb-4 transition-all duration-500 text-amber-800 group-hover:scale-110" />
                <h3 className="font-medium mb-2 transition-all duration-300 group-hover:text-amber-800">Email Us</h3>
                <p className="text-sm text-gray-500">care@tanishq.com</p>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}