"use client"
import { useEffect, createContext, useContext, useState } from "react";
import { loginRequest, registerRequest, verifyTokenRequest } from "../api/requets.js";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");


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

        Cookies.set("token", token);
        setUser({ ...response.data.user, email: userData.email });
        setIsAuthenticated(true);
        setErrors([]);

        // Retorna información sobre el éxito del inicio de sesión y si el usuario es un administrador
        return { success: true, isAdmin };
      } else {
        setErrorMessage("Error al iniciar sesión. Por favor, verifica tus credenciales.");
        // Retorna información sobre el fallo del inicio de sesión
        return { success: false };
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      setErrorMessage("Error al procesar la solicitud. Por favor, intenta nuevamente más tarde.");
      // Retorna información sobre el fallo del inicio de sesión
      return { success: false };
    }
  };
  

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
        return;
      }

      try {
        const res = await verifyTokenRequest(cookies.token);
        console.log(res);
        if (!res.data) return setIsAuthenticated(false);
        setIsAuthenticated(true);
        setUser(res.data);
        setLoading(false);
      } catch (error) {
        setIsAuthenticated(false);
        setLoading(false);
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
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
