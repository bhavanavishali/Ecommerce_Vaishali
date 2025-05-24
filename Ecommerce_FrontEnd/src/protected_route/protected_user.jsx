

import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const parsedUser = JSON.parse(user);

  if (parsedUser.is_superadmin === false || parsedUser.is_active === true) {
    return children;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
