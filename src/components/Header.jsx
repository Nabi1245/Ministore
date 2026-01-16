import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const { getCartItemsCount } = useCart();
  const cartCount = getCartItemsCount();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   setIsLoggedIn(false);
  //   setShowLogout(false);
  //   navigate("/");
  // }

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      await fetch("https://artiststation.co.in/foxecom/api/auth/user/signout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // ✅ Alert after API call
      //alert("You are logged out");
      setShowLogoutModal(true);
    } catch (error) {
      console.log("Signout API error", error);
      alert("Logout failed, but session cleared");
    } finally {
      // 🔥 Frontend logout (must)
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setShowLogout(false);
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
      className={`site-header header-scrolled position-fixed text-black bg-light ${
        isScrolled ? "scrolled" : ""
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
      <nav id="header-nav" className="navbar navbar-expand-lg px-3 mb-3">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img src="/images/main-logo.png" className="logo" alt="logo" />
          </Link>
          <button
            className="navbar-toggler d-flex d-lg-none order-3 p-2"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#bdNavbar"
            aria-controls="bdNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <svg className="navbar-icon">
              <use xlinkHref="#navbar-icon"></use>
            </svg>
          </button>
          <div
            className="offcanvas offcanvas-end"
            tabIndex="-1"
            id="bdNavbar"
            aria-labelledby="bdNavbarOffcanvasLabel"
          >
            <div className="offcanvas-header px-4 pb-0">
              <Link className="navbar-brand" to="/">
                <img src="/images/main-logo.png" className="logo" alt="logo" />
              </Link>
              <button
                type="button"
                className="btn-close btn-close-black"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
                data-bs-target="#bdNavbar"
              ></button>
            </div>
            <div className="offcanvas-body">
              <ul
                id="navbar"
                className="navbar-nav text-uppercase justify-content-end align-items-center flex-grow-1 pe-3"
              >
                <li className="nav-item">
                  <Link
                    className={`nav-link me-4 ${
                      location.pathname === "/" ? "active" : ""
                    }`}
                    to="/"
                  >
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <a className="nav-link me-4" href="#company-services">
                    Services
                  </a>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link me-4 ${
                      location.pathname === "/shop" ? "active" : ""
                    }`}
                    to="/shop"
                  >
                    Products
                  </Link>
                </li>
                <li className="nav-item">
                  <a className="nav-link me-4" href="#smart-watches">
                    Watches
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link me-4" href="#yearly-sale">
                    Sale
                  </a>
                </li>

                <li className="nav-item dropdown">
                  <a
                    className="nav-link me-4 dropdown-toggle link-dark"
                    data-bs-toggle="dropdown"
                    href="#"
                    role="button"
                    aria-expanded="false"
                  >
                    Pages
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <a href="about.html" className="dropdown-item">
                        About
                      </a>
                    </li>

                    <li>
                      <Link to="/shop" className="dropdown-item">
                        Shop
                      </Link>
                    </li>
                    <li>
                      <Link to="/cart" className="dropdown-item">
                        Cart
                      </Link>
                    </li>
                    <li>
                      <Link to="/checkout" className="dropdown-item">
                        Checkout
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <div className="user-items ps-5">
                    <ul className="d-flex justify-content-end list-unstyled">
                      <li className="search-item pe-3">
                        <a href="#" className="search-button">
                          <svg className="search">
                            <use xlinkHref="#search"></use>
                          </svg>
                        </a>
                      </li>

                      {/* {!isLoggedIn ? (
                        <li className="pe-3">
                          <a href="./login">LOGIN</a>
                        </li>
                      ) : (
                        <>
                          <li className="pe-3">
                            <svg
                              className="user"
                              onClick={() => setShowLogout(!showLogout)}
                            >
                              <use xlinkHref="#user"></use>
                            </svg>
                          </li>
                          {showLogout && (
                            <button
                              className="btn btn-outline-secondary  d-flex align-items-center"
                              onClick={handleLogout}
                              
                            >
                              Logout
                            </button>
                          )}
                        </>
                      )} */}
                      {!isLoggedIn ? (
                        <li className="nav-item">
                          <a href="/login" className="nav-link fw-semibold">
                            Login
                          </a>
                        </li>
                      ) : (
                        <li className="nav-item dropdown">
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
                        </li>
                      )}

                      {/* model show */}
                      {showLogoutModal && (
                        <div
                          className="modal fade show"
                          style={{
                            display: "block",
                            backgroundColor: "rgba(0,0,0,0.5)",
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

                      <li className="position-relative">
                        <Link to="/cart">
                          <svg className="cart">
                            <use xlinkHref="#cart"></use>
                          </svg>
                          {cartCount > 0 && (
                            <span
                              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                              style={{ fontSize: "0.7rem" }}
                            >
                              {cartCount}
                            </span>
                          )}
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;