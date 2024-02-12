"use client"
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../../context/datacontext'; // Update the path

const socket = io('http://localhost:4000', {
  withCredentials: true,
});

const ContactoUsuario: React.FC = () => {
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [mensajes, setMensajes] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]); // Changed to an array
  const [isConnected, setIsConnected] = useState(false);

  const auth = useAuth(); // Use the authentication context

  const enviarMensaje = () => {
    if (nuevoMensaje.trim() !== '') {
      const userEmail = auth.user ? auth.user.email : 'Usuario'; // Use the user's email if available
      socket.emit('chat_message', { user: userEmail, message: nuevoMensaje });
      setMensajes([...mensajes, { user: userEmail, message: nuevoMensaje }]);
      setNuevoMensaje('');
    }
  };

  useEffect(() => {
    socket.on('connect', () => setIsConnected(true));

    socket.on('chat_message', (data) => {
      setMensajes((prevMessages) => [...prevMessages, data]);
    });

    socket.on('connected_users', (data) => {
      setActiveUsers(data.users || []); // Ensure activeUsers is an array
    });

    return () => {
      socket.off('connect');
      socket.off('chat_message');
      socket.off('connected_users');
    };
  }, [mensajes]);

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold">Atencion a clientes</h2>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {/* Mostrar los mensajes */}
        {mensajes.map((mensaje, index) => (
          <div key={index} className={`mb-2 ${mensaje.isAdmin ? 'text-right' : ''}`}>
            {mensaje.isAdmin && mensaje.user === 'admin@example.com' ? (
              <span className="bg-blue-500 p-2 rounded-md inline-block max-w-2/3 text-white">
                <strong>{mensaje.user}:</strong> {mensaje.message}
              </span>
            ) : (
              <div>
                <strong>{mensaje.user}:</strong> {mensaje.message}
              </div>
            )}
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

      <div className="p-4 bg-gray-200">
        <h3>Usuarios Activos:</h3>
        <ul>
          {activeUsers && activeUsers.map((user) => (
            <li key={user}>{user}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ContactoUsuario;


