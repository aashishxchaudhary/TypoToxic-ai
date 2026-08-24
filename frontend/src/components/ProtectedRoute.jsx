import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="grid min-h-[60vh] place-items-center font-mono text-xs tracking-[.2em] text-cyan-300">AUTHENTICATING...</div>;
  return user ? children : <Navigate to="/login" replace/>;
}
