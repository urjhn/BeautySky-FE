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
import paymentsAPI from "../../../services/payment";

const Order = () => {
  const { orders = [], setOrders } = useOrdersContext();
  const { users = [], fetchUsers } = useUsersContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const ordersPerPage = 5;

  const fetchOrdersData = async () => {
    setIsLoading(true);
    try {
      // Lấy orders trước
      const ordersData = await orderAPI.getAll();
      
      // Nếu có orders thì mới lấy payments
      if (ordersData && ordersData.length > 0) {
        try {
          const paymentsData = await paymentsAPI.getAllPaymentDetails();
          
          // Kết hợp dữ liệu
          const combinedData = ordersData.map(order => {
            const payment = paymentsData?.find(p => 
              p.order && p.order.orderId === order.orderId
            );

            return {
              ...order,
              userFullName: order.user?.fullName || "Không xác định",
              userPhone: order.user?.phone || "Không có",
              paymentStatus: payment?.paymentStatus || "Chưa thanh toán",
              paymentType: payment?.paymentType || "Chưa có",
              paymentDate: payment?.paymentDate || null
            };
          });

          setOrders(combinedData);
        } catch (paymentError) {
          console.error("Lỗi khi lấy thông tin thanh toán:", paymentError);
          // Vẫn hiển thị orders nếu không lấy được payments
          setOrders(ordersData.map(order => ({
            ...order,
            userFullName: order.user?.fullName || "Không xác định",
            userPhone: order.user?.phone || "Không có",
            paymentStatus: "Chưa thanh toán",
            paymentType: "Chưa có"
          })));
        }
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi tải dữ liệu',
        text: error.message || 'Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.',
      });
      setOrders([]);
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

      // Hiển thị loading
      Swal.fire({
        title: 'Đang xử lý...',
        text: 'Vui lòng chờ trong giây lát',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        // Thử gọi API với retry logic
        let retries = 3;
        let response;
        
        while (retries > 0) {
          try {
            response = await paymentsAPI.processAndConfirmPayment(orderId);
            break; // Thoát loop nếu thành công
          } catch (error) {
            retries--;
            if (retries === 0) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000)); // Đợi 1s trước khi thử lại
          }
        }

        if (response) {
          // Cập nhật state local
          setOrders(prevOrders =>
            prevOrders.map(order =>
              order.orderId === orderId
                ? {
                    ...order,
                    status: "Completed",
                    paymentStatus: "Confirmed",
                    paymentId: response.paymentId,
                    paymentDate: new Date().toISOString()
                  }
                : order
            )
          );

          await Swal.fire({
            icon: 'success',
            title: 'Duyệt đơn thành công',
            text: `Đơn hàng #${orderId} đã được duyệt và thanh toán`,
            timer: 2000,
            timerProgressBar: true
          });

          // Refresh lại dữ liệu
          await fetchOrdersData();
        }
      } catch (error) {
        console.error("Chi tiết lỗi:", error);
        let errorMessage = 'Không thể duyệt đơn hàng. Vui lòng thử lại.';
        
        if (error.response) {
          if (error.response.status === 500) {
            errorMessage = 'Lỗi hệ thống, vui lòng thử lại sau hoặc liên hệ admin.';
          } else if (error.response.status === 404) {
            errorMessage = 'Không tìm thấy đơn hàng này.';
          }
        }

        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: errorMessage,
          showConfirmButton: true,
          confirmButtonText: 'Thử lại',
          showCancelButton: true,
          cancelButtonText: 'Đóng'
        }).then((result) => {
          if (result.isConfirmed) {
            handleApproveOrder(orderId); // Thử lại nếu người dùng muốn
          }
        });
      }
    } catch (error) {
      console.error("Lỗi ngoại lệ:", error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi không mong muốn',
        text: 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.',
      });
    }
  };

  const handleApproveAllOrders = async () => {
    try {
      const pendingOrders = orders.filter(order => order.status === "Pending");

      if (pendingOrders.length === 0) {
        Swal.fire({
          icon: 'info',
          title: 'Thông báo',
          text: 'Không có đơn hàng nào đang chờ xử lý.'
        });
        return;
      }

      const result = await Swal.fire({
        title: 'Xác nhận duyệt tất cả',
        text: `Bạn có chắc muốn duyệt ${pendingOrders.length} đơn hàng đang chờ?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Duyệt tất cả',
        cancelButtonText: 'Hủy',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33'
      });

      if (!result.isConfirmed) return;

      // Hiển thị loading
      const loadingSwal = Swal.fire({
        title: 'Đang xử lý...',
        html: 'Vui lòng chờ trong giây lát<br/>Đang xử lý đơn hàng...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Xử lý từng đơn hàng
      const results = await Promise.allSettled(
        pendingOrders.map(async (order) => {
          try {
            const response = await paymentsAPI.processAndConfirmPayment(order.orderId);
            return {
              orderId: order.orderId,
              success: true,
              paymentId: response.paymentId
            };
          } catch (error) {
            return {
              orderId: order.orderId,
              success: false,
              error: error.response?.data || 'Lỗi không xác định'
            };
          }
        })
      );

      // Đóng loading
      await loadingSwal.close();

      // Thống kê kết quả
      const successfulOrders = results.filter(r => r.status === 'fulfilled' && r.value.success);
      const failedOrders = results.filter(r => r.status === 'fulfilled' && !r.value.success);

      // Cập nhật state
      if (successfulOrders.length > 0) {
        setOrders(prevOrders =>
          prevOrders.map(order => {
            const successResult = successfulOrders.find(r => r.value.orderId === order.orderId);
            if (successResult) {
              return {
                ...order,
                status: "Completed",
                paymentStatus: "Confirmed",
                paymentId: successResult.value.paymentId,
                paymentDate: new Date().toISOString()
              };
            }
            return order;
          })
        );
      }

      // Hiển thị kết quả
      await Swal.fire({
        icon: successfulOrders.length > 0 ? 'success' : 'warning',
        title: 'Kết quả xử lý',
        html: `
          <div class="text-left">
            <p>✅ Thành công: ${successfulOrders.length} đơn hàng</p>
            ${failedOrders.length > 0 ? `<p>❌ Thất bại: ${failedOrders.length} đơn hàng</p>` : ''}
            ${failedOrders.length > 0 ? '<p class="text-red-500 mt-2">Một số đơn hàng không thể xử lý, vui lòng thử lại sau.</p>' : ''}
          </div>
        `
      });

      // Refresh lại dữ liệu
      await fetchOrdersData();

    } catch (error) {
      console.error("Lỗi khi duyệt tất cả đơn hàng:", error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Có lỗi xảy ra khi duyệt đơn hàng. Vui lòng thử lại.',
      });
    }
  };

  const filteredOrders = orders.filter((order) => {
    const search = searchTerm.toLowerCase();
    return (
      [
        order.orderId,
        order.userId,
        order.userFullName,
        order.userPhone,
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

  // Thêm xử lý khi không có dữ liệu
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
                    <th className="p-4 text-left text-xs font-semibold text-gray-600">Số điện thoại</th>
                    <th className="p-4 text-left text-xs font-semibold text-gray-600">Tổng tiền</th>
                    <th className="p-4 text-left text-xs font-semibold text-gray-600">Ngày đặt hàng</th>
                    <th className="p-4 text-left text-xs font-semibold text-gray-600">Trạng thái đơn hàng</th>
                    <th className="p-4 text-left text-xs font-semibold text-gray-600">Trạng thái thanh toán</th>
                    <th className="p-4 text-left text-xs font-semibold text-gray-600">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan="8" className="text-center py-8">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                          <span className="ml-3">Đang tải dữ liệu...</span>
                        </div>
                      </td>
                    </tr>
                  ) : currentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-8 text-gray-500">
                        Không tìm thấy đơn hàng nào
                      </td>
                    </tr>
                  ) : (
                    currentOrders.map((order) => (
                      <tr key={order.orderId} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="p-4 text-sm text-gray-900">#{order.orderId}</td>
                        <td className="p-4 text-sm text-gray-900">{order.userFullName}</td>
                        <td className="p-4 text-sm text-gray-900">{order.userPhone}</td>
                        <td className="p-4 text-sm font-medium text-gray-900">
                          {formatCurrency(order.totalAmount)}
                        </td>
                        <td className="p-4 text-sm text-gray-500">
                          {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="p-4">
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
                        <td className="p-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            order.paymentStatus === "Confirmed"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {order.paymentStatus || "Chưa thanh toán"}
                          </span>
                        </td>
                        <td className="p-4">
                          {order.status === "Pending" && (
                            <button
                              onClick={() => handleApproveOrder(order.orderId)}
                              className="inline-flex items-center px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200"
                            >
                              <FaCheckCircle className="mr-1.5" />
                              Duyệt
                            </button>
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
