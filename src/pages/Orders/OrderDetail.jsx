import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  TruckIcon,
  XCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
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
        console.log("Fetching order with ID:", orderId);
        
        const response = await orderAPI.getOrderDetail(orderId);
        if (response) {
          console.log("Order detail response:", response);
          setOrder(response);
        }
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.'
        });
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetail();
    }
  }, [orderId]);

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
          onClick={() => navigate("/order-history")}
          className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          Quay lại Lịch sử đơn hàng
        </motion.button>
      </motion.div>
    );
  }

  return (
    <>
      <Navbar />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 py-10 px-4 sm:px-6"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="bg-white shadow-xl rounded-2xl overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
              <h1 className="text-2xl sm:text-3xl font-bold text-center">
                Chi tiết đơn hàng #{order.orderId}
              </h1>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Order Status */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  {getStatusIcon(order.status)}
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusDisplay(order.status)}
                  </span>
                </div>
                <p className="text-gray-600">
                  {dayjs(order.orderDate).format("DD/MM/YYYY HH:mm")}
                </p>
              </div>

              {/* Price Details */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng tiền hàng:</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá:</span>
                  <span>- {formatCurrency(order.discountAmount)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Thành tiền:</span>
                  <span className="text-blue-600">{formatCurrency(order.finalAmount)}</span>
                </div>
              </div>

              {/* Products List - Nếu có thông tin sản phẩm từ BE */}
              {order.orderItems && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Sản phẩm đã đặt</h2>
                  <div className="space-y-3">
                    {order.orderItems.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          {item.productImage && (
                            <img 
                              src={item.productImage} 
                              alt={item.productName}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          )}
                          <div>
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-gray-500">Số lượng: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-medium">{formatCurrency(item.price)}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="p-6 bg-gray-50">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/order-history")}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                Quay lại Lịch sử đơn hàng
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
      <Footer />
    </>
  );
};

export default OrderDetail;
