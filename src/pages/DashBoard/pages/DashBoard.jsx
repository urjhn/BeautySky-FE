import React, { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import SalesChart from "../charts/SalesChart";
import RevenueChart from "../charts/RevenueChart";
import CustomersChart from "../charts/CustomersChart";
import RecentOrders from "../components/RecentOrders";
import {
  FaUsers,
  FaShoppingCart,
  FaBox,
  FaMoneyBillWave,
  FaChartLine,
  FaPercentage,
} from "react-icons/fa";
import { useUsersContext } from "../../../context/UserContext";
import { useDataContext } from "../../../context/DataContext";

const Dashboard = () => {
  const { users } = useUsersContext();
  const { products } = useDataContext();
  const [orders, setOrders] = useState([]);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get("/Orders");
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders data:", error);
      }
    };

    const fetchRevenue = async () => {
      try {
        const response = await axiosInstance.get("/Revenue");
        setRevenue(response.data.totalRevenue);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    };

    fetchOrders();
    fetchRevenue();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col p-6 space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<FaUsers />}
            title="Users"
            value={users.length}
            subtitle="Updated dynamically"
          />
          <StatCard
            icon={<FaShoppingCart />}
            title="Orders"
            value={orders.length}
            subtitle="Fetched from API"
          />
          <StatCard
            icon={<FaBox />}
            title="Products"
            value={products.length}
            subtitle="Stock data from API"
          />
          <StatCard
            icon={<FaMoneyBillWave />}
            title="Revenue"
            value={new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(revenue)}
            subtitle="Real-time revenue"
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
          <CustomersChart users={users} />
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Recent Orders
          </h2>
          <RecentOrders />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
