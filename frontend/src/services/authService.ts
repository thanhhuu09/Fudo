// import { User } from "@/types";
// import axios from "axios";

// interface LoginResponse {
//   user: User;
//   accessToken: string;
//   refreshToken: string;
// }

// export async function login(
//   email: string,
//   password: string
// ): Promise<LoginResponse | null> {
//   try {
//     const response = await axios.post<LoginResponse>(
//       `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
//       {
//         email,
//         password,
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Login failed:", error);
//     return null;
//   }
// }
