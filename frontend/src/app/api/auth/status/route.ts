// api/auth/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 401 }
    );
  }
  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_TOKEN_SECRET as string
    );
    return NextResponse.json(
      {
        authenticated: true,
        user: decoded,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Access token verification failed:", error);
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 401 }
    );
  }
}
