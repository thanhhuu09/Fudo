export interface User {
  _id: string;
  name: string;
  email: string;
  photo: string;
  role: string;
  addresses: string[];
  orderHistory: string[];
  accountStatus: string;
  paymentMethods: string[];
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
