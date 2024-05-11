import { Fragment } from "react";
import { Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import LoginForm from "./Login";
import Clients from "./Clients";
import "./App.css";
import theme from "./resources/themes";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { useNavigate } from "react-router-dom";
import PrivateRoute from "./auth/PrivateRoute";
import Navigation from "./Navigation";

function App() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const handleLoginSuccess = () => {
    navigate("/clients");
  };
  console.log(isLoggedIn);
  return (
    <ConfigProvider theme={theme}>
      <Navigation />
      <AuthProvider>
        <Fragment>
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Clients />
                </PrivateRoute>
              }
            />
            <Route
              path="/clients"
              element={
                <PrivateRoute>
                  <Clients />
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<LoginForm onSuccess={handleLoginSuccess} />} />
          </Routes>
        </Fragment>
      </AuthProvider>
    </ConfigProvider>
  );
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
