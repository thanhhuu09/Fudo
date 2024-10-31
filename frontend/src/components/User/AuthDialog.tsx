"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FcGoogle } from "react-icons/fc";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAppDispatch } from "@/store";
import {
  loginFailure,
  loginStart,
  loginSuccess,
} from "@/store/slices/authSlice";

const AuthDialog = () => {
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      dispatch(loginStart());
      if (isLogin) {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
          const data = await res.json();
          dispatch(loginSuccess(data.user));
          setOpen(false);
          toast.success("Logged in successfully");
        } else {
          dispatch(loginFailure());
          setError("Invalid email or password. Please try again.");
        }
      } else {
        // Implement register logic here
        console.log("Registering");
      }
    } catch (error) {
      dispatch(loginFailure());
      console.error("Login failed:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  const handleGoogleAuth = () => {
    // Implement Google authentication logic here
    console.log("Authenticating with Google");
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setEmail("");
    setPassword("");
    setName("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          className="w-full rounded-3xl bg-[#FFCB45] hover:bg-[#FFAC4B] text-black shadow-md"
        >
          <LogIn className="mr-2 h-4 w-4" />
          <span className="font-bold">Log in</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isLogin ? "Login" : "Register"}
          </DialogTitle>
          <DialogDescription>
            {isLogin
              ? "Enter your credentials to access your account"
              : "Create a new account to get started"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleAuth}
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            {isLogin ? "Login with Google" : "Register with Google"}
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="space-y-4"
          >
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={isShowPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setIsShowPassword(!isShowPassword)}
                >
                  {isShowPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </Button>
              </div>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full">
              {isLogin ? "Login" : "Register"}
            </Button>
          </form>
          <div className="text-center text-sm">
            <span className="text-gray-600">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
            </span>
            <Button
              variant="link"
              className="p-0 text-[#FF9F29]"
              onClick={toggleAuthMode}
            >
              {isLogin ? "Register" : "Login"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
