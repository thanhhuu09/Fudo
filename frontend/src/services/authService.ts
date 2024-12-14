import { User } from "@/types";
import apiClient from "./apiClient";

interface LoginResponse {
  accessToken: string;
  user: User;
}

interface RefreshResponse {
  accessToken: string;
}
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const loginAPI = async (
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

export const logoutAPI = async () => {
  try {
    await apiClient.post(`${API_URL}/auth/logout`);
  } catch (error) {
    console.log("Logout Failed", error);
    throw error;
  }
};

export const registerAPI = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const response = await apiClient.post<User>(`${API_URL}/auth/register`, {
      name,
      email,
      password,
    });
    console.log("Register Success", response.data);
    return response.data;
  } catch (error) {
    console.log("Register Failed", error);
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
