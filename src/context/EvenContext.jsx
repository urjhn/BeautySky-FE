import { createContext, useEffect, useState, useContext } from "react";
import newsAPI from "../services/events";

const NewsContext = createContext();

const NewsProvider = ({ children }) => {
  const [news, setNews] = useState([]);
  const fetchNews = async () => {
    try {
      const response = await newsAPI.getAll();
      setNews(response.data);
    } catch (error) {
      console.error("Error fetching news data:", error);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <NewsContext.Provider value={{ news, setNews, fetchNews }}>
      {children}
    </NewsContext.Provider>
  );
};
const useNewsContext = () => useContext(NewsContext);

export { NewsProvider, useNewsContext };
