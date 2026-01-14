import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout"; // Import Layout mới
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Nhóm các trang cần có Menu Sidebar vào trong Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Sau này Sếp thêm các trang khác vào đây: */}
          {/* <Route path="/leave" element={<LeavePage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
