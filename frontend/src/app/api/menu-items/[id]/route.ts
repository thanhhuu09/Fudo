import axios from "axios";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json(); // Parse the JSON body data
    const { id } = params;

    // Send the PUT request to your NestJS backend
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/menu-items/${id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      return NextResponse.json(
        {
          success: true,
          message: "Menu item updated successfully",
          data: response.data,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update menu item",
        },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Error in Next.js API route PUT:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Send the DELETE request to your NestJS backend
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/menu-items/${id}`
    );

    if (response.status === 200) {
      return NextResponse.json(
        {
          success: true,
          message: "Menu item deleted successfully",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error in Next.js API route DELETE:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
