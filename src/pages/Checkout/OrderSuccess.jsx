import { useEffect, useState } from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useNotifications } from "../../context/NotificationContext";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addNotification } = useNotifications();
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkOrderDetails = () => {
      try {
        const state = location.state;
        
        if (!state || !state.orderDetails) {
          addNotification("Không tìm thấy thông tin đơn hàng", "error");
          setOrderDetails(null);
          return;
        }

        setOrderDetails(state.orderDetails);
        addNotification("Đặt hàng thành công! 🎉");
      } catch (error) {
        console.error("Error processing order details:", error);
        addNotification("Đã có lỗi xảy ra", "error");
      } finally {
        setIsLoading(false);
      }
    };

    checkOrderDetails();
  }, [location, addNotification]);

  // Loading Component
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-lg shadow-md">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang xử lý đơn hàng...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error Component
  if (!orderDetails) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center bg-white p-8 rounded-lg shadow-md max-w-md w-full"
          >
            <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-800 mb-2">
              Không tìm thấy thông tin đơn hàng
            </h1>
            <p className="text-gray-600 mb-6">
              Vui lòng kiểm tra lại đơn hàng của bạn
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate("/vieworder")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Xem đơn hàng
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Về trang chủ
              </button>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  // Success Component
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-grow py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-center">
            <CheckCircleIcon className="w-16 h-16 text-white mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-white">
              Đặt hàng thành công!
            </h1>
            <p className="text-green-100 text-sm mt-1">
              Mã đơn hàng: #{orderDetails.orderId}
            </p>
          </div>

          {/* Order Summary */}
          <div className="p-6">
            <div className="space-y-6">
              {/* Products */}
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-gray-800">
                  Chi tiết đơn hàng
                </h2>
                {orderDetails.products.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <img
                      src={item.productImage}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-grow">
                      <h3 className="font-medium text-gray-800">
                        {item.productName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item.quantity} x {formatCurrency(item.price)}
                      </p>
                    </div>
                    <p className="font-medium text-gray-800">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Price Summary */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-60x`">
                  <span>Tổng tiền hàng</span>
                  <span>{formatCurrency(orderDetails.totalAmount)}</span>
                </div>
                {orderDetails.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá</span>
                    <span>- {formatCurrency(orderDetails.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t">
                  <span>Thành tiền</span>
                  <span>{formatCurrency(orderDetails.finalAmount)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-center pt-4">
                <button
                  onClick={() => navigate("/vieworder")}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Xem đơn hàng
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Về trang chủ
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderSuccess;
