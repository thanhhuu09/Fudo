// app/api/auth/refresh/route.js
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  const oldRefreshToken = req.cookies.get("refreshToken")?.value;
  console.log("oldRefreshToken", oldRefreshToken);

  if (!oldRefreshToken) {
    return new Response(
      JSON.stringify({ success: false, message: "No refresh token" }),
      {
        status: 401,
      }
    );
  }

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      {
        refreshToken: oldRefreshToken,
      }
    );

    const { accessToken, refreshToken } = response.data;
    const nextResponse = NextResponse.json(
      {
        success: true,
        message: "Token refreshed successfully",
      },
      { status: 200 }
    );

    // set the new access token and refresh token to httpOnly cookies
    nextResponse.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 15, // 15 minutes
    });
    nextResponse.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return nextResponse;
  } catch (error) {
    console.error("Refresh token failed:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Invalid refresh token" }),
      {
        status: 401,
      }
    );
  }
}
