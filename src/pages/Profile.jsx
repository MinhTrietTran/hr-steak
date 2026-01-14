import { useEffect, useState } from "react";
import { getMyProfile } from "../services/api";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  CreditCard,
  Calendar,
} from "lucide-react";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();
        setProfile(data);
      } catch (error) {
        console.error("Lỗi lấy profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="p-10 text-center">Đang tải hồ sơ...</div>;
  if (!profile)
    return (
      <div className="p-10 text-center text-red-500">
        Không thể tải thông tin.
      </div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto pb-20">
      {/* Header Profile */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row items-center gap-8">
        <div className="relative">
          <img
            src="https://avatar.iran.liara.run/public/boy" // Avatar placeholder đẹp
            alt="Avatar"
            className="w-32 h-32 rounded-full border-4 border-blue-50 shadow-md"
          />
          <span className="absolute bottom-2 right-2 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></span>
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            {profile.lastName} {profile.firstName}
          </h1>
          <p className="text-gray-500 font-medium mb-3">@{profile.username}</p>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
              {profile.department}
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">
              {profile.role}
            </span>
          </div>
        </div>
      </div>

      {/* Thông tin chi tiết */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cột Trái: Thông tin liên hệ */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <User className="text-blue-500" /> Thông tin cá nhân
          </h3>
          <div className="space-y-4">
            <InfoRow label="Ngày sinh" value={profile.dob} icon={Calendar} />
            <InfoRow label="Giới tính" value={profile.gender} icon={User} />
            <InfoRow
              label="CMND/CCCD"
              value={profile.identityNumber}
              icon={CreditCard}
            />
            <InfoRow label="Địa chỉ" value={profile.address} icon={MapPin} />
          </div>
        </div>

        {/* Cột Phải: Thông tin công việc & Ngân hàng */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Briefcase className="text-orange-500" /> Công việc & Thanh toán
          </h3>
          <div className="space-y-4">
            <InfoRow label="Email" value={profile.email} icon={Mail} />
            <InfoRow
              label="Điện thoại"
              value={profile.phoneNumber}
              icon={Phone}
            />
            <InfoRow
              label="Mã số thuế"
              value={profile.taxCode}
              icon={CreditCard}
            />
            <InfoRow
              label="Số tài khoản"
              value={profile.bankAccountNumber}
              icon={CreditCard}
            />
            <InfoRow
              label="Ngày vào làm"
              value={profile.startDate}
              icon={Calendar}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Component con hiển thị từng dòng cho đẹp
function InfoRow({ label, value, icon: Icon }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3 text-gray-600">
        <Icon size={18} />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="text-gray-900 font-semibold text-sm">
        {value || "---"}
      </span>
    </div>
  );
}
