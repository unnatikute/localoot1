import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../store/auth.jsx";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // If no user is logged in, redirect to login page
    return (
      <Navigate
        to="/login"
        state={{ from: location, notice: "Please login to explore localoot!" }}
        replace
      />
    );
  }

  return children;
};

// THIS IS THE MISSING PIECE:
export default ProtectedRoute;
