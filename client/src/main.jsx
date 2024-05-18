import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./auth/AuthContext";
import "@fontsource/merriweather";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeToggleProvider } from "./resources/ThemeToggleProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <ThemeToggleProvider>
        <AuthProvider>
          <CssBaseline />
          <App />
        </AuthProvider>
      </ThemeToggleProvider>
    </Router>
  </React.StrictMode>
);
