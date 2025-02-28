import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const status = "success"; // Hardcoded status

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-100 to-blue-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-lg rounded-lg p-8 text-center max-w-md mx-auto"
        >
          {status === "success" ? (
            <>
              <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-green-600">
                Thanh toán thành công!
              </h1>
              <p className="text-gray-600 mt-2">
                Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận.
              </p>
            </>
          ) : (
            <>
              <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-red-600">
                Thanh toán thất bại
              </h1>
              <p className="text-gray-600 mt-2">
                Có lỗi xảy ra trong quá trình thanh toán. Hãy thử lại.
              </p>
            </>
          )}
          <div className="mt-6">
            <button
              onClick={() => navigate("/vieworder")}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
            >
              Xem đơn hàng
            </button>
            <button
              onClick={() => navigate("/")}
              className="ml-4 px-4 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 transition"
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
