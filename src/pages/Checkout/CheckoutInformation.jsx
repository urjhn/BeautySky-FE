// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
// import Navbar from "../../components/Navbar/Navbar";
// import Footer from "../../components/Footer/Footer";
// import { useCart } from "../../context/CartContext";
// import {
//   CheckCircleIcon,
//   XCircleIcon,
//   CreditCardIcon,
//   BanknotesIcon,
// } from "@heroicons/react/24/solid";

// const CheckoutPage = () => {
//   const { cartItems, totalPrice } = useCart();
//   const [paymentMethod, setPaymentMethod] = useState("VNPay");
//   const [paymentStatus, setPaymentStatus] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//   });

//   const navigate = useNavigate(); // Initialize useNavigate hook

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handlePayment = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch("https://your-api.com/payment", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ method: paymentMethod }),
//       });

//       const result = await response.json();
//       setLoading(false);
//       setPaymentStatus(result.success ? "success" : "error");

//       if (result.success) {
//         // Save user information and cart data to localStorage
//         const checkoutData = {
//           ...formData,
//           cartItems,
//           paymentMethod,
//           totalPrice,
//         };
//         localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
//       }
//     } catch (error) {
//       console.error("Lỗi thanh toán:", error);
//       setPaymentStatus("error");
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="flex flex-col items-center bg-gray-100 min-h-screen py-10 px-4">
//         <h1 className="text-4xl font-bold text-gray-800 mb-6">Thanh toán</h1>
//         <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-xl">
//           <form className="space-y-6">
//             {/* Thông tin thanh toán */}
//             <section>
//               <h2 className="text-xl font-semibold text-gray-700 mb-4">
//                 Thông tin thanh toán
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <input
//                   type="text"
//                   name="name"
//                   placeholder="Họ và tên"
//                   required
//                   className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                 />
//                 <input
//                   type="email"
//                   name="email"
//                   placeholder="Địa chỉ Email"
//                   required
//                   className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                 />
//                 <input
//                   type="tel"
//                   name="phone"
//                   placeholder="Số điện thoại"
//                   required
//                   className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                 />
//                 <textarea
//                   name="address"
//                   placeholder="Địa chỉ giao hàng"
//                   required
//                   className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500"
//                   value={formData.address}
//                   onChange={handleInputChange}
//                 />
//               </div>
//             </section>

//             {/* Tóm tắt đơn hàng */}
//             <section>
//               <h2 className="text-xl font-semibold text-gray-700 mb-4">
//                 Tóm tắt đơn hàng
//               </h2>
//               <div className="bg-gray-100 p-4 rounded-lg space-y-4">
//                 {cartItems.length > 0 ? (
//                   cartItems.map((item) => (
//                     <div
//                       key={item.id}
//                       className="flex items-center justify-between text-gray-700"
//                     >
//                       <img
//                         src={item.image}
//                         alt={item.name}
//                         className="w-12 h-12 rounded"
//                       />
//                       <span>{item.name}</span>
//                       <span>${item.price.toFixed(2)}</span>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-center text-gray-600 text-lg">
//                     Giỏ hàng của bạn trống.
//                   </p>
//                 )}
//                 <div className="flex justify-between font-bold text-gray-900 mt-2 border-t pt-2">
//                   <span>Tổng cộng:</span>
//                   <span>${totalPrice}</span>
//                 </div>
//               </div>
//             </section>

//             {/* Phương thức thanh toán */}
//             <section>
//               <h2 className="text-xl font-semibold text-gray-700 mb-4">
//                 Phương thức thanh toán
//               </h2>
//               <div className="flex gap-4">
//                 <label className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer w-full bg-gray-100 hover:bg-blue-100 transition">
//                   <BanknotesIcon className="h-6 w-6 text-green-500" />
//                   <input
//                     type="radio"
//                     value="VNPay"
//                     checked={paymentMethod === "VNPay"}
//                     onChange={() => setPaymentMethod("VNPay")}
//                   />
//                   <span className="text-gray-800">Thanh toán qua VNPay</span>
//                 </label>
//                 <label className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer w-full bg-gray-100 hover:bg-blue-100 transition">
//                   <CreditCardIcon className="h-6 w-6 text-blue-500" />
//                   <input
//                     type="radio"
//                     value="CreditCard"
//                     checked={paymentMethod === "CreditCard"}
//                     onChange={() => setPaymentMethod("CreditCard")}
//                   />
//                   <span className="text-gray-800">Thẻ tín dụng</span>
//                 </label>
//               </div>
//             </section>

//             {/* Nút thanh toán và quay lại giỏ hàng */}
//             <div className="flex justify-between gap-4">
//               <button
//                 type="button"
//                 className="w-full bg-gray-500 text-white py-3 rounded-lg font-bold hover:bg-gray-600 transition"
//                 onClick={() => navigate("/viewcart")}
//               >
//                 Quay lại giỏ hàng
//               </button>
//               <button
//                 type="button"
//                 className="w-full bg-blue-500 text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition flex justify-center items-center"
//                 onClick={handlePayment}
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <span className="animate-spin h-5 w-5 border-b-2 border-white mr-2"></span>
//                 ) : null}
//                 {loading ? "Đang xử lý..." : "Tiến hành thanh toán"}
//               </button>
//             </div>
//           </form>

//           {/* Trạng thái thanh toán */}
//           {paymentStatus === "success" && (
//             <div className="mt-6 p-4 bg-green-500 text-white text-center rounded-lg flex items-center justify-center gap-2 animate-bounce">
//               <CheckCircleIcon className="h-6 w-6" /> Thanh toán thành công!
//             </div>
//           )}
//           {paymentStatus === "error" && (
//             <div className="mt-6 p-4 bg-red-500 text-white text-center rounded-lg flex items-center justify-center gap-2 animate-bounce">
//               <XCircleIcon className="h-6 w-6" /> Thanh toán thất bại. Vui lòng
//               thử lại!
//             </div>
//           )}
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default CheckoutPage;

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
