import { useEffect, useState } from "react";
import { getEmployees } from "../services/api";
import { Users, Search, Phone, Mail, Building, UserCheck } from "lucide-react";

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchList = async () => {
      try {
        const data = await getEmployees();
        setEmployees(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Lỗi tải danh sách:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, []);

  // Logic lọc nhân viên theo ô tìm kiếm
  const filtered = employees.filter(
    (emp) =>
      emp.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="text-blue-600" /> Quản lý nhân viên
          </h1>
          <p className="text-gray-500 text-sm">
            Danh sách nhân sự thuộc quyền quản lý
          </p>
        </div>

        {/* Ô tìm kiếm */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Tìm tên, email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Đang tải dữ liệu...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-4">Nhân viên</th>
                  <th className="p-4">Liên hệ</th>
                  <th className="p-4">Phòng ban</th>
                  <th className="p-4">Vai trò</th>
                  <th className="p-4">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filtered.length > 0 ? (
                  filtered.map((emp) => (
                    <tr
                      key={emp.id}
                      className="hover:bg-blue-50/50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="font-bold text-gray-900">
                          {emp.lastName} {emp.firstName}
                        </div>
                        <div className="text-xs text-gray-400">
                          ID: #{emp.id} • {emp.gender}
                        </div>
                      </td>
                      <td className="p-4 space-y-1">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail size={14} className="text-blue-400" />{" "}
                          {emp.email}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone size={14} className="text-green-400" />{" "}
                          {emp.phoneNumber}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-md w-fit text-xs font-semibold">
                          <Building size={12} /> {emp.department}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${
                            emp.role === "MANAGER"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {emp.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="flex items-center gap-1 text-green-600 font-bold text-xs">
                          <UserCheck size={14} /> Active
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-400">
                      Không tìm thấy nhân viên nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
