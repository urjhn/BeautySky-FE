import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  TruckIcon,
  XCircleIcon,
  ClockIcon,
  ArrowLeftIcon
} from "@heroicons/react/24/solid";
import { formatCurrency } from "../../utils/formatCurrency";
import orderAPI from "../../services/order";
import dayjs from "dayjs";
import Swal from "sweetalert2";

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        if (!orderId) {
          throw new Error('Không tìm thấy mã đơn hàng');
        }
        
        const response = await orderAPI.getOrderDetail(orderId);
        if (response) {
          setOrder(response);
        } else {
          throw new Error('Không tìm thấy thông tin đơn hàng');
        }
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: error.message || 'Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.'
        });
        navigate('/profilelayout/historyorder');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId, navigate]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
      case "Pending":
        return <ClockIcon className="w-6 h-6 text-yellow-500" />;
      case "Cancelled":
        return <XCircleIcon className="w-6 h-6 text-red-500" />;
      case "Shipping":
        return <TruckIcon className="w-6 h-6 text-purple-500" />;
      case "Delivered":
        return <CheckCircleIcon className="w-6 h-6 text-blue-500" />;
      default:
        return <TruckIcon className="w-6 h-6 text-blue-500" />;
    }
  };

  const getStatusColor = (status) => {
    const colorMap = {
      "Pending": "bg-yellow-100 text-yellow-800",
      "Completed": "bg-green-100 text-green-800", 
      "Cancelled": "bg-red-100 text-red-800",
      "Shipping": "bg-purple-100 text-purple-800",
      "Delivered": "bg-blue-100 text-blue-800"
    };
    return colorMap[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusDisplay = (status) => {
    const statusMap = {
      "Pending": "Đang xử lý",
      "Completed": "Đã thanh toán",
      "Cancelled": "Đã hủy",
      "Shipping": "Đang giao hàng",
      "Delivered": "Đã giao hàng thành công"
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-[72px]">
        <div className="w-12 h-12 border-3 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="ml-3 text-sm text-gray-600">Đang tải...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex flex-col items-center justify-center bg-gray-100 pt-[72px]"
      >
        <div className="w-16 h-16 text-red-500 mb-4">
          <XCircleIcon />
        </div>
        <h1 className="text-2xl font-bold text-red-500 mb-2">
          Không tìm thấy đơn hàng
        </h1>
        <p className="text-gray-600 mb-6">Đơn hàng không tồn tại hoặc đã bị xóa</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/profilelayout/historyorder")}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Quay lại lịch sử đơn hàng
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 py-6 px-3 sm:px-4 pt-[80px]"
    >
      <div className="max-w-2xl mx-auto">
        <motion.div 
          className="bg-white shadow-md rounded-xl overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Header - giảm padding */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => navigate("/profilelayout/historyorder")}
                className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4" />
              </button>
              <h1 className="text-base sm:text-lg font-bold text-center flex-1">
                Chi tiết đơn hàng #{order.orderId}
              </h1>
              <div className="w-4"></div> {/* Spacer nhỏ hơn */}
            </div>
          </div>

          {/* Content - giảm padding và spacing */}
          <div className="p-4 space-y-4">
            {/* Order Status và Date */}
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                {getStatusIcon(order.status)}
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {getStatusDisplay(order.status)}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-xs text-gray-400">Ngày đặt hàng</p>
                <p className="text-xs font-medium text-gray-700">
                  {dayjs(order.orderDate).format("DD/MM/YYYY HH:mm")}
                </p>
              </div>
            </div>

            {/* Thông tin người đặt hàng */}
            <div className="bg-white rounded-lg p-3 space-y-2 border border-gray-100 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-800 border-b pb-1.5">Thông tin người đặt</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="space-y-0.5">
                  <p className="text-gray-500 text-xs">Họ tên</p>
                  <p className="font-medium">{order.user.fullName}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-gray-500 text-xs">Số điện thoại</p>
                  <p className="font-medium">{order.user.phone}</p>
                </div>
                <div className="sm:col-span-2 space-y-0.5">
                  <p className="text-gray-500 text-xs">Địa chỉ giao hàng</p>
                  <p className="font-medium text-gray-800">{order.user.address}</p>
                </div>
              </div>
            </div>

            {/* Danh sách sản phẩm */}
            <div className="bg-white rounded-lg p-3 space-y-3 border border-gray-100 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-800 border-b pb-1.5">Sản phẩm đã đặt</h2>
              <div className="space-y-2">
                {order.orderProducts.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center p-2 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-800">{item.productName}</p>
                      <div className="flex items-center mt-0.5 text-xs text-gray-600">
                        <p>{formatCurrency(item.price)}</p>
                        <span className="mx-1 text-gray-400">×</span>
                        <p>{item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right font-medium text-sm text-blue-600">
                      {formatCurrency(item.totalPrice)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Thông tin khuyến mãi */}
            {order.promotion && (
              <div className="bg-green-50 rounded-lg p-3 border border-green-100 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-sm text-green-800">Khuyến mãi áp dụng</h3>
                    <p className="text-xs text-green-600 mt-0.5">{order.promotion.name || "Chương trình khuyến mãi"}</p>
                  </div>
                  <div className="bg-white px-3 py-1.5 rounded-lg text-green-700 font-bold text-sm">
                    -{order.promotion.discountPercentage}%
                  </div>
                </div>
              </div>
            )}

            {/* Chi tiết thanh toán */}
            <div className="bg-gray-50 rounded-lg p-3 space-y-2 border border-gray-100 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-800 border-b pb-1.5">Chi tiết thanh toán</h2>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Tổng tiền hàng:</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá:</span>
                  <span>- {formatCurrency(order.discountAmount)}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-gray-200">
                  <span>Thành tiền:</span>
                  <span className="text-blue-600">{formatCurrency(order.finalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/profilelayout/historyorder")}
              className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm font-medium hover:shadow-md transition-all duration-300 flex items-center justify-center"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-1.5" />
              Quay lại lịch sử đơn hàng
            </motion.button>
          </div>
        </motion.div>
        
        {/* Back button cho mobile - nhỏ hơn */}
        <div className="mt-4 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-blue-600 underline text-xs"
          >
            Lên đầu trang
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderDetail;
