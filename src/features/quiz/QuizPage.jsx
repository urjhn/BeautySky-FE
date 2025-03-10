import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import questionsAPI from "../services/questions";
import answersAPI from "../services/answers";
import resultAPI from "../services/result";

const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const navigate = useNavigate();

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
  }, []);

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
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
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
          ) : result ? (
            <div className="text-center">
              <h2 className="text-4xl sm:text-3xl font-bold text-green-600">
                🎉 Kết quả của bạn
              </h2>
              <p className="text-2xl sm:text-xl mt-4 font-semibold">
                Loại da của bạn:{" "}
                <span className="text-blue-500">
                  {result.bestSkinType.skinTypeName}
                </span>
              </p>
              <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
                <button
                  className="bg-gray-400 text-white py-3 px-8 rounded-xl font-semibold shadow-md hover:bg-gray-500 transition-all w-full sm:w-auto"
                  onClick={() => {
                    setResult(null);
                    setSelectedAnswers({});
                    setCurrentQuestionIndex(0);
                  }}
                >
                  🔄 Làm lại bài kiểm tra
                </button>
                <button
                  className="bg-blue-400 text-white py-3 px-8 rounded-xl font-semibold shadow-md hover:bg-blue-500 transition-all w-full sm:w-auto"
                  onClick={() => navigate("/routine-builder")}
                >
                  📍 Xem lộ trình
                </button>
              </div>
            </div>
          ) : questions.length > 0 ? (
            <div>
              {/* Progress indicators */}
              <div className="flex justify-center items-center my-4 space-x-2 flex-wrap gap-y-2">
                {questions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-7 h-7 sm:w-6 sm:h-6 flex items-center justify-center rounded-full text-sm font-medium border-2 ${
                      index === currentQuestionIndex
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-gray-100 border-gray-300"
                    }`}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
              
              {/* Question display */}
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

              {/* Navigation buttons */}
              <div className="mt-6 flex justify-between items-center w-full flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-auto order-2 sm:order-1">
                  {currentQuestionIndex > 0 && (
                    <button
                      className="bg-gradient-to-r from-gray-400 to-gray-600 text-white py-3 px-6 rounded-xl font-semibold shadow-md hover:from-gray-500 hover:to-gray-700 transition-all w-full sm:w-auto"
                      onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
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
      </div>
      <Footer />
    </>
  );
};

export default QuizPage;
