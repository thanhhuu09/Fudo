import {
  loginAPI,
  logoutAPI,
  refreshToken,
  registerAPI,
} from "@/services/authService";
import { fetchUserProfile } from "@/services/userServices";
import { User } from "@/types";
import { toast } from "sonner";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => void;
  logout: () => void;
  register: (name: string, email: string, password: string) => void;
  initialize: () => void;
}
const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  accessToken: null,
  loading: true,
  initialize: async () => {
    try {
      const accessToken = await refreshToken();
      if (accessToken) {
        const userProfile = await fetchUserProfile(accessToken);
        set({
          user: userProfile,
          accessToken,
          loading: false,
        });
      }
    } catch {
      set({
        user: null,
        accessToken: null,
        loading: false,
      });
    }
  },
  login: async (email: string, password: string, rememberMe: boolean) => {
    try {
      const { user, accessToken } = await loginAPI(email, password, rememberMe);
      set({ user, accessToken, loading: false });
      toast.success("Login successful");
    } catch (error) {
      console.log("Login failed", error);
      throw error;
    }
  },
  logout: async () => {
    await logoutAPI();
    set({ user: null, accessToken: null });
  },
  register: async (name: string, email: string, password: string) => {
    try {
      const user = await registerAPI(name, email, password);
      set({ user, accessToken: null });
      toast.success("Registration successful");
    } catch (error) {
      console.log("Registration failed", error);
      throw error;
    }
  },
}));

export default useAuthStore;
