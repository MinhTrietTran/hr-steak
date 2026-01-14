import axios from "axios";

// Cấu hình cổng User Service (Port 5032 theo chỉ đạo của Sếp)
export const apiUser = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
});

// Hàm Login - Gọi API /api/auth/login
export const loginUser = async (username, password) => {
  try {
    const response = await apiUser.post("/api/auth/login", {
      username,
      password,
    });
    return response.data; // Trả về token và thông tin user
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: "Lỗi kết nối Server" };
  }
};
