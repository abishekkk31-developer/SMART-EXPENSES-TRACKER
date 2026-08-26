import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    console.log(
      "API Request:",
      config.method?.toUpperCase(),
      config.baseURL + config.url
    );

    console.log(
      "JWT Token exists:",
      !!token
    );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const loginUser = async (
  loginData
) => {
  const response = await API.post(
    "/api/auth/login",
    loginData
  );

  return response.data;
};

export const registerUser = async (
  registerData
) => {
  const response = await API.post(
    "/api/auth/register",
    registerData
  );

  return response.data;
};

export default API;