// OpenRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const OpenRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if(token == null){
    return children
  }
  const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
  console.log(payload);
    if(payload.role=="customer"){
      return token ? <Navigate to="/customer" replace /> : children;
    }else{
      return token ? <Navigate to="/factory" replace /> : children;
    }
};

export default OpenRoute;
