// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
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
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//   });

//   useEffect(() => {
//     const storedData = JSON.parse(localStorage.getItem("checkoutData"));
//     if (storedData) {
//       setFormData(storedData);
//     } else {
//       navigate("/checkoutinfo");
//     }
//   }, [navigate]);

//   useEffect(() => {
//     localStorage.setItem("checkoutData", JSON.stringify(formData));
//   }, [formData]);

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
//         <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-2xl">
//           {/* Thông tin người dùng */}
//           <section className="mb-6">
//             <h2 className="text-xl font-semibold text-gray-700 mb-4">
//               Thông tin thanh toán
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl shadow-md">
//               <div>
//                 <label className="block text-gray-600 text-sm font-medium">
//                   Họ và tên
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   className="p-3 border rounded-lg w-full bg-white shadow-sm"
//                   value={formData.name}
//                   disabled
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray-600 text-sm font-medium">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   className="p-3 border rounded-lg w-full bg-white shadow-sm"
//                   value={formData.email}
//                   disabled
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray-600 text-sm font-medium">
//                   Số điện thoại
//                 </label>
//                 <input
//                   type="tel"
//                   name="phone"
//                   className="p-3 border rounded-lg w-full bg-white shadow-sm"
//                   value={formData.phone}
//                   disabled
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray-600 text-sm font-medium">
//                   Địa chỉ giao hàng
//                 </label>
//                 <textarea
//                   name="address"
//                   className="p-3 border rounded-lg w-full bg-white shadow-sm"
//                   value={formData.address}
//                   disabled
//                 />
//               </div>
//             </div>
//           </section>

//           {/* Phương thức thanh toán */}
//           <section className="mb-6">
//             <h2 className="text-xl font-semibold text-gray-700 mb-4">
//               Phương thức thanh toán
//             </h2>
//             <div className="grid grid-cols-2 gap-4">
//               <label className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer bg-gray-100 hover:bg-blue-100 transition shadow-md">
//                 <BanknotesIcon className="h-6 w-6 text-green-500" />
//                 <input
//                   type="radio"
//                   value="VNPay"
//                   checked={paymentMethod === "VNPay"}
//                   onChange={() => setPaymentMethod("VNPay")}
//                 />
//                 <span className="text-gray-800">Thanh toán qua VNPay</span>
//               </label>
//               <label className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer bg-gray-100 hover:bg-blue-100 transition shadow-md">
//                 <CreditCardIcon className="h-6 w-6 text-blue-500" />
//                 <input
//                   type="radio"
//                   value="CreditCard"
//                   checked={paymentMethod === "CreditCard"}
//                   onChange={() => setPaymentMethod("CreditCard")}
//                 />
//                 <span className="text-gray-800">Thẻ tín dụng</span>
//               </label>
//             </div>
//           </section>

//           {/* Nút thanh toán */}
//           <div className="flex justify-between gap-4">
//             <button
//               type="button"
//               className="w-full bg-gray-500 text-white py-3 rounded-lg font-bold hover:bg-gray-600 transition shadow-lg"
//               onClick={() => navigate("/viewcart")}
//             >
//               Quay lại giỏ hàng
//             </button>
//             <button
//               type="button"
//               className="w-full bg-blue-500 text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition flex justify-center items-center shadow-lg"
//               onClick={handlePayment}
//               disabled={loading}
//             >
//               {loading ? (
//                 <span className="animate-spin h-5 w-5 border-b-2 border-white mr-2"></span>
//               ) : null}
//               {loading ? "Đang xử lý..." : "Tiến hành thanh toán"}
//             </button>
//           </div>

//           {/* Hiển thị trạng thái thanh toán */}
//           {paymentStatus === "success" && (
//             <div className="mt-6 p-4 bg-green-500 text-white text-center rounded-lg flex items-center justify-center gap-2 animate-bounce shadow-md">
//               <CheckCircleIcon className="h-6 w-6" /> Thanh toán thành công!
//             </div>
//           )}
//           {paymentStatus === "error" && (
//             <div className="mt-6 p-4 bg-red-500 text-white text-center rounded-lg flex items-center justify-center gap-2 animate-bounce shadow-md">
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
import {
  CheckCircleIcon,
  XCircleIcon,
  CreditCardIcon,
  BanknotesIcon,
} from "@heroicons/react/24/solid";

const CheckoutPage = () => {
  const { cartItems, totalPrice } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("VNPay");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("checkoutData"));
    if (storedData) {
      setFormData(storedData);
    } else {
      navigate("/checkoutinfo");
    }
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem("checkoutData", JSON.stringify(formData));
  }, [formData]);

  const handlePayment = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/paymentsuccess");
    }, 2000);
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center bg-gray-100 min-h-screen py-10 px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Thanh toán</h1>
        <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-2xl">
          {/* Hiển thị sản phẩm */}
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Sản phẩm trong đơn hàng
            </h2>
            <div className="bg-gray-50 p-6 rounded-xl shadow-md">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between py-2">
                  <span className="text-gray-800">
                    {item.name} x {item.quantity}
                  </span>
                  <span className="text-gray-800">
                    {item.price * item.quantity} VND
                  </span>
                </div>
              ))}
              <div className="border-t mt-4 pt-4 text-lg font-semibold text-gray-900">
                Tổng cộng: {totalPrice} VND
              </div>
            </div>
          </section>

          {/* Thông tin thanh toán */}
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Thông tin thanh toán
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl shadow-md">
              <div>
                <label className="block text-gray-600 text-sm font-medium">
                  Họ và tên
                </label>
                <input
                  type="text"
                  name="name"
                  className="p-3 border rounded-lg w-full bg-white shadow-sm"
                  value={formData.name}
                  disabled
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="p-3 border rounded-lg w-full bg-white shadow-sm"
                  value={formData.email}
                  disabled
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phone"
                  className="p-3 border rounded-lg w-full bg-white shadow-sm"
                  value={formData.phone}
                  disabled
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium">
                  Địa chỉ giao hàng
                </label>
                <textarea
                  name="address"
                  className="p-3 border rounded-lg w-full bg-white shadow-sm"
                  value={formData.address}
                  disabled
                />
              </div>
            </div>
          </section>

          {/* Phương thức thanh toán */}
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Phương thức thanh toán
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer bg-gray-100 hover:bg-blue-100 transition shadow-md">
                <BanknotesIcon className="h-6 w-6 text-green-500" />
                <input
                  type="radio"
                  value="VNPay"
                  checked={paymentMethod === "VNPay"}
                  onChange={() => setPaymentMethod("VNPay")}
                />
                <span className="text-gray-800">Thanh toán qua VNPay</span>
              </label>
              <label className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer bg-gray-100 hover:bg-blue-100 transition shadow-md">
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
          <div className="flex justify-between gap-4">
            <button
              type="button"
              className="w-full bg-gray-500 text-white py-3 rounded-lg font-bold hover:bg-gray-600 transition shadow-lg"
              onClick={() => navigate("/viewcart")}
            >
              Quay lại điền thông tin
            </button>
            <button
              type="button"
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition flex justify-center items-center shadow-lg"
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Tiến hành thanh toán"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CheckoutPage;
