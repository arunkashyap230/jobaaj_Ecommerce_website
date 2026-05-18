import React from "react";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../context/AuthContext";

function AdminContent({ children }) {
  const { user } = useAuth();

  if (!user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AdminRoute({ children }) {
  return (
    <ProtectedRoute>
      <AdminContent>{children}</AdminContent>
    </ProtectedRoute>
  );
}

export default AdminRoute;
