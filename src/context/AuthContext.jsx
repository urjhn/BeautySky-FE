import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      let user = null;
      if (storedUser && storedUser !== "undefined") {
        try {
          user = JSON.parse(storedUser);
        } catch (error) {
          console.error("Error parsing user data:", error);
          localStorage.removeItem("user"); // Remove corrupted data
        }
      }
      const storedRole = localStorage.getItem("role");

      setUser(storedUser ? JSON.parse(storedUser) : null);
      setRole(storedRole || null);
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
      localStorage.removeItem("user"); // Xóa dữ liệu lỗi để tránh crash
      localStorage.removeItem("role");
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "http://10.87.38.210:7112/api/Accounts/Login", // Đổi HTTPS -> HTTP nếu backend không dùng SSL
        { email, password }
      );

      const userData = response.data?.user;
      const userRole = response.data?.role;
      const token = response.data?.token;

      if (!userData || !userRole || !token) {
        throw new Error("Invalid API response format");
      }

      setUser(userData);
      setRole(userRole);

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("role", userRole);
      localStorage.setItem("token", token);

      return userRole; // Trả về role để điều hướng trong Login.jsx
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, login }}>
      {children}
    </AuthContext.Provider>
  );
};
