import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  TruckIcon,
  CreditCardIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const orderData = {
  orderId: "#ORD20240221",
  cartItems: [
    {
      id: 1,
      name: "Sữa rửa mặt dịu nhẹ",
      image: "/images/product1.jpg",
      price: 12.99,
      quantity: 2,
    },
    {
      id: 2,
      name: "Kem dưỡng ẩm ban đêm",
      image: "/images/product2.jpg",
      price: 24.99,
      quantity: 1,
    },
  ],
  totalPrice: 50.97,
  paymentInfo: {
    bankAccount: "9704 **** **** 6789",
    amountPaid: 50.97,
    paymentMethod: "VNPAY",
  },
  shippingStatus: "Đang giao hàng",
};

const ViewOrder = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-100 to-blue-200">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full mx-auto"
        >
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
            Thông tin đơn hàng
          </h1>
          <p className="text-center text-gray-600">
            Mã đơn hàng:{" "}
            <span className="font-semibold">{orderData.orderId}</span>
          </p>

          {/* Hiển thị sản phẩm đã mua */}
          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Sản phẩm đã mua:
            </h2>
            <div className="bg-gray-100 p-4 rounded-lg space-y-4 mt-2">
              {orderData.cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-gray-700"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded"
                  />
                  <div>
                    <p>{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Số lượng: {item.quantity}
                    </p>
                  </div>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold text-gray-900 mt-2 border-t pt-2">
              <span>Tổng cộng:</span>
              <span>${orderData.totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Thông tin thanh toán */}
          <div className="mt-6 bg-blue-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700 flex items-center">
              <CreditCardIcon className="w-6 h-6 text-blue-500 mr-2" /> Thông
              tin thanh toán
            </h2>
            <p className="text-gray-600 mt-2">
              Số tài khoản:{" "}
              <span className="font-semibold">
                {orderData.paymentInfo.bankAccount}
              </span>
            </p>
            <p className="text-gray-600">
              Số tiền đã thanh toán:{" "}
              <span className="font-semibold text-green-600">
                ${orderData.paymentInfo.amountPaid.toFixed(2)}
              </span>
            </p>
            <p className="text-gray-600">
              Phương thức:{" "}
              <span className="font-semibold">
                {orderData.paymentInfo.paymentMethod}
              </span>
            </p>
          </div>

          {/* Trạng thái giao hàng */}
          <div className="mt-6 bg-green-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700 flex items-center">
              <TruckIcon className="w-6 h-6 text-green-500 mr-2" /> Trạng thái
              giao hàng
            </h2>
            <p className="text-gray-600 mt-2 font-semibold">
              {orderData.shippingStatus}
            </p>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={() => navigate("/product")}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
            >
              Tiếp tục mua sắm
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

export default ViewOrder;
