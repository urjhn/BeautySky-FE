import { useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const SkinTypeQuiz = () => {
  const allQuestions = [
    {
      question: "How does your skin feel after washing your face?",
      options: [
        "Tight and dry",
        "Oily and greasy",
        "Balanced and smooth",
        "Sensitive and itchy",
      ],
    },
    {
      question: "How often does your skin get oily?",
      options: ["Rarely", "Often", "Sometimes", "Never"],
    },
    {
      question: "Do you experience redness or irritation on your skin?",
      options: ["Yes, frequently", "Sometimes", "Rarely", "Never"],
    },
    {
      question: "How does your skin react to new skincare products?",
      options: ["Gets irritated", "No reaction", "Becomes oilier", "Feels dry"],
    },
  ];

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    setQuestions([...allQuestions].sort(() => Math.random() - 0.5));
  }, []);

  const handleOptionClick = (option) => {
    const updatedAnswers = [...answers, option];
    setAnswers(updatedAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateSkinType(updatedAnswers);
    }
  };

  const calculateSkinType = (answers) => {
    const skinType = answers.includes("Tight and dry")
      ? "Dry Skin"
      : answers.includes("Oily and greasy")
      ? "Oily Skin"
      : answers.includes("Sensitive and itchy") ||
        answers.includes("Gets irritated")
      ? "Sensitive Skin"
      : "Normal Skin";

    setResult(skinType);
  };

  const recommendedProducts = {
    "Dry Skin": [
      {
        name: "Hydrating Moisturizer",
        image: "https://via.placeholder.com/150?text=Moisturizer",
        description: "Deep hydration for dry skin.",
        price: "$25.00",
      },
      {
        name: "Gentle Cleanser",
        image: "https://via.placeholder.com/150?text=Cleanser",
        description: "Non-drying cleanser for daily use.",
        price: "$18.00",
      },
    ],
    "Oily Skin": [
      {
        name: "Oil-Free Gel Moisturizer",
        image: "https://via.placeholder.com/150?text=Gel+Moisturizer",
        description: "Lightweight and non-greasy.",
        price: "$22.00",
      },
      {
        name: "Clay Mask",
        image: "https://via.placeholder.com/150?text=Clay+Mask",
        description: "Purifies and controls oil production.",
        price: "$20.00",
      },
    ],
    "Sensitive Skin": [
      {
        name: "Soothing Cream",
        image: "https://via.placeholder.com/150?text=Soothing+Cream",
        description: "Calms and protects sensitive skin.",
        price: "$28.00",
      },
      {
        name: "Fragrance-Free Serum",
        image: "https://via.placeholder.com/150?text=Serum",
        description: "Nourishing without irritation.",
        price: "$35.00",
      },
    ],
    "Normal Skin": [
      {
        name: "Daily Moisturizer",
        image: "https://via.placeholder.com/150?text=Moisturizer",
        description: "Maintains skin's natural balance.",
        price: "$24.00",
      },
      {
        name: "SPF 50 Sunscreen",
        image: "https://via.placeholder.com/150?text=Sunscreen",
        description: "Protects skin from harmful UV rays.",
        price: "$30.00",
      },
    ],
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center">
      <Navbar />
      <main className="flex flex-col items-center p-6 w-full max-w-2xl">
        {!result ? (
          <div className="bg-white p-6 shadow-lg rounded-lg w-full text-center">
            <h2 className="text-xl font-bold text-gray-700">
              Question {currentQuestion + 1}
            </h2>
            <p className="text-gray-600 mt-2">
              {questions[currentQuestion]?.question}
            </p>
            <div className="mt-4 grid grid-cols-1 gap-3">
              {questions[currentQuestion]?.options.map((option, index) => (
                <button
                  key={index}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 shadow-lg rounded-lg w-full text-center">
            <h2 className="text-2xl font-bold text-gray-700">
              Your Skin Type: {result}
            </h2>
            <p className="text-gray-600 mt-2">
              Here are some recommended products for you:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {recommendedProducts[result].map((product, index) => (
                <div key={index} className="bg-gray-200 p-4 rounded-lg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
                  <p className="text-gray-600">{product.description}</p>
                  <p className="text-blue-500 font-bold mt-2">
                    {product.price}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SkinTypeQuiz;
