import { decodeToken } from "@/lib/decodeToken";
import { UpdateUserInfoDTO } from "@/types";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchUserProfile = async (accessToken: string) => {
  const decodedToken = decodeToken(accessToken);
  const userId = decodedToken?.sub;
  try {
    const response = await axios.get(`${API_URL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (
  accessToken: string,
  userId: string,
  updateUserInfoDTO: Partial<UpdateUserInfoDTO>
) => {
  try {
    const response = await axios.put(
      `${API_URL}/users/${userId}`,
      updateUserInfoDTO,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};
