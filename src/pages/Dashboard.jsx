import { useEffect, useState } from "react";
import { getMyProfile } from "../services/api"; // 1. Import hàm gọi API
import { Sun, Trophy, Armchair, Calendar, CheckCircle2 } from "lucide-react";
import { mockData } from "../mockData";

export default function Dashboard() {
  // 2. Tạo state để lưu thông tin user thật
  const [user, setUser] = useState(null);

  // 3. Gọi API lấy thông tin ngay khi component được render
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile(); // Gọi API /api/users/me
        setUser(data); // Lưu dữ liệu vào state
      } catch (error) {
        console.error("Lỗi lấy thông tin user:", error);
      }
    };
    fetchProfile();
  }, []);

  return (
    // Thêm pb-10 để nội dung không bị dính sát đáy khi cuộn
    <div className="pb-10">
      {/* 1. Welcome Banner */}
      <section className="m-6 p-10 bg-[#3D7A8A] rounded-2xl text-white flex justify-between items-center relative overflow-hidden shadow-lg">
        <div className="z-10 relative">
          {/* 4. Hiển thị First Name thật (Logic: Có user thì hiện tên, chưa có thì hiện "User") */}
          <h2 className="text-3xl font-bold mb-2">
            👋 Welcome, {user ? user.firstName : "User"}!
          </h2>
          <p className="text-lg opacity-90">
            You checked in at{" "}
            <span className="font-semibold">{mockData.user.checkInTime}</span>{" "}
            today
          </p>
        </div>

        <button className="z-10 relative bg-[#F87171] hover:bg-red-600 transition-all px-8 py-3 rounded-full font-bold shadow-lg text-white">
          Check out
        </button>
      </section>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-6">
        {/* Card Request Leave */}
        <div className="bg-[#E0E7FF] p-6 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-sm h-full min-h-40">
          <Sun className="text-blue-600 mb-2" size={48} />
          <span className="text-blue-900 font-extrabold text-lg">
            Request Leave
          </span>
        </div>

        {/* Card Leave Balance */}
        <StatCard
          title={`${mockData.leaveBalance.remainingDays}/${mockData.leaveBalance.totalDays}`}
          subtitle="days remaining"
          Icon={Calendar}
          color="text-red-400"
          progress="80%"
        />

        {/* Card Campaign */}
        <StatCard
          title={`${mockData.campaign.current} / ${mockData.campaign.target} km`}
          subtitle="Campaign Progress"
          Icon={Armchair}
          color="text-yellow-500"
          progress="65%"
        />

        {/* Card Rewards */}
        <div className="bg-white p-6 rounded-2xl shadow-sm text-center border border-gray-100 flex flex-col items-center justify-center h-full min-h-40">
          <Trophy className="mx-auto text-yellow-600 mb-2" size={32} />
          <p className="text-2xl font-black text-gray-800">
            {mockData.campaign.points} pts
          </p>
          <p className="text-green-500 text-xs font-bold">+200 this month</p>
        </div>
      </div>

      {/* 3. Recent Activity */}
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

// --- Component con (Giữ nguyên như code Sếp đưa) ---

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
