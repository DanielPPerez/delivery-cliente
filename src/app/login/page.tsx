"use client"
import { useState } from 'react';
import { useAuth } from '@/context/datacontext.js';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signin } = useAuth(); // Obtén las funciones y estados del contexto

 
  const handleLogin = async () => {
    try {
      // Verificar si ambos campos están llenos
      if (!email || !password) {
        console.log("Por favor, completa todos los campos.");
        return;
      }

      // Llamar a la función de inicio de sesión
      await signin({ email, password });

        // Redirigir al usuario según las credenciales
        if (email === 'admin@example.com' && password === 'adminPassword') {
          window.location.href = '/admin'; 
        } else {
          window.location.href = '/'; // Redirige a la página principal
        }

    } catch (error) {
      console.log("Error al iniciar sesión:", error.message);
      // Puedes manejar el error y mostrar un mensaje apropiado al usuario si es necesario
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
