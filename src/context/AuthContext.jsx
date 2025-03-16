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
        const userInfo = {
          userId: decoded.id,
          name: decoded.name,
          email: decoded.email,
          role: decoded.role,
          token: userData.token,
          roleId: userData.user.roleId,
          phone: decoded.phone || "",
          address: decoded.address || "",
        };

        setUser(userInfo);
        localStorage.setItem("token", userData.token);
        localStorage.setItem("roleId", userData.user.roleId);
      } else {
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