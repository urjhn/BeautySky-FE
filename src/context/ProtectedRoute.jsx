import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (!requiredRole.includes(user.roleId))
    return <Navigate to="/unauthorized" replace />;

  return children;
};

export default ProtectedRoute;
