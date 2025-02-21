import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const questions = [
  {
    question: "Sau khi rửa mặt 30 phút, da bạn cảm thấy thế nào?",
    options: [
      { text: "Bóng dầu, đặc biệt ở vùng chữ T", type: "oily" },
      { text: "Khô, căng và có cảm giác khó chịu", type: "dry" },
      { text: "Bình thường, không quá khô hoặc nhờn", type: "normal" },
      { text: "Dễ bị đỏ và kích ứng", type: "sensitive" },
    ],
  },
  {
    question: "Lỗ chân lông của bạn trông như thế nào?",
    options: [
      { text: "To và dễ thấy trên toàn bộ khuôn mặt", type: "oily" },
      { text: "Nhỏ hoặc không thấy rõ", type: "dry" },
      { text: "Nhỏ ở má nhưng lớn hơn ở vùng chữ T", type: "normal" },
      { text: "Bình thường nhưng dễ bị mẩn đỏ", type: "sensitive" },
    ],
  },
  {
    question: "Bạn có thường xuyên bị nổi mụn hoặc kích ứng không?",
    options: [
      { text: "Rất dễ bị mụn", type: "oily" },
      { text: "Thỉnh thoảng bị khô và bong tróc", type: "dry" },
      { text: "Rất ít khi bị mụn", type: "normal" },
      { text: "Dễ bị đỏ và nhạy cảm với mỹ phẩm", type: "sensitive" },
    ],
  },
];

const skinTypeDescriptions = {
  oily: {
    name: "Da Dầu",
    description:
      "Da bạn có xu hướng sản xuất nhiều dầu, dễ bị mụn nhưng ít nếp nhăn hơn. Hãy sử dụng sản phẩm kiềm dầu và cấp ẩm nhẹ.",
    products: [
      { name: "Sữa rửa mặt kiềm dầu", image: "/images/oily-cleanser.jpg" },
      { name: "Toner chứa BHA", image: "/images/oily-toner.jpg" },
      { name: "Kem dưỡng gel nhẹ", image: "/images/oily-moisturizer.jpg" },
    ],
  },
  dry: {
    name: "Da Khô",
    description:
      "Da bạn thường thiếu nước, dễ bong tróc và có nếp nhăn. Hãy sử dụng kem dưỡng ẩm sâu và tránh các sản phẩm có cồn.",
    products: [
      { name: "Sữa rửa mặt dịu nhẹ", image: "/images/dry-cleanser.jpg" },
      { name: "Serum cấp ẩm", image: "/images/dry-serum.jpg" },
      { name: "Kem dưỡng ẩm sâu", image: "/images/dry-moisturizer.jpg" },
    ],
  },
  normal: {
    name: "Da Thường",
    description:
      "Da bạn cân bằng, không quá dầu cũng không quá khô. Bạn có thể sử dụng hầu hết các sản phẩm chăm sóc da.",
    products: [
      { name: "Sữa rửa mặt dịu nhẹ", image: "/images/normal-cleanser.jpg" },
      { name: "Toner cân bằng", image: "/images/normal-toner.jpg" },
      { name: "Kem dưỡng ẩm", image: "/images/normal-moisturizer.jpg" },
    ],
  },
  sensitive: {
    name: "Da Nhạy Cảm",
    description:
      "Da bạn dễ bị kích ứng, mẩn đỏ hoặc phản ứng với mỹ phẩm. Hãy sử dụng các sản phẩm dịu nhẹ, không chứa hương liệu.",
    products: [
      {
        name: "Sữa rửa mặt không xà phòng",
        image: "/images/sensitive-cleanser.jpg",
      },
      { name: "Serum làm dịu", image: "/images/sensitive-serum.jpg" },
      {
        name: "Kem dưỡng không chứa hương liệu",
        image: "/images/sensitive-moisturizer.jpg",
      },
    ],
  },
};

const QuizPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleOptionClick = (option) => {
    const updatedAnswers = [...answers, option.type];
    setAnswers(updatedAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      determineSkinType(updatedAnswers);
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
                  <button
                    key={index}
                    className="block w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white py-3 px-8 rounded-xl shadow-xl hover:scale-105 transition"
                    onClick={() => handleOptionClick(option)}
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default QuizPage;
