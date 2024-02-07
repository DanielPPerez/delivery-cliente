"use client"
import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { useCart } from "../../context/cartcontext.js";

const CartPage = () => {
  const { cart, removeFromCart, calculateSubtotal, calculateTotal, isServiceFree } = useCart();
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (alert) {
      // Ocultar la notificación después de 5 segundos
      const timer = setTimeout(() => {
        setAlert(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleCheckout = async () => {
    try {
      const userEmail = "pizza22@gmail.com";
      const detallesVenta = cart.map((item) => ({
        title: item.title,
        quantity: item.quantity,
      }));

      // Enviar la información al servidor
      const response = await axios.post("http://localhost:4000/user/crearpedido", { userEmail, detallesVenta });

      // Realizar una solicitud para notificación de nuevos pedidos
      await axios.get("http://localhost:4000/notifications");

      // Mostrar la notificación de éxito
      setAlert({
        type: "success",
        message: `Pedido realizado con éxito. Número de pedido: ${response.data.numeroPedido}`,
      });

      // Realizar alguna acción después de realizar el pedido (redirección, limpiar carrito, etc.)
      console.log("Pedido realizado con éxito:", response.data);
    } catch (error) {
      // Mostrar la notificación de error
      setAlert({
        type: "error",
        message: "Error al realizar el pedido. Por favor, inténtalo de nuevo.",
      });

      console.error("Error al realizar el pedido:", error);
    }
  };

  // Long polling para recibir notificaciones de nuevos pedidos
  useEffect(() => {
    const checkNotifications = async () => {
      try {
        const response = await axios.get("http://localhost:4000/notifications");
        if (response.data.alert) {
          setAlert(response.data.alert);
        }
        checkNotifications(); // Realizar la próxima solicitud
      } catch (error) {
        // Manejar errores
      }
    };

    checkNotifications(); // Iniciar el long polling al montar el componente
  }, [setAlert]);

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
        {/* ALERT CONTAINER */}
{alert && (
  <div className={`mt-4 p-4 bg-${alert.type === "success" ? "green" : "red"}-200 text-${alert.type === "success" ? "green" : "red"}-700`}>
    {alert.message}
  </div>
)}
      </div>
    </div>
  );
};

export default CartPage;
