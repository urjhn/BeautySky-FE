import React, { useState, useEffect } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaSearch,
} from "react-icons/fa";
import { formatCurrency } from "../../../utils/formatCurrency";
import { useOrdersContext } from "../../../context/OrdersContext";
import { useUsersContext } from "../../../context/UserContext";

const Order = () => {
  const { orders, fetchOrders } = useOrdersContext();
  const { users, fetchUsers } = useUsersContext();
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOrders();
    fetchUsers();
  }, []);

  // Get user's full name based on userId
  const getUserFullName = (userId) => {
    const user = users.find((u) => u.userId === userId);
    return user ? user.fullName : "Unknown User";
  };

  // Filter orders based on search term
  const filteredOrders = orders.filter((order) => {
    const orderId = order.orderId?.toString().toLowerCase() || "";
    const userId = order.userId?.toString().toLowerCase() || "";
    const fullName = getUserFullName(order.userId)?.toLowerCase() || "";
    const totalAmount = order.finalAmount?.toString().toLowerCase() || "";
    const orderDate =
      new Date(order.orderDate).toLocaleDateString().toLowerCase() || "";
    const status = order.status?.toLowerCase() || "";

    return (
      orderId.includes(searchTerm.toLowerCase()) ||
      userId.includes(searchTerm.toLowerCase()) ||
      fullName.includes(searchTerm.toLowerCase()) ||
      totalAmount.includes(searchTerm.toLowerCase()) ||
      orderDate.includes(searchTerm.toLowerCase()) ||
      status.includes(searchTerm.toLowerCase())
    );
  });

  // Pagination calculation
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  // Total pages
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
              <th className="p-3 text-left">Customer Name</th>
              <th className="p-3 text-left">Total Amount</th>
              <th className="p-3 text-left">Order Date</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order.orderId} className="border-t">
                <td className="p-3">{order.orderId}</td>
                <td className="p-3">{getUserFullName(order.userId)}</td>
                <td className="p-3">{formatCurrency(order.finalAmount)}</td>
                <td className="p-3">
                  {new Date(order.orderDate).toLocaleDateString()}
                </td>
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

        {/* Pagination */}
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
