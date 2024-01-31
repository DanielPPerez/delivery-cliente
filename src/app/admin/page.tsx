// ChatAdmin.tsx
"use client"
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000');

const ChatAdmin: React.FC = () => {
  const [nombreRepartidor, setNombreRepartidor] = useState('Admin');
  const [numeroRepartidor, setNumeroRepartidor] = useState('Admin');
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [mensajes, setMensajes] = useState([]);

  const enviarMensaje = () => {
    if (nuevoMensaje.trim() !== '') {
      console.log(`Enviando mensaje: ${nuevoMensaje}`);
      const selectUser = 'usuario';
      socket.emit('sendMessagesPrivate', { selectUser, message: nuevoMensaje });
      setMensajes([...mensajes, { user: 'Admin', message: nuevoMensaje }]);
      setNuevoMensaje('');
    }
  };

  useEffect(() => {
    socket.on('sendMessage', ({ user, message }) => {
      console.log(`Mensaje recibido de ${user}: ${message}`);
      setMensajes([...mensajes, { user, message }]);
    });

    socket.on('activeSessions', (users) => {
      console.log('Lista de usuarios activos:', users);
    });

    return () => {
      socket.off('sendMessage');
      socket.off('activeSessions');
    };
  }, [mensajes]);

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold">{nombreRepartidor}</h2>
        <p>{numeroRepartidor}</p>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {mensajes.map((mensaje, index) => (
          <div key={index} className="mb-2">
            <strong>{mensaje.user}:</strong> {mensaje.message}
          </div>
        ))}
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

export default ChatAdmin;
