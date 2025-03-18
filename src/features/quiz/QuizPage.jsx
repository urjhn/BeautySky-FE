import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import questionsAPI from "../services/questions";
import answersAPI from "../services/answers";
import resultAPI from "../services/result";
import { useAuth } from "../../context/AuthContext";

const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showConfirmLoginPopup, setShowConfirmLoginPopup] = useState(false);
  const [showResultPopup, setShowResultPopup] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [questionsRes, answersRes] = await Promise.all([
          questionsAPI.getAll(),
          answersAPI.getAll(),
        ]);

        if (Array.isArray(questionsRes.data) && questionsRes.data.length > 0) {
          const formattedQuestions = questionsRes.data.map((q) => ({
            id: q.questionId,
            quizId: q.quizId,
            question: q.questionText,
            order: q.orderNumber,
            options: answersRes.data
              .filter((a) => a.questionId === q.questionId)
              .map((a) => ({
                id: a.answerId,
                text: a.answerText,
                skinTypeId: a.skinTypeId,
                point: a.point,
              })),
          }));
          setQuestions(formattedQuestions);
        } else {
          setQuestions([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.key]);

  const handleSelectAnswer = (questionId, answerId) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (Object.keys(selectedAnswers).length !== questions.length) {
      alert("❗Vui lòng trả lời tất cả câu hỏi!");
      return;
    }

    try {
      const payload = Object.entries(selectedAnswers).map(
        ([questionId, answerId]) => ({
          questionId: parseInt(questionId),
          answerId: answerId,
        })
      );

      const response = await resultAPI.createQuiz(payload);
      if (response.data) {
        setResult(response.data);
        setShowResultPopup(true);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  const handleRestartQuiz = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setResult(null);
    setShowResultPopup(false);
  };

  const handleViewRoutine = () => {
    if (user) {
      navigate("/RoutineBuilderPage", {
        state: {
          userId: user.userId,
          skinTypeId: result.bestSkinType.skinTypeId, // Loại da mới từ quiz
          isNewPlan: true, // Đánh dấu đây là lộ trình mới
        },
      });
    } else {
      setShowConfirmLoginPopup(true);
    }
  };

  const handleConfirmLogin = () => {
    navigate("/login");
    setShowConfirmLoginPopup(false);
  };

  const handleCancelLogin = () => {
    setShowConfirmLoginPopup(false);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <h1 className="text-5xl md:text-4xl sm:text-3xl font-bold text-[#6BBCFE] animate-pulse text-center mb-6 px-4">
          🔍 Kiểm tra loại da của bạn
        </h1>
        <div className="bg-white shadow-xl p-10 sm:p-6 rounded-2xl w-full max-w-2xl text-center">
          {loading ? (
            <p>Đang tải câu hỏi...</p>
          ) : questions.length > 0 ? (
            <div>
              <div className="flex justify-center items-center my-4 space-x-2 flex-wrap gap-y-2">
                {questions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-7 h-7 sm:w-6 sm:h-6 flex items-center justify-center rounded-full text-sm font-medium border-2 ${
                      index === currentQuestionIndex
                        ? "bg-blue-500 text-white border-blue-500"
                        : index < currentQuestionIndex
                        ? "bg-green-500 text-white border-green-500"
                        : "bg-gray-100 border-gray-300"
                    }`}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
              <h2 className="text-2xl sm:text-xl font-semibold text-blue-600 px-2">
                {questions[currentQuestionIndex].question}
              </h2>
              <div className="mt-6 space-y-4 px-2">
                {questions[currentQuestionIndex].options.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center justify-start space-x-4 cursor-pointer rounded-xl p-4 sm:p-3 shadow-md bg-gray-100 hover:bg-blue-200 ${
                      selectedAnswers[questions[currentQuestionIndex].id] ===
                      option.id
                        ? "bg-blue-300"
                        : ""
                    }`}
                    onClick={() =>
                      handleSelectAnswer(
                        questions[currentQuestionIndex].id,
                        option.id
                      )
                    }
                  >
                    <div className="w-6 h-6 sm:w-5 sm:h-5 flex items-center justify-center border-2 border-blue-500 rounded-full">
                      {selectedAnswers[questions[currentQuestionIndex].id] ===
                        option.id && "✔"}
                    </div>
                    <span className="text-lg sm:text-base">{option.text}</span>
                  </label>
                ))}
              </div>
              <div className="mt-6 flex justify-between items-center w-full flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-auto order-2 sm:order-1">
                  {currentQuestionIndex > 0 && (
                    <button
                      className="bg-gradient-to-r from-gray-400 to-gray-600 text-white py-3 px-6 rounded-xl font-semibold shadow-md hover:from-gray-500 hover:to-gray-700 transition-all w-full sm:w-auto"
                      onClick={() =>
                        setCurrentQuestionIndex((prev) => prev - 1)
                      }
                    >
                      ⬅️ Quay lại
                    </button>
                  )}
                </div>
                <button
                  className={`py-3 px-8 rounded-xl font-semibold shadow-xl transition-all w-full sm:w-auto order-1 sm:order-2 ${
                    currentQuestionIndex < questions.length - 1
                      ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white hover:from-blue-500 hover:to-blue-700 disabled:opacity-50"
                      : "bg-gradient-to-r from-green-400 to-green-600 text-white hover:from-green-500 hover:to-green-700"
                  }`}
                  onClick={
                    currentQuestionIndex < questions.length - 1
                      ? handleNextQuestion
                      : handleSubmitQuiz
                  }
                  disabled={
                    currentQuestionIndex < questions.length - 1 &&
                    !selectedAnswers[questions[currentQuestionIndex].id]
                  }
                >
                  {currentQuestionIndex < questions.length - 1
                    ? "Tiếp theo ➡️"
                    : "Hoàn thành bài kiểm tra ✅"}
                </button>
              </div>
            </div>
          ) : (
            <p>Không có câu hỏi nào!</p>
          )}
        </div>

        {showResultPopup && result && (
          <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl transform transition-all animate-fadeIn">
              <div className="relative p-6 text-center">
                <div className="bg-gradient-to-r from-blue-300 via-purple-400 to-blue-500 absolute top-0 left-0 right-0 h-28 rounded-t-2xl"></div>

                <div className="relative pt-14 pb-6 px-8">
                  <div className="bg-white w-24 h-24 rounded-full mx-auto shadow-lg flex items-center justify-center border-4 border-purple-100">
                    <span className="text-5xl">🌟</span>
                  </div>

                  <h2 className="text-3xl font-bold text-gray-800 mt-6 mb-3">
                    Kết quả phân tích da của bạn
                  </h2>

                  <div className="bg-blue-50 rounded-xl p-6 mb-6 mt-4 shadow-inner">
                    <p className="text-xl font-medium text-gray-700">
                      Loại da của bạn là:
                    </p>
                    <p className="text-3xl font-bold text-blue-600 mt-2 mb-2">
                      {result.bestSkinType.skinTypeName}
                    </p>
                    <p className="text-gray-600 text-sm mt-2">
                      Kết quả được xác định dựa trên các câu trả lời của bạn
                      trong bài kiểm tra
                    </p>
                  </div>

                  <div className="bg-yellow-50 rounded-xl p-5 mb-6 max-w-2xl mx-auto border border-yellow-100">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Đặc điểm của loại da {result.bestSkinType.skinTypeName}:
                    </h3>
                    <p className="text-gray-700">
                      {result.bestSkinType.skinTypeName === "Da khô" &&
                        "Da thường xuyên cảm thấy căng, thiếu độ ẩm. Dễ bong tróc, đặc biệt khi thời tiết lạnh hoặc khô."}
                      {result.bestSkinType.skinTypeName === "Da dầu" &&
                        "Da tiết nhiều dầu, đặc biệt ở vùng chữ T (trán, mũi, cằm). Dễ bị mụn và lỗ chân lông to."}
                      {result.bestSkinType.skinTypeName === "Da hỗn hợp" &&
                        "Da vừa có vùng dầu (thường là vùng chữ T), vừa có vùng khô (hai má). Cần chăm sóc cân bằng."}
                      {result.bestSkinType.skinTypeName === "Da thường" &&
                        "Da cân bằng, không quá dầu cũng không quá khô. Ít gặp vấn đề và dễ chăm sóc nhất."}
                      {result.bestSkinType.skinTypeName === "Da nhạy cảm" &&
                        "Da dễ bị kích ứng, đỏ hoặc ngứa khi tiếp xúc với một số sản phẩm. Cần những sản phẩm dịu nhẹ."}
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-center gap-4 mt-4">
                    <button
                      onClick={handleRestartQuiz}
                      className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium"
                    >
                      🔄 Làm lại bài kiểm tra
                    </button>

                    <button
                      onClick={handleViewRoutine}
                      className="px-6 py-3 bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-md"
                    >
                      📍 Xem lộ trình chăm sóc da
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showConfirmLoginPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 text-center">
              <h2 className="text-xl font-bold">Bạn có muốn đăng nhập?</h2>
              <p className="mt-4">
                Bạn cần đăng nhập để xem lộ trình chăm sóc da.
              </p>
              <div className="mt-6 flex justify-center gap-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={handleConfirmLogin}
                >
                  Có, đăng nhập
                </button>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  onClick={handleCancelLogin}
                >
                  Không, cảm ơn
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default QuizPage;
