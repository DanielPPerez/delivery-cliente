"use client"
import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, { ...product, quantity: 1 }]);
  };

  const removeFromCart = (_id) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== _id));
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateTotal = () => {
    const serviceCost = 50;

    if (cart.length > 3) {
      // Si hay más de 3 productos, el costo de envío es gratis
      return calculateSubtotal();
    } else {
      // Si hay 3 o menos productos, agrega el costo de envío
      return calculateSubtotal() + serviceCost;
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, calculateSubtotal, calculateTotal }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
