import React, { useState, useEffect } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaSearch,
  FaFilter,
  FaShoppingBag,
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
  const [isLoading, setIsLoading] = useState(true);
  const ordersPerPage = 5;

  useEffect(() => {
    const fetchOrdersData = async () => {
      setIsLoading(true);
      try {
        const data = await orderAPI.getAll();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi tải dữ liệu',
          text: 'Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.',
        });
      } finally {
        setIsLoading(false);
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
      // Tìm đơn hàng cần duyệt
      const orderToUpdate = orders.find(order => order.orderId === orderId);
      if (!orderToUpdate) {
        throw new Error("Không tìm thấy đơn hàng");
      }

      // Gọi API cập nhật trạng thái
      const response = await orderAPI.updateOrder(orderId, {
        ...orderToUpdate,
        status: "Completed"
      });

      // Cập nhật state local
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId
            ? { ...order, status: "Completed" }
            : order
        )
      );

      Swal.fire(
        "Thành công",
        "Đơn hàng đã được duyệt thành công",
        "success"
      );
    } catch (error) {
      console.error("Lỗi khi duyệt đơn hàng:", error);
      Swal.fire(
        "Lỗi",
        error.message || "Không thể duyệt đơn hàng. Vui lòng thử lại.",
        "error"
      );
    }
  };

  const handleApproveAllOrders = async () => {
    try {
      const pendingOrders = orders.filter(
        (order) => order.status === "Pending"
      );

      if (pendingOrders.length === 0) {
        Swal.fire("Thông báo", "Không có đơn hàng nào đang chờ xử lý.", "info");
        return;
      }

      // Gửi yêu cầu cập nhật tất cả đơn hàng
      const updateResults = await Promise.allSettled(
        pendingOrders.map((order) =>
          orderAPI.updateOrder(order.orderId, {
            ...order,
            status: "Completed"
          })
        )
      );

      // Kiểm tra kết quả cập nhật
      const successOrders = updateResults.filter(
        (result) => result.status === "fulfilled"
      );

      if (successOrders.length > 0) {
        // Cập nhật state local
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.status === "Pending"
              ? { ...order, status: "Completed" }
              : order
          )
        );

        Swal.fire(
          "Thành công",
          `${successOrders.length} đơn hàng đã được duyệt thành công`,
          "success"
        );
      } else {
        throw new Error("Không có đơn hàng nào được duyệt thành công");
      }
    } catch (error) {
      console.error("Lỗi khi duyệt tất cả đơn hàng:", error);
      Swal.fire(
        "Lỗi",
        error.message || "Không thể duyệt các đơn hàng. Vui lòng thử lại.",
        "error"
      );
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
    <div className="p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FaShoppingBag className="text-3xl text-blue-600" />
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Quản lý đơn hàng
          </h1>
        </div>
        <div className="text-sm text-gray-500">
          Tổng số đơn hàng: {orders.length}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 transition-all duration-300 hover:shadow-xl">
        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm đơn hàng..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <div className="relative min-w-[200px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all duration-300"
              >
                <option value="All">Tất cả trạng thái</option>
                <option value="Pending">Đang xử lý</option>
                <option value="Completed">Đã hoàn thành</option>
                <option value="Cancelled">Đã hủy</option>
              </select>
            </div>

            <button
              onClick={handleApproveAllOrders}
              className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <FaCheckCircle />
              Duyệt tất cả
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto -mx-4 md:mx-0">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden border border-gray-200 rounded-xl">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="p-4 text-left text-xs font-semibold text-gray-600">Mã đơn hàng</th>
                    <th className="p-4 text-left text-xs font-semibold text-gray-600">Tên khách hàng</th>
                    <th className="p-4 text-left text-xs font-semibold text-gray-600">Tổng tiền</th>
                    <th className="p-4 text-left text-xs font-semibold text-gray-600">Ngày đặt hàng</th>
                    <th className="p-4 text-left text-xs font-semibold text-gray-600">Tình trạng</th>
                    <th className="p-4 text-left text-xs font-semibold text-gray-600">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan="6" className="text-center py-8">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                          <span className="ml-3">Đang tải dữ liệu...</span>
                        </div>
                      </td>
                    </tr>
                  ) : currentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-gray-500">
                        Không tìm thấy đơn hàng nào
                      </td>
                    </tr>
                  ) : (
                    currentOrders.map((order) => (
                      <tr 
                        key={order.orderId}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="p-4 text-sm text-gray-900 whitespace-nowrap">
                          #{order.orderId}
                        </td>
                        <td className="p-4 text-sm text-gray-900 whitespace-nowrap">
                          {getUserFullName(order.userId)}
                        </td>
                        <td className="p-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                          {formatCurrency(order.finalAmount)}
                        </td>
                        <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                          {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "Cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {order.status === "Completed" ? (
                              <FaCheckCircle className="mr-1.5" />
                            ) : order.status === "Cancelled" ? (
                              <FaTimesCircle className="mr-1.5" />
                            ) : (
                              <FaClock className="mr-1.5" />
                            )}
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          {order.status === "Pending" ? (
                            <button
                              onClick={() => handleApproveOrder(order.orderId)}
                              className="inline-flex items-center px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200"
                            >
                              <FaCheckCircle className="mr-1.5" />
                              Duyệt
                            </button>
                          ) : (
                            <span className="text-green-600 flex items-center">
                              <FaCheckCircle className="mr-1.5" />
                              Đã hoàn thành
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pagination Section */}
        {!isLoading && totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <nav className="flex items-center space-x-2" aria-label="Pagination">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    currentPage === index + 1
                      ? "bg-blue-500 text-white shadow-md transform scale-105"
                      : "bg-white text-gray-500 hover:bg-gray-50 border"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
