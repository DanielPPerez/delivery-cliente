"use client"
import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { useCart } from "../../context/cartcontext.js";
import { useAuth } from "@/context/datacontext.js";

const CartPage = () => {
  const { cart, removeFromCart, calculateSubtotal, calculateTotal, isServiceFree } = useCart();
  const { userToken, user } = useAuth();
  const [alert, setAlert] = useState(null);
  const [newOrderNotification, setNewOrderNotification] = useState(null);

  useEffect(() => {
    // Mostrar la notificación de nuevo pedido
    if (newOrderNotification) {
      // Verificar si la notificación tiene el formato esperado
      if (newOrderNotification.numeroPedido) {
        setAlert({
          type: "success",
          message: `Nuevo pedido disponible. Número de pedido: ${newOrderNotification.numeroPedido}`,
        });
      } else {
        // Manejar el caso en el que la estructura de la notificación no es la esperada
        console.error('Estructura de notificación no válida:', newOrderNotification);
        setAlert({
          type: "error",
          message: "Error en la notificación de nuevos pedidos. Inténtalo de nuevo.",
        });
      }
  
      // Limpiar la notificación de nuevo pedido después de mostrarla
      setNewOrderNotification(null);
    }
  }, [newOrderNotification]);

  const closeNotification = () => {
    // Cerrar manualmente la notificación
    setAlert(null);
  };

  const handleCheckout = async () => {
    try {
      // Verificar si el usuario está autenticado
      if (!userToken) {
        setAlert({
          type: "error",
          message: "Debes iniciar sesión para realizar un pedido.",
        });
        return;
      }

      const detallesVenta = cart.map((item) => ({
        name: item.title,
        quantity: item.quantity,
      }));

      const response = await axios.post("http://localhost:4000/user/crearpedido", {
        userToken,
        detallesVenta,
        userEmail: user.email,
      });

      const notificationResponse = await axios.get("http://localhost:4000/notifications/wait");

      if (notificationResponse.data && notificationResponse.data.numeroPedido) {
        setNewOrderNotification(notificationResponse.data);
      } else {
        console.error('Estructura de notificación no válida:', notificationResponse.data);
        setAlert({
          type: "error",
          message: "Error al obtener la notificación de nuevos pedidos. Inténtalo de nuevo.",
        });
      }

     // Mostrar la notificación de éxito
     setAlert({
      type: "success",
      message: `Pedido realizado con éxito. Número de pedido: ${response.data.numeroPedido}`,
    });

    console.log("Pedido realizado con éxito:", response.data);
  } catch (error) {
    setAlert({
      type: "error",
      message: "Error al realizar el pedido. Por favor, inténtalo de nuevo.",
    });

    console.error("Error al realizar el pedido:", error);
  }
};
  return (
    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex flex-col text-red-500 lg:flex-row">
      {/* PRODUCTS CONTAINER */}
      <div className="h-1/2 p-4 flex flex-col justify-center overflow-scroll lg:h-full lg:w-2/3 2xl:w-1/2 lg:px-4 xl:px-8">
        {cart.map((item, index) => (
          <div className="flex items-center justify-between mb-4" key={index}>
            {item.img && (
              <div className="relative h-[80%] mr-4">
                <Image src={`data:image/*;base64,${item.img}`} alt="" width={500} height={500} />
              </div>
            )}
            <div>
              <h1 className="uppercase text-xl font-bold">{item.title}</h1>
              <span>{item.size}</span>
              <span>{` x${item.quantity}`}</span>
            </div>
            <h2 className="font-bold">${(item.price * item.quantity).toFixed(2)}</h2>
            <span className="cursor-pointer" onClick={() => removeFromCart(item._id)}>
              X
            </span>
          </div>
        ))}
      </div>
      {/* PAYMENT CONTAINER */}
      <div className="h-1/2 p-4 bg-fuchsia-50 flex flex-col gap-4 justify-center lg:h-full lg:w-1/3 2xl:w-1/2 lg:px-4 xl:px-8 2xl:text-xl 2xl:gap-6">
        <div className="flex justify-between">
          <span>Subtotal ({cart.length} items)</span>
          <span>${calculateSubtotal().toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Service Cost</span>
          {/* Muestra el costo del servicio según el estado de isServiceFree */}
          <span>${isServiceFree ? "FREE!" : "50.00"}</span>
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
       {/* NOTIFICATION CONTAINER */}
    {alert && (
      <div className={`fixed bottom-4 left-4 right-4 bg-${alert.type}-200 text-${alert.type}-800 p-2 rounded-md`}>
        <div className="flex justify-between items-center">
          <span>{alert.message}</span>
          <button onClick={closeNotification} className="text-sm font-bold focus:outline-none">
            X
          </button>
        </div>
      </div>
    )}
  </div>
  );
};

export default CartPage;