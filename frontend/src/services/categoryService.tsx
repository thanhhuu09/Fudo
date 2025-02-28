import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
type Category = {
  name: string;
  description: string;
};
export const addCategory = async (category: Category, accessToken: string) => {
  try {
    const response = await axios.post(`${API_URL}/categories`, category, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};
