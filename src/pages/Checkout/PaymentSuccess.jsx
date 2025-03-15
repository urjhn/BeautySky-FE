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

  useEffect(() => {
    const state = location.state;
    if (state && state.orderDetails) {
      setOrderDetails(state.orderDetails);
      addNotification("Bạn đã thanh toán thành công! 🎉");
    }
  }, [location, addNotification]);

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-100 to-blue-200 px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-lg rounded-lg p-4 sm:p-6 lg:p-8 text-center w-full max-w-md mx-auto"
        >
          {orderDetails ? (
            <>
              <CheckCircleIcon className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-3 sm:mb-4" />
              <h1 className="text-xl sm:text-2xl font-bold text-green-600 mb-4">
                Thanh toán thành công!
              </h1>
              <div className="text-left bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Mã đơn hàng:</span> #{orderDetails.orderId}
                </p>
                
                {/* Danh sách sản phẩm */}
                <div className="mt-4 mb-4">
                  <p className="font-medium text-gray-700 mb-2">Sản phẩm đã mua:</p>
                  <div className="space-y-3">
                    {orderDetails.products.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 bg-white p-2 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg border"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            {formatCurrency(item.price)} x {item.quantity}
                          </p>
                        </div>
                        <p className="font-medium text-blue-600">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-3 mt-3">
                  <p className="text-gray-700 mb-2">
                    <span className="font-medium">Tổng tiền:</span> {formatCurrency(orderDetails.totalAmount)}
                  </p>
                  {orderDetails.discountAmount > 0 && (
                    <p className="text-green-600 mb-2">
                      <span className="font-medium">Giảm giá:</span> {formatCurrency(orderDetails.discountAmount)}
                    </p>
                  )}
                  <p className="text-blue-600 font-bold mt-2">
                    <span className="font-medium text-gray-700">Thành tiền:</span> {formatCurrency(orderDetails.finalAmount)}
                  </p>
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận và đang được xử lý.
              </p>
            </>
          ) : (
            <>
              <XCircleIcon className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-3 sm:mb-4" />
              <h1 className="text-xl sm:text-2xl font-bold text-red-600">
                Không tìm thấy thông tin đơn hàng
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-2">
                Có lỗi xảy ra trong quá trình xử lý đơn hàng.
              </p>
            </>
          )}

          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <button
              onClick={() => navigate("/vieworder")}
              className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white text-sm sm:text-base rounded-lg shadow hover:bg-blue-600 transition"
            >
              Xem đơn hàng
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full sm:w-auto px-4 py-2 bg-gray-500 text-white text-sm sm:text-base rounded-lg shadow hover:bg-gray-600 transition"
            >
              Trang chủ
            </button>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentSuccess;
