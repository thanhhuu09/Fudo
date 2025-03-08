import { CartResponse } from "@/types/cart";
import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchCart = async (
  userId: string,
  accessToken: string
): Promise<CartResponse> => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}/cart`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};

export const updateCart = async (
  userId: string,
  accessToken: string,
  menuItemId: string,
  quantity: number
) => {
  try {
    const payload = {
      menuItemId,
      quantity,
    };
    console.log("userIDFromCart", userId);
    const response = await axios.put(
      `${API_URL}/users/${userId}/cart`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating cart:", error);
    throw error;
  }
};
