import { Fragment } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Box, IconButton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "./auth/AuthContext";
import { useThemeToggle } from "./resources/ThemeToggleProvider";
import LoginForm from "./Login";
import Layout from "./Pages/Layout";
import Clients from "./Clients";
import Models from "./Pages/Models/Models";
import TemplateConfigs from "./Pages/TemplateConfigs";
import Campaign from "./Pages/Campaign";
import Settings from "./Pages/Settings/Settings";
import PrivateRoute from "./auth/PrivateRoute";
import Spinner from "./components/Spinner";

function App() {
  const { isLoggedIn, isLoading } = useAuth();
  const { isDarkMode, toggleTheme } = useThemeToggle();
  const navigate = useNavigate();
  const handleLoginSuccess = () => {
    navigate("/clients");
  };

  if (isLoading) {
    return <Spinner fullScreen message="Loading..." />;
  }

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          padding: 2,
        }}
      >
        {!isLoggedIn && (
          <IconButton onClick={toggleTheme} color="inherit" style={{ marginRight: "2rem" }}>
            <FontAwesomeIcon color={isDarkMode ? "#FFDC2E" : "#23232d"} icon={isDarkMode ? faSun : faMoon} />
          </IconButton>
        )}
      </Box>
      <Fragment>
        <Routes>
          <Route path="/login" element={isLoggedIn ? <Navigate to="/clients" /> : <LoginForm onSuccess={handleLoginSuccess} />} />
          <Route path="/" element={isLoggedIn ? <Navigate to="/clients" /> : <Navigate to="/login" />} />
          <Route
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path="clients" element={<Clients />} />
            <Route path="marketing/models" element={<Models />} />
            <Route path="marketing/template-configs" element={<TemplateConfigs />} />
            <Route path="marketing/campaigns" element={<Campaign />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Fragment>
    </div>
  );
}

export default App;
