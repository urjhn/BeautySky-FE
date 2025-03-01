import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { roleId } = useContext(AuthContext);

  if (!roleId) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(roleId)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
