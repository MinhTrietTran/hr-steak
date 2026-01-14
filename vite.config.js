import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Khi nào code gọi đến đường dẫn bắt đầu bằng /api
      "/api": {
        target: "http://localhost:5032", // Tự động chuyển hướng sang cổng 5032 của User Service
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
