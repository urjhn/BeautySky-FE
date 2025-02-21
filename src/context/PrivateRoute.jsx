import { Navigate } from "react-router-dom";
import { useUser } from "./UserContext";

const PrivateRoute = ({ element, allowedRoles }) => {
  const { user } = useUser();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return allowedRoles.includes(user.role) ? element : <Navigate to="/" />;
};

export default PrivateRoute;
