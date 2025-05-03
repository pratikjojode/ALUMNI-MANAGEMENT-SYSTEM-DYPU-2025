import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles }) => {
  let user;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    console.error("Failed to parse user data:", error);
    user = null;
  }

  
  const token = localStorage.getItem("token");
  const isTokenValid =
    token && (!user?.expiresAt || Date.now() < user?.expiresAt);

  if (!isTokenValid) {
    return <Navigate to="/unifiedLogin" replace />;
  }

  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
