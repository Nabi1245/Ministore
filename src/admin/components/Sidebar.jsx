import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  // ✅ Hook must be here (top-level of component)
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1️⃣ Clear auth data
    localStorage.removeItem("adminToken");
    localStorage.removeItem("isAdmin");

    // 2️⃣ Redirect to login
    navigate("/admin/login", { replace: true });
  };

  return (
    <aside
      className="col-12 col-md-3 col-lg-2 bg-white border-end d-flex flex-column p-3"
      style={{ height: "100vh" }}
    >
      {/* Logo */}
      <div className="mb-4 fw-bold fs-5 text-primary">
        Admin Panel
      </div>

      {/* Navigation */}
      <ul className="nav nav-pills flex-column gap-2">
        <li className="nav-item">
          <Link to="/admin/dashboard" className="btn btn-light text-start w-100">
            Dashboard
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/admin/categories" className="btn btn-light text-start w-100">
            Categories
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/admin/mobile-brand" className="btn btn-light text-start w-100">
            Mobile Brand
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/admin/mobile-model" className="btn btn-light text-start w-100">
            Mobile Model
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/admin/products" className="btn btn-light text-start w-100">
            Products
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/admin/mobile-case" className="btn btn-light text-start w-100">
            Mobile Case
          </Link>
        </li>
      </ul>

      {/* Logout */}
      <div className="mt-auto">
        <button
          className="btn btn-danger w-100"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
