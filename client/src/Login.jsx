import { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useAuth } from "./auth/AuthContext";

const LoginForm = ({ onSuccess }) => {
  const { login } = useAuth();
  const [error, setError] = useState("");

  const handleLogin = async (authCredentials) => {
    try {
      const response = await fetch("your_login_endpoint", {
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
      const userData = await response.json();
      await login(userData, onSuccess);
      message.success("Login successful");
    } catch (error) {
      setError(error.message);
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
