import { Fragment } from "react";
import { Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import LoginForm from "./Login";
import "./App.css";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { useNavigate } from "react-router-dom";
import PageLayout from "./Layout/PageLayout";
import { Box, Container, IconButton } from "@mui/material";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import { useThemeToggle } from "./resources/ThemeToggleProvider";
import Layout from "./Pages/Layout";
import Clients from "./Clients";

function App() {
  const { isLoggedIn } = useAuth();
  const { isDarkMode, toggleTheme } = useThemeToggle();
  const navigate = useNavigate();
  const handleLoginSuccess = () => {
    navigate("/dashboard");
  };
  console.log(isLoggedIn);
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
        <IconButton onClick={toggleTheme} color="inherit">
          {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        {/* Your other components go here */}
      </Box>
      <Fragment>
        <Routes>
          <Route path="/" element={<PageLayout />} />
          <Route path="/dashboard" element={<Layout />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/login" element={<LoginForm onSuccess={handleLoginSuccess} />} />
        </Routes>
      </Fragment>
    </div>
  );
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
}

export default App;

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
