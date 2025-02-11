import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");

    if (storedUser && storedRole) {
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "https://localhost:7250/api/Accounts/Login",
        {
          email,
          password,
        }
      );

      const userData = response.data.user;
      const userRole = response.data.role; // API phải trả về role

      setUser(userData);
      setRole(userRole);

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("role", userRole);
      localStorage.setItem("token", response.data.token);

      return userRole; // Trả về role để điều hướng trong Login.jsx
    } catch (error) {
      console.error("Login fail:", error.response?.data || error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, login }}>
      {children}
    </AuthContext.Provider>
  );
};
