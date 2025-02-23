import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMemo } from "react";

// Component bảo vệ Route
const PrivateRoute = ({ allowedRoles = [] }) => {
  const { user } = useAuth();

  // Kiểm tra quyền của user
  const hasAccess = useMemo(() => {
    return user?.role && allowedRoles.includes(user.role);
  }, [user, allowedRoles]);

  // Nếu chưa đăng nhập, chuyển hướng đến trang login
  if (!user) return <Navigate to="/login" replace />;

  // Nếu không có quyền, chuyển hướng về trang chính
  if (!hasAccess) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default PrivateRoute;
