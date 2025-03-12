import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import GetCarePlanAPI from "../services/getcareplan";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

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
        setShowLoginPopup(true);
        setLoading(false);
      }
    };

    fetchCarePlan();
  }, [user, location.state]);

  const handleLoginRedirect = () => {
    navigate("/login");
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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
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
              onClick={() => navigate("/quiz")}
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
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
        <h1 className="text-5xl md:text-4xl sm:text-3xl font-bold text-[#6BBCFE] animate-pulse text-center mb-6 px-4">
          ✨ Lộ trình chăm sóc da của bạn
        </h1>

        <div className="bg-white shadow-xl p-10 sm:p-6 rounded-2xl w-full max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-4xl sm:text-3xl font-bold text-green-600 mb-4">
              {carePlan.planName}
            </h2>
            <p className="text-xl sm:text-lg text-gray-600">
              {carePlan.description}
            </p>
          </div>

          <div className="space-y-6">
            {carePlan.steps.map((step) => (
              <div
                key={step.stepOrder}
                className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start mb-4">
                  <div className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full mr-4">
                    {step.stepOrder}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl sm:text-xl font-semibold text-blue-800 mb-2">
                      {step.stepName}
                    </h3>
                    <ul className="space-y-3">
                      {step.products.map((product) => (
                        <li
                          key={product.productId}
                          className="flex items-center bg-white p-3 rounded-lg shadow-sm hover:bg-blue-50 transition-colors"
                        >
                          <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                          <span className="text-lg sm:text-base text-gray-700">
                            {product.productName}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <button
              className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-3 px-8 rounded-xl font-semibold shadow-md hover:from-blue-500 hover:to-blue-700 transition-all"
              onClick={() => navigate("/quiz")}
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
