import React, { createContext, useState, useContext } from 'react';
import api from '../api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('cartapp/cart/');
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError(error.response?.data?.error || 'Failed to fetch cart.');
    } finally {
      setLoading(false);
    }
  };

  // Accept productId OR variantId
  const addToCart = async (idOrOptions, quantity = 1) => {
    setLoading(true);
    setError(null);
    try {
      let payload = { quantity };

      if (typeof idOrOptions === 'object') {
        if (idOrOptions.productId) {
          payload.product_id = idOrOptions.productId;
        } else if (idOrOptions.variantId) {
          payload.variant_id = idOrOptions.variantId;
        }
      } else {
        // backward compatible: treat number as variant_id
        payload.variant_id = idOrOptions;
      }

      const response = await api.post('cartapp/cart/add/', payload);
      setCart(response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError(error.response?.data?.error || 'Failed to add item to cart.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('cartapp/cart/update/', { item_id: itemId, quantity });
      setCart(response.data);
    } catch (error) {
      console.error('Error updating quantity:', error);
      setError(error.response?.data?.error || 'Failed to update cart quantity.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('cartapp/cart/remove/', { item_id: itemId });
      setCart(response.data);
    } catch (error) {
      console.error('Error removing from cart:', error);
      setError(error.response?.data?.error || 'Failed to remove item from cart.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.post('cartapp/cart/clear/');
      setCart(null);
    } catch (error) {
      console.error('Error clearing cart:', error);
      setError(error.response?.data?.error || 'Failed to clear cart.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{ cart, loading, error, fetchCart, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);