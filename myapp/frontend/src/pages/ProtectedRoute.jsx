import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("name");

  if (!isAuthenticated) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  return children;
}
