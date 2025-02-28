import { MenuItem } from "../menu-item";

export interface Product {
  _id: string;
  quantity: number;
  menuItem: MenuItem;
}
