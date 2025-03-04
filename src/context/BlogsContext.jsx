import { createContext, useEffect, useState, useContext } from "react";
import blogsAPI from "../services/blogs";

const BlogsContext = createContext();

const BlogsProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const fetchBlogs = async () => {
    try {
      const response = await blogsAPI.getAll();
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blogs data:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <BlogsContext.Provider value={{ blogs, setBlogs, fetchBlogs }}>
      {children}
    </BlogsContext.Provider>
  );
};
const useBlogsContext = () => useContext(BlogsContext);

export { BlogsProvider, useBlogsContext };
