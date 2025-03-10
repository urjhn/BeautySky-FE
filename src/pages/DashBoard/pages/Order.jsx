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
import orderAPI from "../../../services/order";
import Swal from "sweetalert2";

const Order = () => {
  const { orders = [], setOrders } = useOrdersContext();
  const { users = [], fetchUsers } = useUsersContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const ordersPerPage = 5;

  useEffect(() => {
    const fetchOrdersData = async () => {
      try {
        const data = await orderAPI.getAll();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrdersData();
    fetchUsers();
  }, []);

  const getUserFullName = (userId) => {
    return (
      users.find((user) => user.userId === userId)?.fullName ||
      "Không tìm thấy người dùng"
    );
  };

  const handleApproveOrder = async (orderId) => {
    try {
      const response = await orderAPI.createOrderCompleted(orderId);

      if (response?.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderId
              ? { ...order, status: "Completed" }
              : order
          )
        );

        Swal.fire(
          "Success",
          `Đơn hàng ${orderId} được duyệt thành công!`,
          "success"
        );
      } else {
        throw new Error("API không phản hồi thành công");
      }
    } catch (error) {
      console.error("Lỗi duyệt đơn hàng:", error);
      Swal.fire("Error", "Lỗi duyệt đơn hàng.", "error");
    }
  };

  const handleApproveAllOrders = async () => {
    try {
      const pendingOrders = orders.filter(
        (order) => order.status === "Pending"
      );

      if (pendingOrders.length === 0) {
        Swal.fire("Info", "Không có đơn hàng nào đang chờ xử lý.", "info");
        return;
      }

      // Gửi yêu cầu cập nhật tất cả đơn hàng
      const updateResults = await Promise.allSettled(
        pendingOrders.map((order) =>
          orderAPI.createOrderCompleted(order.orderId)
        )
      );

      // Kiểm tra nếu tất cả đơn hàng đều duyệt thành công
      const successOrders = updateResults.filter(
        (res) => res.status === "fulfilled"
      );

      if (successOrders.length > 0) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.status === "Pending"
              ? { ...order, status: "Completed" }
              : order
          )
        );

        Swal.fire(
          "Success",
          `${successOrders.length} đơn hàng đã được duyệt`,
          "success"
        );
      } else {
        throw new Error("Không có đơn hàng nào được duyệt thành công");
      }
    } catch (error) {
      console.error("Lỗi duyệt tất cả đơn hàng:", error);
      Swal.fire("Error", "Lỗi duyệt tất cả đơn hàng", "error");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const search = searchTerm.toLowerCase();
    return (
      [
        order.orderId,
        order.userId,
        getUserFullName(order.userId),
        order.finalAmount,
        order.orderDate,
        order.status,
      ]
        .map((value) => String(value || "").toLowerCase())
        .some((field) => field.includes(search)) &&
      (filterStatus === "All" || order.status === filterStatus)
    );
  });

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  return (
    <div className="p-2 sm:p-4 md:p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Orders</h1>
      <div className="bg-white p-2 sm:p-4 rounded-lg shadow-md">
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:w-80">
              <FaSearch className="absolute left-3 top-2.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search orders..."
                className="pl-10 pr-4 py-2 border rounded-md w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border rounded-md w-full"
              >
                <option value="All">All</option>
                <option value="Pending">Đang xử lý</option>
                <option value="Completed">Đã hoàn thành</option>
                <option value="Cancelled">Đã hủy</option>
              </select>
              <button
                onClick={handleApproveAllOrders}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 w-full"
              >
                Duyệt tất cả
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden border border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-2 sm:p-3 text-left text-xs sm:text-sm">Mã đơn hàng</th>
                    <th className="p-2 sm:p-3 text-left text-xs sm:text-sm">Tên khách hàng</th>
                    <th className="p-2 sm:p-3 text-left text-xs sm:text-sm">Tổng tiền</th>
                    <th className="p-2 sm:p-3 text-left text-xs sm:text-sm">Ngày đặt hàng</th>
                    <th className="p-2 sm:p-3 text-left text-xs sm:text-sm">Tình trạng</th>
                    <th className="p-2 sm:p-3 text-left text-xs sm:text-sm">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentOrders.map((order) => (
                    <tr key={order.orderId}>
                      <td className="p-2 sm:p-3 text-xs sm:text-sm">{order.orderId}</td>
                      <td className="p-2 sm:p-3 text-xs sm:text-sm">{getUserFullName(order.userId)}</td>
                      <td className="p-2 sm:p-3 text-xs sm:text-sm">{formatCurrency(order.finalAmount)}</td>
                      <td className="p-2 sm:p-3 text-xs sm:text-sm">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                      <td className="p-2 sm:p-3 text-xs sm:text-sm flex items-center">
                        {order.status === "Completed" ? (
                          <FaCheckCircle className="text-green-600 mr-2" />
                        ) : order.status === "Cancelled" ? (
                          <FaTimesCircle className="text-red-500 mr-2" />
                        ) : (
                          <FaClock className="text-yellow-500 mr-2" />
                        )}
                        {order.status}
                      </td>
                      <td className="p-2 sm:p-3 text-xs sm:text-sm">
                        {order.status === "Pending" ? (
                          <button
                            onClick={() => handleApproveOrder(order.orderId)}
                            className="px-2 sm:px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-xs sm:text-sm"
                          >
                            Duyệt
                          </button>
                        ) : (
                          <span className="text-green-600">Đã hoàn thành</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-4 gap-1 sm:gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-2 sm:px-3 py-1 border rounded-md text-xs sm:text-sm ${
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
