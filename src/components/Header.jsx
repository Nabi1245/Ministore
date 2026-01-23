import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { userAuthAPI } from "../utils/api";

const Header = () => {
  const { getCartItemsCount, loadCart } = useCart();
  const cartCount = getCartItemsCount();
  const location = useLocation();
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("token"));

  useEffect(() => {
    const checkLoginStatus = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };
    window.addEventListener("storage", checkLoginStatus);
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, []);

  const handleLogout = async () => {
    try {
      await userAuthAPI.signout();
    } catch (e) {}

    localStorage.removeItem("token");
    setIsLoggedIn(false);
    loadCart();
    navigate("/");
  };

  return (
    <header className="fixed-top bg-white shadow-sm">
      <nav className="navbar navbar-expand-lg container">
        
        {/* Logo */}
        <Link className="navbar-brand fw-bold fs-4" to="/">
          FOXECOM
        </Link>

        {/* Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Menu */}
        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-4">

            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/" ? "fw-bold text-primary" : ""}`} to="/">
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/shop" ? "fw-bold text-primary" : ""}`} to="/shop">
                Products
              </Link>
            </li>

            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/contact-us" ? "fw-bold text-primary" : ""}`} to="/contact-us">
                Contact Us
              </Link>
            </li>

            {/* Cart */}
            <li className="nav-item">
              <Link className="nav-link d-flex align-items-center gap-1" to="/cart">
                🛒 Cart ({cartCount})
              </Link>
            </li>

            {/* Account */}
            {!isLoggedIn ? (
              <li className="nav-item">
                <Link className="nav-link fw-semibold" to="/login">
                  Login
                </Link>
              </li>
            ) : (
              <li className="nav-item dropdown">
                <button className="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                  Account
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/my-orders">
                      My Orders
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            )}

          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
