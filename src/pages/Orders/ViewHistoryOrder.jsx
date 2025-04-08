import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";
import orderAPI from "../../services/order";
import { useAuth } from "../../context/AuthContext";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import paymentAPI from "../../services/payment";

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
  const [pendingStatusChange, setPendingStatusChange] = useState(new Set());
  const [pendingCodOrders, setPendingCodOrders] = useState(new Set());

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

  // Thêm useEffect để kiểm tra trạng thái đơn hàng
  useEffect(() => {
    const checkOrderStatus = async () => {
      const ordersToCheck = Array.from(pendingStatusChange);
      for (const orderId of ordersToCheck) {
        try {
          const response = await orderAPI.getOrderDetail(orderId);
          if (response && response.status === "Shipping") {
            // Cập nhật UI khi trạng thái đã chuyển sang Shipping
            setOrders(prevOrders =>
              prevOrders.map(order =>
                order.orderId === orderId
                  ? {
                      ...order,
                      status: "Shipping",
                      shippingDate: response.shippingDate
                    }
                  : order
              )
            );
            
            // Xóa khỏi danh sách theo dõi
            setPendingStatusChange(prev => {
              const newSet = new Set(prev);
              newSet.delete(orderId);
              return newSet;
            });

            // Hiển thị thông báo
            Swal.fire({
              icon: 'info',
              title: 'Trạng thái đơn hàng đã cập nhật',
              text: 'Đơn hàng của bạn đang được giao',
              timer: 3000,
              showConfirmButton: false
            });
          }
        } catch (error) {
          console.error(`Lỗi khi kiểm tra trạng thái đơn hàng ${orderId}:`, error);
        }
      }
    };

    // Kiểm tra mỗi 10 giây nếu có đơn hàng cần theo dõi
    if (pendingStatusChange.size > 0) {
      const interval = setInterval(checkOrderStatus, 10000);
      return () => clearInterval(interval);
    }
  }, [pendingStatusChange]);

  // Thêm useEffect để kiểm tra trạng thái đơn hàng COD
  useEffect(() => {
    const checkCodOrderStatus = async () => {
      const ordersToCheck = Array.from(pendingCodOrders);
      for (const orderId of ordersToCheck) {
        try {
          const response = await orderAPI.getOrderDetail(orderId);
          if (response && response.status === "Shipping") {
            setOrders(prevOrders =>
              prevOrders.map(order =>
                order.orderId === orderId
                  ? {
                      ...order,
                      status: "Shipping",
                      shippingDate: response.shippingDate
                    }
                  : order
              )
            );
            
            setPendingCodOrders(prev => {
              const newSet = new Set(prev);
              newSet.delete(orderId);
              return newSet;
            });

            Swal.fire({
              icon: 'info',
              title: 'Trạng thái đơn hàng đã cập nhật',
              text: 'Đơn hàng của bạn đang được giao',
              timer: 3000,
              showConfirmButton: false
            });
          }
        } catch (error) {
          console.error(`Lỗi khi kiểm tra trạng thái đơn hàng COD ${orderId}:`, error);
        }
      }
    };

    if (pendingCodOrders.size > 0) {
      const interval = setInterval(checkCodOrderStatus, 10000);
      return () => clearInterval(interval);
    }
  }, [pendingCodOrders]);

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
      Completed: "Đã thanh toán",
      Cancelled: "Đã hủy",
      Shipping: "Đang giao hàng",
      Delivered: "Đã nhận được hàng",
    };
    return statusMap[status] || status;
  };

  // Lấy màu cho status
  const getStatusColor = (status) => {
    const colorMap = {
      Pending: "bg-yellow-100 text-yellow-800",
      Completed: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800",
      Shipping: "bg-purple-100 text-purple-800",
      Delivered: "bg-blue-100 text-blue-800"            
    };
    return colorMap[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-[80px] sm:pt-[92px] lg:pt-[100px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleCancelOrder = async (orderId) => {
    try {
      // Danh sách các lý do hủy đơn phổ biến
      const cancelReasons = [
        'Muốn thay đổi sản phẩm',
        'Muốn thay đổi địa chỉ giao hàng',
        'Tìm thấy sản phẩm giá tốt hơn',
        'Đặt nhầm sản phẩm',
        'Thay đổi phương thức thanh toán',
        'Không đủ kinh phí thanh toán',
        'Lý do khác'
      ];

      // Tạo HTML cho radio buttons
      const radioOptions = cancelReasons
        .map((reason, index) => `
          <div class="flex items-center mb-3">
            <input type="radio" id="reason${index}" name="cancelReason" value="${reason}" 
                   class="w-4 h-4 text-blue-600 cursor-pointer">
            <label for="reason${index}" class="ml-2 text-gray-700 cursor-pointer">${reason}</label>
          </div>
        `)
        .join('');

      // Hiển thị modal với radio buttons và text area cho "Lý do khác"
      const { value: cancelReason, isConfirmed } = await Swal.fire({
        title: 'Xác nhận hủy đơn hàng',
        html: `
          <div class="text-left">
            <p class="mb-4 text-gray-600 font-medium">Vui lòng chọn lý do hủy đơn hàng:</p>
            <div class="max-h-48 overflow-y-auto mb-4 px-2">
              ${radioOptions}
            </div>
            <div id="otherReasonContainer" class="hidden mt-4">
              <p class="mb-2 text-gray-600">Vui lòng nêu rõ lý do:</p>
              <textarea 
                id="otherReason" 
                class="w-full p-2 border rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Nhập lý do hủy đơn hàng..."
                rows="3"
              ></textarea>
            </div>
          </div>
        `,
        didOpen: () => {
          // Xử lý hiển thị/ẩn textarea khi chọn "Lý do khác"
          const radioButtons = document.getElementsByName('cancelReason');
          const otherReasonContainer = document.getElementById('otherReasonContainer');
          
          radioButtons.forEach(radio => {
            radio.addEventListener('change', (e) => {
              if (e.target.value === 'Lý do khác') {
                otherReasonContainer.classList.remove('hidden');
              } else {
                otherReasonContainer.classList.add('hidden');
              }
            });
          });
        },
        showCancelButton: true,
        confirmButtonText: 'Xác nhận hủy',
        cancelButtonText: 'Đóng',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        preConfirm: () => {
          const selectedReason = document.querySelector('input[name="cancelReason"]:checked')?.value;
          if (!selectedReason) {
            Swal.showValidationMessage('Vui lòng chọn lý do hủy đơn hàng');
            return false;
          }
          if (selectedReason === 'Lý do khác') {
            const otherReason = document.getElementById('otherReason').value.trim();
            if (!otherReason) {
              Swal.showValidationMessage('Vui lòng nhập lý do hủy đơn hàng');
              return false;
            }
            return otherReason;
          }
          return selectedReason;
        },
        allowOutsideClick: () => !Swal.isLoading()
      });

      // Nếu người dùng xác nhận và chọn lý do
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
                  cancelledReason: cancelReason
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

  // Thêm hàm xử lý thanh toán VNPay
  const handlePaymentVNPay = async (order) => {
    try {
      Swal.fire({
        title: "Đang xử lý...",
        text: "Vui lòng chờ trong giây lát",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const paymentRequest = {
        orderId: order.orderId,
        amount: parseInt(order.finalAmount),
        orderInfo: `Thanh toan don hang #${order.orderId}`,
        orderType: "other",
        language: "vn",
        name: user?.name || "",
        orderDescription: `Don hang ${order.orderId}`,
      };

      const vnpayResponse = await paymentAPI.createVNPayPayment(paymentRequest);

      if (vnpayResponse.paymentUrl) {
        window.location.href = vnpayResponse.paymentUrl;
      }
    } catch (error) {
      console.error("Lỗi khi tạo thanh toán:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Không thể tạo thanh toán. Vui lòng thử lại sau.",
      });
    }
  };

  // Thêm hàm xử lý xác nhận đã nhận hàng
  const handleConfirmDelivery = async (orderId) => {
    try {
      const result = await Swal.fire({
        title: 'Xác nhận đã nhận hàng?',
        html: `
          <div class="text-left">
            <p class="mb-3">Vui lòng kiểm tra kỹ:</p>
            <ul class="list-disc pl-4 space-y-2 text-sm">
              <li>Đơn hàng đã được giao đến bạn</li>
              <li>Sản phẩm còn nguyên vẹn, không bị hư hỏng</li>
              <li>Đúng số lượng và chủng loại đã đặt</li>
            </ul>
          </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Xác nhận đã nhận hàng',
        cancelButtonText: 'Kiểm tra lại' 
      });

      if (result.isConfirmed) {
        // Hiển thị loading
        Swal.fire({
          title: 'Đang xử lý...',
          text: 'Vui lòng chờ trong giây lát',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        const response = await paymentAPI.confirmDelivery(orderId);

        if (response.success) {
          // Cập nhật state orders với thông tin mới
          setOrders(prevOrders =>
            prevOrders.map(order =>
              order.orderId === orderId
                ? {
                    ...order,
                    status: 'Delivered',
                    deliveryDate: new Date().toISOString()
                  }
                : order
            )
          );

          await Swal.fire({
            icon: 'success',
            title: 'Xác nhận thành công',
            html: `
              <div class="text-center">
                <p class="mb-2">Cảm ơn bạn đã xác nhận đã nhận hàng!</p>
                <p class="text-sm text-gray-600">Hãy đánh giá sản phẩm để nhận thêm ưu đãi nhé!</p>
              </div>
            `,
            timer: 2000,
            showConfirmButton: false
          });
        }
      }
    } catch (error) {
      console.error('Lỗi khi xác nhận đã nhận hàng:', error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: error.response?.data?.message || 'Không thể xác nhận. Vui lòng thử lại sau.',
        confirmButtonText: 'Đóng'
      });
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 pt-[80px] sm:pt-[92px] lg:pt-[100px] pb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <motion.h1
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center text-gray-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Lịch sử đơn hàng
        </motion.h1>

        {/* Filter Tabs - Cải thiện responsive */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
          {["All", "Pending", "Completed", "Shipping", "Delivered", "Cancelled"].map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedTab(tab);
                setCurrentPage(1);
              }}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all shadow-md ${
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
            className="text-center py-12 sm:py-16 bg-white rounded-xl shadow-lg mt-4"
            variants={itemVariants}
          >
            <div className="text-gray-500 text-lg sm:text-xl mb-4">
              Bạn chưa có đơn hàng nào
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/product")}
              className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:shadow-lg transition-all duration-300"
            >
              Mua sắm ngay
            </motion.button>
          </motion.div>
        ) : (
          <>
            {/* Mobile View */}
            <div className="grid gap-4 sm:gap-6 md:hidden">
              {paginatedOrders.map((order) => (
                <motion.div
                  key={order.orderId}
                  variants={itemVariants}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/profilelayout/orderdetail/${order.orderId}`)}
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
                        ? `Ngày hủy: ${dayjs(order.cancelDate).format("DD/MM/YYYY HH:mm")}`
                        : `Ngày đặt: ${dayjs(order.orderDate).format("DD/MM/YYYY HH:mm")}`}
                    </p>
                    <p className="font-bold text-xl text-blue-600">
                      {formatCurrency(order.finalAmount)}
                    </p>
                  </div>

                  <div className="mt-4 flex gap-3">
                    {order.status === "Pending" && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài
                          handlePaymentVNPay(order);
                        }}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <i className="fas fa-credit-card"></i>
                        Thanh toán lại
                      </motion.button>
                    )}

                    {order.status === "Pending" && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài
                          handleCancelOrder(order.orderId);
                        }}
                        className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        Hủy đơn hàng
                      </motion.button>
                    )}

                    {order.status === "Shipping" && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConfirmDelivery(order.orderId);
                        }}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <i className="fas fa-check-circle"></i>
                        Đã nhận được hàng
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

            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
              <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg min-w-[800px]">
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
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/profilelayout/orderdetail/${order.orderId}`)}
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
                            {order.status === "Pending" && (
                              <>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePaymentVNPay(order);
                                  }}
                                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                                >
                                  <i className="fas fa-credit-card mr-2"></i>
                                  Thanh toán lại
                                </motion.button>

                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCancelOrder(order.orderId);
                                  }}
                                  className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-all duration-300"
                                >
                                  Hủy đơn
                                </motion.button>
                              </>
                            )}

                            {order.status === "Shipping" && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleConfirmDelivery(order.orderId);
                                }}
                                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                              >
                                <i className="fas fa-check-circle mr-2"></i>
                                Đã nhận được hàng
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

            {/* Pagination - Cải thiện responsive */}
            {totalPages > 1 && (
              <motion.div
                variants={itemVariants}
                className="flex justify-center mt-6 sm:mt-8 gap-2 sm:gap-3 items-center flex-wrap"
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
      </div>
    </motion.div>
  );
};

export default OrderHistory;
