import { Outlet } from "react-router-dom";
import Sidebar from "../DashBoard/components/Sidebar";
import Navbar from "../DashBoard/components/Navbar";
import Footer from "../DashBoard/components/Footer"; // Import Footer

const DashboardLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar /> {/* Sidebar cố định bên trái */}
      <div className="flex flex-col flex-1 h-screen">
        <Navbar /> {/* Navbar cố định trên cùng */}
        <main className="flex-1 overflow-auto p-4">
          <Outlet /> {/* Nội dung trang */}
        </main>
        <Footer /> {/* Footer cố định dưới cùng */}
      </div>
    </div>
  );
};

export default DashboardLayout;
