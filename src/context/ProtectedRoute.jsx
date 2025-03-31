import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Lưu current path khi vào route được bảo vệ
  useEffect(() => {
    if (user && location.pathname !== '/login') {
      localStorage.setItem('lastPath', location.pathname);
    }
  }, [location.pathname, user]);

  // Hiển thị loading state nếu đang kiểm tra authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Chuyển hướng về login nếu chưa đăng nhập
  if (!user) {
    return <Navigate 
      to="/login" 
      replace 
      state={{ from: location.pathname }}
    />;
  }

  // Xử lý kiểm tra role
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

  // Kiểm tra role và chuyển hướng nếu không có quyền
  if (!roles.includes(user.roleId)) {
    return <Navigate 
      to="/unauthorized" 
      replace 
      state={{ from: location.pathname }}
    />;
  }

  // Kiểm tra token hết hạn
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      if (decodedToken.exp && decodedToken.exp < currentTime) {
        // Token hết hạn
        localStorage.removeItem('token');
        return <Navigate 
          to="/login" 
          replace 
          state={{ 
            from: location.pathname,
            message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
          }}
        />;
      }
    }
  } catch (error) {
    console.error('Token validation error:', error);
    return <Navigate 
      to="/login" 
      replace 
      state={{ 
        from: location.pathname,
        message: "Có lỗi xảy ra. Vui lòng đăng nhập lại."
      }}
    />;
  }

  return children;
};

export default ProtectedRoute;
