import { Link, useLocation } from "react-router-dom";
import {
  X,
  LayoutDashboard,
  User,
  CalendarDays,
  Plane,
  Activity,
  Medal,
  FileText,
  ChevronsLeft,
} from "lucide-react";
import logo from "../assets/logo.png";

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation(); // Để biết đang ở trang nào mà bôi đậm

  // Danh sách menu cấu hình sẵn
  const menuItems = [
    { path: "/dashboard", name: "Dashboard", icon: LayoutDashboard },
    { path: "/profile", name: "Profile", icon: User },
    { path: "/timesheet", name: "Timesheet", icon: CalendarDays },
    { path: "/leave", name: "Leave", icon: Plane },
    { path: "/activity", name: "Activity", icon: Activity },
    { path: "/reward", name: "Reward", icon: Medal },
    { path: "/report", name: "Report", icon: FileText },
  ];

  return (
    <>
      {/* 1. Lớp màn đen mờ che phía sau (Overlay) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* 2. Phần Menu chính (Drawer) */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#F3F4F6] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header của Menu */}
        <div className="flex items-center justify-between p-6 mb-4">
          <div className="flex flex-col items-start">
            {/* Logo dùng filter brightness-0 để thành màu đen */}
            <img src={logo} alt="HR Steak" className="h-8 mb-2 brightness-0" />
            <span className="font-bold text-lg tracking-tight text-black">
              HR Steak
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full"
          >
            <ChevronsLeft size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Danh sách Link */}
        <nav className="space-y-1 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose} // Bấm xong tự đóng menu
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "text-blue-700 font-bold border-l-4 border-blue-700 bg-white shadow-sm"
                    : "text-gray-600 hover:bg-white/60 hover:text-black font-medium"
                }`}
              >
                <Icon
                  size={20}
                  className={isActive ? "text-blue-700" : "text-gray-500"}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
