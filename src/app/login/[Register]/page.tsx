"use client"
import React, { useState } from 'react';
import { useAuth } from '@/context/datacontext.js';
import Link from 'next/link';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const { signup, isAuthenticated, user } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
      telefono,
    };

    try {
      await signup(userData);
    } catch (error) {
      setErrorMessage('Error al registrarse. Por favor, intenta nuevamente más tarde.');
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-96">
        <h1 className="text-3xl font-bold mb-4">Registrarse</h1>
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
            <label htmlFor="phone" className="block text-sm font-medium text-gray-600">
              Teléfono
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div>
            <button
              type="button"
              onClick={handleRegister}
              className="w-full bg-blue-500 text-white p-2 rounded-md"
            >
              Registrarse
            </button>
          </div>
          {user && user.email === 'admin@example.com' && user.isAdmin && (
            <div>
              <Link href="/admin">Acceder a la página del admin</Link>
            </div>
          )}
          <div>
            <p>
              ¿Ya tienes cuenta?{' '}
              <Link href="/login">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;

