const apiUrl = "http://localhost:5000"; // Your backend API URL

export const login = async (credentials) => {
  try {
    const response = await fetch(`${apiUrl}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      throw new Error("Invalid username or password");
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Login failed");
  }
};
