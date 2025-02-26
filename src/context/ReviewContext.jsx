import { createContext, useEffect, useState, useContext } from "react";
import reviewsAPI from "../services/reviews";

const ReviewContext = createContext();

const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);
  const fetchReviews = async () => {
    try {
      const response = await reviewsAPI.getAll();
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews data:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <ReviewContext.Provider value={{ reviews, setReviews, fetchReviews }}>
      {children}
    </ReviewContext.Provider>
  );
};
const useReviewContext = () => useContext(ReviewContext);

export { ReviewProvider, useReviewContext };
