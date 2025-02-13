import { Outlet } from "react-router-dom";
import Sidebar from "../DashBoard/components/Sidebar";
import Navbar from "../DashBoard/components/Navbar";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen">
      <Sidebar /> {/* Sidebar bên trái */}
      <div className="flex-1 flex flex-col">
        <Navbar /> {/* Navbar trên cùng */}
        <main className="p-4">
          <Outlet /> {/* Đây là nơi hiển thị các trang con */}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
