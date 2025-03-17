import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  // Nếu requiredRole là số, chuyển thành mảng
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

  // Nếu roleId của user không nằm trong danh sách được phép
  if (!roles.includes(user.roleId))
    return <Navigate to="/unauthorized" replace />;

  return children;
};
export default ProtectedRoute;
