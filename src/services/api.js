import axios from "axios";

// 1. Cấu hình Axios User
export const apiUser = axios.create({
  baseURL: "", // Để trống để dùng Proxy trong vite.config.js
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. INTERCEPTOR: Tự động gắn Token vào mọi request
apiUser.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Gắn chìa khóa vào đây
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Các hàm gọi API
export const loginUser = async (username, password) => {
  const response = await apiUser.post("/api/auth/login", {
    username,
    password,
  });
  return response.data;
};

// Hàm mới: Lấy thông tin cá nhân (Cần Token)
export const getMyProfile = async () => {
  const response = await apiUser.get("/api/users/me");
  return response.data;
};
