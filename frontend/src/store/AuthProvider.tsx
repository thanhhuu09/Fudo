"use client"; // This file explicitly enables client-side logic

import { useEffect } from "react";
import useAuthStore from "./authStore";

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
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
