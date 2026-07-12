import React, { createContext, useState, useContext } from 'react';
import api from '../api';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(null);

  const fetchWishlist = async () => {
    try {
      const response = await api.get('cartapp/wishlist/');
      setWishlist(response.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const addToWishlist = async (idOrOptions) => {
    try {
      let payload = {};

      if (typeof idOrOptions === 'object') {
        if (idOrOptions.productId) {
          payload.product = idOrOptions.productId;
        } else if (idOrOptions.variantId) {
          payload.variant = idOrOptions.variantId;
        }
      } else {
        payload.variant = idOrOptions;
      }

      const response = await api.post('cartapp/wishlist/add/', payload);
      setWishlist(response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  };

  const removeFromWishlist = async (itemId) => {
    try {
      const response = await api.post('cartapp/wishlist/remove/', { item_id: itemId });
      setWishlist(response.data);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, fetchWishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);