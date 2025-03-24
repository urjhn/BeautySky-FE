import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { EyeIcon, CreditCardIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";
import orderAPI from "../../services/order";
import { useAuth } from "../../context/AuthContext";
import dayjs from "dayjs";
import Swal from "sweetalert2";

// Thêm animation variants cho Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const OrderHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTab, setSelectedTab] = useState("All");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 7;

  // Fetch orders từ BE
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderAPI.getListOrderUser();
        if (response) {
          // Sắp xếp đơn hàng mới nhất lên đầu
          const sortedOrders = response.sort(
            (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
          );
          setOrders(sortedOrders);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: "Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  // Lọc đơn hàng theo status
  const filteredOrders = orders.filter((order) =>
    selectedTab === "All" ? true : order.status === selectedTab
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Mapping status để hiển thị tiếng Việt
  const getStatusDisplay = (status) => {
    const statusMap = {
      Pending: "Đang xử lý",
      Completed: "Đã giao hàng",
      Cancelled: "Đã hủy",
    };
    return statusMap[status] || status;
  };

  // Lấy màu cho status
  const getStatusColor = (status) => {
    const colorMap = {
      Pending: "bg-yellow-100 text-yellow-800",
      Completed: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800",
    };
    return colorMap[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleCancelOrder = async (orderId) => {
    try {
      // Hiển thị modal nhập lý do hủy đơn
      const { value: cancelReason, isConfirmed } = await Swal.fire({
        title: 'Xác nhận hủy đơn hàng',
        html: `
          <div class="text-left">
            <p class="mb-2 text-gray-600">Vui lòng cho chúng tôi biết lý do bạn muốn hủy đơn hàng:</p>
            <textarea 
              id="cancelReason" 
              class="w-full p-2 border rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Nhập lý do hủy đơn hàng..."
              rows="3"
            ></textarea>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Xác nhận hủy',
        cancelButtonText: 'Đóng',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        preConfirm: () => {
          const reason = document.getElementById('cancelReason').value;
          if (!reason.trim()) {
            Swal.showValidationMessage('Vui lòng nhập lý do hủy đơn hàng');
            return false;
          }
          return reason;
        },
        allowOutsideClick: () => !Swal.isLoading()
      });

      // Nếu người dùng xác nhận và nhập lý do
      if (isConfirmed && cancelReason) {
        // Hiển thị loading
        Swal.fire({
          title: 'Đang xử lý...',
          text: 'Vui lòng chờ trong giây lát',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // Gọi API hủy đơn hàng với lý do
        const response = await orderAPI.cancelOrder(orderId, cancelReason);

        // Cập nhật state orders với thông tin mới
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.orderId === orderId
              ? {
                  ...order,
                  status: 'Cancelled',
                  cancelledDate: new Date().toISOString(),
                  cancelledReason: response.cancelledReason// Thêm cancelDate để hiển thị
                }
              : order
          )
        );

        // Thông báo thành công
        await Swal.fire({
          icon: 'success',
          title: 'Đã hủy đơn hàng',
          text: 'Đơn hàng của bạn đã được hủy thành công',
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Lỗi khi hủy đơn:', error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: error.response?.data?.message || 'Không thể hủy đơn hàng. Vui lòng thử lại sau.'
      });
    }
  };

  return (
    <motion.div
      className="container mx-auto p-4 md:p-6 max-w-7xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Lịch sử đơn hàng
      </motion.h1>

      {/* Filter Tabs - Cải thiện giao diện */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {["All", "Pending", "Completed", "Cancelled"].map((tab) => (
          <motion.button
            key={tab}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSelectedTab(tab);
              setCurrentPage(1);
            }}
            className={`px-6 py-3 rounded-full font-medium transition-all shadow-md ${
              selectedTab === tab
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {tab === "All" ? "Tất cả" : getStatusDisplay(tab)}
          </motion.button>
        ))}
      </div>

      {orders.length === 0 ? (
        <motion.div
          className="text-center py-16 bg-white rounded-xl shadow-lg"
          variants={itemVariants}
        >
          <div className="text-gray-500 text-xl mb-4">
            Bạn chưa có đơn hàng nào
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/product")}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:shadow-lg transition-all duration-300"
          >
            Mua sắm ngay
          </motion.button>
        </motion.div>
      ) : (
        <>
          {/* Mobile View - Cải thiện card design */}
          <div className="grid gap-6 md:hidden">
            {paginatedOrders.map((order) => (
              <motion.div
                key={order.orderId}
                variants={itemVariants}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-lg">#{order.orderId}</span>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusDisplay(order.status)}
                  </span>
                </div>

                <div className="space-y-3">
                  <p className="text-gray-600">
                    <i className="far fa-calendar-alt mr-2"></i>
                    {order.status === "Cancelled"
                      ? `Ngày hủy: ${dayjs(order.cancelDate).format(
                          "DD/MM/YYYY HH:mm"
                        )}`
                      : `Ngày đặt: ${dayjs(order.orderDate).format(
                          "DD/MM/YYYY HH:mm"
                        )}`}
                  </p>
                  <p className="font-bold text-xl text-blue-600">
                    {formatCurrency(order.finalAmount)}
                  </p>
                </div>

                <div className="mt-4 flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/orderdetail/${order.orderId}`)}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <EyeIcon className="w-5 h-5" />
                    Xem chi tiết
                  </motion.button>

                  {order.status === "Pending" && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleCancelOrder(order.orderId)}
                      className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      Hủy đơn hàng
                    </motion.button>
                  )}
                </div>

                {order.status === "Cancelled" && (
                  <div className="mt-3 p-3 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-700 font-medium">Lý do hủy:</p>
                    <p className="text-sm text-red-600">{order.cancelledReason || "Không có lý do"}</p>
                    <p className="text-xs text-red-500 mt-1">
                      Thời gian hủy: {dayjs(order.cancelledDate).format("DD/MM/YYYY HH:mm")}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Desktop View - Cải thiện table design */}
          <div className="hidden md:block">
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium tracking-wider">
                      Mã đơn hàng
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium tracking-wider">
                      Thời gian
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium tracking-wider">
                      Tổng tiền
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedOrders.map((order) => (
                    <motion.tr
                      key={order.orderId}
                      variants={itemVariants}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        #{order.orderId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.status === "Cancelled"
                          ? `Ngày hủy: ${dayjs(order.cancelDate).format(
                              "DD/MM/YYYY HH:mm"
                            )}`
                          : `Ngày đặt: ${dayjs(order.orderDate).format(
                              "DD/MM/YYYY HH:mm"
                            )}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusDisplay(order.status)}
                        </span>
                        {order.status === "Cancelled" && (
                          <div className="mt-2 text-xs text-red-600">
                            <p className="font-medium">Lý do: {order.cancelledReason || "Không có lý do"}</p>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600">
                        {formatCurrency(order.finalAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-3">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(`/profilelayout/orderdetail/${order.orderId}`)}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                          >
                            <EyeIcon className="w-4 h-4 mr-2" />
                            Chi tiết
                          </motion.button>

                          {order.status === "Pending" && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleCancelOrder(order.orderId)}
                              className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-all duration-300"
                            >
                              Hủy đơn
                            </motion.button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>

          {/* Pagination - Cải thiện thiết kế với giới hạn trang */}
          {totalPages > 1 && (
            <motion.div
              variants={itemVariants}
              className="flex justify-center mt-8 gap-3 items-center"
            >
              {/* Nút Previous */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-100 shadow"
                }`}
                disabled={currentPage === 1}
              >
                ‹
              </motion.button>

              {/* Hiển thị các số trang */}
              {[...Array(totalPages)].map((_, i) => {
                if (
                  i + 1 === 1 || // Trang đầu tiên
                  i + 1 === totalPages || // Trang cuối cùng
                  (i + 1 >= currentPage - 2 && i + 1 <= currentPage + 2) // Giới hạn hiển thị 5 trang xung quanh trang hiện tại
                ) {
                  return (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        currentPage === i + 1
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                          : "bg-white text-gray-700 hover:bg-gray-100 shadow"
                      }`}
                    >
                      {i + 1}
                    </motion.button>
                  );
                } else if (
                  i + 1 === currentPage - 3 ||
                  i + 1 === currentPage + 3
                ) {
                  return (
                    <span key={i} className="px-2 text-gray-500">
                      ...
                    </span>
                  );
                }
                return null;
              })}

              {/* Nút Next */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-100 shadow"
                }`}
                disabled={currentPage === totalPages}
              >
                ›
              </motion.button>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default OrderHistory;
