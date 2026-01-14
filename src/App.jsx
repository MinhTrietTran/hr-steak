import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Profile from "./pages/Profile"; // 1. Import Profile
import EmployeeManagement from "./pages/EmployeeManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          {/* 2. Khai báo đường dẫn Profile tại đây */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/employees" element={<EmployeeManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
