import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ==========================================
// LOGIN
// ==========================================

export const loginUser = async (loginData) => {
  const response = await API.post(
    "/auth/login",
    loginData
  );

  return response.data;
};

// ==========================================
// REGISTER
// ==========================================

export const registerUser = async (registerData) => {
  const response = await API.post(
    "/auth/register",
    registerData
  );

  return response.data;
};

export default API;