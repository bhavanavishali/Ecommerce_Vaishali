import React, { createContext, useState, useContext } from 'react';
import api from '../api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);

  const fetchCart = async () => {
    try {
      const response = await api.get('cartapp/cart/');
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  // Accept productId OR variantId
  const addToCart = async (idOrOptions, quantity = 1) => {
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
      throw error;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const response = await api.post('cartapp/cart/update/', { item_id: itemId, quantity });
      setCart(response.data);
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const response = await api.post('cartapp/cart/remove/', { item_id: itemId });
      setCart(response.data);
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await api.post('cartapp/cart/clear/');
      setCart(null);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, fetchCart, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);