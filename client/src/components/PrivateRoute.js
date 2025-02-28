/************************************************************
 * client/src/components/PrivateRoute.js
 ************************************************************/
import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  // Token kontrolü (örnek)
  const token = localStorage.getItem("fitness_app_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Token varsa, bileşeni render et
  return children;
}

export default PrivateRoute;
