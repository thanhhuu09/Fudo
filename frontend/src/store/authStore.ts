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
  loginWithGoogle: (token: string, user: User) => void;
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
        console.log("userProfile", userProfile);

        set({
          user: userProfile,
          accessToken,
          loading: false,
        });
      } else {
        set({
          loading: false,
          accessToken: null,
          user: null,
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
  loginWithGoogle: async (token: string, user: User) => {
    set({ user, accessToken: token });
    toast.success("Login with Google successful");
  },
  login: async (email: string, password: string, rememberMe: boolean) => {
    set({ loading: true });
    try {
      const { user, accessToken } = await loginAPI(email, password, rememberMe);
      set({ user, accessToken, loading: false });
      toast.success("Login successful");
    } catch (error) {
      console.log("Login failed", error);
      throw error;
    } finally {
      set({ loading: false });
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
      throw error;
    }
  },
}));

export default useAuthStore;
