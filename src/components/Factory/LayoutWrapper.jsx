// components/LayoutWrapper.jsx
import React from "react";
import Sidebar from "./Sidebar";

const LayoutWrapper = ({ children }) => {
  const token = localStorage.getItem("token");

  return (
    <div className="flex">
      {token && <Sidebar />} {/* Show sidebar only if admin (token) */}
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
};

export default LayoutWrapper;
