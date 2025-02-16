import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import {
  CheckCircleIcon,
  XCircleIcon,
  CreditCardIcon,
  BanknotesIcon,
} from "@heroicons/react/24/solid";

const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("VNPay");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://your-api.com/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method: paymentMethod }),
      });

      const result = await response.json();
      setLoading(false);
      setPaymentStatus(result.success ? "success" : "error");
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      setPaymentStatus("error");
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center bg-gray-100 min-h-screen py-10 px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Thanh toán</h1>
        <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-xl">
          <form className="space-y-6">
            {/* Thông tin thanh toán */}
            <section>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Thông tin thanh toán
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Họ và tên"
                  required
                  className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="Địa chỉ Email"
                  required
                  className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="tel"
                  placeholder="Số điện thoại"
                  required
                  className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Địa chỉ giao hàng"
                  required
                  className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </section>

            {/* Tóm tắt đơn hàng */}
            <section>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Tóm tắt đơn hàng
              </h2>
              <div className="bg-gray-100 p-4 rounded-lg space-y-4">
                <div className="flex items-center justify-between text-gray-700">
                  <img
                    src="/images/product1.jpg"
                    alt="Sản phẩm 1"
                    className="w-12 h-12 rounded"
                  />
                  <span>Sản phẩm 1</span>
                  <span>$25.99</span>
                </div>
                <div className="flex items-center justify-between text-gray-700">
                  <img
                    src="/images/product2.jpg"
                    alt="Sản phẩm 2"
                    className="w-12 h-12 rounded"
                  />
                  <span>Sản phẩm 2</span>
                  <span>$30.99</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 mt-2 border-t pt-2">
                  <span>Tổng cộng:</span>
                  <span>$56.98</span>
                </div>
              </div>
            </section>

            {/* Phương thức thanh toán */}
            <section>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Phương thức thanh toán
              </h2>
              <div className="flex gap-4">
                <label className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer w-full bg-gray-100 hover:bg-blue-100 transition">
                  <BanknotesIcon className="h-6 w-6 text-green-500" />
                  <input
                    type="radio"
                    value="VNPay"
                    checked={paymentMethod === "VNPay"}
                    onChange={() => setPaymentMethod("VNPay")}
                  />
                  <span className="text-gray-800">Thanh toán qua VNPay</span>
                </label>
                <label className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer w-full bg-gray-100 hover:bg-blue-100 transition">
                  <CreditCardIcon className="h-6 w-6 text-blue-500" />
                  <input
                    type="radio"
                    value="CreditCard"
                    checked={paymentMethod === "CreditCard"}
                    onChange={() => setPaymentMethod("CreditCard")}
                  />
                  <span className="text-gray-800">Thẻ tín dụng</span>
                </label>
              </div>
            </section>

            {/* Nút thanh toán */}
            <button
              type="button"
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition flex justify-center items-center"
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? (
                <span className="animate-spin h-5 w-5 border-b-2 border-white mr-2"></span>
              ) : null}
              {loading ? "Đang xử lý..." : "Tiến hành thanh toán"}
            </button>
          </form>

          {/* Trạng thái thanh toán */}
          {paymentStatus === "success" && (
            <div className="mt-6 p-4 bg-green-500 text-white text-center rounded-lg flex items-center justify-center gap-2 animate-bounce">
              <CheckCircleIcon className="h-6 w-6" /> Thanh toán thành công!
            </div>
          )}
          {paymentStatus === "error" && (
            <div className="mt-6 p-4 bg-red-500 text-white text-center rounded-lg flex items-center justify-center gap-2 animate-bounce">
              <XCircleIcon className="h-6 w-6" /> Thanh toán thất bại. Vui lòng
              thử lại!
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CheckoutPage;
