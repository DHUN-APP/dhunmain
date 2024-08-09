import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import AuthError from "../Errors/AuthError";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <AuthError />;
  }
  return children;
};

export default ProtectedRoute;
