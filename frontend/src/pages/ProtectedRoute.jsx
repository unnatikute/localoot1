import { Navigate } from "react-router-dom";
import { useAuth } from "../store/auth.jsx";
import { hasRole } from "../utils/roles.js";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role-based access (allowedRoles: e.g. ["USER", "SHOPKEEPER", "ADMIN"])
  if (allowedRoles?.length) {
    const normalizedAllowed = allowedRoles.map((r) => String(r).toUpperCase());
    // Also allow SHOP_OWNER as alias for SHOPKEEPER
    if (normalizedAllowed.includes("SHOP_OWNER") && !normalizedAllowed.includes("SHOPKEEPER")) {
      normalizedAllowed.push("SHOPKEEPER");
    }
    if (!hasRole(user, normalizedAllowed)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
