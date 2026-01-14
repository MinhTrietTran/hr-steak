import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import logo from "../assets/logo.png";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await loginUser(username, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/dashboard");
    } catch (err) {
      setError("Đăng nhập thất bại! Kiểm tra lại tài khoản.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    // CẬP NHẬT: Dùng bg-linear-to-br chuẩn Tailwind v4
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-200">
        {/* CẬP NHẬT: Flex-row để logo và chữ nằm ngang */}
        <div className="flex flex-row items-center justify-center gap-4 mb-8">
          {/* Logo đậm hơn nhờ drop-shadow và bỏ nền mờ */}
          <img
            src={logo}
            alt="HR Steak Logo"
            className="h-14 w-14 object-contain drop-shadow-md"
          />

          <div className="flex flex-col">
            <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">
              HR STEAK
            </h1>
            <p className="text-gray-500 text-xs font-medium tracking-wide">
              SMART HRM SYSTEM
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex items-center gap-2 font-medium">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Tài khoản
            </label>
            <input
              type="text"
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all font-medium"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-blue-900/30 transition-all disabled:opacity-70 mt-4"
          >
            {loading ? "Đang xác thực..." : "Đăng nhập ngay"}
          </button>
        </form>

        <p className="text-center text-gray-400 text-xs mt-8">
          © 2026 HR Steak. All rights reserved.
        </p>
      </div>
    </div>
  );
}
