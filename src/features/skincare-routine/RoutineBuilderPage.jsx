import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import GetCarePlanAPI from "../services/getcareplan";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { formatCurrency } from "../../utils/formatCurrency";
import Swal from "sweetalert2";

const RoutineBuilderPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [carePlan, setCarePlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  useEffect(() => {
    const fetchCarePlan = async () => {
      if (user) {
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
      } else {
        const isFromQuizz = location.pathname === "/quizz" || location.state?.from?.pathname === "/quizz";
        if (!isFromQuizz) {
          setShowLoginPopup(true);
        }
        setLoading(false);
      }
    };

    fetchCarePlan();
  }, [user, location.state, location.pathname]);

  const handleLoginRedirect = () => {
    navigate("/login", { state: { returnUrl: location.pathname } });
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`, { state: { from: location } });
  };

  const saveCarePlan = async () => {
    if (!user) {
      setShowLoginPopup(true);
      return;
    }

    try {
      const productsToSave = carePlan.steps.flatMap(step => 
        step.products.map(product => ({
          productId: product.productId,
          productName: product.productName,
          stepId: step.stepOrder,
          productImage: product.productImage,
          productPrice: product.productPrice || product.price
        }))
      );

      const saveData = {
        userId: user.userId,
        products: productsToSave
      };

      const response = await GetCarePlanAPI.saveUserCarePlan(saveData);

      if (response.status === 200) {
        Swal.fire({
          title: "Thành công!",
          text: "Lộ trình đã được lưu thành công!",
          icon: "success",
          confirmButtonText: "Đóng",
          confirmButtonColor: "#3085d6",
        });

        const updatedResponse = await GetCarePlanAPI.getUserCarePlan(user.userId);
        if (updatedResponse.data) {
          setCarePlan(updatedResponse.data);
        }
      } else {
        Swal.fire({
          title: "Lỗi!",
          text: "Không thể lưu lộ trình. Vui lòng thử lại sau.",
          icon: "error",
          confirmButtonText: "Đóng",
          confirmButtonColor: "#d33",
        });
      }
    } catch (err) {
      console.error("Error saving care plan:", err);
      Swal.fire({
        title: "Lỗi!",
        text: err.response?.data || "Không thể lưu lộ trình. Vui lòng thử lại sau.",
        icon: "error",
        confirmButtonText: "Đóng",
        confirmButtonColor: "#d33",
      });
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="bg-white shadow-xl p-10 sm:p-6 rounded-2xl w-full max-w-2xl text-center">
            <p className="text-xl text-gray-600 animate-pulse">
              Đang tải lộ trình...
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="bg-white shadow-xl p-10 sm:p-6 rounded-2xl w-full max-w-2xl text-center">
            <p className="text-xl text-red-500">{error}</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (showLoginPopup) {
    return (
      <>
        <Navbar />
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 text-center">
            <h2 className="text-xl font-bold">Vui lòng đăng nhập</h2>
            <p className="mt-4">Bạn cần đăng nhập để xem lộ trình chăm sóc da.</p>
            <div className="mt-6 flex justify-center gap-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                onClick={handleLoginRedirect}
              >
                Đăng nhập
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                onClick={() => navigate("/quizz")}
              >
                Quay lại
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!carePlan) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="bg-white shadow-xl p-10 sm:p-6 rounded-2xl w-full max-w-2xl text-center">
            <p className="text-xl text-gray-600">Không có lộ trình nào!</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="bg-white shadow-xl p-10 sm:p-6 rounded-2xl w-full max-w-4xl">
          {carePlan && (
            <>
              <div className="text-center mb-8">
                <h2 className="text-5xl md:text-4xl sm:text-3xl font-bold text-[#6BBCFE] animate-pulse text-center mb-6 px-4">
                  {carePlan.planName}
                </h2>
                <p className="text-xl sm:text-lg text-gray-600">
                  {carePlan.description}
                </p>
              </div>

              <div className="space-y-6 relative">
                {/* Đường kết nối dọc giữa các bước */}
                {carePlan.steps.length > 1 && (
                  <div 
                    className="absolute left-4 w-0.5 bg-blue-400 z-0"
                    style={{
                      top: "8px",
                      // Tính toán chiều cao để dừng trước bước cuối cùng
                      bottom: `${carePlan.steps.length > 0 ? 120 : 0}px` // Điều chỉnh giá trị 120px tùy theo layout thực tế
                    }}
                  ></div>
                )}


                {carePlan.steps.map((step, index) => (
                  <div key={step.stepOrder} className="relative z-10">
                    <div className="flex items-start mb-4">
                      {/* Sử dụng index + 1 thay vì step.stepOrder để đảm bảo đánh số liên tục */}
                      <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full mr-4 shadow-lg font-bold border-2 border-white">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl sm:text-xl font-semibold text-blue-800 mb-2">
                          {step.stepName}
                        </h3>
                        {/* Phần nội dung còn lại của bước vẫn giữ nguyên */}
                        <ul className="space-y-3">
                          {step.products.map((product) => (
                            <li
                              key={product.productId}
                              className="flex items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-100"
                              onClick={() => handleProductClick(product.productId)}
                            >
                              <img
                                src={product.productImage || '/default-product-image.jpg'}
                                alt={product.productName}
                                className="w-16 h-16 rounded-full mr-4 object-cover border-2 border-blue-100"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = '/default-product-image.jpg';
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
                      </div>
                    </div>
                    
                    {/* Thêm nút kết nối giữa các bước nếu không phải bước cuối cùng */}
                    {index < carePlan.steps.length - 1 && (
                      <div className="absolute left-5 -bottom-3 w-0 h-6 flex items-center justify-center z-0">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

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
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RoutineBuilderPage;