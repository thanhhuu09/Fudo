// app/api/menu-items/route.ts
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json(); // Extracts JSON data from the request body
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/menu-items`,
      data as object,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 201) {
      return NextResponse.json(
        {
          success: true,
          message: "Menu item created successfully",
        },
        { status: 201 }
      );
    } else {
      console.error("Error response from NestJS:", response.data); // Logs error details
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create menu item",
        },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Error caught in Next.js API route:", error); // Logs catch-block errors
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
