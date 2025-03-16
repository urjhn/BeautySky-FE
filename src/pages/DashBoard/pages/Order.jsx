import React, { useState, useEffect } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaSearch,
  FaFilter,
  FaShoppingBag,
  FaEye
} from "react-icons/fa";
import { formatCurrency } from "../../../utils/formatCurrency";
import { useOrdersContext } from "../../../context/OrdersContext";
import { useUsersContext } from "../../../context/UserContext";
import orderAPI from "../../../services/order";
import Swal from "sweetalert2";
import paymentsAPI from "../../../services/payment";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const Order = () => {
  const { orders = [], setOrders } = useOrdersContext();
  const { users = [], fetchUsers } = useUsersContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const ordersPerPage = 5;
  const navigate = useNavigate();

  const fetchOrdersData = async () => {
    setIsLoading(true);
    try {
      const ordersData = await orderAPI.getAll();
      
      if (ordersData && ordersData.length > 0) {
        try {
          const paymentsData = await paymentsAPI.getAllPaymentDetails();
          
          // Kết hợp và format dữ liệu
          const combinedData = ordersData.map(order => {
            const payment = paymentsData?.find(p => 
              p.order && p.order.orderId === order.orderId
            );

            // Kiểm tra và truy cập thông tin user một cách an toàn hơn
            const userData = order.user || {};
            
            return {
              ...order,
              // Xử lý thông tin user kỹ hơn
              userFullName: userData.fullName || userData.name || "Không xác định",
              userPhone: userData.phone || userData.phoneNumber || "Không có",
              userAddress: userData.address || "Không có",
              // Thêm userId để debug
              userId: userData.userId || userData.id,
              // Thông tin thanh toán
              paymentStatus: payment?.paymentStatus || "Chưa thanh toán",
              paymentType: payment?.paymentType || "Chưa có",
              paymentDate: payment?.paymentDate || null,
              totalAmount: order.finalAmount || order.totalAmount || 0
            };
          });


          // Sắp xếp theo thời gian mới nhất
          const sortedData = combinedData.sort((a, b) => 
            new Date(b.orderDate) - new Date(a.orderDate)
          );

          setOrders(sortedData);
        } catch (paymentError) {
          console.error("Lỗi khi lấy thông tin thanh toán:", paymentError);
          
          // Nếu lỗi payment vẫn xử lý orders
          const formattedOrders = ordersData.map(order => {
            const userData = order.user || {};
            return {
              ...order,
              userFullName: userData.fullName || userData.name || "Không xác định",
              userPhone: userData.phone || userData.phoneNumber || "Không có",
              userAddress: userData.address || "Không có",
              userId: userData.userId || userData.id,
              paymentStatus: "Chưa thanh toán",
              paymentType: "Chưa có"
            };
          });
          setOrders(formattedOrders);
        }
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      console.error("Chi tiết lỗi:", error.response?.data);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi tải dữ liệu',
        text: 'Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersData();
    fetchUsers();
  }, []);

  const handleApproveOrder = async (orderId) => {
    try {
      const result = await Swal.fire({
        title: 'Xác nhận duyệt đơn',
        text: `Bạn có chắc muốn duyệt đơn hàng #${orderId}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Duyệt',
        cancelButtonText: 'Hủy',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33'
      });

      if (!result.isConfirmed) return;

      Swal.fire({
        title: 'Đang xử lý...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      const response = await paymentsAPI.processAndConfirmPayment(orderId);

      if (response) {
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.orderId === orderId
              ? {
                  ...order,
                  status: "Completed",
                  paymentStatus: "Confirmed",
                  paymentDate: new Date().toISOString()
                }
              : order
          )
        );

        await Swal.fire({
          icon: 'success',
          title: 'Duyệt đơn thành công',
          text: `Đơn hàng #${orderId} đã được duyệt`,
          timer: 1500
        });
      }
    } catch (error) {
      console.error("Lỗi khi duyệt đơn:", error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể duyệt đơn hàng. Vui lòng thử lại sau.'
      });
    }
  };

  const handleApproveAllOrders = async () => {
    const pendingOrders = orders.filter(order => order.status === "Pending");

    if (pendingOrders.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Thông báo',
        text: 'Không có đơn hàng nào đang chờ xử lý.'
      });
      return;
    }

    try {
      const result = await Swal.fire({
        title: 'Xác nhận duyệt tất cả',
        text: `Bạn có chắc muốn duyệt ${pendingOrders.length} đơn hàng đang chờ?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Duyệt tất cả',
        cancelButtonText: 'Hủy'
      });

      if (!result.isConfirmed) return;

      Swal.fire({
        title: 'Đang xử lý...',
        html: 'Vui lòng chờ trong giây lát',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      const results = await Promise.allSettled(
        pendingOrders.map(order => 
          paymentsAPI.processAndConfirmPayment(order.orderId)
        )
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      await Swal.fire({
        icon: successful > 0 ? 'success' : 'warning',
        title: 'Kết quả xử lý',
        html: `
          <div class="text-left">
            <p>✅ Thành công: ${successful} đơn hàng</p>
            ${failed > 0 ? `<p>❌ Thất bại: ${failed} đơn hàng</p>` : ''}
          </div>
        `
      });

      await fetchOrdersData();
    } catch (error) {
      console.error("Lỗi khi duyệt tất cả đơn hàng:", error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Có lỗi xảy ra khi duyệt đơn hàng. Vui lòng thử lại.'
      });
    }
  };

  const filteredOrders = orders.filter((order) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = [
      order.orderId,
      order.userFullName,
      order.userPhone,
      order.userAddress,
      order.totalAmount,
      order.status
    ].some(field => 
      String(field).toLowerCase().includes(searchLower)
    );

    return matchesSearch && (filterStatus === "All" || order.status === filterStatus);
  });

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  // Mapping trạng thái sang tiếng Việt
  const getStatusDisplay = (status) => {
    const statusMap = {
      "Pending": "Chờ xử lý",
      "Processing": "Đang xử lý",
      "Completed": "Đã hoàn thành",
      "Cancelled": "Đã hủy"
    };
    return statusMap[status] || status;
  };

  // Xử lý màu sắc cho trạng thái
  const getStatusColor = (status) => {
    const colorMap = {
      "Completed": "bg-green-100 text-green-800",
      "Cancelled": "bg-red-100 text-red-800",
      "Pending": "bg-yellow-100 text-yellow-800",
      "Processing": "bg-blue-100 text-blue-800"
    };
    return colorMap[status] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <FaShoppingBag className="text-3xl text-blue-600" />
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Quản lý đơn hàng
            </h1>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <FaShoppingBag className="mx-auto text-6xl text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Chưa có đơn hàng nào
          </h2>
          <p className="text-gray-500">
            Hiện tại chưa có đơn hàng nào trong hệ thống
          </p>
          <button
            onClick={fetchOrdersData}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Tải lại dữ liệu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
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
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
        {/* Search và Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm đơn hàng..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">Tất cả trạng thái</option>
                <option value="Pending">Chờ xử lý</option>
                <option value="Processing">Đang xử lý</option>
                <option value="Completed">Đã hoàn thành</option>
                <option value="Cancelled">Đã hủy</option>
              </select>
            </div>

            <button
              onClick={handleApproveAllOrders}
              className="px-6 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <FaCheckCircle />
              Duyệt tất cả
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
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
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thanh toán
                </th>
                <th className="p-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentOrders.map((order) => (
                <tr key={order.orderId} className="hover:bg-gray-50">
                  <td className="p-4 text-sm">#{order.orderId}</td>
                  <td className="p-4 text-sm">{order.userFullName}</td>
                  <td className="p-4 text-sm">{order.userPhone}</td>
                  <td className="p-4 text-sm">{order.userAddress}</td>
                  <td className="p-4 text-sm font-medium">
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td className="p-4 text-sm">
                    {dayjs(order.orderDate).format('DD/MM/YYYY HH:mm')}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusDisplay(order.status)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.paymentStatus === "Confirmed" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {order.paymentStatus === "Confirmed" ? "Đã thanh toán" : "Chưa thanh toán"}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => navigate(`/admin/orders/${order.orderId}`)}
                        className="p-1.5 text-blue-600 hover:text-blue-800"
                        title="Xem chi tiết"
                      >
                        <FaEye />
                      </button>
                      {order.status === "Pending" && (
                        <button
                          onClick={() => handleApproveOrder(order.orderId)}
                          className="p-1.5 text-green-600 hover:text-green-800"
                          title="Duyệt đơn"
                        >
                          <FaCheckCircle />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <nav className="flex items-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-2 rounded-lg ${
                    currentPage === i + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {i + 1}
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
