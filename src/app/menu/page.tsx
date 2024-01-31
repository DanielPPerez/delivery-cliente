"use client"
import Link from "next/link";
import React, { useState, useEffect } from "react";

const MenuPage = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Realiza la llamada a tu backend para obtener todos los productos
    // Sustituye 'http://localhost:4000/obtener' con la URL real de tu endpoint
    fetch("http://localhost:4000/user/obtener")
      .then((response) => response.json())
      .then((data) => setProductos(data))
      .catch((error) => console.error("Error al obtener productos:", error));
  }, []);

  return (
    <div className="flex flex-wrap text-red-500">
      {productos.map((producto) => (
        <div key={producto.id} className="w-full h-[60vh] border-r-2 border-b-2 border-red-500 sm:w-1/2 lg:w-1/3 p-4 flex flex-col justify-between group odd:bg-fuchsia-50">
          {/* IMAGE CONTAINER */}
          {producto.img && (
            <div className="relative h-[80%]">
              <img src={producto.img} alt="" className="object-contain" />
            </div>
          )}
          {/* TEXT CONTAINER */}
          <div className="flex items-center justify-between font-bold">
            <h1 className="text-2xl uppercase p-2">{producto.title}</h1>
            <h2 className="text-xl">${producto.price}</h2>
            <button className="uppercase bg-red-500 text-white p-2 rounded-md">Add to Cart</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuPage;
