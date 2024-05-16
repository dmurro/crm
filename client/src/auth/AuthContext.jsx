import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(null);

  const login = async (authCredentials, onSuccess) => {
    try {
      const response = await fetch("https://crm-three-green.vercel.app/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(authCredentials),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      const { token } = await response.json();
      localStorage.setItem("auth", JSON.stringify({ jwt: token }));
      setIsLoggedIn(true);
      setError(null);
      onSuccess();
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const logout = () => {
    // Add logic to handle logout
    setIsLoggedIn(false);
  };

  return <AuthContext.Provider value={{ isLoggedIn, login, logout, error }}>{children}</AuthContext.Provider>;
};
