import { useState } from "react";
import { useAuth } from "./auth/AuthContext";
import { Button, TextField, Typography, Container, Box, Alert } from "@mui/material";
import logo from "./assets/logo.png"; // Adjust the path to your logo

const LoginForm = ({ onSuccess }) => {
  const { login } = useAuth();
  const [error, setError] = useState("");

  const handleLogin = async (authCredentials) => {
    try {
      await login(authCredentials, onSuccess);
      setError("");
    } catch (error) {
      setError(error?.response?.data?.message || error?.message || "Login failed");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const authCredentials = {
      username: data.get("username"),
      password: data.get("password"),
    };
    handleLogin(authCredentials);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img src={logo || ""} alt="Logo" style={{ width: "100%", maxWidth: "200px", marginBottom: "20px", borderRadius: "100%" }} />
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField margin="normal" required fullWidth id="username" label="Username" name="username" autoComplete="username" autoFocus />
          <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" />
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
          {error && <Alert severity="error">{error}</Alert>}
        </Box>
      </Box>
      <Typography
        variant="caption"
        sx={{
          position: "fixed",
          bottom: 8,
          right: 12,
          color: "text.secondary",
          opacity: 0.6,
          fontSize: "0.75rem",
          userSelect: "none",
        }}
      >
        v1.1.2
      </Typography>
    </Container>
  );
};

export default LoginForm;
