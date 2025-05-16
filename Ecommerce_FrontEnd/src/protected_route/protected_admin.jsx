// ProtectedRoute.js
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const parsedUser = JSON.parse(user);

  if (parsedUser.is_superadmin === true) {
    return children;
  } else {
    return <Navigate to="/adminLogin" replace />;
  }
};

export default AdminProtectedRoute;
