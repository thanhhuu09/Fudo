// hooks/useAuth.ts
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  loginFailure,
  loginStart,
  loginSuccess,
  logout,
} from "@/store/slices/authSlice";
import { RootState } from "@/store";

export function useAuth() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  useEffect(() => {
    const checkAuthStatus = async () => {
      dispatch(loginStart());
      try {
        const response = await axios.get("/api/auth/status");
        dispatch(loginSuccess(response.data));
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.response &&
          error.response.status === 401
        ) {
          try {
            await axios.post("/api/auth/refresh");
            const response = await axios.get("/api/auth/status");
            dispatch(loginSuccess(response.data.user));
          } catch (error) {
            console.error("Refresh token failed:", error);
            dispatch(loginFailure());
          }
        }
      }
    };

    checkAuthStatus();
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await axios.get("/api/auth/logout");
      dispatch(logout());
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return { isAuthenticated, user, handleLogout };
}
