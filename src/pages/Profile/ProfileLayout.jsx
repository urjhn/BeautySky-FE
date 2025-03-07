import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Sidebar from "./components/Sidebar/Sidebar"; // Adjust import path if necessary

const ProfileLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar at the top */}
      <Navbar />

      {/* Main Content with Sidebar */}
      <div className="flex flex-1">
        {/* Sidebar Fixed on the Left */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-4">
          <Outlet />
        </div>
      </div>

      {/* Footer at the bottom */}
      <Footer />
    </div>
  );
};

export default ProfileLayout;
