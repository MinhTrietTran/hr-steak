import { useState } from "react";
import { Outlet, useLocation, Link, useNavigate } from "react-router-dom"; // Thêm Link, useNavigate
import { Menu, Bell, LogOut, User as UserIcon } from "lucide-react"; // Thêm icon LogOut, User
import Sidebar from "./Sidebar";
import logo from "../assets/logo.png";
import avatar from "../assets/user-avatar.png";

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // State bật tắt popup avatar

  const location = useLocation();
  const navigate = useNavigate();

  // Lấy info từ localStorage để hiện tên
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Hàm đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const pageTitles = {
    "/dashboard": "Dashboard",
    "/profile": "Hồ sơ cá nhân",
    "/timesheet": "Bảng chấm công",
    "/leave": "Quản lý nghỉ phép",
    "/activity": "Nhật ký hoạt động",
    "/reward": "Đổi thưởng",
    "/report": "Báo cáo thống kê",
  };

  const currentTitle = pageTitles[location.pathname] || "HR Steak System";

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-gray-50 to-blue-100">
      {/* Sidebar giữ nguyên */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <header className="bg-[#2D3748] text-white p-4 flex justify-between items-center shadow-md sticky top-0 z-30">
        {/* Phần TRÁI: Logo & Tên trang (Giữ nguyên code của Sếp) */}
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

          <span className="text-xl font-bold tracking-tight capitalize">
            {currentTitle}
          </span>
        </div>

        {/* Phần PHẢI: Chuông & Avatar (Đã sửa lại để có Popup an toàn) */}
        <div className="flex items-center gap-5">
          <div className="relative">
            <Bell className="cursor-pointer hover:text-gray-300" size={22} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] rounded-full px-1">
              3
            </span>
          </div>

          {/* --- BẮT ĐẦU PHẦN SỬA --- */}
          {/* Bọc Avatar trong relative để popup bám theo nó */}
          <div className="relative">
            <img
              src={avatar}
              alt="User"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} // Bấm để bật/tắt
              className="w-10 h-10 rounded-full border-2 border-gray-400 object-cover cursor-pointer hover:border-blue-400 transition"
            />

            {/* Popup Menu: Chỉ hiện khi isUserMenuOpen = true */}
            {isUserMenuOpen && (
              <>
                {/* 1. Màn chắn tàng hình để click ra ngoài tự đóng */}
                <div
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setIsUserMenuOpen(false)}
                ></div>

                {/* 2. Nội dung Popup */}
                <div className="absolute right-0 mt-3 w-56 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in duration-200">
                  {/* Header của Popup */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-bold text-gray-900">
                      {user.username || "User"}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user.roles?.[0]?.replace("ROLE_", "").toLowerCase() ||
                        "Employee"}
                    </p>
                  </div>

                  {/* Link Profile */}
                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                    >
                      <UserIcon size={16} /> Hồ sơ cá nhân
                    </Link>
                  </div>

                  {/* Nút Đăng xuất */}
                  <div className="py-1 border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-red-50 text-red-600 font-medium"
                    >
                      <LogOut size={16} /> Đăng xuất
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
          {/* --- KẾT THÚC PHẦN SỬA --- */}
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
