import React, { createContext, useState, useContext } from 'react';
import api from '../api';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWishlist = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('cartapp/wishlist/');
      setWishlist(response.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setError(error.response?.data?.error || 'Failed to fetch wishlist.');
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (idOrOptions) => {
    setLoading(true);
    setError(null);
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
      setError(error.response?.data?.error || 'Failed to add item to wishlist.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (itemId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('cartapp/wishlist/remove/', { item_id: itemId });
      setWishlist(response.data);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      setError(error.response?.data?.error || 'Failed to remove item from wishlist.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, loading, error, fetchWishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);