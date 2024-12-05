export interface User {
  _id: string;
  name: string;
  email: string;
  photo: string;
  password_hash: string;
  role: string;
  addresses: string[];
  order_history: string[];
  account_status: string;
  paymentMethods: string[];
  createdAt: Date;
  __v: number;
}

export type UserProfile = Pick<
  User,
  "name" | "email" | "photo" | "addresses" | "paymentMethods" | "role"
>;

export interface AuthResponse {
  authenticated: boolean;
  user: {
    email: string;
    sub: string;
    iat: number;
    exp: number;
  };
}
