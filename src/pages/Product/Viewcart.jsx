import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { motion } from "framer-motion"; // Hiệu ứng động
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";

const ViewCart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);

  return (
    <>
      <Navbar cartCount={cartItems.length} />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Giỏ hàng của bạn
        </h1>
        <div className="w-3/4 bg-white shadow-xl rounded-xl p-6">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center justify-between border-b py-4 hover:bg-gray-100 rounded-lg transition"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg shadow"
                />
                <h3 className="text-lg font-semibold text-gray-800 flex-1 ml-4">
                  {item.name}
                </h3>
                <p className="text-blue-500 font-bold text-lg">
                  ${item.price.toFixed(2)}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center mx-4">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="px-2 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-full shadow-md"
                  >
                    <FaMinus />
                  </button>
                  <span className="mx-3 text-lg">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="px-2 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-full shadow-md"
                  >
                    <FaPlus />
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <FaTrash size={18} />
                </button>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-600 text-lg">
              Giỏ hàng của bạn trống. 😢
            </p>
          )}

          {/* Total Section */}
          <div className="flex justify-between mt-6 text-xl font-bold">
            <span>Tổng tiền:</span>
            <span className="text-red-500">${totalPrice}</span>
          </div>

          {/* Checkout Button */}
          <div className="flex justify-end mt-6">
            <Link
              to="/checkout"
              className="bg-[#6bbcfe] text-white px-6 py-3 rounded-lg hover:bg-blue-600 shadow-md transform hover:scale-105 transition duration-300"
            >
              Thanh toán
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ViewCart;
