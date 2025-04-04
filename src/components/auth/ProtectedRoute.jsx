// ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // If no token, redirect to login
  return token ? children : <Navigate to="/factory/login" replace />;
};

export default ProtectedRoute;
