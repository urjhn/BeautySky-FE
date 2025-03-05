import { createContext, useState, useEffect, useContext } from "react";
import authAPI from "../services/auth";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const roleId = localStorage.getItem("roleId");
    if (token && roleId) {
      try {
        const decoded = jwtDecode(token); // Giải mã token
        setUser({
          userId: decoded.userId,
          name: decoded.name,
          email: decoded.email,
          role: decoded.role,
          token: token, // Giữ token để gọi API
          roleId: parseInt(roleId, 10),
          phone: decoded.phone,
          address: decoded.address,
        });
      } catch (err) {
        console.error("Invalid token:", err);
        logout(); // Xóa token nếu lỗi
      }
    }
  }, []);

  const login = async (userData) => {
    try {
      const data = await authAPI.login(userData, navigate);
      const roleId = parseInt(data.roleId, 10);

      const decoded = jwtDecode(data.token);
      setUser({
        userId: decoded.userId,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
        token: data.token,
        roleId: roleId,
        phone: decoded.phone,
        address: decoded.address,
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("roleId", roleId);
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  // Cập nhật lại PROFILE nhưng không bị đăng xuất ra ngoài
  const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Make sure setUser is included in the context value
    return (
      <AuthContext.Provider value={{ user, setUser, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };

  const register = async (userData) => {
    try {
      await authAPI.register(userData, navigate);
    } catch (err) {
      console.error("Register failed", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("roleId");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
