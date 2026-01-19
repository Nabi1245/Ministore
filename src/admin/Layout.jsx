import React, { useState } from 'react'
import Sidebar from './components/Sidebar';
import { Link, Outlet } from 'react-router-dom';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="container-fluid">
      <div className="row g-0">
        {/* ===== LEFT SIDEBAR (FIXED, NO SCROLL) ===== */}
        {/* <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} /> */}

        {/* ===== RIGHT CONTENT (SCROLLABLE) ===== */}
        {/* <main
          className="col-12 col-md-9 col-lg-10 bg-light p-3 p-md-4 overflow-auto ms-md-auto"
          style={{ 
            height: "100vh"
          }}
        > */}
          {/* Mobile Menu Button */}
          <button
            className="btn btn-outline-secondary d-md-none mb-3"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            ☰ Menu
          </button>

          {/* Cards Section */}
          <Outlet />
        {/* </main> */}
      </div>
    </div>
  )
}

export default Layout;