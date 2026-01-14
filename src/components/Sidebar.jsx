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
  Users,
  CheckSquare,
} from "lucide-react";
import logo from "../assets/logo.png";

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  // 1. Lấy thông tin User đang đăng nhập từ LocalStorage
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const userRoles = user?.roles || []; // Ví dụ: ["ROLE_MANAGER"]

  // Hàm kiểm tra quyền (Chỉ cần dính 1 quyền là cho qua)
  const hasRole = (allowedRoles) => {
    if (!user) return false;
    return userRoles.some((role) => allowedRoles.includes(role));
  };

  // 2. Định nghĩa Menu kèm theo quyền hạn (allowedRoles)
  const allMenuItems = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: LayoutDashboard,
      allowedRoles: ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_EMPLOYEE"], // Ai cũng vào được
    },
    {
      path: "/employees",
      name: "Quản lý nhân viên",
      icon: Users,
      allowedRoles: ["ROLE_ADMIN", "ROLE_MANAGER"], // Chỉ Manager/Admin thấy
    },
    {
      path: "/approve-leave",
      name: "Duyệt đơn nghỉ",
      icon: CheckSquare,
      allowedRoles: ["ROLE_MANAGER", "ROLE_ADMIN"], // Manager (manager/manager123) và Admin
    },
    {
      path: "/profile",
      name: "Hồ sơ cá nhân",
      icon: User,
      allowedRoles: ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_EMPLOYEE"],
    },
    {
      path: "/timesheet",
      name: "Chấm công",
      icon: CalendarDays,
      allowedRoles: ["ROLE_EMPLOYEE", "ROLE_MANAGER"],
    },
    {
      path: "/leave",
      name: "Xin nghỉ phép",
      icon: Plane,
      allowedRoles: ["ROLE_EMPLOYEE", "ROLE_MANAGER"],
    },
    // ... Sếp thêm các menu khác tương tự
  ];

  // 3. Lọc danh sách menu dựa trên quyền thật
  const visibleMenuItems = allMenuItems.filter((item) =>
    hasRole(item.allowedRoles)
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#F3F4F6] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 mb-4">
          <Link
            to="/dashboard"
            onClick={onClose}
            className="flex flex-col items-start cursor-pointer hover:opacity-80 transition-opacity"
          >
            <img src={logo} alt="HR Steak" className="h-8 mb-2 brightness-0" />
            <span className="font-bold text-lg tracking-tight text-black">
              HR Steak
            </span>
            {/* Giữ nguyên phần hiển thị Role */}
            <span className="text-xs text-blue-600 font-bold px-2 py-0.5 bg-blue-100 rounded-full mt-1">
              {userRoles[0]?.replace("ROLE_", "")}
            </span>
          </Link>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full"
          >
            <ChevronsLeft size={24} className="text-gray-600" />
          </button>
        </div>

        <nav className="space-y-1 px-4">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
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

          {/* Nút Đăng xuất */}
          <div className="mt-8 border-t border-gray-300 pt-4">
            <button
              onClick={() => {
                localStorage.clear(); // Xóa sạch token
                window.location.href = "/"; // Đá về trang login
              }}
              className="flex w-full items-center gap-4 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-all"
            >
              <ChevronsLeft size={20} className="rotate-180" />
              Đăng xuất
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}
