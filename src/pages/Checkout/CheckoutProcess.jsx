import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useCart } from "../../context/CartContext";
import { formatCurrency } from "../../utils/formatCurrency";
import { CreditCardIcon, BanknotesIcon } from "@heroicons/react/24/solid";

const initialPromotions = [
  { id: 1, name: "Summer Sale", discount: 20 },
  { id: 2, name: "Black Friday", discount: 50 },
  { id: 3, name: "Christmas Sale", discount: 30 },
  { id: 4, name: "New Year Offer", discount: 25 },
];

const CheckoutPage = () => {
  const { cartItems, totalPrice } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("VNPay");
  const [loading, setLoading] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [points, setPoints] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedPoints = parseInt(localStorage.getItem("userPoints")) || 0;
    setPoints(storedPoints);
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      // Kiểm tra nếu người dùng đã đăng nhập (dựa vào dữ liệu trong localStorage)
      const userLoggedIn = localStorage.getItem("user") !== null;

      if (userLoggedIn) {
        const earnedPoints = Math.floor(discountedPrice / 10000);
        const newTotalPoints = points + earnedPoints;
        localStorage.setItem("userPoints", newTotalPoints);
        setPoints(newTotalPoints);
      }

      navigate("/paymentsuccess");
    }, 2000);
  };

  const discountedPrice = selectedVoucher
    ? totalPrice - (totalPrice * selectedVoucher.discount) / 100
    : totalPrice;

  return (
    <>
      <Navbar />
      <motion.div className="flex flex-col items-center bg-gray-100 min-h-screen py-10 px-4">
        <motion.h1 className="text-4xl font-bold text-gray-800 mb-6">
          Thanh toán
        </motion.h1>
        <motion.div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-2xl">
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Sản phẩm
            </h2>
            <div className="bg-gray-50 p-6 rounded-xl shadow-md">
              {cartItems.map((item) => (
                <motion.div key={item.id} className="flex justify-between py-2">
                  <span className="text-gray-800">
                    {item.name} x {item.quantity}
                  </span>
                  <span className="text-gray-800">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </motion.div>
              ))}
              <div className="border-t mt-4 pt-4 text-lg font-semibold text-gray-900">
                Tổng cộng: {formatCurrency(discountedPrice)}
              </div>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Chọn voucher
            </h2>
            <motion.select
              className="p-3 border rounded-lg w-full bg-white shadow-sm cursor-pointer"
              onChange={(e) => {
                const voucher = initialPromotions.find(
                  (v) => v.id === parseInt(e.target.value)
                );
                setSelectedVoucher(voucher);
              }}
            >
              <option value="">Không áp dụng</option>
              {initialPromotions.map((promo) => (
                <option key={promo.id} value={promo.id}>
                  {promo.name} - Giảm {promo.discount}%
                </option>
              ))}
            </motion.select>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Phương thức thanh toán
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <motion.label className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer bg-gray-100 hover:bg-blue-100 transition shadow-md">
                <BanknotesIcon className="h-6 w-6 text-green-500" />
                <input
                  type="radio"
                  value="VNPay"
                  checked={paymentMethod === "VNPay"}
                  onChange={() => setPaymentMethod("VNPay")}
                />
                <span className="text-gray-800">VNPay</span>
              </motion.label>
              <motion.label className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer bg-gray-100 hover:bg-blue-100 transition shadow-md">
                <CreditCardIcon className="h-6 w-6 text-blue-500" />
                <input
                  type="radio"
                  value="CreditCard"
                  checked={paymentMethod === "CreditCard"}
                  onChange={() => setPaymentMethod("CreditCard")}
                />
                <span className="text-gray-800">Thẻ tín dụng</span>
              </motion.label>
            </div>
          </section>

          <div className="flex justify-between gap-4">
            <motion.button
              className="w-full bg-gray-500 text-white py-3 rounded-lg font-bold hover:bg-gray-600 transition shadow-lg"
              onClick={() => navigate("/viewcart")}
            >
              Quay lại
            </motion.button>
            <motion.button
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition flex justify-center items-center shadow-lg"
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Thanh toán"}
            </motion.button>
          </div>

          <div className="mt-6 p-4 bg-yellow-500 text-white text-center rounded-lg shadow-md">
            Bạn có {points} điểm tích lũy!
          </div>
        </motion.div>
      </motion.div>
      <Footer />
    </>
  );
};

export default CheckoutPage;
