"use client";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LoginSuccess = () => {
  const router = useRouter();
  const { loginWithGoogle } = useAuthStore();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const userString = urlParams.get("user");
      console.log("Token", token);
      console.log("User", userString);

      if (token && userString) {
        // Decode user string and parse it to JSON
        const user = JSON.parse(decodeURIComponent(userString as string));
        loginWithGoogle(token, user);
        router.push("/");
        console.log("Login with Google successful", user);
      } else {
        console.log("Login with Google failed");
        router.push("/");
      }
    }
  }, []);

  return <div>Đang đăng nhập...</div>;
};

export default LoginSuccess;
