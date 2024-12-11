import { login, logout, refreshToken } from "@/services/authService";
import { fetchUserProfile } from "@/services/userServices";
import { User } from "@/types";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => void;
  logout: () => void;
  initialize: () => void;
}
const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  accessToken: null,
  loading: true,
  initialize: async () => {
    try {
      const accessToken = await refreshToken();
      console.log("Access token", accessToken);

      if (accessToken) {
        const userProfile = await fetchUserProfile(accessToken);
        set({
          user: userProfile,
          accessToken,
        });
      }
    } catch {
      set({
        user: null,
        accessToken: null,
      });
    } finally {
      set({ loading: false });
    }
  },
  login: async (email: string, password: string, rememberMe: boolean) => {
    const { accessToken, user } = await login(email, password, rememberMe);
    set({ user: user, accessToken });
  },
  logout: async () => {
    await logout();
    set({ user: null, accessToken: null });
  },
}));

export default useAuthStore;
