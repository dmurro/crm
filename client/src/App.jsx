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

function App() {
  const { isLoggedIn } = useAuth();
  const { isDarkMode, toggleTheme } = useThemeToggle();
  const navigate = useNavigate();
  const handleLoginSuccess = () => {
    navigate("/clients");
  };

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
          <Route path="/login" element={<LoginForm onSuccess={handleLoginSuccess} />} />
          <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          <Route path="/" element={<Layout />}>
            <Route path="clients" element={<Clients />} />
          </Route>
        </Routes>
      </Fragment>
    </div>
  );
}

export default App;

/*   return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">My Themed App</Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Typography variant="h1" gutterBottom>
          Welcome to My Themed App
        </Typography>
        <Card>
          <CardContent>
            <Typography variant="body1">This is a card component styled with the custom theme.</Typography>
            <Button variant="contained" color="primary">
              Primary Button
            </Button>
            <Button variant="contained" color="secondary">
              Secondary Button
            </Button>
          </CardContent>
        </Card>
      </Container>
    </div>
  ); */

/* const sendEmail = async () => {
    try {
      const response = await fetch("https://crm-three-green.vercel.app/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: "davi.murroni@gmail.com",
          subject: "Test email",
          html: "<h1>This is a test email</h1>",
        }),
      });

      if (response.ok) {
        alert("Email sent successfully");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send email");
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }; */
