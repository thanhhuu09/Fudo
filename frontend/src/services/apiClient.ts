import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3001/api", // Backend URL
  withCredentials: true, // if you want to send or receive cookies from the API
});

export default apiClient;

// How to use the apiClient
// import apiClient from "@/services/apiClient";
// post request: apiClient.post("/auth/login", { email, password });
