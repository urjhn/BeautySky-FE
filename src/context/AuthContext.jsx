import { createContext, useState, useEffect, useContext } from "react";
import authAPI from "../services/auth";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser({
          userId: Number(decodedToken.userId) || parseInt(decodedToken.userId),
          name: decodedToken.name,
          email: decodedToken.email,
          role: decodedToken.role,
          token: token,
          roleId: decodedToken.role === "Customer" ? 1 : 
                 decodedToken.role === "Staff" ? 2 : 
                 decodedToken.role === "Manager" ? 3 : 1,
          phone: decodedToken.phone,
          address: decodedToken.address,
          point: parseInt(decodedToken.point) || 0, 
        });
      } catch (err) {
        console.error("Invalid token:", err);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (userData) => {
    try {
      if (userData.token) {
        const decoded = jwtDecode(userData.token);
        
        // Đảm bảo userId luôn là số
        const userId = Number(decoded.userId || decoded.id || decoded.sub);
        
        // Xác định roleId một cách chính xác
        const roleId = userData.user?.roleId || 
                      (decoded.role === "Customer" ? 1 : 
                       decoded.role === "Staff" ? 2 : 
                       decoded.role === "Manager" ? 3 : 1);

        const userInfo = {
          userId: userId,
          name: decoded.name,
          email: decoded.email,
          role: decoded.role || "Customer",
          token: userData.token,
          roleId: roleId,
          phone: decoded.phone || "",
          address: decoded.address || "",
          point: parseInt(decoded.point) || 0,
        };

        setUser(userInfo);
        localStorage.setItem("token", userData.token);
        localStorage.setItem("roleId", roleId.toString());

        // Chuyển hướng dựa vào roleId
        if (roleId === 2 || roleId === 3) {
          navigate("/dashboardlayout");
        } else {
          navigate("/");
        }
      } else {
        const data = await authAPI.login(userData, navigate);
        const roleId = parseInt(data.roleId, 10);
        const decoded = jwtDecode(data.token);
        const userInfo = {
          userId: decoded.userId || decoded.id,
          name: decoded.name,
          email: decoded.email,
          role: decoded.role,
          token: data.token,
          roleId: roleId,
          phone: decoded.phone,
          address: decoded.address,
          point: parseInt(decoded.point) || 0,
        };
        
        setUser(userInfo);
        localStorage.setItem("token", data.token);
        localStorage.setItem("roleId", roleId.toString());

        // Chuyển hướng dựa vào roleId
        if (roleId === 2 || roleId === 3) {
          navigate("/dashboardlayout");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      console.error("Login failed", err);
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      await authAPI.register(userData, navigate);
    } catch (err) {
      console.error("Register failed", err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("roleId");
    setUser(null);
    navigate("/login");
  };

  const updateAuthUser = (userData) => {
    setUser((prevUser) => ({ ...prevUser, ...userData }));
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, updateAuthUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;