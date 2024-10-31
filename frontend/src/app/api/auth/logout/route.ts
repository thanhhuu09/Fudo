import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });
  response.cookies.set("accessToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  response.cookies.set("refreshToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  return response;
}
