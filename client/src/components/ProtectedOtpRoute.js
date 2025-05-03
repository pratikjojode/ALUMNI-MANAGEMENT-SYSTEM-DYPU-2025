// components/ProtectedOtpRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedOtpRoute = ({ children }) => {
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");

  return email && role ? children : <Navigate to="/login" />;
};

export default ProtectedOtpRoute;
