import { createContext, useState, useEffect, useContext } from "react";
import authAPI from "../services/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const verifyAndSetUser = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp && decodedToken.exp < currentTime) {
        throw new Error('Token expired');
      }

      const userInfo = {
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
      };

      setUser(userInfo);
      return true;
    } catch (err) {
      console.error("Token verification failed:", err);
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      const currentPath = location.pathname;

      if (token) {
        const isValidToken = verifyAndSetUser(token);
        
        if (!isValidToken) {
          logout();
          return;
        }

        if (currentPath !== '/login') {
          localStorage.setItem('lastPath', currentPath);
        }
      } else {
        if (currentPath.includes('dashboard')) {
          navigate('/login');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [location.pathname]);

  const login = async (userData) => {
    try {
      if (userData.token) {
        const decoded = jwtDecode(userData.token);
        const userId = Number(decoded.userId || decoded.id || decoded.sub);
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
        };

        setUser(userInfo);
        localStorage.setItem("token", userData.token);
        localStorage.setItem("roleId", roleId.toString());

        const savedPath = localStorage.getItem('lastPath');
        if (roleId === 2 || roleId === 3) {
          navigate(savedPath && savedPath.includes('dashboard') ? savedPath : "/dashboardlayout");
        } else {
          navigate(savedPath || "/");
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
        };
        
        setUser(userInfo);
        localStorage.setItem("token", data.token);
        localStorage.setItem("roleId", roleId.toString());

        const savedPath = localStorage.getItem('lastPath');
        if (roleId === 2 || roleId === 3) {
          navigate(savedPath && savedPath.includes('dashboard') ? savedPath : "/dashboardlayout");
        } else {
          navigate(savedPath || "/");
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
    localStorage.removeItem("lastPath");
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