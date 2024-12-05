export const config = {
  runtime: "nodejs", // Use Node.js runtime instead of Edge runtime
};

import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/cart`,
      {
        headers: {
          Authorization: `Bearer ${request.cookies.get("accessToken")?.value}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }
    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while updating the cart" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: { userId: string };
  }
) {
  const { userId } = params;

  try {
    const body = await request.json();
    const { menuItemId, quantity } = body;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/cart`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${request.cookies.get("accessToken")?.value}`,
        },
        body: JSON.stringify({ menuItemId, quantity }),
      }
    );

    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Error in Next.js API route:", error.message);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  {
    params,
    body,
  }: {
    params: { userId: string };
    body: {
      menuItemId: string;
    };
  }
) {
  const { userId } = params;
  const { menuItemId } = body;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/cart`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${request.cookies.get("accessToken")?.value}`,
        },
        body: JSON.stringify({ menuItemId }),
      }
    );

    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Error in Next.js API route:", error.message);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
