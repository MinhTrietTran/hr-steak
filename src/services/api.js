import axios from "axios";

// CHỈ CẦN 1 INSTANCE DUY NHẤT (Vì Proxy ở vite.config.js sẽ tự phân luồng cổng)
export const apiUser = axios.create({
  baseURL: "", // BẮT BUỘC ĐỂ TRỐNG để trình duyệt gọi qua Proxy (localhost:5173)
  headers: {
    "Content-Type": "application/json",
  },
});

// INTERCEPTOR: Gắn chìa khóa Token (Giữ nguyên logic cũ)
apiUser.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- CÁC HÀM GỌI API ---

export const loginUser = async (username, password) => {
  // Proxy sẽ tự đẩy request này về cổng 5032
  const response = await apiUser.post("/api/auth/login", {
    username,
    password,
  });
  return response.data;
};

export const getMyProfile = async () => {
  const response = await apiUser.get("/api/users/me");
  return response.data;
};

export const getEmployees = async () => {
  const response = await apiUser.get("/api/employees");
  return response.data;
};

export const postAttendance = async (type, note = "") => {
  // Nhờ cấu hình Proxy đặt "/api/attendance" lên đầu,
  // request này sẽ tự động được đẩy về đúng cổng 5033
  const response = await apiUser.post("/api/attendance", {
    type: type,
    note: note,
  });
  return response.data;
};

// Hàm lấy lịch sử chấm công cá nhân
export const getMyAttendanceLogs = async () => {
  // Proxy sẽ chuyển tiếp sang http://localhost:5033/api/attendance/me
  const response = await apiUser.get("/api/attendance/me");
  return response.data; // Trả về object chứa { message, data: [...] }
};

// ... các code cũ

// Hàm lấy bảng công (Timesheet) đã được xử lý
export const getMyTimesheets = async () => {
  // Proxy sẽ tự chuyển sang cổng 5033
  const response = await apiUser.get("/api/timesheets/me");
  return response.data;
};
