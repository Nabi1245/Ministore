import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

const Header = ({ isLoggedIn: propIsLoggedIn, setIsLoggedIn: propSetIsLoggedIn }) => {
  const { getCartItemsCount, loadCart } = useCart();
  const cartCount = getCartItemsCount();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // Local login state that syncs with localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("token"));
  
  // Use prop if provided, otherwise use local state
  const loginState = propIsLoggedIn !== undefined ? propIsLoggedIn : isLoggedIn;
  const setLoginState = propSetIsLoggedIn || setIsLoggedIn;

  // Sync login state with localStorage
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      const loggedIn = !!token;
      if (propSetIsLoggedIn) {
        propSetIsLoggedIn(loggedIn);
      } else {
        setIsLoggedIn(loggedIn);
      }
    };

    // Check on mount
    checkLoginStatus();

    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        checkLoginStatus();
      }
    };

    // Listen for custom events
    const handleLoginStatusChange = () => {
      checkLoginStatus();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("loginStatusChanged", handleLoginStatusChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("loginStatusChanged", handleLoginStatusChange);
    };
  }, [propSetIsLoggedIn]);


  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        // Call logout API if token exists
        try {
          await fetch("https://artiststation.co.in/foxecom/api/auth/user/signout", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (apiError) {
          console.log("Signout API error", apiError);
          // Continue with logout even if API call fails
        }
      }

      // Clear frontend session
      localStorage.removeItem("token");
      localStorage.removeItem("redirectAfterLogin");
      setLoginState(false);
      setShowLogout(false);
      // Dispatch event to sync login state across components
      window.dispatchEvent(new Event("loginStatusChanged"));

      // Reload cart to switch from user cart to guest cart
      loadCart();

      // Show success modal
      setShowLogoutModal(true);

      // Navigate to home after a short delay
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Logout error:", error);
      // Even on error, clear local session
      localStorage.removeItem("token");
      localStorage.removeItem("redirectAfterLogin");
      setLoginState(false);
      setShowLogout(false);
      // Dispatch event to sync login state across components
      window.dispatchEvent(new Event("loginStatusChanged"));
      loadCart();
      navigate("/");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      id="header"
      className={`site-header header-scrolled position-fixed text-black bg-light ${isScrolled ? "scrolled" : ""
        }`}
      style={{
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1030,
        width: "100%",
        transition: "all 0.3s ease-in-out",
        boxShadow: isScrolled ? "0 2px 10px rgba(0,0,0,0.1)" : "none",
      }}
    >
      <nav id="header-nav" className="navbar navbar-expand-lg px-2 px-md-3 mb-2 mb-md-3">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/" style={{ minWidth: '120px' }}>
            <img
              src="/images/main-logo.png"
              className="logo"
              alt="logo"
              style={{
                maxWidth: '100%',
                height: 'auto',
                maxHeight: '40px'
              }}
            />
          </Link>

          {/* Cart Icon - Always Visible on Desktop */}
          <Link
            to="/cart"
            className="position-relative d-none d-lg-flex align-items-center me-3 text-decoration-none"
            style={{ minWidth: '40px', justifyContent: 'center' }}
          >
            <svg className="cart" width="24" height="24" style={{ fill: 'currentColor' }}>
              <use xlinkHref="#cart"></use>
            </svg>
            {cartCount > 0 && (
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{ fontSize: "0.65rem", minWidth: '18px', height: '18px', lineHeight: '18px', padding: '0 4px' }}
              >
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            className="navbar-toggler d-flex d-lg-none order-3 p-2 border-0"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#bdNavbar"
            aria-controls="bdNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <svg className="navbar-icon" width="24" height="24">
              <use xlinkHref="#navbar-icon"></use>
            </svg>
          </button>
          <div
            className="offcanvas offcanvas-end"
            tabIndex="-1"
            id="bdNavbar"
            aria-labelledby="bdNavbarOffcanvasLabel"
          >
            <div className="offcanvas-header px-3 px-md-4 pb-0">
              <Link className="navbar-brand" to="/">
                <img
                  src="/images/main-logo.png"
                  className="logo"
                  alt="logo"
                  style={{ maxHeight: '35px', width: 'auto' }}
                />
              </Link>
              <button
                type="button"
                className="btn-close btn-close-black"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
                data-bs-target="#bdNavbar"
              ></button>
            </div>
            <div className="offcanvas-body px-3 px-md-4">
              <ul
                id="navbar"
                className="navbar-nav text-uppercase justify-content-start justify-content-lg-end align-items-start align-items-lg-center flex-grow-1 pe-0 pe-lg-3"
                style={{ gap: '0.5rem' }}
              >
                <li className="nav-item">
                  <Link
                    className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
                    to="/"
                    
                  >
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/shop" className="nav-link" >
                    Products
                  </Link>
                </li>
              {/* User Items Section */}
              <li className="nav-item w-100 d-lg-none mt-3 mt-lg-0 border-top pt-3 pt-lg-0 border-top-0">
                <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-3 w-100">
                  {/* Search Icon - Mobile */}
                  <a
                    href="#"
                    className="search-button d-flex align-items-center text-decoration-none text-dark"
                    onClick={(e) => { e.preventDefault(); alert('Search coming soon'); }}
                  >
                    <svg className="search" width="24" height="24" style={{ fill: 'currentColor' }}>
                      <use xlinkHref="#search"></use>
                    </svg>
                    <span className="ms-2 d-lg-none">Search</span>
                  </a>

                  {/* Cart Icon - Mobile */}
                  <Link
                    to="/cart"
                    className="position-relative d-flex align-items-center text-decoration-none text-dark"
                    
                  >
                    <svg className="cart" width="24" height="24" style={{ fill: 'currentColor' }}>
                      <use xlinkHref="#cart"></use>
                    </svg>
                    <span className="ms-2 d-lg-none">Cart</span>
                    {cartCount > 0 && (
                      <span
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger ms-1"
                        style={{ fontSize: "0.65rem", minWidth: '18px', height: '18px', lineHeight: '18px', padding: '0 4px' }}
                      >
                        {cartCount > 99 ? '99+' : cartCount}
                      </span>
                    )}
                  </Link>

                  {/* Login/Account - Mobile */}
                  {!loginState ? (
                    <Link
                      to="/login"
                      className="nav-link fw-semibold text-decoration-none p-0"
                      data-bs-dismiss="offcanvas"
                    >
                      Login
                    </Link>
                  ) : (
                    <div className="dropdown w-100 w-lg-auto">
                      <button
                        className="btn btn-outline-secondary dropdown-toggle w-100 w-lg-auto d-flex align-items-center justify-content-between"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <span className="d-flex align-items-center">
                          <svg className="me-2" width="20" height="20">
                            <use xlinkHref="#user"></use>
                          </svg>
                          Account
                        </span>
                      </button>
                      <ul className="dropdown-menu dropdown-menu-start dropdown-menu-lg-end shadow w-100 w-lg-auto">
                        <li>
                          <button
                            className="dropdown-item text-danger"
                            onClick={handleLogout}
                          >
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </li>

              {/* Desktop User Items - Always Visible */}
              <li className="nav-item d-none d-lg-block">
                <div className="user-items d-flex align-items-center gap-3">
                  {/* Search Icon - Desktop */}
                  <a
                    href="#"
                    className="search-button text-decoration-none text-dark"
                    onClick={(e) => { e.preventDefault(); alert('Search coming soon'); }}
                    title="Search"
                  >
                    <svg className="search" width="20" height="20" style={{ fill: 'currentColor' }}>
                      <use xlinkHref="#search"></use>
                    </svg>
                  </a>

                  {/* Login/Account - Desktop */}
                  {!loginState ? (
                    <Link to="/login" className="nav-link fw-semibold text-decoration-none p-0">
                      Login
                    </Link>
                  ) : (
                    <div className="dropdown">
                      <button
                        className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <svg className="me-2" width="20" height="20">
                          <use xlinkHref="#user"></use>
                        </svg>
                        Account
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end shadow">
                        <li>
                          <button
                            className="dropdown-item text-danger"
                            onClick={handleLogout}
                          >
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </li>
            </ul>

            {/* Logout Modal */}
            {showLogoutModal && (
              <div
                className="modal fade show"
                style={{
                  display: "block",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  zIndex: 1050
                }}
                tabIndex="-1"
              >
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Logged Out</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowLogoutModal(false)}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <p>You have been logged out successfully.</p>
                    </div>
                    <div className="modal-footer">
                      <button
                        className="btn btn-primary"
                        onClick={() => setShowLogoutModal(false)}
                      >
                        OK
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
    </header >
  );
};

export default Header;