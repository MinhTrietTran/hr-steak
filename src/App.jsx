import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import EmployeeManagement from "./pages/EmployeeManagement";

// 1. IMPORT TRANG BẢNG CÔNG (ATTENDANCE)
import Attendance from "./pages/Attendance";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/employees" element={<EmployeeManagement />} />

          {/* 2. ĐĂNG KÝ ĐƯỜNG DẪN /TIMESHEET */}
          <Route path="/timesheet" element={<Attendance />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
