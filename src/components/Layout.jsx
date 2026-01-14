import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom"; // 1. Thêm useLocation
import { Menu, Bell } from "lucide-react";
import Sidebar from "./Sidebar";
import logo from "../assets/logo.png";
import avatar from "../assets/user-avatar.png";

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 2. Lấy thông tin đường dẫn hiện tại (ví dụ: /dashboard)
  const location = useLocation();

  // 3. Định nghĩa từ điển: Đường dẫn -> Tên trang hiển thị
  const pageTitles = {
    "/dashboard": "Dashboard",
    "/profile": "Hồ sơ cá nhân",
    "/timesheet": "Bảng chấm công",
    "/leave": "Quản lý nghỉ phép",
    "/activity": "Nhật ký hoạt động",
    "/reward": "Đổi thưởng",
    "/report": "Báo cáo thống kê",
  };

  // Lấy tên trang, nếu không có trong danh sách thì hiện tên mặc định
  const currentTitle = pageTitles[location.pathname] || "HR Steak System";

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-gray-50 to-blue-100">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <header className="bg-[#2D3748] text-white p-4 flex justify-between items-center shadow-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Menu className="cursor-pointer text-white" />
          </button>

          <img
            src={logo}
            alt="HR Steak Logo"
            className="h-8 w-8 object-contain"
          />

          {/* 4. CẬP NHẬT: Hiển thị tên trang động thay vì cứng */}
          <span className="text-xl font-bold tracking-tight capitalize">
            {currentTitle}
          </span>
        </div>

        <div className="flex items-center gap-5">
          <div className="relative">
            <Bell className="cursor-pointer hover:text-gray-300" size={22} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] rounded-full px-1">
              3
            </span>
          </div>
          <img
            src={avatar}
            alt="User"
            className="w-10 h-10 rounded-full border-2 border-gray-400 object-cover"
          />
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
