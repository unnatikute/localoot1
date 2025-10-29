import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/auth.jsx';

export default function ProtectedRoute({ children }) {
  const { token } = useAuth();
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" state={{ from: location, notice: 'Please login to continue' }} replace />;
  }
  return children;
}


