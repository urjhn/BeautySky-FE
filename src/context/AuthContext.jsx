import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Tạo Context
const AuthContext = createContext();

// Provider cho Context
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // Lấy thông tin user từ localStorage
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Lỗi khi đọc user từ localStorage:", error);
      localStorage.removeItem("user");
      return null;
    }
  });

  // Lấy vai trò từ localStorage
  const [role, setRole] = useState(() => {
    try {
      return localStorage.getItem("role") || null;
    } catch (error) {
      console.error("Lỗi khi đọc role từ localStorage:", error);
      localStorage.removeItem("role");
      return null;
    }
  });

  // Cập nhật localStorage khi user hoặc role thay đổi
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role); // Lưu role vào localStorage
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("role");
    }
  }, [user]);

  // Hàm đăng nhập với phân quyền
  const login = (userData) => {
    setUser(userData);
    setRole(userData.role);

    // Điều hướng dựa trên vai trò của người dùng
    if (userData.role === "Manager" || userData.role === "Staff") {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  // Hàm đăng xuất
  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook để sử dụng AuthContext
export const useAuth = () => useContext(AuthContext);
