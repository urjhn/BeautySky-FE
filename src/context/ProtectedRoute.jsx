import { Navigate } from "react-router-dom";
import { useUser } from "./UserContext";

const ProtectedRoute = ({ element, allowedRoles = [] }) => {
  const { user } = useUser();

  // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Nếu không có danh sách allowedRoles hoặc user có quyền phù hợp thì cho phép truy cập
  if (allowedRoles.length === 0 || allowedRoles.includes(user.role)) {
    return element;
  }

  // Nếu không có quyền, chuyển hướng đến trang không được phép truy cập
  return <Navigate to="/unauthorized" />;
};

export default ProtectedRoute;
