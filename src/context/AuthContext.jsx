import { createContext, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "https://localhost:7250/api/Accounts/Login",
        {
          email,
          password,
        }
      );
      setUser(response.data.user); // Lưu thông tin user
      localStorage.setItem("token", response.data.token); // Lưu token
    } catch (error) {
      console.error("Login fail:", error.response?.data || error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login }}>
      {children}
    </AuthContext.Provider>
  );
};
