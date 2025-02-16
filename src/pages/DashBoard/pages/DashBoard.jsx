import React from "react";
import StatCard from "../components/StatCard";
import SalesChart from "../charts/SalesChart";
import RevenueChart from "../charts/RevenueChart";
import CustomersChart from "../charts/CustomersChart";
import RecentOrders from "../components/RecentOrders";
import {
  FaUsers,
  FaShoppingCart,
  FaBox,
  FaDollarSign,
  FaChartLine,
  FaPercentage,
} from "react-icons/fa";

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col p-6 space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<FaUsers />}
            title="Users"
            value="1,234"
            subtitle="+5.2% this month"
          />
          <StatCard
            icon={<FaShoppingCart />}
            title="Orders"
            value="567"
            subtitle="+12% this week"
          />
          <StatCard
            icon={<FaBox />}
            title="Products"
            value="78"
            subtitle="In stock: 50"
          />
          <StatCard
            icon={<FaDollarSign />}
            title="Revenue"
            value="$12,345"
            subtitle="+8.4% this quarter"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SalesChart />
          <RevenueChart />
        </div>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon={<FaChartLine />}
            title="Conversion Rate"
            value="3.8%"
            subtitle="Improved from last month"
          />
          <StatCard
            icon={<FaPercentage />}
            title="Profit Margin"
            value="22.5%"
            subtitle="Stable trend"
          />
          <CustomersChart />
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Orders gần đây
          </h2>
          <RecentOrders />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
