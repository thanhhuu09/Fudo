// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function middleware(req: NextRequest) {
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const accessToken = req.cookies.get("accessToken")?.value;

  if (!accessToken) {
    if (!refreshToken) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    try {
      // Call the refresh token endpoint to get a new access token
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
        {
          refreshToken: refreshToken,
        }
      );

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        response.data;

      // Create a new response to set the new tokens
      const nextResponse = NextResponse.next();

      // Set the new access token and refresh token to httpOnly cookies
      nextResponse.cookies.set("accessToken", newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 15, // 15 minutes
      });
      nextResponse.cookies.set("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return nextResponse;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // If access token is present, proceed with the request
  return NextResponse.next();
}

export const config = {
  matcher: ["/profile", "/settings"],
};
