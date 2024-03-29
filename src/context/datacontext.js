"use client"
import { useEffect, createContext, useContext, useState } from 'react';
import { loginRequest, registerRequest, verifyTokenRequest } from '../api/requets.js';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [redirectPath, setRedirectPath] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [userToken, setUserToken] = useState(null);



  // Limpiar errores después de 5 segundos
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  const signup = async (user) => {
    try {
      const res = await registerRequest(user);
      if (res.status === 200) {
        setUser(res.data);
        setIsAuthenticated(true);
        // Puedes agregar una lógica de redirección aquí si es necesario
      }
    } catch (error) {
      console.log(error.response.data);
      setErrors(error.response.data.message);
    }
  };

  const signin = async (userData) => {
    try {
      const response = await loginRequest(userData);
  
      if (response.data.token) {
        const token = response.data.token;
        const isAdmin = response.data.isAdmin;
        
  
        // Almacenar el token en las cookies
        Cookies.set("token", token);
  
        // Configurar el estado del usuario autenticado y la propiedad isAdmin
        setUser({ ...response.data.user, email: userData.email, isAdmin });
        setUserToken(token);
        

        setIsAuthenticated(true);
        setErrors([]);
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      setErrorMessage("Error al procesar la solicitud. Por favor, intenta nuevamente más tarde.");
      // Retorna información sobre el fallo del inicio de sesión
      return { success: false };
    }
  };
  

 
  useEffect(() => {
    if (redirectPath) {
      window.location.href = redirectPath;
    }
  }, [redirectPath]);

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const checkLogin = async () => {
      const cookies = Cookies.get();
      if (!cookies.token) {
        setIsAuthenticated(false);
        setLoading(false);
        setUserLoaded(true); // Marca la información del usuario como cargada incluso si no hay token
        return;
      }

      try {
        const res = await verifyTokenRequest(cookies.token);
        console.log(res);
        if (!res.data) return setIsAuthenticated(false);
        setIsAuthenticated(true);
        setUser(res.data);
        setUserEmail(res.data.email);
        setLoading(false);
        setUserLoaded(true); // Marca la información del usuario como cargada
      } catch (error) {
        setIsAuthenticated(false);
        setLoading(false);
        setUserLoaded(true); // Marca la información del usuario como cargada
      }
    };
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signup,
        signin,
        logout,
        isAuthenticated,
        errors,
        userToken,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;