import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  TruckIcon,
  XCircleIcon,
  ClockIcon,
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
      default:
        return <TruckIcon className="w-6 h-6 text-blue-500" />;
    }
  };

  const getStatusColor = (status) => {
    const colorMap = {
      "Pending": "bg-yellow-100 text-yellow-800",
      "Completed": "bg-green-100 text-green-800",
      "Cancelled": "bg-red-100 text-red-800"
    };
    return colorMap[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusDisplay = (status) => {
    const statusMap = {
      "Pending": "Đang xử lý",
      "Completed": "Đã giao hàng",
      "Cancelled": "Đã hủy"
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex flex-col items-center justify-center bg-gray-100"
      >
        <h1 className="text-2xl font-bold text-red-500">
          Không tìm thấy đơn hàng
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/profilelayout/historyorder")}
          className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          Quay lại Lịch sử đơn hàng
        </motion.button>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 py-6 px-4 sm:px-6"
      >
        <div className="max-w-2xl mx-auto">
          <motion.div 
            className="bg-white shadow-lg rounded-xl overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
              <h1 className="text-xl font-bold text-center">
                Chi tiết đơn hàng #{order.orderId}
              </h1>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Order Status và Date */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusDisplay(order.status)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {dayjs(order.orderDate).format("DD/MM/YYYY HH:mm")}
                </p>
              </div>

              {/* Thông tin người đặt hàng */}
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <h2 className="text-base font-semibold">Thông tin người đặt</h2>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p><span className="font-medium">Họ tên:</span> {order.user.fullName}</p>
                  <p><span className="font-medium">SĐT:</span> {order.user.phone}</p>
                  <p className="col-span-2"><span className="font-medium">Địa chỉ:</span> {order.user.address}</p>
                </div>
              </div>

              {/* Danh sách sản phẩm */}
              <div className="space-y-3">
                <h2 className="text-base font-semibold">Sản phẩm đã đặt</h2>
                <div className="space-y-2">
                  {order.orderProducts.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{item.productName}</p>
                        <div className="text-gray-600 text-xs mt-1">
                          <p>Đơn giá: {formatCurrency(item.price)} x {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right font-medium">
                        {formatCurrency(item.totalPrice)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Thông tin khuyến mãi */}
              {order.promotion && (
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-sm text-green-700">
                    Khuyến mãi: <span className="font-medium">{order.promotion.discountPercentage}%</span>
                  </p>
                </div>
              )}

              {/* Chi tiết thanh toán */}
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tổng tiền hàng:</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                  <span>Giảm giá:</span>
                  <span>- {formatCurrency(order.discountAmount)}</span>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t">
                  <span>Thành tiền:</span>
                  <span className="text-blue-600">{formatCurrency(order.finalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="p-4 bg-gray-50">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/profilelayout/historyorder")}
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm font-medium hover:shadow-md transition-all duration-300"
              >
                Quay lại Lịch sử đơn hàng
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default OrderDetail;
