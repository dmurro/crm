import { createContext, useState, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(null);

  const login = async (authCredentials, onSuccess) => {
    try {
      const response = await axios.post("http://localhost:5000/api/login", authCredentials);
      const { token } = await response.data;
      localStorage.setItem("auth", JSON.stringify({ jwt: token }));
      setIsLoggedIn(true);
      setError(null);
      onSuccess();
    } catch (error) {
      setError(error.response.data.message);
      throw error;
    }
  };

  const logout = () => {
    // Add logic to handle logout
    setIsLoggedIn(false);
  };

  return <AuthContext.Provider value={{ isLoggedIn, login, logout, error }}>{children}</AuthContext.Provider>;
};
