import axios from "axios"; // Import Axios library

const apiUrl = "https://crm-three-green.vercel.app"; // Your backend API URL

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${apiUrl}/api/login`, credentials, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status !== 200) {
      throw new Error("Invalid username or password");
    }

    const data = response.data;
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Login failed");
  }
};
