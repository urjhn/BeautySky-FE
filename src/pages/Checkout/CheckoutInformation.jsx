import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useCart } from "../../context/CartContext";
import { formatCurrency } from "../../utils/formatCurrency";
// import { useAuth } from "../../context/AuthContext";

const CheckoutInformation = () => {
  const { cartItems, totalPrice } = useCart();
  // const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState(() => {
    const savedData = JSON.parse(localStorage.getItem("checkoutData"));
    return (
      savedData || {
        name: "",
        email: "",
        phone: "",
        address: "",
      }
    );
  });

  useEffect(() => {
    // Kiểm tra nếu có user thì tự động điền thông tin
    // if (user) {
    //   setFormData({
    //     name: user.fullname || "",
    //     email: user.email || "",
    //     phone: user.phone || "",
    //     address: user.address || "",
    //   });
    // }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProceedToPayment = () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.address
    ) {
      alert("Vui lòng nhập đầy đủ thông tin trước khi tiếp tục.");
      return;
    }

    localStorage.setItem(
      "checkoutData",
      JSON.stringify({
        ...formData,
        cartItems,
        totalPrice,
      })
    );
    navigate("/checkoutprocess");
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center bg-gray-100 min-h-screen py-10 px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Thông tin thanh toán
        </h1>
        <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-xl">
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Thông tin thanh toán
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Họ và tên"
                required
                className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                value={formData.name}
                onChange={handleInputChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Địa chỉ Email"
                required
                className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                value={formData.email}
                onChange={handleInputChange}
              />
              <input
                type="tel"
                name="phone"
                placeholder="Số điện thoại"
                required
                className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                value={formData.phone}
                onChange={handleInputChange}
              />
              <textarea
                name="address"
                placeholder="Địa chỉ giao hàng"
                required
                className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Tóm tắt đơn hàng
            </h2>
            <div className="bg-gray-100 p-4 rounded-lg space-y-4">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-gray-700"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded"
                    />
                    <span>{item.name}</span>
                    <span>{formatCurrency(item.price.toFixed(2))}</span>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-600 text-lg">
                  Giỏ hàng của bạn trống.
                </p>
              )}
              <div className="flex justify-between font-bold text-gray-900 mt-2 border-t pt-2">
                <span>Tổng cộng:</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
            </div>
          </section>

          <div className="flex justify-between gap-4">
            <button
              type="button"
              className="w-full bg-gray-500 text-white py-3 rounded-lg font-bold hover:bg-gray-600 transition"
              onClick={() => navigate("/viewcart")}
            >
              Quay lại giỏ hàng
            </button>
            <button
              type="button"
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition"
              onClick={handleProceedToPayment}
              disabled={loading}
            >
              Lựa chọn thanh toán
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CheckoutInformation;
