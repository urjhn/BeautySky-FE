import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/unauthorized" replace />;
  if (user.roleId !== requiredRole)
    return <Navigate to="/unauthorized" replace />;

  return children;
};

export default ProtectedRoute;
