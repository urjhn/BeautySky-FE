import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import {
  FaChartBar,
  FaShoppingCart,
  FaUsers,
  FaBox,
  FaHome,
  FaCog,
} from "react-icons/fa";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const Dashboard = () => {
  const { user } = useAuth();

  if (!user || user.role !== "Manager") {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-5 flex flex-col space-y-6">
        <h2 className="text-xl font-bold text-center">Admin Panel</h2>
        <nav>
          <ul className="space-y-4">
            <NavItem icon={<FaChartBar />} title="Dashboard" />
            <NavItem icon={<FaHome />} title="Home" />
            <NavItem icon={<FaUsers />} title="Users" />
            <NavItem icon={<FaCog />} title="Settings" />
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-100 text-gray-900">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {/* Thống kê */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard icon={<FaUsers />} title="Users" value="1,234" />
          <StatCard icon={<FaShoppingCart />} title="Orders" value="567" />
          <StatCard icon={<FaBox />} title="Products" value="78" />
          <StatCard icon={<FaChartBar />} title="Revenue" value="$12,345" />
        </div>

        {/* Biểu đồ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <ChartCard title="Sales Overview">
            <Line
              data={{
                labels: ["Jan", "Feb", "Mar", "Apr", "May"],
                datasets: [
                  {
                    label: "Sales",
                    data: [1200, 1900, 3000, 5000, 7000],
                    borderColor: "#0272cd",
                    backgroundColor: "rgba(2, 114, 205, 0.2)",
                  },
                ],
              }}
            />
          </ChartCard>

          <ChartCard title="Revenue Growth">
            <Bar
              data={{
                labels: ["Jan", "Feb", "Mar", "Apr", "May"],
                datasets: [
                  {
                    label: "Revenue",
                    data: [3000, 5000, 7000, 9000, 12000],
                    backgroundColor: "#6BBCFE",
                  },
                ],
              }}
            />
          </ChartCard>
        </div>
      </main>
    </div>
  );
};

// Component cho Sidebar Item
const NavItem = ({ icon, title }) => (
  <li className="flex items-center space-x-3 p-3 hover:bg-gray-700 rounded-md cursor-pointer">
    <div className="text-xl">{icon}</div>
    <span>{title}</span>
  </li>
);

// Component hiển thị thống kê
const StatCard = ({ icon, title, value }) => (
  <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
    <div className="text-3xl text-blue-500">{icon}</div>
    <div>
      <p className="text-gray-600">{title}</p>
      <h2 className="text-2xl font-semibold text-gray-800">{value}</h2>
    </div>
  </div>
);

// Component hiển thị biểu đồ
const ChartCard = ({ title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
    {children}
  </div>
);

export default Dashboard;
