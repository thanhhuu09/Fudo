import { Order } from "@/types";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createOrder = async (orderData: Order, accessToken: string) => {
  try {
    const response = await axios.post(`${API_URL}/orders`, orderData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const getOrdersByUser = async (userId: string, accessToken: string) => {
  try {
    const response = await axios.get(`${API_URL}/orders?userId=${userId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const getOrderById = async (orderId: string, accessToken: string) => {
  try {
    const response = await axios.get(`${API_URL}/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};
