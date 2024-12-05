import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import jwt from "jsonwebtoken";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Bỏ qua middleware nếu đang ở trang login
  if (pathname.startsWith("/dashboard/login")) {
    return NextResponse.next();
  }

  const refreshToken = req.cookies.get("refreshToken")?.value;
  const accessToken = req.cookies.get("accessToken")?.value;

  try {
    const token =
      accessToken || (await handleMissingAccessToken(refreshToken, req));

    const decodedToken = jwt.decode(token);

    if (req.nextUrl.pathname.startsWith("/dashboard")) {
      const response = checkAdminAccess(decodedToken, req);
      if (response) return response;
    }

    return NextResponse.next();
  } catch (error) {
    if (error instanceof Error) {
      console.error("Middleware error:", error.message);
    } else {
      console.error("Middleware error:", error);
    }
    return NextResponse.redirect(new URL("/dashboard/login", req.url));
  }
}

// Xử lý trường hợp không có accessToken
async function handleMissingAccessToken(
  refreshToken: string | undefined
): Promise<string> {
  if (!refreshToken) {
    throw new Error("No tokens available, redirecting to login");
  }

  const tokens = await refreshTokens(refreshToken);
  return setTokensToCookies(tokens);
}

// Gửi request lên API để refresh token
async function refreshTokens(refreshToken: string) {
  try {
    const response = await axios.post(`${API_URL}/auth/refresh`, {
      refreshToken,
    });
    if (!response.data?.accessToken || !response.data?.refreshToken) {
      throw new Error("Invalid token data from refresh API");
    }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Failed to refresh tokens:", error.message);
    } else {
      console.error("Failed to refresh tokens:", error);
    }
    throw new Error("Failed to refresh tokens, redirecting to login");
  }
}

// Lưu tokens vào cookies và trả về accessToken
function setTokensToCookies(tokens: {
  accessToken: string;
  refreshToken: string;
}) {
  const nextResponse = NextResponse.next();

  nextResponse.cookies.set("accessToken", tokens.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 15, // 15 phút
  });

  nextResponse.cookies.set("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 ngày
  });

  return tokens.accessToken;
}

// Kiểm tra quyền truy cập của admin và redirect nếu không có quyền
function checkAdminAccess(decodedToken: any, req: NextRequest) {
  if (!decodedToken || decodedToken.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard/login", req.url));
  }
  return null;
}

// Path: frontend/src/middleware.ts
export const config = {
  matcher: ["/profile", "/settings", "/dashboard/:path*"],
};
