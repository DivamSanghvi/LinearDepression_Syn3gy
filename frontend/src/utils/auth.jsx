import axios from "axios";

const API_URL = "http://localhost:8000/api/auth"; // Change this to your backend URL

// Login function
export const login = async (email, password) => {
  try {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    localStorage.setItem("token", res.data.token); // Store token
    return res.data;
  } catch (error) {
    console.error("Login failed:", error.response?.data?.message || error.message);
    return null;
  }
};

// Register function
export const register = async (name, email, password) => {
  try {
    const res = await axios.post(`${API_URL}/register`, { name, email, password });
    localStorage.setItem("token", res.data.token); // Store token
    return res.data;
  } catch (error) {
    console.error("Registration failed:", error.response?.data?.message || error.message);
    return null;
  }
};

// Logout function
export const logout = () => {
  localStorage.removeItem("token"); // Remove token
};
