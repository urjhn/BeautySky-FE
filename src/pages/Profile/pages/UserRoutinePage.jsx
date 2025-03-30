import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import GetCarePlanAPI from "../../../features/services/getcareplan";
import { formatCurrency } from "../../../utils/formatCurrency";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from 'framer-motion';

const UserRoutinePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userRoutines, setUserRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRoutineId, setExpandedRoutineId] = useState(null);

  useEffect(() => {
    const fetchUserRoutines = async () => {
      if (!user) {
        navigate("/login", {
          state: { returnUrl: "/profilelayout/my-routines" },
        });
        return;
      }

      try {
        setLoading(true);
        const response = await GetCarePlanAPI.getUserCarePlan(user.userId);
        setUserRoutines(response.data);
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

  const handleDeleteRoutine = async (carePlanId) => {
    try {
      // Hiển thị confirm trước khi xóa
      const result = await Swal.fire({
        title: "Bạn có chắc chắn?",
        text: "Bạn sẽ không thể khôi phục lại lộ trình này!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
      });

      if (!result.isConfirmed) {
        return;
      }

      setLoading(true);

      // Gọi API xóa lộ trình với userId và carePlanId
      const response = await GetCarePlanAPI.deleteUserCarePlan(user.userId, carePlanId);

      if (response.status === 200) {
        // Xóa lộ trình khỏi state
        setUserRoutines(prevRoutines => 
          prevRoutines.filter(routine => routine.carePlanId !== carePlanId)
        );

        // Hiển thị thông báo thành công
        await Swal.fire({
          title: "Đã xóa!",
          text: "Lộ trình của bạn đã được xóa thành công.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error("Lỗi khi xóa lộ trình:", error);
      
      // Hiển thị thông báo lỗi
      await Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: error.response?.data || "Không thể xóa lộ trình. Vui lòng thử lại sau.",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleRoutineExpand = (routineId) => {
    setExpandedRoutineId(expandedRoutineId === routineId ? null : routineId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white shadow-xl p-10 sm:p-6 rounded-2xl w-full max-w-2xl text-center">
          <p className="text-xl text-gray-600 animate-pulse">
            Đang tải lộ trình của bạn...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  if (!userRoutines || userRoutines.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white shadow-xl p-10 sm:p-6 rounded-2xl w-full max-w-2xl text-center">
          <p className="text-xl text-gray-600 mb-4">
            Bạn chưa có lộ trình chăm sóc da nào!
          </p>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() => navigate("/quizz")}
          >
            Tạo lộ trình mới
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-8 px-4 mt-[72px]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Lộ trình chăm sóc da của bạn
          </h1>
          <p className="text-gray-600 text-lg">
            Được tạo dựa trên kết quả phân tích làn da của bạn
          </p>
        </motion.div>

        <div className="space-y-6">
          {userRoutines.map((routine) => (
            <motion.div
              key={routine.carePlanId}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div
                className="p-6 cursor-pointer"
                onClick={() => toggleRoutineExpand(routine.carePlanId)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                      {routine.planName}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Cập nhật: {new Date(routine.dateModified || routine.dateCreate).toLocaleDateString('vi-VN', {
                        // hour: '2-digit',
                        // minute: '2-digit',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRoutine(routine.carePlanId);
                      }}
                      disabled={loading}
                      className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg 
                                 transition-all duration-200 transform hover:scale-105
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Đang xóa..." : "Xóa"}
                    </button>
                    <motion.span
                      animate={{ rotate: expandedRoutineId === routine.carePlanId ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-blue-500 text-2xl"
                    >
                      ▼
                    </motion.span>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {expandedRoutineId === routine.carePlanId && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 border-t border-gray-100">
                      <p className="text-lg text-gray-600 mb-6">
                        {routine.description}
                      </p>
                      <div className="space-y-6">
                        {routine.steps?.map((step) => (
                          <motion.div
                            key={step.stepOrder}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: step.stepOrder * 0.1 }}
                            className="bg-gray-50 p-5 rounded-xl shadow-sm"
                          >
                            <div className="flex items-start">
                              <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-full mr-4 flex-shrink-0 text-lg font-semibold">
                                {step.stepOrder}
                              </div>
                              <div className="flex-1">
                                <h3 className="text-xl font-medium text-gray-800 mb-3">
                                  {step.stepName}
                                </h3>
                                <div className="grid gap-4">
                                  {step.products?.length > 0 ? (
                                    step.products.map((product) => (
                                      <motion.div
                                        key={product.productId}
                                        whileHover={{ scale: 1.02 }}
                                        className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                                        onClick={() => handleProductClick(product.productId)}
                                      >
                                        <div className="flex items-center">
                                          <img
                                            src={product.productImage}
                                            alt={product.productName}
                                            className="w-16 h-16 object-cover rounded-lg mr-4"
                                          />
                                          <div>
                                            <h4 className="text-lg font-medium text-gray-800 mb-1">
                                              {product.productName}
                                            </h4>
                                            <p className="text-blue-500 font-medium">
                                              {formatCurrency(product.productPrice)}
                                            </p>
                                          </div>
                                        </div>
                                      </motion.div>
                                    ))
                                  ) : (
                                    <p className="text-gray-500 text-center py-4">
                                      Không có sản phẩm nào cho bước này
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-center"
        >
          <button
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                     text-white py-3 px-6 rounded-lg text-lg font-medium 
                     transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            onClick={() => navigate("/quizz")}
          >
            Tạo lộ trình mới
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default UserRoutinePage;
