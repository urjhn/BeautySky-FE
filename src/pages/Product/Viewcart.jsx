import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useOrdersContext } from "../../context/OrdersContext";
import productApi from "../../services/product";
import orderApi from "../../services/order"; // Import Order API
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { motion } from "framer-motion";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { formatCurrency } from "../../utils/formatCurrency";

const ViewCart = () => {
  const { cartItems, setCartItems, removeFromCart, updateQuantity } = useCart();
  const { orders, setOrders, fetchOrders } = useOrdersContext(); // Get orders from context
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch products & pending order on mount
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await productApi.getAll();
        setProducts(response.data);

        // Fetch pending order
        await fetchOrders();
        const pendingOrder = orders.find((order) => order.status === "Pending");
        if (pendingOrder) {
          setCartItems(pendingOrder.items || []); // Sync cart with API order
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };
    fetchCartData();
  }, [fetchOrders, setCartItems, orders]);

  // Update order in API when cart changes
  useEffect(() => {
    const updateOrder = async () => {
      if (cartItems.length > 0) {
        try {
          const pendingOrder = orders.find(
            (order) => order.status === "Pending"
          );
          if (pendingOrder) {
            await orderApi.editOrder(pendingOrder.orderId, {
              items: cartItems,
            });
          }
        } catch (error) {
          console.error("Lỗi khi cập nhật giỏ hàng:", error);
        }
      }
    };
    updateOrder();
  }, [cartItems, orders]);

  // Calculate total price
  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);

  // Handle Checkout
  const handleCheckoutClick = async (e) => {
    if (cartItems.length === 0) {
      e.preventDefault();
      setErrorMessage("❌ Không có sản phẩm để thanh toán.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  return (
    <>
      <Navbar cartCount={cartItems.length} />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Giỏ hàng của bạn
        </h1>

        {errorMessage && (
          <div className="mb-4 px-4 py-2 bg-red-100 text-red-600 border border-red-400 rounded-lg">
            {errorMessage}
          </div>
        )}

        <div className="w-3/4 bg-white shadow-xl rounded-xl p-6">
          {cartItems.length > 0 ? (
            cartItems.map((item) => {
              const product =
                products.find((p) => p.productId === item.id) || {};
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-center justify-between border-b py-4 hover:bg-gray-100 rounded-lg transition"
                >
                  <img
                    src={
                      product.productsImages?.[0]?.imageUrl || "placeholder.jpg"
                    }
                    alt={product.productName || "Sản phẩm"}
                    className="w-16 h-16 object-cover rounded-lg shadow"
                  />
                  <h3 className="text-lg font-semibold text-gray-800 flex-1 ml-4">
                    {product.productName || "Tên sản phẩm"}
                  </h3>
                  <p className="text-blue-500 font-bold text-lg">
                    {formatCurrency(item.price.toFixed(2))}
                  </p>

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

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <FaTrash size={18} />
                  </button>
                </motion.div>
              );
            })
          ) : (
            <p className="text-center text-gray-600 text-lg">
              Giỏ hàng của bạn trống. 😢
            </p>
          )}

          <div className="flex justify-between mt-6 text-xl font-bold">
            <span>Tổng tiền:</span>
            <span className="text-red-500">{formatCurrency(totalPrice)}</span>
          </div>

          <div className="flex justify-between mt-6">
            <Link
              to="/product"
              className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 shadow-md transform hover:scale-105 transition duration-300"
            >
              Quay lại cửa hàng
            </Link>

            <Link
              to={cartItems.length > 0 ? "/checkoutinfo" : "#"}
              onClick={handleCheckoutClick}
              className={`px-6 py-3 rounded-lg shadow-md transform transition duration-300 ${
                cartItems.length > 0
                  ? "bg-[#6bbcfe] text-white hover:bg-blue-600 hover:scale-105"
                  : "bg-gray-300 text-gray-500 opacity-50 cursor-not-allowed"
              }`}
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
