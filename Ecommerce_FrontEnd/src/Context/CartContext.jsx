import React, { createContext, useState, useContext } from 'react';
import api from '../api'


const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  
  const fetchCart = async () => {                    // for fetch cart 
    try {
      
      const response = await api.get('cartapp/cart/');

      setCart(response.data);
     
      console.log("datas cart",response.data)
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (variantId, quantity = 1) => {
    try {
      const response = await api.post(
        'cartapp/cart/add/',
        { variant_id: variantId, quantity },
        
      );
      console.log("this my fetchcart",response.data)
      
      setCart(response.data);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const response = await api.post(
        'cartapp/cart/update/',
        { item_id: itemId, quantity }
        
      );
      setCart(response.data);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const response = await api.post(
        'cartapp/cart/remove/',
        { item_id: itemId }
      
      );
      setCart(response.data);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

   const clearCart = async () => {
    try {
      const response = await api.post('cartapp/cart/clear/'); // New endpoint to clear cart
      setCart(null); // Reset cart state to empty
      console.log("Cart cleared:", response.data);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, fetchCart, addToCart, updateQuantity, removeFromCart,clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);