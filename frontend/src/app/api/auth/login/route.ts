//api/auth/login/route.ts
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const loginResponse = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
    {
      email,
      password,
    }
  );

  if (loginResponse.data) {
    const { user, accessToken, refreshToken } = loginResponse.data;
    const response = NextResponse.json({
      success: true,
      message: "Logged in successfully",
      user,
      accessToken,
      refreshToken,
    });
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 15, // 15 minutes
    });
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return response;
  } else {
    return NextResponse.json({
      success: false,
      message: "Login failed",
    });
  }
}
