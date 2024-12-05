// services/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    console.log("Request:", config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log("Response:", response.config.url);
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);

    return Promise.reject(error);
  }
);

export default axiosInstance;
