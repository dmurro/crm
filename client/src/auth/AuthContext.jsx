import { createContext, useState, useContext, useEffect } from "react";
import { useLogin } from "../services/queries";
import apiClient from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const loginMutation = useLogin();

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const authData = localStorage.getItem("auth");
      if (authData) {
        console.log(authData)
        try {
          const { jwt } = JSON.parse(authData);
          if (jwt) {
            // Validate token by making a test request
            try {
              await apiClient.get("/clients");
              setIsLoggedIn(true);
            } catch (error) {
              // Token is invalid, clear it
              localStorage.removeItem("auth");
              setIsLoggedIn(false);
            }
          } else {
            setIsLoggedIn(false);
          }
        } catch (error) {
          localStorage.removeItem("auth");
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (authCredentials, onSuccess) => {
    const result = await loginMutation.mutateAsync(authCredentials);
    console.log(authCredentials)
    setIsLoggedIn(true);
    onSuccess();
    return result;
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        error: loginMutation.error?.response?.data?.message || loginMutation.error?.message,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
