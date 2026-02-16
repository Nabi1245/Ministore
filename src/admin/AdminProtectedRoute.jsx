import React from "react";
import { Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          {/* ===== LEFT SIDEBAR (FIXED, NO SCROLL) ===== */}
          <Sidebar />

          {/* ===== RIGHT CONTENT (SCROLLABLE) ===== */}
          <main className="col-12 col-md-9 col-lg-10 bg-light p-4">
            {/* Cards Section */}
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminProtectedRoute;
