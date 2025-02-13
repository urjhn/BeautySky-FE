// src/Dashboard/pages/Dashboard.jsx
import React from "react";
import StatCard from "../components/StatCard";
import SalesChart from "../charts/SalesChart";
import RevenueChart from "../charts/RevenueChart";
import { FaUsers, FaShoppingCart, FaBox, FaDollarSign } from "react-icons/fa";

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col">
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard icon={<FaUsers />} title="Users" value="1,234" />
          <StatCard icon={<FaShoppingCart />} title="Orders" value="567" />
          <StatCard icon={<FaBox />} title="Products" value="78" />
          <StatCard icon={<FaDollarSign />} title="Revenue" value="$12,345" />
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <SalesChart />
          <RevenueChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
