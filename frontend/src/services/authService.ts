import { User } from "@/types";
import axios from "axios";
import apiClient from "./apiClient";

interface LoginResponse {
  accessToken: string;
  user: User;
}

interface RefreshResponse {
  accessToken: string;
}
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const login = async (
  email: string,
  password: string,
  rememberMe: boolean
) => {
  try {
    const response = await apiClient.post<LoginResponse>(
      `${API_URL}/auth/login`,
      {
        email,
        password,
        rememberMe,
      }
    );
    return response.data;
  } catch (error) {
    console.log("Login Failed", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await apiClient.post(`${API_URL}/auth/logout`);
  } catch (error) {
    console.log("Logout Failed", error);
    throw error;
  }
};

export const refreshToken = async () => {
  try {
    const response = await apiClient.post<RefreshResponse>(
      `${API_URL}/auth/refresh-token`
    );
    const { accessToken } = response.data;
    return accessToken;
  } catch (error) {
    console.log("Refresh Failed", error);
    throw error;
  }
};
