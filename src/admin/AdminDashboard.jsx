import React from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("isAdmin");
    navigate("/admin/login");
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Dashboard</h4>
        <div className="fw-semibold">Welcome, Admin</div>
      </div>
      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="card-title">CATEGORIES</h6>
              <p className="card-text text-muted">Manage product categories</p>
              <Link to={"/admin/categories"} className="btn btn-primary btn-sm">
                View
              </Link>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="card-title">Products</h6>
              <p className="card-text text-muted">Manage products</p>
              <button className="btn btn-success btn-sm">View</button>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="card-title">Orders</h6>
              <p className="card-text text-muted">View customer orders</p>
              <button className="btn btn-warning btn-sm">View</button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Test Content */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h6 className="mb-3">Recent Activity</h6>

          {Array.from({ length: 20 }).map((_, index) => (
            <div
              key={index}
              className="d-flex justify-content-between align-items-center border-bottom py-2"
            >
              <span>Dummy Activity #{index + 1}</span>
              <button className="btn btn-outline-primary btn-sm">View</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
