import { MenuItem } from "../menu-item";

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  _id: string;
}

export type CartResponse = CartItem[];
