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
import dayjs from "dayjs";

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
  const [timeFrame, setTimeFrame] = useState("monthly");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderAPI.getAll(); // Gọi API lấy tất cả đơn hàng
        // Kết hợp thông tin người dùng với đơn hàng
        const ordersWithUserInfo = data.map((order) => {
          const user = users.find((u) => u.userId === order.userId) || {};
          return {
            ...order,
            userFullName: user.fullName || "Không xác định",
            userPhone: user.phone || "Không có",
            userAddress: user.address || "Không có",
          };
        });
        setOrders(ordersWithUserInfo);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [users]); // Chạy lại khi danh sách users thay đổi

  useEffect(() => {
    if (!orders || orders.length === 0) return;

    // Tính tổng doanh thu từ các đơn hoàn thành
    const totalRevenue = orders
      .filter((order) => order.status === "Completed")
      .reduce((sum, order) => sum + order.totalAmount, 0);
    setRevenue(totalRevenue);
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

  // Sort orders from newest to oldest
  const sortedOrders = orders.sort((a, b) => dayjs(b.orderDate).valueOf() - dayjs(a.orderDate).valueOf());

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex-1 flex flex-col p-4 md:p-6 space-y-6 md:space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 animate-fade-in">
            Tổng quan Bảng điều khiển
          </h1>
          <div className="text-sm text-gray-500">
            Cập nhật lần cuối: {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Time Frame Selector */}
        <div className="flex justify-end mb-4">
          <select
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value)}
            className="border border-gray-300 rounded-lg p-2"
          >
            <option value="monthly">Theo tháng</option>
            <option value="yearly">Theo năm</option>
          </select>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            icon={<FaUsers className="text-blue-500" />}
            title="Người dùng"
            value={users.length}
            className="bg-white hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
            gradient="from-blue-500/10 to-blue-100/30"
          />
          <StatCard
            icon={<FaShoppingCart className="text-green-500" />}
            title="Đơn hàng"
            value={orders ? orders.length : 0}
            className="bg-white hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
            gradient="from-green-500/10 to-green-100/30"
          />
          <StatCard
            icon={<FaBox className="text-purple-500" />}
            title="Sản phẩm"
            value={products.length}
            className="bg-white hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
            gradient="from-purple-500/10 to-purple-100/30"
          />
          <StatCard
            icon={<FaMoneyBillWave className="text-yellow-500" />}
            title="Doanh thu"
            value={new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(revenue)}
            className="bg-white hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
            gradient="from-yellow-500/10 to-yellow-100/30"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <div className="w-full min-h-[300px] md:min-h-[400px] flex items-center justify-center">
            <RevenueChart revenueGrowth={revenueGrowth} />
          </div>
          <div className="w-full min-h-[300px] md:min-h-[400px] flex items-center justify-center">
            <CustomersChart customerGrowth={customerGrowth} />
          </div>
        </div>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          <StatCard
            icon={<FaChartLine className="text-indigo-500" />}
            title="Tỷ lệ chuyển đổi"
            value={`${conversionRate}%`}
            className="bg-white hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
            gradient="from-indigo-500/10 to-indigo-100/30"
          />
          <StatCard
            icon={<FaPercentage className="text-red-500" />}
            title="Lợi nhuận"
            value="22.5%"
            className="bg-white hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
            gradient="from-red-500/10 to-red-100/30"
          />
        </div>

        {/* Order List Section */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Danh sách đơn hàng</h2>
          <div className="overflow-x-auto max-h-96">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã đơn hàng
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số điện thoại
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Địa chỉ
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày đặt
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedOrders.map((order) => (
                  <tr key={order.orderId} className="hover:bg-gray-50">
                    <td className="p-4 text-sm">#{order.orderId}</td>
                    <td className="p-4 text-sm">{order.userFullName}</td>
                    <td className="p-4 text-sm">{order.userPhone}</td>
                    <td className="p-4 text-sm">{order.userAddress}</td>
                    <td className="p-4 text-sm font-medium">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(order.finalAmount)}
                    </td>
                    <td className="p-4 text-sm">
                      {dayjs(order.orderDate).format("DD/MM/YYYY HH:mm")}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.status === "Completed"
                          ? "Đã hoàn thành"
                          : order.status === "Pending"
                          ? "Chờ xử lý"
                          : "Đã hủy"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
