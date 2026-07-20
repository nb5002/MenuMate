import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({
  children,
  allowedRole,
}: {
  children: ReactNode;
  allowedRole: "staff" | "admin";
}) {
  const { token, role } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role !== allowedRole) {
    // Logged in, but wrong role — redirect to their correct dashboard
    if (role === "admin") return <Navigate to="/admin/menu" replace />;
    if (role === "staff") return <Navigate to="/staff" replace />;
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}