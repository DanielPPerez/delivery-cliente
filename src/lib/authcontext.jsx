// authcontext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import {registerRequest, loginRequest } from "@/api/request.js";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const signup = async (user, redirectFunction) => {
    try {
      const res = await registerRequest(user, Cookies.get('token'));
      if (res.status === 200) {
        setUser(res.data);
        setIsAuthenticated(true);
        if (redirectFunction) redirectFunction();
      }
    } catch (error) {
      console.log(error.response.data);
      setErrors(error.response.data.message);
    }
  };

  const signin = async (user, redirectFunction) => {
    try {
      const res = await loginRequest(user, Cookies.get('token'));
      const token = res.data.token;
      const isAdmin = res.data.isAdmin;

      console.log("Token de sesión:", token);

      Cookies.set("token", token);

      setUser({ ...res.data.user, email: user.email });
      setIsAuthenticated(true);

      // Redirigir según el tipo de usuario
      if (isAdmin) {
        if (redirectFunction) redirectFunction('/admin');
      } else {
        if (redirectFunction) redirectFunction('/');
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error.response.data.message);
      setErrors(error.response.data.message);
    }
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
    setIsAuthenticated(false);
  };

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
