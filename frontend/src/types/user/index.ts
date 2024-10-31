export interface User {
  _id: string;
  name: string;
  email: string;
  photo: string;
  password_hash: string;
  addresses: string[];
  order_history: string[];
  account_status: string;
  paymentMethods: string[];
  createdAt: Date;
  __v: number;
}

export type UserProfile = Pick<
  User,
  "name" | "email" | "photo" | "addresses" | "paymentMethods"
>;
