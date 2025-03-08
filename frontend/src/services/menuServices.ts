import { MenuItemForm } from "@/types";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const addMenu = async (menu: MenuItemForm, accessToken: string) => {
  try {
    const response = await axios.post(`${API_URL}/menu-items`, menu, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding menu item:", error);
    throw error;
  }
};

export const fetchMenu = async () => {
  try {
    const response = await axios.get(`${API_URL}/menu-items`);
    return response.data;
  } catch (error) {
    console.error("Error fetching menu items:", error);
    throw error;
  }
};

export const updateMenu = async (
  menuId: string,
  menu: Partial<MenuItemForm>,
  accessToken: string
) => {
  try {
    const response = await axios.put(`${API_URL}/menu-items/${menuId}`, menu, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating menu item:", error);
    throw error;
  }
};

export const deleteMenu = async (menuId: string, accessToken: string) => {
  try {
    const response = await axios.delete(`${API_URL}/menu-items/${menuId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchMenuById = async (menuId: string) => {
  try {
    const response = await axios.get(`${API_URL}/menu-items/${menuId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching menu item by ID:", error);
    throw error;
  }
};

export const fetchMenuByCategory = async (category: string) => {
  try {
    const response = await axios.get(`${API_URL}/menu-items`, {
      params: {
        category,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching menu items by category:", error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Upload file to S3
export const uploadFile = async (
  file: File,
  accessToken: string
): Promise<{ imageUrl: string }> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
