import { useEffect, useState } from "react";
import { getMyTimesheets } from "../services/api";
import {
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  Coffee,
} from "lucide-react";

export default function Attendance() {
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimesheets = async () => {
      try {
        const response = await getMyTimesheets();
        // API trả về { data: [...] } nên cần lấy response.data
        if (Array.isArray(response.data)) {
          setTimesheets(response.data);
        }
      } catch (error) {
        console.error("Lỗi tải bảng công:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTimesheets();
  }, []);

  // Hàm format ngày (2026-01-15 -> 15/01/2026)
  const formatDate = (isoString) => {
    if (!isoString) return "-";
    return new Date(isoString).toLocaleDateString("vi-VN");
  };

  // Hàm format giờ (2026-01-15T08:30... -> 08:30)
  const formatTime = (isoString) => {
    if (!isoString) return "--:--";
    return new Date(isoString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Calendar className="text-blue-600" /> Bảng công cá nhân
        </h1>
        <p className="text-gray-500">
          Theo dõi chi tiết giờ làm việc, đi muộn và về sớm.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Đang tải dữ liệu...
          </div>
        ) : timesheets.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Chưa có dữ liệu bảng công nào.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
                <tr>
                  <th className="p-4 border-b">Ngày</th>
                  <th className="p-4 border-b text-center">Check In</th>
                  <th className="p-4 border-b text-center">Check Out</th>
                  <th className="p-4 border-b text-center">Tổng giờ</th>
                  <th className="p-4 border-b">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {timesheets.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors border-b last:border-0"
                  >
                    {/* Cột Ngày */}
                    <td className="p-4 font-medium text-gray-800">
                      {formatDate(item.date)}
                      {/* Hiển thị ngày trong tuần (T2, T3...) */}
                      <div className="text-xs text-gray-400 font-normal mt-0.5">
                        {new Date(item.date).toLocaleDateString("vi-VN", {
                          weekday: "long",
                        })}
                      </div>
                    </td>

                    {/* Cột Check In */}
                    <td className="p-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full font-medium ${
                          item.isLate
                            ? "bg-red-100 text-red-700"
                            : "bg-green-50 text-green-700"
                        }`}
                      >
                        {formatTime(item.firstCheckIn)}
                      </span>
                      {item.isLate && (
                        <div className="text-[10px] text-red-500 mt-1 font-bold">
                          ĐI MUỘN
                        </div>
                      )}
                    </td>

                    {/* Cột Check Out */}
                    <td className="p-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full font-medium ${
                          item.isEarlyLeave
                            ? "bg-orange-100 text-orange-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {formatTime(item.lastCheckOut)}
                      </span>
                      {item.isEarlyLeave && (
                        <div className="text-[10px] text-orange-500 mt-1 font-bold">
                          VỀ SỚM
                        </div>
                      )}
                    </td>

                    {/* Cột Tổng giờ */}
                    <td className="p-4 text-center font-bold text-blue-900 text-lg">
                      {item.totalWorkHours}h
                    </td>

                    {/* Cột Trạng thái & Ghi chú */}
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {/* Logic hiển thị Badge trạng thái */}
                        {!item.isLate && !item.isEarlyLeave && (
                          <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">
                            <CheckCircle size={12} /> Đủ công
                          </span>
                        )}

                        {item.isLate && (
                          <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded">
                            <AlertCircle size={12} /> Muộn
                          </span>
                        )}

                        {item.isEarlyLeave && (
                          <span className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded">
                            <Coffee size={12} /> Về sớm
                          </span>
                        )}
                      </div>

                      {item.note && (
                        <p
                          className="text-xs text-gray-400 italic mt-1 line-clamp-1 max-w-[200px]"
                          title={item.note}
                        >
                          Note: {item.note}
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
