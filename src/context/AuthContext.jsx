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
    const roleId = localStorage.getItem("roleId");
    if (token && roleId) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          userId: decoded.userId,
          name: decoded.name,
          email: decoded.email,
          role: decoded.role,
          token: token,
          roleId: parseInt(roleId, 10),
          phone: decoded.phone,
          address: decoded.address,
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
      // navigate("/routine-builder");
    } catch (err) {
      console.error("Login failed", err);
    }
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