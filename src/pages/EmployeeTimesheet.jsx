import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEmployeeTimesheets, updateTimesheet } from "../services/api"; // 1. Import updateTimesheet
import {
  Calendar,
  ArrowLeft,
  Pencil,
  X,
  Save,
  CheckSquare,
} from "lucide-react";

export default function EmployeeTimesheet() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. State cho Modal sửa
  const [editingItem, setEditingItem] = useState(null); // Lưu dòng đang sửa
  const [formData, setFormData] = useState({}); // Lưu dữ liệu form

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getEmployeeTimesheets(id);
      if (response.data && Array.isArray(response.data)) {
        setTimesheets(response.data);
      }
    } catch (error) {
      console.error("Lỗi tải bảng công:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  // --- LOGIC MODAL ---
  const handleEditClick = (item) => {
    setEditingItem(item);
    // Điền dữ liệu hiện tại vào form
    setFormData({
      note: item.note || "",
      isWFH: item.isWFH || false,
      isLate: item.isLate || false,
      status: item.status || 1, // Mặc định là 1 nếu null
    });
  };

  const handleSave = async () => {
    if (!editingItem) return;
    try {
      // Gọi API Update (như Postman)
      await updateTimesheet(editingItem.id, formData);
      alert("Cập nhật thành công!");

      setEditingItem(null); // Đóng modal
      fetchData(); // Tải lại bảng để thấy thay đổi
    } catch (error) {
      alert(
        "Lỗi cập nhật: " + (error.response?.data?.message || "Có lỗi xảy ra")
      );
    }
  };

  // --- HELPER FORMAT ---
  const formatDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString("vi-VN") : "-";
  const formatTime = (iso) =>
    iso
      ? new Date(iso).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "--:--";

  return (
    <div className="p-6 relative">
      <button
        onClick={() => navigate("/employees")}
        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-4 transition-colors font-medium"
      >
        <ArrowLeft size={20} /> Quay lại danh sách
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Calendar className="text-blue-600" /> Bảng công nhân viên #{id}
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Đang tải dữ liệu...
          </div>
        ) : timesheets.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Chưa có dữ liệu chấm công.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
                <tr>
                  <th className="p-4 border-b">Ngày</th>
                  <th className="p-4 border-b text-center">In / Out</th>
                  <th className="p-4 border-b text-center">Giờ làm</th>
                  <th className="p-4 border-b">Trạng thái & Note</th>
                  <th className="p-4 border-b text-center">Sửa</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {timesheets.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 border-b last:border-0 transition-colors"
                  >
                    <td className="p-4 font-medium">
                      {formatDate(item.date)}
                      <div className="text-xs text-gray-400 mt-0.5">
                        {new Date(item.date).toLocaleDateString("vi-VN", {
                          weekday: "long",
                        })}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div
                        className={item.isLate ? "text-red-600 font-bold" : ""}
                      >
                        {formatTime(item.firstCheckIn)}
                      </div>
                      <div className="text-gray-400 text-xs">⬇</div>
                      <div
                        className={
                          item.isEarlyLeave ? "text-orange-600 font-bold" : ""
                        }
                      >
                        {formatTime(item.lastCheckOut)}
                      </div>
                    </td>
                    <td className="p-4 text-center font-bold text-blue-900">
                      {item.totalWorkHours}h
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2 mb-1">
                        {item.isLate && (
                          <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold">
                            Muộn
                          </span>
                        )}
                        {item.isWFH && (
                          <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-[10px] font-bold">
                            WFH
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 italic max-w-[150px] truncate">
                        {item.note || "-"}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="p-2 bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 rounded-full transition-all"
                      >
                        <Pencil size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- 3. MODAL EDIT (Hiện lên khi editingItem khác null) --- */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 mx-4">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Cập nhật Timesheet
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Note */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú (Note)
                </label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  rows="3"
                  value={formData.note}
                  onChange={(e) =>
                    setFormData({ ...formData, note: e.target.value })
                  }
                  placeholder="Nhập lý do chỉnh sửa..."
                />
              </div>

              {/* Các Checkbox Option */}
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.isWFH}
                    onChange={(e) =>
                      setFormData({ ...formData, isWFH: e.target.checked })
                    }
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="font-semibold text-gray-700">Is WFH</span>
                </label>

                <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.isLate}
                    onChange={(e) =>
                      setFormData({ ...formData, isLate: e.target.checked })
                    }
                    className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                  />
                  <span className="font-semibold text-gray-700">Is Late</span>
                </label>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái (Status)
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: Number(e.target.value) })
                  }
                  className="w-full p-3 border border-gray-300 rounded-xl outline-none"
                >
                  <option value={1}>Hợp lệ (Approved)</option>
                  <option value={0}>Chờ duyệt (Pending)</option>
                  <option value={-1}>Không hợp lệ (Rejected)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setEditingItem(null)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
              >
                <Save size={18} /> Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
