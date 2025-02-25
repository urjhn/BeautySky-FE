import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
import { useMemo } from "react";

const PrivateRoute = ({ allowedRoles = [] }) => {
  // const { user } = useAuth();
  const token = localStorage.getItem("token"); // Lấy token từ localStorage
  const roleId = localStorage.getItem("roleId"); // Lấy roleId từ localStorage

  // Kiểm tra xem người dùng có hợp lệ không
  const isAuthenticated = token && roleId;

  // Kiểm tra quyền của user
  const hasAccess = useMemo(() => {
    return isAuthenticated && allowedRoles.includes(roleId);
  }, [isAuthenticated, roleId, allowedRoles]);

  // Nếu chưa đăng nhập hoặc không có token, chuyển hướng đến trang login
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Nếu không có quyền, chuyển hướng về trang chính
  if (!hasAccess) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default PrivateRoute;
