import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useOrdersContext } from "../../context/OrdersContext";
import productAPI from "../../services/product";
import orderAPI from "../../services/order";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useAuth } from "../../context/AuthContext";
import { FaArrowRight, FaShoppingCart } from "react-icons/fa";
import { CreditCardIcon, BanknotesIcon } from "@heroicons/react/24/solid";
import { formatCurrency } from "../../utils/formatCurrency";

const initialPromotions = [
  { id: 1, name: "Summer Sale", discount: 20 },
  { id: 2, name: "Black Friday", discount: 50 },
  { id: 3, name: "Christmas Sale", discount: 30 },
  { id: 4, name: "New Year Offer", discount: 25 },
];

const Viewcart = () => {
  const { user } = useAuth(); // Kiểm tra user đã đăng nhập chưa
  const isLoggedIn = !!user; // Chuyển user thành boolean
  const navigate = useNavigate();
  const {
    cartItems,
    setCartItems,
    removeFromCart,
    updateQuantity,
    totalPrice,
  } = useCart();
  const { orders, fetchOrders } = useOrdersContext();
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showCheckout] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("VNPay");
  const [points, setPoints] = useState(0);

  // Form data for checkout
  const [formData, setFormData] = useState(() => {
    const savedData = JSON.parse(
      localStorage.getItem("checkoutData") || "null"
    );
    return (
      savedData || {
        name: "",
        email: "",
        phone: "",
        address: "",
      }
    );
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
        const response = await productAPI.getAll();
        setProducts(response.data);

        if (user) {
          await fetchOrders();
          const pendingOrder = orders.find(
            (order) =>
              order.userId === user.userId && order.status === "Pending"
          );

          if (pendingOrder) {
            const mappedCart = pendingOrder.orderProducts.map((item) => ({
              id: item.productId,
              quantity: item.quantity,
              price: item.unitPrice,
            }));
            setCartItems(mappedCart);
          } else {
            // Load from localStorage if no pending order
            const savedCart =
              JSON.parse(localStorage.getItem("cartItems")) || [];
            setCartItems(savedCart);
          }
        } else {
          setCartItems([]);
          localStorage.removeItem("cartItems");
        }
      } catch (error) {
        console.error("🚨 Error fetching cart data:", error);
      }
    };

    fetchCartData();
  }, [fetchOrders, setCartItems, orders, user]);

  // 🌍 Sync cart with API when cartItems change
  useEffect(() => {
    const updateOrder = async () => {
      if (!user || cartItems.length === 0) return;

      try {
        const pendingOrder = orders.find(
          (order) => order.userId === user.userId && order.status === "Pending"
        );

        if (pendingOrder) {
          await orderAPI.editOrder(pendingOrder.orderId, {
            orderProducts: cartItems.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              unitPrice: item.price,
              totalPrice: item.price * item.quantity,
            })),
          });
        }
      } catch (error) {
        console.error("🚨 Error updating cart in API:", error);
      }
    };

    updateOrder();
  }, [cartItems, orders, user]);

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
    navigate("/paymentsuccess");
  };

  const discountedPrice = selectedVoucher
    ? totalPrice - (totalPrice * selectedVoucher.discount) / 100
    : totalPrice;

  const cartTotal = totalPrice.toFixed(2);
  return (
    <>
      <Navbar cartCount={cartItems.length} />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {showCheckout
            ? "Thanh toán đơn hàng"
            : "Chi tiết giỏ hàng và thanh toán"}
        </h1>

        {errorMessage && (
          <div className="mb-4 px-4 py-2 bg-red-100 text-red-600 border border-red-400 rounded-lg">
            {errorMessage}
          </div>
        )}

        <div className="w-full max-w-7xl bg-white shadow-xl rounded-xl p-6">
          {cartItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FaShoppingCart className="text-6xl text-gray-300 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-600 mb-2">
                Giỏ hàng của bạn đang trống
              </h2>
              <p className="text-gray-500 mb-6">
                Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng.
              </p>
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
                {/* Checkout form */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
                    Thông tin thanh toán
                  </h2>
                  <div className="space-y-4">
                    {isLoggedIn ? (
                      <>
                        <div>
                          <label className="block text-gray-700 mb-1">
                            Họ và tên
                          </label>
                          <p className="p-3 border rounded-lg w-full bg-gray-100">
                            {user.name}
                          </p>
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-1">
                            Email
                          </label>
                          <p className="p-3 border rounded-lg w-full bg-gray-100">
                            {user.email}
                          </p>
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-1">
                            Số điện thoại
                          </label>
                          <p className="p-3 border rounded-lg w-full bg-gray-100">
                            {user.phone}
                          </p>
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-1">
                            Địa chỉ giao hàng
                          </label>
                          <p className="p-3 border rounded-lg w-full bg-gray-100">
                            {user.address || "Chưa có địa chỉ"}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="block text-gray-700 mb-1">
                            Họ và tên
                          </label>
                          <input
                            type="text"
                            name="name"
                            placeholder="Họ và tên"
                            required
                            className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                            value={formData.name}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            placeholder="Địa chỉ Email"
                            required
                            className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                            value={formData.email}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-1">
                            Số điện thoại
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            placeholder="Số điện thoại"
                            required
                            className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                            value={formData.phone}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-1">
                            Địa chỉ giao hàng
                          </label>
                          <textarea
                            name="address"
                            placeholder="Địa chỉ giao hàng"
                            required
                            className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 min-h-20"
                            value={formData.address}
                            onChange={handleInputChange}
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Voucher Selection */}
                  <div className="mt-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                      Chọn voucher
                    </h2>
                    <select
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
                    </select>
                  </div>

                  {/* Payment Method Selection */}
                  <div className="mt-6">
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
                        <span className="text-gray-800">VNPay</span>
                      </label>
                      <label className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer bg-gray-100 hover:bg-blue-100 transition shadow-md">
                        <CreditCardIcon className="h-6 w-6 text-blue-500" />
                        <input
                          type="radio"
                          value="CreditCard"
                          checked={paymentMethod === "CreditCard"}
                          onChange={() => setPaymentMethod("CreditCard")}
                        />
                        <span className="text-gray-800">Shipcode</span>
                      </label>
                    </div>
                  </div>

                  {/* Points Display */}
                  <div className="mt-6 p-4 bg-yellow-500 text-white text-center rounded-lg shadow-md">
                    Bạn có {points} điểm tích lũy!
                  </div>
                </div>

                {/* Order summary */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">
                    Tóm tắt đơn hàng
                  </h2>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="max-h-96 overflow-y-auto space-y-3 mb-4">
                      {cartItems.map((item) => {
                        const product =
                          products.find((p) => p.productId === item.id) || {};

                        return (
                          <div
                            key={item.id}
                            className="flex items-center justify-between text-gray-700 border-b pb-2"
                          >
                            <div className="flex items-center">
                              <img
                                src={
                                  product.productsImages?.[0]?.imageUrl ||
                                  "placeholder.jpg"
                                }
                                alt={product.productName || "Sản phẩm"}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div className="ml-3">
                                <p className="font-medium">
                                  {product.productName || "Tên sản phẩm"}
                                </p>
                                <p className="text-sm text-gray-500">
                                  SL: {item.quantity}
                                </p>
                                <div className="flex items-center mt-1">
                                  <button
                                    className="px-2 py-1 text-sm bg-gray-300 rounded hover:bg-gray-400"
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity - 1)
                                    }
                                    disabled={item.quantity <= 1}
                                  >
                                    -
                                  </button>
                                  <span className="mx-2">{item.quantity}</span>
                                  <button
                                    className="px-2 py-1 text-sm bg-gray-300 rounded hover:bg-gray-400"
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity + 1)
                                    }
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span>
                                {formatCurrency(
                                  (item.price * item.quantity).toFixed(2)
                                )}
                              </span>
                              <button
                                className="text-red-500 hover:text-red-700"
                                onClick={() => removeFromCart(item.id)}
                              >
                                ❌
                              </button>
                            </div>
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
                          <span>
                            -{" "}
                            {formatCurrency(
                              (totalPrice * selectedVoucher.discount) / 100
                            )}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Phí vận chuyển:</span>
                        <span>Miễn phí</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                        <span>Tổng thanh toán:</span>
                        <span className="text-red-500">
                          {formatCurrency(discountedPrice)}
                        </span>
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
                  Thanh toán <FaArrowRight />
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
