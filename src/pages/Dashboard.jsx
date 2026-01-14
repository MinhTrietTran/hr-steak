import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// 1. IMPORT THÊM getMyAttendanceLogs
import {
  getMyProfile,
  postAttendance,
  getMyAttendanceLogs,
} from "../services/api";
import {
  Sun,
  Trophy,
  Armchair,
  Calendar,
  CheckCircle2,
  LogIn,
  LogOut,
  Clock, // Thêm icon Clock cho đẹp
} from "lucide-react";
import { mockData } from "../mockData";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [lastAction, setLastAction] = useState(null);

  // 2. STATE LƯU TRỮ LỊCH SỬ CHẤM CÔNG
  const [logs, setLogs] = useState([]);

  const navigate = useNavigate();

  // Hàm tải dữ liệu (được tách ra để tái sử dụng)
  const fetchLogs = async () => {
    try {
      const logsResponse = await getMyAttendanceLogs();
      const logsData = logsResponse.data || []; // Lấy mảng data từ response
      setLogs(logsData);

      // Tự động set trạng thái nút dựa trên log mới nhất (Log đầu tiên)
      if (logsData.length > 0) {
        setLastAction(logsData[0].type); // 1: In, 2: Out
      }
    } catch (error) {
      console.error("Lỗi tải lịch sử:", error);
    }
  };

  useEffect(() => {
    const initData = async () => {
      try {
        const userData = await getMyProfile();
        setUser(userData);

        // Gọi API lấy lịch sử
        await fetchLogs();
      } catch (error) {
        console.error("Lỗi khởi tạo:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
        }
      }
    };
    initData();
  }, [navigate]);

  const handleAttendance = async (type) => {
    setIsChecking(true);
    try {
      const response = await postAttendance(
        type,
        `Chấm công ${type === 1 ? "Vào" : "Ra"} từ Web`
      );

      setLastAction(type);
      alert(response.message || "Thao tác thành công!");

      // 3. RELOAD LẠI LỊCH SỬ NGAY SAU KHI CHẤM CÔNG
      await fetchLogs();
    } catch (error) {
      console.error("Attendance Error:", error.response?.data);
      const serverError = error.response?.data?.error;
      const serverMessage = error.response?.data?.message;
      const finalDisplay = serverError || serverMessage || "Có lỗi xảy ra";

      alert(`Thông báo: ${finalDisplay}`);

      if (finalDisplay.toLowerCase().includes("already checked in"))
        setLastAction(1);
      if (finalDisplay.toLowerCase().includes("already checked out"))
        setLastAction(2);
    } finally {
      setIsChecking(false);
    }
  };

  // 4. HÀM FORMAT THỜI GIAN (ISO -> Giờ đẹp)
  const formatTime = (isoString) => {
    if (!isoString) return "--:--";
    const date = new Date(isoString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="pb-10">
      {/* 1. Welcome Banner */}
      <section className="m-6 p-10 bg-[#3D7A8A] rounded-2xl text-white flex justify-between items-center relative overflow-hidden shadow-lg">
        <div className="z-10 relative">
          <h2 className="text-3xl font-bold mb-2">
            👋 Welcome, {user ? user.firstName : "User"}!
          </h2>
          <p className="text-lg opacity-90">
            {lastAction === 1
              ? "Trạng thái: Đang trong giờ làm việc"
              : "Trạng thái: Đã kết thúc làm việc / Chưa vào ca"}
          </p>
        </div>

        <div className="z-10 relative flex gap-3">
          {(lastAction === null || lastAction === 2) && (
            <button
              onClick={() => handleAttendance(1)}
              disabled={isChecking}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 transition-all px-8 py-3 rounded-full font-bold shadow-lg text-white border-2 border-green-500 disabled:opacity-50"
            >
              <LogIn size={20} /> {isChecking ? "Đang xử lý..." : "Check in"}
            </button>
          )}

          {lastAction === 1 && (
            <button
              onClick={() => handleAttendance(2)}
              disabled={isChecking}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 transition-all px-8 py-3 rounded-full font-bold shadow-lg text-white border-2 border-red-400 disabled:opacity-50"
            >
              <LogOut size={20} /> {isChecking ? "Đang xử lý..." : "Check out"}
            </button>
          )}
        </div>

        <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 skew-x-12 transform origin-bottom-left"></div>
      </section>

      {/* 2. Stats Grid (Giữ nguyên) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-6">
        <div className="bg-[#E0E7FF] p-6 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-sm h-full min-h-40">
          <Sun className="text-blue-600 mb-2" size={48} />
          <span className="text-blue-900 font-extrabold text-lg text-center leading-tight">
            Request Leave
          </span>
        </div>
        <StatCard
          title={`${mockData.leaveBalance.remainingDays}/${mockData.leaveBalance.totalDays}`}
          subtitle="days remaining"
          Icon={Calendar}
          color="text-red-400"
          progress="80%"
        />
        <StatCard
          title={`${mockData.campaign.current} / ${mockData.campaign.target} km`}
          subtitle="Campaign Progress"
          Icon={Armchair}
          color="text-yellow-500"
          progress="65%"
        />
        <div className="bg-white p-6 rounded-2xl shadow-sm text-center border border-gray-100 flex flex-col items-center justify-center h-full min-h-40">
          <Trophy className="mx-auto text-yellow-600 mb-2" size={32} />
          <p className="text-2xl font-black text-gray-800">
            {mockData.campaign.points} pts
          </p>
          <p className="text-green-500 text-xs font-bold">+200 this month</p>
        </div>
      </div>

      {/* 3. Recent Activity (SỬA ĐỂ DÙNG DỮ LIỆU THẬT) */}
      <div className="m-6 bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
        <h3 className="font-bold text-gray-800 text-lg mb-6 border-b pb-4 flex items-center gap-2">
          <Clock size={20} className="text-blue-600" /> Lịch sử hoạt động hôm
          nay
        </h3>

        <div className="space-y-4">
          {logs.length > 0 ? (
            logs.map((item) => (
              <ActivityItem
                key={item.id}
                time={formatTime(item.timestamp)}
                date={formatDate(item.timestamp)}
                // Type 1 = In (Xanh), Type 2 = Out (Xám/Đỏ)
                text={
                  item.type === 1
                    ? "Check-in thành công"
                    : "Check-out thành công"
                }
                isSpecial={item.type === 1}
                note={item.note}
              />
            ))
          ) : (
            <p className="text-gray-400 text-center italic py-4">
              Chưa có dữ liệu chấm công nào.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Helper Components ---

function StatCard({ title, subtitle, Icon, color, progress }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full min-h-40">
      <div className="text-center">
        <Icon className={`mx-auto ${color} mb-3`} size={32} />
        <p className="text-2xl font-black text-blue-900 leading-tight">
          {title}
        </p>
        <p className="text-gray-500 text-sm mb-3">{subtitle}</p>
      </div>
      <div className="w-full bg-gray-100 h-2 rounded-full mt-auto">
        <div
          className="bg-green-500 h-2 rounded-full"
          style={{ width: progress }}
        ></div>
      </div>
    </div>
  );
}

// Cập nhật ActivityItem để hiện thêm Ngày và Note
function ActivityItem({ time, date, text, isSpecial, note }) {
  return (
    <div
      className={`flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-xl border transition-colors hover:bg-gray-50 ${
        isSpecial ? "bg-green-50 border-green-100" : "bg-white border-gray-100"
      }`}
    >
      <div className="flex flex-col w-24 shrink-0">
        <span className="text-gray-800 font-bold text-sm">{time}</span>
        <span className="text-gray-400 text-xs">{date}</span>
      </div>

      <CheckCircle2
        className={isSpecial ? "text-green-500" : "text-gray-400"}
        size={20}
      />

      <div className="flex flex-col">
        <span className="text-gray-700 font-semibold">{text}</span>
        {note && <span className="text-gray-400 text-xs italic">{note}</span>}
      </div>
    </div>
  );
}
