"use client"
import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const socket = io('http://localhost:4000'); 

const Contacto: React.FC = () => {
  const [nombreRepartidor, setNombreRepartidor] = useState('Nombre del Repartidor');
  const [numeroRepartidor, setNumeroRepartidor] = useState('123456789');
  const [mensajes, setMensajes] = useState<{ id: string; mensaje: string }[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const enviarMensaje = () => {
    if (nuevoMensaje.trim() !== '') {
      console.log(`Enviando mensaje: ${nuevoMensaje}`);
      socket.emit('mensaje', nuevoMensaje);
      setNuevoMensaje('');
    }
  };

  useEffect(() => {
    console.log('Conectando al servidor...');
  
    socket.on('connect', () => {
      console.log(`Conectado al servidor: ${socket.id}`);
    });
  
    // Escucha el evento 'mensaje' y muestra el mensaje en el div de mensajes
    socket.on('mensaje', (data) => {
      console.log(`Mensaje recibido de ${data.id}: ${data.mensaje}`);
      setMensajes((prevMensajes) => [...prevMensajes, data]);
      scrollToBottom();
    });
  
    return () => {
      socket.off('mensaje');
      console.log('Desconectado del servidor');
    };
  }, []);
  

  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold">{nombreRepartidor}</h2>
        <p>{numeroRepartidor}</p>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
  {mensajes.map((mensaje, index) => (
    <div
      key={index}
      className={`${
        mensaje.id === socket.id ? 'self-end' : 'self-start'
      } bg-blue-500 text-white p-2 rounded-md mb-2 max-w-2/3`}
    >
      {mensaje.mensaje}
    </div>
  ))}
  <div ref={messagesEndRef} />
</div>


      <div className="p-4 bg-gray-200">
        <input
          type="text"
          value={nuevoMensaje}
          onChange={(e) => setNuevoMensaje(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <button onClick={enviarMensaje} className="mt-2 bg-blue-500 text-white p-2 rounded-md">
          Enviar
        </button>
      </div>
    </div>
  );
};

export default Contacto; 
