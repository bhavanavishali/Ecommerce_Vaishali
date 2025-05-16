"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useWishlist } from "@/Context/WishlistContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; 
import { useCart } from "@/Context/CartContext"
import { useState } from "react";

export default function Wishlist() {
  const { wishlist, fetchWishlist,removeFromWishlist, loading, error } = useWishlist();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1)
    const { addToCart } = useCart()
  console.log("i want wishlistitem",wishlist)

  const BASE_URL = "http://127.0.0.1:8000"
  useEffect(() => {
    if (!wishlist) {
      fetchWishlist();
    }
  }, [wishlist, fetchWishlist]);

  const handleAddToCart = async (variantId, quantity, event) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }

    try {
      await addToCart(variantId, quantity)
      const toast = document.createElement("div")
      toast.className =
        "fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg transform transition-transform duration-500 ease-in-out z-50"
      toast.innerHTML = "Item added to cart successfully!"
      document.body.appendChild(toast)

      setTimeout(() => {
        toast.classList.add("translate-y-20", "opacity-0")
        setTimeout(() => document.body.removeChild(toast), 500)
      }, 3000)
    } catch (error) {
      console.error("Add to cart failed:", error)
    }
  }

  if (loading) return <div>Loading cart...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!wishlist) return <div>Initializing cart...</div>;

  const totalItems = wishlist.total_items || 0;
  console.log(" wishlist",wishlist)

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <h1 className="text-xl font-semibold mb-1">WishList</h1>
      <div className="flex justify-between mb-4">
        <p className="text-sm">Total ({totalItems} items)</p>
        
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left side - Products */}
        <div className="md:col-span-2 space-y-4">
          {wishlist.items.map((item) => (
            <Card key={item.id} className="overflow-hidden border rounded-md">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Product Image */}
                  {/* <div className="w-full sm:w-32 h-32 flex-shrink-0">
                    <img
                      src={`${BASE_URL}${item.product.images[0]}`}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                    />
                  </div> */}

                  {/* Product Details */}
                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row justify-between">
                      <div className="flex-grow">
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="text-sm text-black-500 mb-2">Description: {item.product.description}</p>
                        <p className="text-sm text-gray-500 mb-2">Weight: {item.variant.gross_weight}g</p>

                        
                      </div>

                      <div className="mt-4 sm:mt-0 flex flex-col items-end justify-between">
                        <span className="text-green-600 font-medium">₹ {item.variant.total_price}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-red-600 text-white border border-red-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 mt-4"
                          onClick={() => removeFromWishlist(item.id)}
                          disabled={loading}
                        >
                          Remove
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-[#7a2828] text-white border border-red-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 mt-4"
                          onClick={(e) => handleAddToCart(item.variant.id, quantity, e) }
                          disabled={loading}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

     
      </div>
    </div>
  );
}