import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./auth/AuthContext";
import "@fontsource/merriweather";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeToggleProvider } from "./resources/ThemeToggleProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router>
        <ThemeToggleProvider>
          <AuthProvider>
            <CssBaseline />
            <App />
          </AuthProvider>
        </ThemeToggleProvider>
      </Router>
    </QueryClientProvider>
  </React.StrictMode>
);
