"use client"
import React, { useState } from 'react';
import { useAuth } from '@/context/datacontext.js';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signin, isAuthenticated, user } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    try {
      // Llama a tu función de autenticación (signin) y espera a que se complete
      await signin(userData);

      // Verifica si el usuario es administrador
      if (isAuthenticated && user.isAdmin) {
        // Redirige al panel de administrador
        window.location.href = '/admin';
      } else {
        // Redirige a la página principal del usuario común
        window.location.href = '/';
      }

    } catch (error) {
      setErrorMessage('Error al iniciar sesión. Por favor, intenta nuevamente más tarde.');
      console.error(error);
    }
  };
  
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-96">
        <h1 className="text-3xl font-bold mb-4">Iniciar Sesión</h1>
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div>
            <button
              type="button"
              onClick={handleLogin}
              className="w-full bg-blue-500 text-white p-2 rounded-md"
            >
              Iniciar Sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;