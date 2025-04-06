import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import GetCarePlanAPI from "../services/getcareplan";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { formatCurrency } from "../../utils/formatCurrency";
import { FaShoppingCart } from "react-icons/fa";
import Swal from "sweetalert2";
import productAPI from "../../services/product";
import { useCart } from "../../context/CartContext";

const RoutineBuilderPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const [carePlan, setCarePlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState({});
  const [relatedProducts, setRelatedProducts] = useState({});
  const [products, setProducts] = useState([]);

  // Fetch care plan
  const fetchCarePlan = useCallback(async () => {
    if (!user) {
      const isFromQuizz =
        location.pathname === "/quizz" ||
        location.state?.from?.pathname === "/quizz";
      if (!isFromQuizz) {
        setShowLoginPopup(true);
      }
      setLoading(false);
      return;
    }

    const userId = user?.userId || location.state?.userId;
    if (!userId) {
      setError("Không tìm thấy userId. Vui lòng đăng nhập lại.");
      setLoading(false);
      return;
    }

    try {
      const response = await GetCarePlanAPI.getCarePlanById(userId);
      setCarePlan(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching care plan:", err);
      setError("Không thể tải lộ trình. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }, [user, location.state, location.pathname]);

  // Fetch all products once
  const fetchProducts = useCallback(async () => {
    try {
      const response = await productAPI.getAll();
      if (response.data && Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        console.error("Invalid product data format:", response.data);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error.response || error.message);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể tải danh sách sản phẩm",
        confirmButtonColor: "#3085d6",
      });
    }
  }, []);

  // Run fetch on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchCarePlan(), fetchProducts()]);
      setLoading(false);
    };
    loadData();
  }, [fetchCarePlan, fetchProducts]);

  // Find related products based on category and skin type
  const findRelatedProducts = useCallback(
    (step) => {
      if (!products.length || !step.products?.length) return [];

      const stepProductIds = step.products.map((p) => p.productId);
      const stepCategories = new Set();
      const stepSkinTypes = new Set();

      step.products.forEach((product) => {
        if (product.categoryName) stepCategories.add(product.categoryName);
        if (product.skinTypeName) stepSkinTypes.add(product.skinTypeName);
        if (product.category?.categoryName) stepCategories.add(product.category.categoryName);
        if (product.skinType?.skinTypeName) stepSkinTypes.add(product.skinType.skinTypeName);
      });

      if (stepCategories.size === 0 || stepSkinTypes.size === 0) {
        step.products.forEach((stepProduct) => {
          const originalProduct = products.find((p) => p.productId === stepProduct.productId);
          if (originalProduct) {
            if (originalProduct.categoryName) stepCategories.add(originalProduct.categoryName);
            if (originalProduct.skinTypeName) stepSkinTypes.add(originalProduct.skinTypeName);
          }
        });
      }

      if (stepCategories.size === 0 || stepSkinTypes.size === 0) {
        return [];
      }

      const related = products
        .filter((product) => {
          if (product.isActive === false || stepProductIds.includes(product.productId)) {
            return false;
          }
          const categoryMatch = product.categoryName && stepCategories.has(product.categoryName);
          const skinTypeMatch = product.skinTypeName && stepSkinTypes.has(product.skinTypeName);
          return categoryMatch && skinTypeMatch;
        })
        .slice(0, 4);

      return related;
    },
    [products]
  );

  // Toggle expanded state and load related products
  const toggleExpanded = (stepId) => {
    setExpandedSteps((prev) => {
      const newState = { ...prev, [stepId]: !prev[stepId] };
      if (newState[stepId]) {
        const step = carePlan?.steps?.find((s) => s.stepOrder === stepId);
        if (step) {
          const related = findRelatedProducts(step);
          setRelatedProducts((prevRelated) => ({
            ...prevRelated,
            [stepId]: related,
          }));
        }
      }
      return newState;
    });
  };

  // Handle product click to navigate to product detail
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`, { state: { from: location } });
  };

  // Handle adding product to cart
  const handleAddToCart = async (product, e) => {
    if (e) e.stopPropagation();
    if (product.quantity === 0) {
      Swal.fire({
        icon: "error",
        title: "Hết hàng",
        text: "Sản phẩm này hiện đã hết hàng!",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    try {
      const cartItem = {
        productId: product.productId,
        quantity: 1,
        price: product.price,
        productName: product.productName,
        productImage: product.productsImages?.[0]?.imageUrl || product.image,
      };

      await addToCart(cartItem);
      Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: "Đã thêm sản phẩm vào giỏ hàng",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.response?.data || "Không thể thêm sản phẩm vào giỏ hàng",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  // Handle login redirect
  const handleLoginRedirect = () => {
    navigate("/login", { state: { returnUrl: location.pathname } });
  };

  // Render login popup
  const renderLoginPopup = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
            Đăng nhập để xem lộ trình
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            Bạn cần đăng nhập để xem lộ trình chăm sóc da cá nhân hóa của mình.
          </p>
          <div className="flex flex-col space-y-4">
            <button
              className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              onClick={handleLoginRedirect}
            >
              Đăng nhập
            </button>
            <button
              className="bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              onClick={() => navigate("/quizz")}
            >
              Làm bài kiểm tra da
            </button>
            <button
              className="text-blue-600 hover:text-blue-800 font-medium"
              onClick={() => setShowLoginPopup(false)}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-xl text-gray-600">Đang tải lộ trình...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        {showLoginPopup && renderLoginPopup()}

        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-blue-800 mb-2 text-center">
              {carePlan?.planName || "Lộ trình chăm sóc da cá nhân hóa"}
            </h1>
            <p className="text-gray-600 mb-6 text-center">
              {carePlan?.description ||
                "Dựa trên kết quả phân tích da của bạn, chúng tôi đã tạo lộ trình chăm sóc da phù hợp nhất."}
            </p>

            {error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
                {error}
                <button
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={handleLoginRedirect}
                >
                  Đăng nhập
                </button>
              </div>
            ) : !carePlan ? (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-center">
                Bạn chưa có lộ trình chăm sóc da. Vui lòng làm bài kiểm tra da để nhận lộ trình phù hợp.
                <div className="mt-4">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={() => navigate("/quizz")}
                  >
                    Làm bài kiểm tra da
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="relative">
                  {carePlan.steps.length > 1 && (
                    <div
                      className="absolute left-5 top-0 w-0.5 bg-blue-200 z-0"
                      style={{ bottom: `${carePlan.steps.length > 0 ? 120 : 0}px` }}
                    />
                  )}

                  <div className="space-y-8">
                    {carePlan.steps.map((step, index) => (
                      <div key={step.stepOrder} className="relative z-10">
                        <div className="flex items-start mb-4">
                          <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full mr-4 shadow-lg font-bold border-2 border-white">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl sm:text-xl font-semibold text-blue-800 mb-2">
                              {step.stepName}
                            </h3>
                            <ul className="space-y-3">
                              {step.products.map((product) => (
                                <li
                                  key={product.productId}
                                  className="flex items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-100"
                                  onClick={() => handleProductClick(product.productId)}
                                >
                                  <img
                                    src={product.productImage || "/default-product-image.jpg"}
                                    alt={product.productName}
                                    className="w-16 h-16 rounded-full mr-4 object-cover border-2 border-blue-100"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = "/default-product-image.jpg";
                                    }}
                                  />
                                  <div className="flex-1">
                                    <span className="text-lg sm:text-xl text-gray-800">
                                      {product.productName}
                                    </span>
                                    <p className="text-md text-gray-600">
                                      {formatCurrency(product.productPrice || product.price)}
                                    </p>
                                  </div>
                                </li>
                              ))}
                            </ul>

                            <button
                              className="mt-4 text-blue-500 hover:text-blue-700 font-medium flex items-center"
                              onClick={() => toggleExpanded(step.stepOrder)}
                            >
                              {expandedSteps[step.stepOrder] ? "Thu gọn ▲" : "Xem thêm ▼"}
                            </button>

                            {expandedSteps[step.stepOrder] && (
                              <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-100 animate-fadeIn">
                                <h4 className="text-lg font-semibold text-blue-700 mb-3">
                                  Sản phẩm liên quan
                                </h4>
                                {relatedProducts[step.stepOrder]?.length > 0 ? (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {relatedProducts[step.stepOrder].map((relatedProduct) => (
                                      <div
                                        key={relatedProduct.productId}
                                        className="flex items-center bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
                                        onClick={() => handleProductClick(relatedProduct.productId)}
                                      >
                                        <img
                                          src={
                                            relatedProduct.productsImages?.[0]?.imageUrl ||
                                            relatedProduct.image ||
                                            "/default-product-image.jpg"
                                          }
                                          alt={relatedProduct.productName}
                                          className="w-12 h-12 rounded-full mr-3 object-cover border-2 border-blue-100"
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "/default-product-image.jpg";
                                          }}
                                        />
                                        <div className="flex-1">
                                          <span className="text-md font-medium text-gray-800 line-clamp-1">
                                            {relatedProduct.productName}
                                          </span>
                                          <div className="flex items-center justify-between">
                                            <p className="text-sm text-gray-600">
                                              {formatCurrency(relatedProduct.price)}
                                            </p>
                                            <button
                                              className="text-blue-500 hover:text-blue-700"
                                              onClick={(e) => handleAddToCart(relatedProduct, e)}
                                            >
                                              <FaShoppingCart />
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-gray-500 text-center py-2">
                                    Không tìm thấy sản phẩm liên quan
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        {index < carePlan.steps.length - 1 && (
                          <div className="absolute left-5 -bottom-3 w-0 h-6 flex items-center justify-center z-0">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex justify-center gap-4">
                  <button
                    className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-3 px-8 rounded-xl font-semibold shadow-md hover:from-blue-500 hover:to-blue-700 transition-all"
                    onClick={() => navigate("/quizz")}
                  >
                    🔄 Làm lại bài kiểm tra
                  </button>
                  <button
                    className="bg-gradient-to-r from-green-400 to-green-600 text-white py-3 px-8 rounded-xl font-semibold shadow-md hover:from-green-500 hover:to-green-700 transition-all"
                    onClick={() => navigate("/")}
                  >
                    🏠 Về trang chủ
                  </button>
                </div>
              </>
            )}
          </div>

          {carePlan && (
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">
                Lời khuyên chăm sóc da
              </h2>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="font-semibold text-blue-700 mb-2">
                    Thứ tự sử dụng sản phẩm
                  </h3>
                  <p className="text-gray-600">
                    Luôn tuân thủ thứ tự các bước trong lộ trình chăm sóc da để đạt hiệu quả tốt nhất. Thông thường, thứ tự từ sản phẩm mỏng đến đặc.
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="font-semibold text-blue-700 mb-2">
                    Kiên trì và nhất quán
                  </h3>
                  <p className="text-gray-600">
                    Kết quả chăm sóc da không đến ngay lập tức. Hãy kiên trì thực hiện lộ trình ít nhất 4-6 tuần để thấy sự thay đổi rõ rệt.
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="font-semibold text-blue-700 mb-2">
                    Chống nắng mỗi ngày
                  </h3>
                  <p className="text-gray-600">
                    Sử dụng kem chống nắng hàng ngày, kể cả khi ở trong nhà hoặc trời mây, để bảo vệ da khỏi tác hại của tia UV.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RoutineBuilderPage;