import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import EmployeeManagement from "./pages/EmployeeManagement";
import EmployeeTimesheet from "./pages/EmployeeTimesheet";

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
          <Route path="/timesheet" element={<Attendance />} />
          <Route
            path="/employees/:id/timesheet"
            element={<EmployeeTimesheet />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
