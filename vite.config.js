import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 1. CẬP NHẬT QUAN TRỌNG:
      // Gom nhóm cả 'attendance' VÀ 'timesheets' để chuyển về cổng 5033
      // Cú pháp regex: ^/api/(attendance|timesheets) nghĩa là bắt đầu bằng 1 trong 2 từ này
      "^/api/(attendance|timesheets)": {
        target: "http://localhost:5033",
        changeOrigin: true,
        secure: false,
      },

      // 2. Chuyển hướng tất cả các request /api còn lại (Login, Profile, Employees) về cổng 5032
      // Lưu ý: Cái này phải để nằm dưới cùng để nó hứng các trường hợp còn sót lại
      "/api": {
        target: "http://localhost:5032",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
