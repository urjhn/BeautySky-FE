import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const questions = [
  {
    question: "Sau khi rửa mặt 30 phút, da bạn cảm thấy thế nào?",
    options: [
      { text: "Bóng dầu ở toàn bộ mặt", type: "oily" },
      { text: "Chỉ dầu vùng chữ T, khô ở má", type: "combination" },
      { text: "Bình thường, không khô không dầu", type: "normal" },
      { text: "Khô, căng, có thể bong tróc", type: "dry" },
      { text: "Dễ đỏ, kích ứng hoặc ngứa", type: "sensitive" },
    ],
  },
  {
    question: "Bạn có thường xuyên bị mụn không?",
    options: [
      { text: "Rất dễ bị mụn đầu đen, đầu trắng", type: "oily" },
      { text: "Chỉ mụn ở vùng chữ T", type: "combination" },
      { text: "Thỉnh thoảng bị mụn", type: "normal" },
      { text: "Hiếm khi bị mụn", type: "dry" },
      { text: "Hay nổi mẩn đỏ, kích ứng", type: "sensitive" },
    ],
  },
  {
    question: "Da bạn phản ứng thế nào với mỹ phẩm mới?",
    options: [
      { text: "Dễ bị mụn hoặc bít tắc lỗ chân lông", type: "oily" },
      { text: "Không phản ứng nhiều", type: "normal" },
      { text: "Có thể khô, căng hơn", type: "dry" },
      { text: "Dễ đỏ hoặc ngứa khi đổi sản phẩm", type: "sensitive" },
    ],
  },
  {
    question: "Lỗ chân lông của bạn trông thế nào?",
    options: [
      { text: "To, dễ thấy trên toàn bộ mặt", type: "oily" },
      { text: "Nhỏ ở má, to hơn ở vùng chữ T", type: "combination" },
      { text: "Nhỏ, khó thấy", type: "dry" },
      { text: "Không quá lớn cũng không quá nhỏ", type: "normal" },
    ],
  },
];

const skinTypeDescriptions = {
  oily: {
    name: "Da Dầu",
    description:
      "Da bạn tiết nhiều dầu, dễ bị mụn. Hãy chọn sản phẩm kiềm dầu và cấp ẩm nhẹ.",
  },
  combination: {
    name: "Da Hỗn Hợp",
    description:
      "Da bạn dầu vùng chữ T, khô vùng má. Cần cân bằng dầu và độ ẩm.",
  },
  normal: {
    name: "Da Thường",
    description:
      "Da bạn cân bằng, ít gặp vấn đề. Bạn có thể dùng nhiều loại sản phẩm.",
  },
  dry: {
    name: "Da Khô",
    description:
      "Da bạn thiếu nước, dễ bong tróc. Hãy chọn sản phẩm dưỡng ẩm sâu.",
  },
  sensitive: {
    name: "Da Nhạy Cảm",
    description:
      "Da bạn dễ kích ứng. Hãy chọn sản phẩm dịu nhẹ, không chứa hương liệu.",
  },
};

const QuizPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (selectedOption) {
      const updatedAnswers = [...answers, selectedOption.type];
      setAnswers(updatedAnswers);
      setSelectedOption(null);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        determineSkinType(updatedAnswers);
      }
    }
  };

  const determineSkinType = (answers) => {
    const typeCount = answers.reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const mostCommonType = Object.keys(typeCount).reduce((a, b) =>
      typeCount[a] > typeCount[b] ? a : b
    );

    setResult(skinTypeDescriptions[mostCommonType]);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <h1 className="text-5xl font-bold text-[#6BBCFE] animate-pulse text-center mb-6">
          🔍 Kiểm tra loại da của bạn
        </h1>
        <div className="bg-white shadow-xl p-10 rounded-2xl w-full max-w-2xl text-center">
          {result ? (
            <div>
              <h2 className="text-3xl font-bold text-blue-600 animate-bounce">
                Kết quả: {result.name}
              </h2>
              <p className="text-lg text-gray-700 my-6">{result.description}</p>
              <button
                className="mt-6 bg-gradient-to-r from-blue-400 to-blue-600 text-white py-3 px-8 rounded-xl font-semibold shadow-xl hover:scale-105 transition"
                onClick={() => navigate(`/routine-builder?type=${result.name}`)}
              >
                Xem lộ trình chăm sóc
              </button>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-semibold text-blue-600">
                {questions[currentQuestion].question}
              </h2>
              <div className="mt-6 space-y-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center justify-start space-x-4 cursor-pointer rounded-xl p-4 shadow-md transition ${
                      selectedOption?.text === option.text
                        ? "bg-[#6BBCFE] text-white scale-105"
                        : "bg-gray-100 hover:bg-blue-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="quiz"
                      value={option.text}
                      className="hidden"
                      onChange={() => handleOptionClick(option)}
                    />
                    <div className="w-6 h-6 flex items-center justify-center border-2 border-blue-500 rounded-full">
                      {selectedOption?.text === option.text && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <span className="text-lg">{option.text}</span>
                  </label>
                ))}
              </div>
              <button
                className={`mt-6 bg-gradient-to-r from-blue-400 to-blue-600 text-white py-3 px-8 rounded-xl font-semibold shadow-xl transition ${
                  selectedOption
                    ? "hover:scale-105"
                    : "opacity-50 cursor-not-allowed"
                }`}
                onClick={handleNext}
                disabled={!selectedOption}
              >
                {currentQuestion < questions.length - 1
                  ? "Tiếp theo"
                  : "Xem kết quả"}
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default QuizPage;
