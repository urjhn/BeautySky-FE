import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import GetCarePlanAPI from "../../../features/services/getcareplan";
import { formatCurrency } from "../../../utils/formatCurrency";
import Swal from "sweetalert2";

const UserRoutinePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userRoutines, setUserRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserRoutines = async () => {
      if (!user) {
        navigate("/login", { state: { returnUrl: "/profilelayout/my-routines" } });
        return;
      }

      try {
        setLoading(true);
        const response = await GetCarePlanAPI.getUserCarePlan(user.userId);
        
        // Kiểm tra và log dữ liệu trả về
        console.log("API response:", response.data);
        
        // Đảm bảo userRoutines luôn là mảng
        if (Array.isArray(response.data)) {
          setUserRoutines(response.data);
        } else if (response.data && typeof response.data === 'object') {
          // Nếu là object đơn lẻ, chuyển thành mảng
          setUserRoutines([response.data]);
        } else {
          // Trường hợp khác, đặt là mảng rỗng
          setUserRoutines([]);
        }
        
        setError(null);
      } catch (err) {
        console.error("Error fetching user routines:", err);
        setError("Không thể tải lộ trình của bạn. Vui lòng thử lại sau.");
        setUserRoutines([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRoutines();
  }, [user, navigate]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleDeleteRoutine = async (routineId) => {
    Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Bạn sẽ không thể khôi phục lại lộ trình này!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy"
    }).then((result) => {
      if (result.isConfirmed) {
        // Thực hiện xóa lộ trình (cần thêm API)
        Swal.fire(
          "Đã xóa!",
          "Lộ trình của bạn đã được xóa.",
          "success"
        );
      }
    });
  };

  if (loading) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="bg-white shadow-xl p-10 sm:p-6 rounded-2xl w-full max-w-2xl text-center">
            <p className="text-xl text-gray-600 animate-pulse">
              Đang tải lộ trình của bạn...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="bg-white shadow-xl p-10 sm:p-6 rounded-2xl w-full max-w-2xl text-center">
            <p className="text-xl text-red-500">{error}</p>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              onClick={() => navigate("/quizz")}
            >
              Tạo lộ trình mới
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!userRoutines || userRoutines.length === 0) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="bg-white shadow-xl p-10 sm:p-6 rounded-2xl w-full max-w-2xl text-center">
            <p className="text-xl text-gray-600 mb-4">Bạn chưa có lộ trình chăm sóc da nào!</p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              onClick={() => navigate("/quizz")}
            >
              Tạo lộ trình mới
            </button>
          </div>
        </div>
      </>
    );
  }

  // Đảm bảo userRoutines là mảng trước khi render
  const routinesToRender = Array.isArray(userRoutines) ? userRoutines : [];

  return (
    <>
      <div className="bg-gray-50 py-6 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
            Dưới đây là các lộ trình chăm sóc da bạn đã lưu
            </h1>
          </div>

          <div className="space-y-6">
            {routinesToRender.map((routine, index) => (
              <div key={index} className="bg-white overflow-hidden shadow-sm rounded-lg">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-2xl font-semibold text-blue-600">{routine.planName}</h2>
                    <button
                      onClick={() => handleDeleteRoutine(routine.id)}
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 text-lg rounded transition-colors"
                    >
                      Xóa
                    </button>
                  </div>
                  
                  <p className="text-lg text-gray-600 mb-4">{routine.description}</p>
                  
                  <div className="space-y-4">
                    {routine.steps && Array.isArray(routine.steps) ? (
                      routine.steps.map((step) => (
                        <div key={step.stepOrder} className="bg-gray-50 p-3 rounded-lg shadow-sm">
                          <div className="flex items-start">
                            <div className="w-6 h-6 flex items-center justify-center bg-blue-500 text-white rounded-full mr-3 flex-shrink-0 text-lg">
                              {step.stepOrder}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-medium text-blue-800 mb-2">
                                {step.stepName}
                              </h3>
                              <ul className="space-y-2">
                                {step.products && Array.isArray(step.products) ? (
                                  step.products.map((product) => (
                                    <li
                                      key={product.productId}
                                      className="flex items-center bg-white p-2 rounded shadow-sm hover:shadow transition-shadow cursor-pointer"
                                      onClick={() => handleProductClick(product.productId)}
                                    >
                                      <img
                                        src={product.productImage}
                                        alt={product.productName}
                                        className="w-12 h-12 object-cover rounded mr-3"
                                      />
                                      <div className="flex-1">
                                        <h4 className="text-lg font-medium text-gray-800">
                                          {product.productName}
                                        </h4>
                                        <p className="text-lg text-gray-600">
                                          {formatCurrency(product.price)}
                                        </p>
                                      </div>
                                    </li>
                                  ))
                                ) : (
                                  <li className="text-lg text-gray-500">Không có sản phẩm nào</li>
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-lg text-gray-500">Không có bước nào trong lộ trình này</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-lg font-medium transition-colors"
              onClick={() => navigate("/quizz")}
            >
              Tạo lộ trình mới
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserRoutinePage;