import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin") return <Navigate to="/" />;

  return children;
};

export const MemberRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (user.role !== "member") return <Navigate to="/admin" />;

  return children;
};
