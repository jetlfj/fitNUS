import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PrivateRoute({ children }) {
  const { currentUser } = useAuth();

  return currentUser ? (
    currentUser.emailVerified || children.key === "verify" ? (
      children
    ) : (
      <Navigate to="/verify-email" />
    )
  ) : (
    <Navigate to="/login" />
  );
}
