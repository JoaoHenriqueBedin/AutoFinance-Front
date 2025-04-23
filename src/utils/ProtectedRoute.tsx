import { Navigate } from "react-router-dom";
import { getToken } from "../services/login-service";
import { JSX } from "react";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;