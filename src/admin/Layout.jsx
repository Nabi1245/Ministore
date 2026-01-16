import React from 'react'
import Sidebar from './components/Sidebar';
import { Link, Outlet } from 'react-router-dom';

const Layout = () => {
  return (
        <div className="container-fluid vh-100 overflow-hidden">
          <div className="row h-100">
    
            {/* ===== LEFT SIDEBAR (FIXED, NO SCROLL) ===== */}
           <Sidebar/>
    
            {/* ===== RIGHT CONTENT (SCROLLABLE) ===== */}
            <main
              className="col-12 col-md-9 col-lg-10 bg-light p-4 overflow-auto"
              style={{ height: "100vh" }}
            >
              
    
              {/* Cards Section */}
              <Outlet />
    
            </main>
          </div>
        </div>
  )
}

export default Layout;