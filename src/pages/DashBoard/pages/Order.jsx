import React, { useState } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaSearch,
} from "react-icons/fa";
import { formatCurrency } from "../../../utils/formatCurrency";

const allOrders = [
  {
    id: "ORD001",
    customer: "John Doe",
    amount: "260000",
    date: "2025-02-10",
    status: "Completed",
  },
  {
    id: "ORD002",
    customer: "Jane Smith",
    amount: "550000",
    date: "2025-02-11",
    status: "Pending",
  },
  {
    id: "ORD003",
    customer: "Alice Johnson",
    amount: "230000",
    date: "2025-02-12",
    status: "Cancelled",
  },
  {
    id: "ORD004",
    customer: "David Brown",
    amount: "950000",
    date: "2025-02-13",
    status: "Completed",
  },
  {
    id: "ORD005",
    customer: "Emma Wilson",
    amount: "350000",
    date: "2025-02-14",
    status: "Pending",
  },
];

const Order = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;
  const [searchTerm, setSearchTerm] = useState("");

  // Lọc danh sách đơn hàng theo từ khóa tìm kiếm
  const filteredOrders = allOrders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.amount.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.date.includes(searchTerm) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Tính toán danh sách đơn hàng hiển thị trên trang hiện tại
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  // Tổng số trang
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>
      <div className="bg-white p-4 rounded-lg shadow-md">
        {/* Search bar */}
        <div className="flex justify-between items-center mb-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-2.5 text-gray-500" />
            <input
              type="text"
              placeholder="Search orders..."
              className="pl-10 pr-4 py-2 border rounded-md w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="p-3">{order.id}</td>
                <td className="p-3">{order.customer}</td>
                <td className="p-3">{formatCurrency(order.amount)}</td>
                <td className="p-3">{order.date}</td>
                <td className="p-3 flex items-center">
                  {order.status === "Completed" ? (
                    <FaCheckCircle className="text-green-500 mr-2" />
                  ) : order.status === "Cancelled" ? (
                    <FaTimesCircle className="text-red-500 mr-2" />
                  ) : (
                    <FaClock className="text-yellow-500 mr-2" />
                  )}
                  {order.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Box */}
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 border rounded-md ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Order;
