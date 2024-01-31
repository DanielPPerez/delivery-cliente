"use client";
import React, { useState } from 'react';
import axios from 'axios'; // Importar Axios

const FormularioSubirProducto: React.FC = () => {
  const [nuevoProducto, setNuevoProducto] = useState({
    title: '',
    desc: '',
    price: 0,
    quantity: 0,
    img: null,
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNuevoProducto((prev) => ({ ...prev, img: file }));
  };

  const enviarProducto = async () => {
    try {
      const formData = new FormData();
      formData.append('title', nuevoProducto.title);
      formData.append('desc', nuevoProducto.desc);
      formData.append('price', nuevoProducto.price.toString());
      formData.append('quantity', nuevoProducto.quantity.toString());
      formData.append('img', nuevoProducto.img);

      const response = await axios.post('http://localhost:4000/user/crearproducto', formData);

      if (response.status === 201) {
        // Handle success
        console.log('Producto subido exitosamente');
      } else {
        // Handle error with more descriptive message
        console.error(`Error al subir el producto. Servidor respondió con estado ${response.status}`);
      }
    } catch (error) {
      // Handle network error or any other error during the request
      console.error(`Error al subir el producto. ${error.message}`);
    }
  };

  return (
    <div className="p-4 bg-gray-200">
      <h2 className="text-xl font-bold mb-2">Subir Nuevo Producto</h2>

      {/* Título del producto */}
      <div className="mb-2">
        <strong>Título:</strong> Ingresa el título del producto.
      </div>
      <input
        type="text"
        placeholder="Título"
        value={nuevoProducto.title}
        onChange={(e) => setNuevoProducto((prev) => ({ ...prev, title: e.target.value }))}
        className="w-full p-2 border border-gray-300 rounded-md mb-2"
      />

      {/* Descripción del producto */}
      <div className="mb-2">
        <strong>Descripción:</strong> Ingresa la descripción del producto.
      </div>
      <textarea
        placeholder="Descripción"
        value={nuevoProducto.desc}
        onChange={(e) => setNuevoProducto((prev) => ({ ...prev, desc: e.target.value }))}
        className="w-full p-2 border border-gray-300 rounded-md mb-2"
      />

      {/* Precio del producto */}
      <div className="mb-2">
        <strong>Precio:</strong> Ingresa el precio del producto.
      </div>
      <input
        type="number"
        placeholder="Precio"
        value={nuevoProducto.price}
        onChange={(e) => setNuevoProducto((prev) => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
        className="w-full p-2 border border-gray-300 rounded-md mb-2"
      />

      {/* Cantidad del producto */}
      <div className="mb-2">
        <strong>Cantidad:</strong> Ingresa la cantidad disponible del producto.
      </div>
      <input
        type="number"
        placeholder="Cantidad"
        value={nuevoProducto.quantity}
        onChange={(e) => setNuevoProducto((prev) => ({ ...prev, quantity: parseInt(e.target.value, 10) || 0 }))}
        className="w-full p-2 border border-gray-300 rounded-md mb-2"
      />

      {/* Subir imagen del producto */}
      <div className="mb-2">
        <strong>Imagen:</strong> Selecciona una imagen para el producto.
      </div>
      <input
        type="file"
        onChange={handleFileChange}
        className="w-full p-2 border border-gray-300 rounded-md mb-2"
      />

      {/* Botón para enviar el producto */}
      <button onClick={enviarProducto} className="bg-green-500 text-white p-2 rounded-md">
        Subir Producto
      </button>
    </div>
  );
};


export default FormularioSubirProducto;
