import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Thêm điều hướng
import { getMyProfile, postAttendance } from "../services/api";
import {
  Sun,
  Trophy,
  Armchair,
  Calendar,
  CheckCircle2,
  LogIn,
  LogOut,
} from "lucide-react";
import { mockData } from "../mockData";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [lastAction, setLastAction] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();
        setUser(data);
      } catch (error) {
        console.error("Lỗi lấy thông tin user:", error);
        // Xử lý lỗi 401: Nếu token hỏng, yêu cầu đăng nhập lại
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
        }
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleAttendance = async (type) => {
    setIsChecking(true);
    try {
      // Gửi type 1 (In) hoặc 2 (Out) tương ứng với Postman Sếp đã test thành công
      const response = await postAttendance(
        type,
        `Chấm công ${type === 1 ? "Vào" : "Ra"} từ Web`
      );

      setLastAction(type);
      alert(response.message || "Thao tác thành công!");
    } catch (error) {
      console.error("Attendance Error:", error.response?.data);

      // --- ĐOẠN SỬA QUAN TRỌNG ---
      // Backend trả về key "error" khi có lỗi (400, 429...)
      const serverError = error.response?.data?.error;
      const serverMessage = error.response?.data?.message;

      // Ưu tiên hiện "error" trước, nếu không có mới hiện "message"
      const finalDisplay = serverError || serverMessage || "Có lỗi xảy ra";

      alert(`Thông báo: ${finalDisplay}`);
      // ---------------------------

      if (finalDisplay.toLowerCase().includes("already checked in"))
        setLastAction(1);
    } finally {
      setIsChecking(false);
    }
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
              : "Trạng thái: Sẵn sàng bắt đầu ngày mới?"}
          </p>
        </div>

        {/* 2. CỤM NÚT BẤM THÔNG MINH (Chỉ hiện nút hợp lệ) */}
        <div className="z-10 relative flex gap-3">
          {/* Hiện Check-in nếu chưa rõ hoặc vừa Out (type 2) */}
          {(lastAction === null || lastAction === 2) && (
            <button
              onClick={() => handleAttendance(1)}
              disabled={isChecking}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 transition-all px-8 py-3 rounded-full font-bold shadow-lg text-white border-2 border-green-500 disabled:opacity-50"
            >
              <LogIn size={20} /> {isChecking ? "Đang xử lý..." : "Check in"}
            </button>
          )}

          {/* Hiện Check-out chỉ khi đang trong trạng thái In (type 1) */}
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

      {/* 3. Recent Activity (Giữ nguyên) */}
      <div className="m-6 bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
        <h3 className="font-bold text-gray-800 text-lg mb-6 border-b pb-4">
          Today — 07 Nov 2025
        </h3>
        <div className="space-y-4">
          {mockData.attendanceLog.map((item) => (
            <ActivityItem
              key={item.id}
              time={item.time}
              text={item.text}
              isSpecial={item.isSpecial}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

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

function ActivityItem({ time, text, isSpecial }) {
  return (
    <div
      className={`flex items-center gap-6 p-4 rounded-xl border transition-colors hover:bg-gray-50 ${
        isSpecial ? "bg-green-50 border-green-100" : "bg-white border-gray-100"
      }`}
    >
      <span className="text-gray-500 font-medium text-sm w-24 shrink-0">
        {time}
      </span>
      <CheckCircle2
        className={isSpecial ? "text-green-500" : "text-gray-400"}
        size={20}
      />
      <span className="text-gray-700 font-semibold">{text}</span>
    </div>
  );
}
