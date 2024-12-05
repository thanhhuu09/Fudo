// app/api/menu-items/route.ts
import axiosInstance from "@/services/axiosInstance";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json(); // Extracts JSON data from the request body
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_API_URL}/menu-items`,
      data as object,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${req.cookies.get("accessToken")?.value}`,
        },
      }
    );
    if (response.status === 201) {
      return NextResponse.json(
        {
          success: true,
          message: "Menu item created successfully",
          data: response.data,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error caught in Next.js API route:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/menu-items`
    );
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error caught in Next.js API route:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
