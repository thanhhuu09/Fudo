import { Category } from "../category";

// Menu item data from the server
export interface MenuItem {
  _id: string;
  name: string;
  description?: string;
  price: number;
  imageURL: string;
  inStock: boolean;
  quantity: number;
  visible: boolean;
  categoryID: Category;
}

// Form data for creating or updating a menu item
export interface MenuItemForm {
  name: string;
  description?: string;
  price: number;
  imageURL: string;
  inStock: boolean;
  quantity: number;
  visible: boolean;
  categoryID: string;
}
