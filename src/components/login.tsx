"use client"
import React, { useState } from 'react';
import { useAuth } from '@/context/datacontext.js';
import Link from 'next/link';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signin, isAuthenticated, user } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    try {
      await signin(userData);
    } catch (error) {
      if (error.response && error.response.data) {
        // Si la respuesta contiene datos, asumimos que es un error personalizado del servidor
        setErrorMessage(error.response.data.message);
      } else {
        // De lo contrario, mostramos un mensaje genérico
        setErrorMessage('Error al iniciar sesión. Por favor, intenta nuevamente más tarde.');
      }

      // Mostrar el mensaje de error en la alerta
      setShowAlert(true);

      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-96">
        <h1 className="text-3xl font-bold mb-4">Iniciar Sesión</h1>
        {showAlert && (
          <div className="bg-red-500 text-white p-2 mb-4 rounded-md">
            {errorMessage}
          </div>
        )}
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
          {user && user.email === 'admin@example.com' && user.isAdmin && (
            <div>
              <Link href="/admin">
               Acceder a la página del admin
              </Link>
            </div>
          )}
          <div>
            <p>
              ¿No tienes cuenta?{' '}
              <Link href="/register">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

