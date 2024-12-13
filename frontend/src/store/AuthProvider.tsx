"use client";

import { useEffect } from "react";
import useAuthStore from "./authStore";
import LoadingUI from "@/components/LoadingUI";

interface Props {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: Props) {
  const initializeAuth = useAuthStore((state) => state.initialize);
  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (loading) {
    return <LoadingUI />;
  }

  return <>{children}</>;
}
