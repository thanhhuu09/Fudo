// services/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Interceptor để kiểm tra lỗi 401 và làm mới access token
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Gọi đến endpoint refresh để lấy access token mới
        const res = await axios.get("/api/auth/refresh");
        if (res.status === 200) {
          const { accessToken } = res.data;
          // Cập nhật access token trong headers của yêu cầu ban đầu
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
          // Gọi lại API với access token mới
          return axiosInstance(originalRequest);
        }
      } catch (err) {
        console.error("Refresh token failed:", err);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
