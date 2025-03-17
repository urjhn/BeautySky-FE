import React, { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import SalesChart from "../charts/SalesChart";
import RevenueChart from "../charts/RevenueChart";
import CustomersChart from "../charts/CustomersChart";
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
import orderAPI from "../../../services/order";

const Dashboard = () => {
  const { users } = useUsersContext();
  const { products } = useDataContext();
  const [orders, setOrders] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [revenueGrowth, setRevenueGrowth] = useState([]);
  const [customerGrowth, setCustomerGrowth] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [leadData, setLeadData] = useState([]);
  const [conversionRate, setConversionRate] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderAPI.getAll(); // Gọi API lấy tất cả đơn hàng
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    if (!orders || orders.length === 0) return;

    // Tính tổng doanh thu từ các đơn hoàn thành
    const totalRevenue = orders
      .filter((order) => order.status === "Completed")
      .reduce((sum, order) => sum + order.totalAmount, 0);
    setRevenue(totalRevenue);

    // Tính doanh thu theo tháng
    const monthlyRevenue = {};
    const monthlySales = {};

    orders.forEach((order) => {
      if (order.status === "Completed") {
        const orderDate = new Date(order.orderDate);
        const month = `${orderDate.getFullYear()}-${orderDate.getMonth() + 1}`; // YYYY-MM

        // Doanh thu theo tháng
        if (!monthlyRevenue[month]) {
          monthlyRevenue[month] = 0;
        }
        monthlyRevenue[month] += order.totalAmount;

        // Số đơn hàng theo tháng
        if (!monthlySales[month]) {
          monthlySales[month] = 0;
        }
        monthlySales[month] += 1;
      }
    });

    // Convert object thành mảng để hiển thị trên biểu đồ
    setRevenueGrowth(
      Object.keys(monthlyRevenue).map((month) => ({
        month,
        revenue: monthlyRevenue[month],
      }))
    );

    setSalesData(
      Object.keys(monthlySales).map((month) => ({
        month,
        sales: monthlySales[month],
      }))
    );
  }, [orders]);

  useEffect(() => {
    if (users.length > 0) {
      const monthlyCustomers = {};
      users.forEach((user) => {
        const dateCreate = new Date(user.dateCreate); // Ngày đăng ký của user
        const month = `${dateCreate.getFullYear()}-${
          dateCreate.getMonth() + 1
        }`; // YYYY-MM

        if (!monthlyCustomers[month]) {
          monthlyCustomers[month] = 0;
        }
        monthlyCustomers[month] += 1; // Tăng số lượng khách hàng trong tháng đó
      });

      const customerData = Object.keys(monthlyCustomers).map((month) => ({
        month,
        customers: monthlyCustomers[month],
      }));

      setCustomerGrowth(customerData);

      const monthlyLeads = {};

      users.forEach((user) => {
        const dateCreate = new Date(user.dateCreate);
        const month = `${dateCreate.getFullYear()}-${
          dateCreate.getMonth() + 1
        }`; // YYYY-MM

        if (!monthlyLeads[month]) {
          monthlyLeads[month] = 0;
        }
        monthlyLeads[month] += 1; // Mỗi user = 1 lead
      });

      const leadDataFormatted = Object.keys(monthlyLeads).map((month) => ({
        month,
        leads: monthlyLeads[month],
      }));

      setLeadData(leadDataFormatted);
    }
  }, [users]); // Chạy khi danh sách users thay đổi

  useEffect(() => {
    if (users.length > 0 && orders.length > 0) {
      const completedOrders = orders.filter(
        (order) => order.status === "Completed"
      ).length;
      const rate = (completedOrders / users.length) * 100; // Tính %
      setConversionRate(rate.toFixed(1)); // Giữ 1 số sau dấu thập phân
    }
  }, [orders, users]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex-1 flex flex-col p-4 md:p-6 space-y-6 md:space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 animate-fade-in">
            Dashboard Overview
          </h1>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            icon={<FaUsers className="text-blue-500" />}
            title="Users"
            value={users.length}
            subtitle="Updated dynamically"
            className="bg-white hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
            gradient="from-blue-500/10 to-blue-100/30"
          />
          <StatCard
            icon={<FaShoppingCart className="text-green-500" />}
            title="Orders"
            value={orders ? orders.length : 0}
            subtitle="Fetched from API"
            className="bg-white hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
            gradient="from-green-500/10 to-green-100/30"
          />
          <StatCard
            icon={<FaBox className="text-purple-500" />}
            title="Products"
            value={products.length}
            subtitle="Stock data from API"
            className="bg-white hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
            gradient="from-purple-500/10 to-purple-100/30"
          />
          <StatCard
            icon={<FaMoneyBillWave className="text-yellow-500" />}
            title="Revenue"
            value={new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(revenue)}
            subtitle="Real-time revenue"
            className="bg-white hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
            gradient="from-yellow-500/10 to-yellow-100/30"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <div className="w-full min-h-[300px] md:min-h-[400px]">
              <SalesChart salesData={salesData} leadData={leadData} />
            </div>
          
            <div className="w-full min-h-[300px] md:min-h-[400px]">
              <RevenueChart revenueGrowth={revenueGrowth} />
            </div>
        </div>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          <StatCard
            icon={<FaChartLine className="text-indigo-500" />}
            title="Conversion Rate"
            value={`${conversionRate}%`}
            subtitle="Improved from last month"
            className="bg-white hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
            gradient="from-indigo-500/10 to-indigo-100/30"
          />
          <StatCard
            icon={<FaPercentage className="text-red-500" />}
            title="Profit Margin"
            value="22.5%"
            subtitle="Stable trend"
            className="bg-white hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
            gradient="from-red-500/10 to-red-100/30"
          />
          <div className="col-span-1 sm:col-span-2 md:col-span-1 bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Customer Growth</h3>
            <CustomersChart customerGrowth={customerGrowth} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
