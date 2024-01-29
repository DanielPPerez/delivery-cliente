"use client"
import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";

const CartPage = () => {
  const [cart, setCart] = useState([
    { id: 1, title: "Sicilian", size: "Large", price: 79.9, quantity: 1 },
    // Otros elementos del carrito...
  ]);

  // Función para eliminar un producto del carrito
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Función para calcular el subtotal
  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Función para calcular el total (incluido el costo de envío)
  const calculateTotal = () => {
    return calculateSubtotal() + 50; // Agrega $50 por gastos de envío
  };

  const handleCheckout = async () => {
    // Simular un ID único de cliente (deberías generar uno en tu aplicación)
    const clientId = "uniqueClientId";

    // Simular la solicitud al servidor para enviar una notificación
    try {
      await axios.post("http://localhost:4000/api/sendNotification", {
        clientId,
        message: "New order received! Check your dashboard.",
      });
      console.log("Notification sent successfully");
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  };


  return (
    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex flex-col text-red-500 lg:flex-row">
      {/* PRODUCTS CONTAINER */}
      <div className="h-1/2 p-4 flex flex-col justify-center overflow-scroll lg:h-full lg:w-2/3 2xl:w-1/2 lg:px-20 xl:px-40">
        {cart.map((item) => (
          <div className="flex items-center justify-between mb-4" key={item.id}>
            <Image src="/temporary/p1.png" alt="" width={100} height={100} />
            <div>
              <h1 className="uppercase text-xl font-bold">{item.title}</h1>
              <span>{item.size}</span>
            </div>
            <h2 className="font-bold">${item.price.toFixed(2)}</h2>
            <span className="cursor-pointer" onClick={() => removeFromCart(item.id)}>
              X
            </span>
          </div>
        ))}
      </div>
      {/* PAYMENT CONTAINER */}
      <div className="h-1/2 p-4 bg-fuchsia-50 flex flex-col gap-4 justify-center lg:h-full lg:w-1/3 2xl:w-1/2 lg:px-20 xl:px-40 2xl:text-xl 2xl:gap-6">
        <div className="flex justify-between">
          <span>Subtotal ({cart.length} items)</span>
          <span>${calculateSubtotal().toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Service Cost</span>
          <span>$0.00</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Cost</span>
          <span className="text-green-500">FREE!</span>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between">
          <span>TOTAL(INCL. VAT)</span>
          <span className="font-bold">${calculateTotal().toFixed(2)}</span>
        </div>
        <button className="bg-red-500 text-white p-3 rounded-md w-1/2 self-end" onClick={handleCheckout}>
      CHECKOUT
    </button>
      </div>
    </div>
  );
};

export default CartPage;
