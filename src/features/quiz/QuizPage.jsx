import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import axios from "axios";

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
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setQuestions([...allQuestions].sort(() => Math.random() - 0.5));
  }, []);

  const handleOptionClick = (option) => {
    const updatedAnswers = [...answers, option];
    setAnswers(updatedAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      determineSkinType(updatedAnswers);
    }
  };

  const determineSkinType = async (answers) => {
    const skinType = answers.includes("Tight and dry")
      ? "Dry Skin"
      : answers.includes("Oily and greasy")
      ? "Oily Skin"
      : answers.includes("Sensitive and itchy") ||
        answers.includes("Gets irritated")
      ? "Sensitive Skin"
      : "Normal Skin";

    setResult(skinType);
    fetchProducts(skinType);
  };

  const fetchProducts = async (skinType) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/products?skinType=${skinType}`
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen flex flex-col items-center">
      <Navbar />
      <main className="flex flex-col items-center p-6 w-full max-w-2xl">
        {!result ? (
          <div className="bg-white p-6 shadow-2xl rounded-xl w-full text-center">
            <h2 className="text-2xl font-bold text-gray-700">
              Question {currentQuestion + 1}
            </h2>
            <p className="text-gray-600 mt-4 text-lg">
              {questions[currentQuestion]?.question}
            </p>
            <div className="mt-6 grid grid-cols-1 gap-4">
              {questions[currentQuestion]?.options.map((option, index) => (
                <button
                  key={index}
                  className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-700 hover:scale-105 transform transition-all duration-300 shadow-md"
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 shadow-2xl rounded-xl w-full text-center">
            <h2 className="text-3xl font-extrabold text-blue-600">
              Your Skin Type: {result}
            </h2>
            <p className="text-gray-700 mt-4 text-lg">
              Here are some recommended products for you:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {products.length > 0 ? (
                products.map((product, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <h3 className="text-xl font-semibold mt-4 text-gray-800">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mt-2">{product.description}</p>
                    <p className="text-blue-500 font-bold mt-2">
                      {product.price}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No products found.</p>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SkinTypeQuiz;
