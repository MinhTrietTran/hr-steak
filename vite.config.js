import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 1. Chuyển hướng các request Chấm công về cổng 5033
      "/api/attendance": {
        target: "http://localhost:5033",
        changeOrigin: true,
        secure: false,
      },
      // 2. Chuyển hướng tất cả các request /api còn lại (Login, Profile, Employees) về cổng 5032
      "/api": {
        target: "http://localhost:5032",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
