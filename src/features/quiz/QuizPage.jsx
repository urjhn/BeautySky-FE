import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import axios from "axios";
import QuizForm from "./QuizForm";
import QuizResult from "./QuizResult";

const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch questions from backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/questions");
        setQuestions(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const handleOptionClick = async (option) => {
    const updatedAnswers = [...answers, option];
    setAnswers(updatedAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      await determineSkinType(updatedAnswers);
    }
  };

  const determineSkinType = async (answers) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/determine-skin",
        { answers }
      );
      setResult(response.data.skinType);
      fetchProducts(response.data.skinType);
    } catch (error) {
      console.error("Error determining skin type:", error);
    }
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
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center">
        <main className="flex flex-col items-center p-6 w-full max-w-2xl">
          {loading ? (
            <p className="text-lg text-gray-700">Loading questions...</p>
          ) : result ? (
            <QuizResult skinType={result} products={products} />
          ) : (
            <QuizForm
              question={questions[currentQuestion]}
              currentIndex={currentQuestion}
              totalQuestions={questions.length}
              handleOptionClick={handleOptionClick}
            />
          )}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default QuizPage;
