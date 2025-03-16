import { useEffect, useState } from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useNotifications } from "../../context/NotificationContext";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addNotification } = useNotifications();
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkOrderDetails = async () => {
      try {
        const state = location.state;
        
        if (!state || !state.orderDetails) {
          // Không có thông tin đơn hàng
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 2000);
          return;
        }

        if (state.orderDetails.paymentMethod !== "Cash") {
          // Không phải thanh toán tiền mặt
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 2000);
          return;
        }

        // Có thông tin đơn hàng hợp lệ
        setOrderDetails(state.orderDetails);
        addNotification("Đặt hàng thành công! 🎉");
      } catch (error) {
        console.error("Error processing order details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkOrderDetails();
  }, [location, addNotification, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang xử lý thông tin đơn hàng...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow bg-gray-50 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-xl rounded-2xl overflow-hidden"
          >
            {orderDetails ? (
              <>
                {/* Header Section */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-8 text-center">
                  <CheckCircleIcon className="w-20 h-20 text-white mx-auto mb-4" />
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Đặt hàng thành công!
                  </h1>
                  <p className="text-green-100">
                    Mã đơn hàng: #{orderDetails.orderId}
                  </p>
                </div>

                {/* Order Details Section */}
                <div className="p-6">
                  {/* Products List */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                      Chi tiết đơn hàng
                    </h2>
                    <div className="space-y-4">
                      {orderDetails.products.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex-shrink-0">
                            <img
                              src={item.productImage}
                              alt={item.name}
                              className="w-24 h-24 object-cover rounded-lg shadow-sm"
                            />
                          </div>
                          <div className="flex-grow">
                            <h3 className="font-medium text-gray-900">
                              {item.productName}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              Số lượng: {item.quantity}
                            </p>
                            <p className="text-sm text-gray-600">
                              Đơn giá: {formatCurrency(item.price)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Summary */}
                  <div className="border-t border-gray-200 pt-6">
                    <div className="space-y-3">
                      <div className="flex justify-between text-gray-600">
                        <span>Tổng tiền hàng:</span>
                        <span>{formatCurrency(orderDetails.totalAmount)}</span>
                      </div>
                      {orderDetails.discountAmount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Giảm giá:</span>
                          <span>- {formatCurrency(orderDetails.discountAmount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-lg font-semibold text-gray-900 pt-3 border-t">
                        <span>Thành tiền:</span>
                        <span>{formatCurrency(orderDetails.finalAmount)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 flex gap-4 justify-center">
                    <button
                      onClick={() => navigate("/vieworder")}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Xem đơn hàng
                    </button>
                    <button
                      onClick={() => navigate("/")}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      Về trang chủ
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8 text-center">
                <XCircleIcon className="w-20 h-20 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-red-600 mb-2">
                  Không tìm thấy thông tin đơn hàng
                </h1>
                <p className="text-gray-600 mb-6">
                  Bạn sẽ được chuyển về trang chủ trong giây lát...
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Về trang chủ ngay
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
