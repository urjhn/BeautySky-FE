import { createContext, useEffect, useState, useContext } from "react";
import questionsAPI from "../features/services/questions";
import answersAPI from "../features/services/answers";

const QuizContext = createContext();

const QuizProvider = ({ children }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  const fetchQuestions = async () => {
    try {
      const response = await questionsAPI.getAll();
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching questions data:", error);
    }
  };

  const fetchAnswers = async () => {
    try {
      const response = await answersAPI.getAll();
      setAnswers(response.data);
    } catch (error) {
      console.error("Error fetching answerss data:", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
    fetchAnswers();
  }, []);

  return (
    <QuizContext.Provider
      value={{
        questions,
        answers,
        setQuestions,
        setAnswers,
        fetchQuestions,
        fetchAnswers,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};
const useQuizContext = () => useContext(QuizContext);

export { QuizProvider, useQuizContext };
