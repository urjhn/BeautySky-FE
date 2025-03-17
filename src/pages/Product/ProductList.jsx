import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useDataContext } from "../../context/DataContext";
import { formatCurrency } from "../../utils/formatCurrency";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext"; 
import orderAPI from "../../services/order";
import paymentAPI from "../../services/payment";

const ITEMS_PER_PAGE = 12;

const ProductList = ({ selectedSkinType, selectedCategory, sortOrder }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products, fetchProduct, isLoading } = useDataContext();
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("VNPay");

  useEffect(() => {
    fetchProduct();
  }, [selectedSkinType, selectedCategory]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const productSkinType = product.skinTypeName?.toLowerCase() || "";
        const productCategory = product.categoryName?.toLowerCase() || "";

        const selectedSkinTypeLower = selectedSkinType.toLowerCase();
        const selectedCategoryLower = selectedCategory.toLowerCase();

        const skinTypeFilter =
          selectedSkinTypeLower === "tất cả" ||
          productSkinType.includes(selectedSkinTypeLower);

        const categoryFilter =
          selectedCategoryLower === "tất cả" ||
          productCategory.includes(selectedCategoryLower);

        return skinTypeFilter && categoryFilter;
      })
      .sort((a, b) =>
        sortOrder === "asc" ? a.price - b.price : b.price - a.price
      );
  }, [products, selectedSkinType, selectedCategory, sortOrder]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleAddToCart = async (product) => {
    if (product.quantity === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Hết hàng',
        text: 'Sản phẩm này hiện đã hết hàng!',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    try {
      const cartItem = {
        productId: product.productId,
        quantity: 1,
        price: product.price,
        productName: product.productName,
        productImage: product.productsImages?.[0]?.imageUrl || product.image
      };

      await addToCart(cartItem);
      
    } catch (error) {
      console.error("Error adding to cart:", error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: error.response?.data || 'Không thể thêm sản phẩm vào giỏ hàng',
        confirmButtonColor: '#3085d6'
      });
    }
  };

  const handleBuyNow = (product) => {
    if (product.quantity === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Hết hàng',
        text: 'Sản phẩm này hiện đã hết hàng!',
        confirmButtonColor: '#3085d6'
      });
      return;
    }
    setSelectedProduct(product);
    setShowPaymentPopup(true);
  };

  const handlePayment = async () => {
    try {
      Swal.fire({
        title: 'Đang xử lý...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const orderProducts = [{
        productID: Number(selectedProduct.productId),
        quantity: 1
      }];

      const orderResponse = await orderAPI.createOrder(null, orderProducts);

      if (orderResponse.orderId) {
        if (paymentMethod === "VNPay") {
          const paymentRequest = {
            orderId: orderResponse.orderId,
            amount: parseInt(selectedProduct.price),
            orderInfo: `Thanh toan don hang #${orderResponse.orderId}`,
            orderType: "other",
            language: "vn",
            name: formData.name,
            orderDescription: `Don hang ${orderResponse.orderId}`
          };

          const vnpayResponse = await paymentAPI.createVNPayPayment(paymentRequest);
          
          if (vnpayResponse.paymentUrl) {
            localStorage.setItem('pendingOrder', JSON.stringify({
              orderId: orderResponse.orderId,
              amount: parseInt(selectedProduct.price),
              products: [{
                ...selectedProduct,
                price: parseInt(selectedProduct.price)
              }]
            }));
            
            window.location.href = vnpayResponse.paymentUrl;
          }
        } else {
          // Xử lý thanh toán tiền mặt
          Swal.close();
          
          await Swal.fire({
            icon: 'success',
            title: 'Đặt hàng thành công!',
            text: 'Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ với bạn sớm nhất!',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Đồng ý'
          });

          // Tạo object sản phẩm với đầy đủ thông tin
          const productInfo = {
            productId: selectedProduct.productId,
            productName: selectedProduct.productName,
            quantity: 1,
            price: selectedProduct.price, // Giữ nguyên giá gốc
            productImage: selectedProduct.productsImages?.[0]?.imageUrl || selectedProduct.image
          };

          const orderInfo = {
            orderId: orderResponse.orderId,
            totalAmount: selectedProduct.price,
            discountAmount: 0,
            finalAmount: selectedProduct.price,
            products: [productInfo], // Sử dụng object sản phẩm đã tạo
            paymentMethod: "Cash"
          };

          navigate("/ordersuccess", {
            state: {
              orderDetails: orderInfo
            }
          });
        }
      }
    } catch (error) {
      Swal.close();
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: error.message || "Đã có lỗi xảy ra khi thanh toán.",
        confirmButtonColor: '#3085d6'
      });
    }
  };

  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
            <p className="text-xl text-gray-600">
              Không có sản phẩm nào phù hợp với bộ lọc của bạn.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {paginatedProducts.map((product) => (
                <div
                  key={product.productId}
                  className="bg-white p-3 sm:p-5 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-102 hover:shadow-xl flex flex-col group"
                >
                  <div className="relative overflow-hidden rounded-xl mb-3 sm:mb-4">
                    <img
                      src={
                        product.productsImages?.[0]?.imageUrl || product.image
                      }
                      alt={product.productName}
                      className="w-full h-48 sm:h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.quantity === 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Hết hàng
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-center flex-grow space-y-1 sm:space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-gray-800 text-center line-clamp-2 hover:text-blue-600 cursor-pointer">
                      {product.productName}
                    </h3>
                    <p className="text-lg sm:text-xl font-bold text-blue-600 mt-1 sm:mt-2">
                      {formatCurrency(product.price)}
                    </p>
                    <div className="flex items-center space-x-1">
                      {product.rating ? (
                        <>
                          {Array.from({ length: 5 }).map((_, index) => (
                            <i
                              key={index}
                              className={`fas fa-star ${
                                index < Math.floor(product.rating)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            ></i>
                          ))}
                          <span className="ml-2 text-sm text-gray-600">
                            ({product.rating.toFixed(1)})
                          </span>
                        </>
                      ) : (
                        <span className="text-sm text-gray-500">
                          Chưa có đánh giá
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                    <button
                      className={`w-full py-2 sm:py-2.5 rounded-xl transition-all duration-300 text-sm sm:text-base font-semibold ${
                        product.quantity === 0
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-blue-500/50"
                      }`}
                      onClick={() => handleAddToCart(product)}
                      disabled={product.quantity === 0}
                    >
                      <i className="fas fa-shopping-cart mr-2"></i>
                      {product.quantity === 0
                        ? "Hết hàng"
                        : "Thêm vào giỏ hàng"}
                    </button>
                    <button
                      onClick={() => handleBuyNow(product)}
                      disabled={product.quantity === 0}
                      className={`w-full bg-gradient-to-r from-green-400 to-green-500 hover:from-green-600 hover:to-green-700 text-white py-2 sm:py-2.5 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/50 ${
                        product.quantity === 0 ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <i className="fas fa-bolt mr-2"></i>
                      Mua ngay
                    </button>
                    <button
                      onClick={() => handleViewDetails(product.productId)}
                      className="w-full bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-600 hover:to-pink-700 text-white py-2 sm:py-2.5 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-pink-500/50"
                    >
                      <i className="fas fa-eye mr-2"></i>
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <button
                  className={`mx-1 px-3 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>

                {totalPages <= 7 ? (
                  Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      className={`mx-1 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                        currentPage === index + 1
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))
                ) : (
                  <>
                    <button
                      className={`mx-1 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                        currentPage === 1
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => setCurrentPage(1)}
                    >
                      1
                    </button>

                    {currentPage > 3 && (
                      <span className="mx-1 px-4 py-2 text-gray-500">...</span>
                    )}

                    {Array.from({ length: totalPages }).map((_, index) => {
                      const pageNumber = index + 1;
                      if (
                        pageNumber !== 1 &&
                        pageNumber !== totalPages &&
                        pageNumber >= currentPage - 1 &&
                        pageNumber <= currentPage + 1
                      ) {
                        return (
                          <button
                            key={index}
                            className={`mx-1 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                              currentPage === pageNumber
                                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                            onClick={() => setCurrentPage(pageNumber)}
                          >
                            {pageNumber}
                          </button>
                        );
                      }
                      return null;
                    })}

                    {currentPage < totalPages - 2 && (
                      <span className="mx-1 px-4 py-2 text-gray-500">...</span>
                    )}

                    <button
                      className={`mx-1 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                        currentPage === totalPages
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  className={`mx-1 px-3 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Popup Thanh toán nhỏ gọn */}
      {showPaymentPopup && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-auto overflow-hidden transform transition-all animate-fadeIn">
            {/* Header */}
            <div className="relative h-12 bg-gradient-to-r from-blue-500 to-blue-600">
              <h3 className="text-white font-medium text-lg p-3">Thanh toán nhanh</h3>
              <button 
                onClick={() => setShowPaymentPopup(false)}
                className="absolute right-3 top-3 text-white hover:text-gray-200 transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="p-5">
              {/* Thông tin sản phẩm */}
              <div className="flex gap-4 mb-5">
                <div className="w-1/3">
                  <img
                    src={selectedProduct.productsImages?.[0]?.imageUrl || selectedProduct.image}
                    alt={selectedProduct.productName}
                    className="w-full h-24 object-cover rounded-lg shadow-sm"
                  />
                </div>
                
                <div className="w-2/3">
                  <h3 className="font-bold text-gray-800 text-lg mb-1 line-clamp-2">
                    {selectedProduct.productName}
                  </h3>
                  <div className="text-blue-600 font-bold">
                    {formatCurrency(selectedProduct.price)}
                  </div>
                </div>
              </div>

              {/* Form thông tin */}
              <div className="space-y-3 mb-5">
                {[
                  { name: "name", label: "Họ tên", icon: "fas fa-user" },
                  { name: "phone", label: "Số điện thoại", icon: "fas fa-phone" },
                  { name: "address", label: "Địa chỉ", icon: "fas fa-map-marker-alt" }
                ].map((field) => (
                  <div key={field.name} className="relative">
                    <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                      <span className="pl-3">
                        <i className={`${field.icon} text-gray-400`}></i>
                      </span>
                      <input
                        className="w-full pl-3 pr-4 py-2 bg-transparent focus:outline-none disabled:text-gray-500 text-sm"
                        type="text"
                        placeholder={field.label}
                        value={formData[field.name]}
                        disabled={user !== null}
                        readOnly
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Phương thức thanh toán */}
              <div className="mb-5">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Phương thức thanh toán</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPaymentMethod("VNPay")}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                      paymentMethod === "VNPay"
                        ? "bg-blue-50 border-blue-500 text-blue-600"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-1">
        <div className="relative flex items-center bg-blue-600 text-white px-2.5 py-1 rounded">
          <span className="font-bold text-yellow-300 mr-0.5 text-sm">VN</span>
          <span className="font-bold text-sm">PAY</span>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
        </div>
      </div>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("Cash")}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                      paymentMethod === "Cash"
                        ? "bg-green-50 border-green-500 text-green-600"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <i className="fas fa-money-bill text-lg"></i>
                    <span className="text-sm font-medium">Tiền mặt</span>
                  </button>
                </div>
              </div>

              {/* Thanh toán */}
              <div className="bg-gray-50 -mx-5 -mb-5 p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">Tổng thanh toán</span>
                  <span className="text-lg font-bold text-blue-600">
                    {formatCurrency(selectedProduct.price)}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handlePayment}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    {paymentMethod === "VNPay" ? (
                      <>
                        <i className="fas fa-lock text-xs"></i>
                        Thanh toán VNPay
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check text-xs"></i>
                        Đặt hàng
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowPaymentPopup(false)}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ProductList;
