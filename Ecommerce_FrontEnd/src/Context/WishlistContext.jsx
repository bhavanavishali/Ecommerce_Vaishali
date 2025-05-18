import React, { createContext, useState, useContext } from 'react';
import api from '../api'


const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(null);
  
  
  const fetchWishlist = async () => {                    
    try {
      
      const response = await api.get('cartapp/wishlist/');

      setWishlist(response.data);
     
      console.log("datas cart",response.data)
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToWishlist = async (variantId) => {
    try {
      const response = await api.post(
        'cartapp/wishlist/add/',
        { variant: variantId }
      );
      console.log("this my fetchwishlist data", response.data);
      setWishlist(response.data);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromWishlist = async (itemId) => {
    try {
      const response = await api.post(
        'cartapp/wishlist/remove/',
        { item_id: itemId }
      
      );
      setWishlist(response.data);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

 
  return (
    <WishlistContext.Provider value={{ wishlist, fetchWishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist= () => useContext(WishlistContext);