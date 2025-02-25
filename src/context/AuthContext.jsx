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

  // Lấy roleId từ localStorage
  const [roleId, setRoleId] = useState(() => {
    return localStorage.getItem("roleId") || null;
  });

  // Lấy token từ localStorage để kiểm tra đăng nhập
  const token = localStorage.getItem("token");

  // Cập nhật localStorage khi user hoặc roleId thay đổi
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("roleId", user.roleId); // Lưu roleId vào localStorage
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("roleId");
      localStorage.removeItem("token");
    }
  }, [user]);

  // Hàm đăng nhập với phân quyền
  const login = (userData) => {
    setUser(userData);
    setRoleId(userData.roleId);

    // Lưu thông tin vào localStorage
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("roleId", userData.roleId);
    localStorage.setItem("token", userData.token);

    // Điều hướng dựa trên roleId của người dùng
    if (userData.roleId === "1" || userData.roleId === "2") {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  // Hàm đăng xuất
  const logout = () => {
    setUser(null);
    setRoleId(null);
    localStorage.removeItem("user");
    localStorage.removeItem("roleId");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, roleId, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook để sử dụng AuthContext
export const useAuth = () => useContext(AuthContext);
