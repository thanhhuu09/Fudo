import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  sub: string;
  email: string;
  role: string;
  name: string;
  [key: string]: string;
}

export const decodeToken = (accessToken: string) => {
  if (!accessToken) {
    return null;
  }
  try {
    const decodedToken: DecodedToken = jwtDecode<DecodedToken>(accessToken);
    return decodedToken;
  } catch (error) {
    console.error("Error decoding token", error);
  }
};
