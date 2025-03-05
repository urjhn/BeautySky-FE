import { createContext, useState, useEffect, useContext } from "react";
import authAPI from "../services/auth";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const roleId = localStorage.getItem("roleId");
    if (token && roleId) {
      setUser({ token, roleId: parseInt(roleId, 10) });
    }
  }, []);

  const login = async (userData) => {
    try {
      const data = await authAPI.login(userData, navigate);
      const roleId = parseInt(data.roleId, 10);

      setUser({ token: data.token, roleId });
      localStorage.setItem("token", data.token);
      localStorage.setItem("roleId", roleId);
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

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
