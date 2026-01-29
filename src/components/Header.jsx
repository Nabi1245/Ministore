import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { userAuthAPI } from "../utils/api";

const Header = () => {
  const { getCartItemsCount, loadCart } = useCart();
  const cartCount = getCartItemsCount();
  const location = useLocation();
  const navigate = useNavigate();
  const collapseRef = useRef(null);
  const collapseInstanceRef = useRef(null);

  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("token"));

  useEffect(() => {
    const checkLoginStatus = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };
    window.addEventListener("storage", checkLoginStatus);
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, []);

  // Initialize Bootstrap Collapse instance
  useEffect(() => {
    const initCollapse = () => {
      if (collapseRef.current && window.bootstrap) {
        try {
          collapseInstanceRef.current = window.bootstrap.Collapse.getOrCreateInstance(collapseRef.current, {
            toggle: false
          });
        } catch (e) {
          // If getOrCreateInstance doesn't exist, use new Collapse
          if (window.bootstrap.Collapse) {
            collapseInstanceRef.current = new window.bootstrap.Collapse(collapseRef.current, {
              toggle: false
            });
          }
        }
      }
    };

    // Try to initialize immediately
    initCollapse();

    // Also try after a short delay in case Bootstrap loads later
    const timeout = setTimeout(initCollapse, 100);

    return () => {
      clearTimeout(timeout);
      if (collapseInstanceRef.current) {
        try {
          collapseInstanceRef.current.dispose();
        } catch (e) {
          // Ignore disposal errors
        }
      }
    };
  }, []);

  // Function to close the navbar
  const closeNavbar = () => {
    if (collapseRef.current) {
      // Method 1: Use Bootstrap Collapse instance if available
      if (collapseInstanceRef.current && collapseRef.current.classList.contains('show')) {
        try {
          collapseInstanceRef.current.hide();
          return;
        } catch (e) {
          // Fall through to method 2
        }
      }
      
      // Method 2: Direct DOM manipulation fallback
      if (collapseRef.current.classList.contains('show')) {
        collapseRef.current.classList.remove('show');
        // Also trigger Bootstrap's hidden event
        const event = new Event('hidden.bs.collapse');
        collapseRef.current.dispatchEvent(event);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await userAuthAPI.signout();
    } catch (e) {}

    localStorage.removeItem("token");
    setIsLoggedIn(false);
    loadCart();
    navigate("/");
    closeNavbar();
  };

  return (
    <header className="fixed-top bg-white shadow-sm">
      <nav className="navbar navbar-expand-lg container">
        
        {/* Logo */}
        <Link className="navbar-brand fw-bold fs-4" to="/" onClick={closeNavbar}>
          FOXECOM
        </Link>

        {/* Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Menu */}
        <div className="collapse navbar-collapse" id="mainNavbar" ref={collapseRef}>
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-4">

            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === "/" ? "fw-bold text-primary" : ""}`} 
                to="/"
                onClick={closeNavbar}
              >
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === "/shop" ? "fw-bold text-primary" : ""}`} 
                to="/shop"
                onClick={closeNavbar}
              >
                Products
              </Link>
            </li>

            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === "/contact-us" ? "fw-bold text-primary" : ""}`} 
                to="/contact-us"
                onClick={closeNavbar}
              >
                Contact Us
              </Link>
            </li>

            {/* Cart */}
            <li className="nav-item">
              <Link 
                className="nav-link d-flex align-items-center gap-1" 
                to="/cart"
                onClick={closeNavbar}
              >
                🛒 Cart ({cartCount})
              </Link>
            </li>

            {/* Account */}
            {!isLoggedIn ? (
              <li className="nav-item">
                <Link 
                  className="nav-link fw-semibold" 
                  to="/login"
                  onClick={closeNavbar}
                >
                  Sign in
                </Link>
              </li>
            ) : (
              <li className="nav-item dropdown">
                <button 
                  className="btn btn-outline-secondary dropdown-toggle" 
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Account
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link 
                      className="dropdown-item" 
                      to="/my-orders"
                      onClick={closeNavbar}
                    >
                      My Orders
                    </Link>
                  </li>
                  <li>
                    <button 
                      className="dropdown-item text-danger" 
                      onClick={handleLogout}
                    >
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
