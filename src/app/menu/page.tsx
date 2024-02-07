"use client"
import React, { useState, useEffect } from "react";
import { useCart } from "../../context/cartcontext.js";

const MenuPage = () => {
  const [productos, setProductos] = useState([]);
  const [productosAgotados, setProductosAgotados] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    // Obtener productos al cargar la página
    fetchProductos();

    // Realizar solicitudes periódicas para verificar la disponibilidad
    const intervalId = setInterval(() => {
      fetchProductos();
      fetchProductosAgotados();
    }, 5000);

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(intervalId);
  }, []);

  const fetchProductos = () => {
    fetch("http://localhost:4000/user/obtener")
      .then((response) => response.json())
      .then((data) => setProductos(data))
      .catch((error) => console.error("Error al obtener productos:", error));
  };

  const fetchProductosAgotados = () => {
    fetch("http://localhost:4000/shortpolling/checkAvailability")
      .then((response) => response.json())
      .then((data) => setProductosAgotados(data.productosAgotados))
      .catch((error) => console.error("Error al verificar disponibilidad:", error));
  };

  return (
    <div className="flex flex-wrap text-red-500">
      {productos.map((producto) => (
        <div
          key={producto._id}
          className={`w-full h-[60vh] border-r-2 border-b-2 border-red-500 sm:w-1/2 lg:w-1/3 p-4 flex flex-col justify-between group odd:bg-fuchsia-50 ${
            productosAgotados.includes(producto.title) ? "bg-gray-300" : ""
          }`}
        >
          {/* IMAGE CONTAINER */}
          {producto.img && (
            <div className="relative h-[80%]">
              <img src={`data:image/*;base64,${producto.img}`} alt="" className="object-contain w-full h-full" />
            </div>
          )}
          {/* TEXT CONTAINER */}
          <div className="flex items-center justify-between font-bold">
            <h1 className="text-2xl uppercase p-2">{producto.title}</h1>
            {productosAgotados.includes(producto.title) ? (
              <p className="text-red-500 font-bold">Agotado</p>
            ) : (
              <>
                <h2 className="text-xl">${producto.price}</h2>
                <button
                  className={`uppercase bg-red-500 text-white p-2 rounded-md ${productosAgotados.includes(producto.title) ? 'cursor-not-allowed' : ''}`}
                  onClick={() => !productosAgotados.includes(producto.title) && addToCart(producto)}
                  disabled={productosAgotados.includes(producto.title)}
                >
                  Add to Cart
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuPage;