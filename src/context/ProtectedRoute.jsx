import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ element, requiredRole }) => {
  const { role } = useContext(AuthContext);

  if (!role) return <Navigate to="/login" replace />;
  if (requiredRole && role !== requiredRole) return <Navigate to="/" replace />;

  return element;
};

export default ProtectedRoute;
