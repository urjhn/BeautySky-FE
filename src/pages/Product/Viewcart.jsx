import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useOrdersContext } from "../../context/OrdersContext";
import productApi from "../../services/product";
import orderApi from "../../services/order";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { motion } from "framer-motion";
import { FaTrash, FaPlus, FaMinus, FaArrowRight, FaShoppingCart } from "react-icons/fa";
import { CreditCardIcon, BanknotesIcon } from "@heroicons/react/24/solid";
import { formatCurrency } from "../../utils/formatCurrency";

const initialPromotions = [
  { id: 1, name: "Summer Sale", discount: 20 },
  { id: 2, name: "Black Friday", discount: 50 },
  { id: 3, name: "Christmas Sale", discount: 30 },
  { id: 4, name: "New Year Offer", discount: 25 },
];

const Viewcart = () => {
  const navigate = useNavigate();
  const { cartItems, setCartItems, removeFromCart, updateQuantity, totalPrice } = useCart();
  const { orders, fetchOrders } = useOrdersContext();
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("VNPay");
  const [points, setPoints] = useState(0);
  
  // Form data for checkout
  const [formData, setFormData] = useState(() => {
    const savedData = JSON.parse(localStorage.getItem("checkoutData") || "null");
    return savedData || {
      name: "",
      email: "",
      phone: "",
      address: "",
    };
  });

  // Fetch points on mount
  useEffect(() => {
    const storedPoints = parseInt(localStorage.getItem("userPoints")) || 0;
    setPoints(storedPoints);
  }, []);

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
          setCartItems(pendingOrder.items || []);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckoutClick = () => {
    if (cartItems.length === 0) {
      setErrorMessage("❌ Không có sản phẩm để thanh toán.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    setShowCheckout(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToPayment = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      setErrorMessage("❌ Vui lòng nhập đầy đủ thông tin trước khi tiếp tục.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    localStorage.setItem(
      "checkoutData",
      JSON.stringify({
        ...formData,
        cartItems,
        totalPrice,
        selectedVoucher,
        paymentMethod,
      })
    );
    navigate("/checkoutprocess");
  };

  const discountedPrice = selectedVoucher
    ? totalPrice - (totalPrice * selectedVoucher.discount) / 100
    : totalPrice;

  const cartTotal = cartItems
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);

  return (
    <>
      <Navbar cartCount={cartItems.length} />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {showCheckout ? "Thanh toán đơn hàng" : "Giỏ hàng của bạn"}
        </h1>

        {errorMessage && (
          <div className="mb-4 px-4 py-2 bg-red-100 text-red-600 border border-red-400 rounded-lg">
            {errorMessage}
          </div>
        )}

        <div className="w-full max-w-4xl bg-white shadow-xl rounded-xl p-6">
          {cartItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FaShoppingCart className="text-6xl text-gray-300 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-600 mb-2">Giỏ hàng của bạn đang trống</h2>
              <p className="text-gray-500 mb-6">Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
              <Link
                to="/product"
                className="bg-[#6bbcfe] text-white px-6 py-3 rounded-lg hover:bg-blue-600 shadow-md transform hover:scale-105 transition duration-300 flex items-center gap-2"
              >
                <FaShoppingCart /> Tiếp tục mua sắm
              </Link>
            </div>
          )}

          {cartItems.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               
                {/* Order summary */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">
                    Tóm tắt đơn hàng
                  </h2>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="max-h-64 overflow-y-auto space-y-3 mb-4">
                      {cartItems.map((item) => {
                        const product = products.find((p) => p.productId === item.id) || {};
                        return (
                          <div
                            key={item.id}
                            className="flex items-center justify-between text-gray-700 border-b pb-2"
                          >
                            <div className="flex items-center">
                              <img
                                src={product.productsImages?.[0]?.imageUrl || "placeholder.jpg"}
                                alt={product.productName || "Sản phẩm"}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div className="ml-3">
                                <p className="font-medium">{product.productName || "Tên sản phẩm"}</p>
                                <p className="text-sm text-gray-500">SL: {item.quantity}</p>
                              </div>
                            </div>
                            <span>{formatCurrency((item.price * item.quantity).toFixed(2))}</span>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="space-y-2 border-t pt-3">
                      <div className="flex justify-between">
                        <span>Tổng tiền sản phẩm:</span>
                        <span>{formatCurrency(cartTotal)}</span>
                      </div>
                      {selectedVoucher && (
                        <div className="flex justify-between text-green-600">
                          <span>Giảm giá ({selectedVoucher.name}):</span>
                          <span>- {formatCurrency((totalPrice * selectedVoucher.discount) / 100)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Phí vận chuyển:</span>
                        <span>Miễn phí</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                        <span>Tổng thanh toán:</span>
                        <span className="text-red-500">{formatCurrency(discountedPrice)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Link
                  to="/product"
                  className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 shadow-md transform hover:scale-105 transition duration-300"
                >
                  Quay lại cửa hàng
                </Link>

                <button
                  onClick={handleProceedToPayment}
                  className={`px-6 py-3 rounded-lg shadow-md transform transition duration-300 ${
                    cartItems.length > 0
                      ? "bg-[#6bbcfe] text-white hover:bg-blue-600 hover:scale-105 flex items-center gap-2"
                      : "bg-gray-300 text-gray-500 opacity-50 cursor-not-allowed"
                  }`}
                >
                  Tiếp tục thanh toán <FaArrowRight />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Viewcart;