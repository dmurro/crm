import { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useAuth } from "./auth/AuthContext";

const LoginForm = ({ onSuccess }) => {
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [clients, setClients] = useState([]);

  useEffect(() => {
    async function fetchClients() {
      try {
        const response = await fetch("https://crm-three-green.vercel.app/api/clients");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const clientsData = await response.json();
        setClients(clientsData);
        console.log(clientsData);
      } catch (error) {
        console.error("Error fetching clients from backend:", error);
      }
    }

    fetchClients();
  }, []);

  const handleLogin = async (authCredentials) => {
    try {
      await login(authCredentials, onSuccess);
      message.success("Login successful");
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <Form onFinish={handleLogin} initialValues={{ username: "", password: "" }}>
      <Form.Item name="username" rules={[{ required: true, message: "Please input your username!" }]}>
        <Input placeholder="Username" />
      </Form.Item>
      <Form.Item name="password" rules={[{ required: true, message: "Please input your password!" }]}>
        <Input.Password placeholder="Password" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Login
        </Button>
      </Form.Item>
      {error && <div className="error">{error}</div>}
    </Form>
  );
};

export default LoginForm;
