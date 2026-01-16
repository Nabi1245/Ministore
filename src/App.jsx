import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SearchPopupProvider } from "./contexts/SearchPopupContext";
import { CartProvider } from "./contexts/CartContext";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Auth from "./pages/Auth";
import SignUp from "./pages/SignUp";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import AdminProtectedRoute from "./admin/AdminProtectedRoute";
import CategoryDashboard from "./admin/pages/CategoryDashboard";
import AddCategory from "./admin/pages/AddCategory";
import Layout from "./admin/Layout";
import AddMobileBrand from "./admin/pages/mobileBrand/addMobileBrand";
import MobileBrandDashboard from "./admin/pages/mobileBrand/mobileBrandDashboard";
import MobileModelDashboard from "./admin/pages/mobileModel/MobileModelDashboard.Jsx";
import AddMobileModel from "./admin/pages/mobileModel/AddMobileModel";

import ProductsDashboard from "./admin/pages/products/ProductsDashboard";
import AddProduct from "./admin/pages/products/AddProducts";
import MobileCase from "./admin/pages/caseDetails/MobileCase";
import AddMobileCase from "./admin/pages/caseDetails/AddMobileCase";


function App() {
  useEffect(() => {
    // Initialize Bootstrap tooltips and dropdowns if needed
    if (typeof window !== "undefined" && window.bootstrap) {
      // Bootstrap is available via CDN
    }
  }, []);
  // 🔴 LOGIN STATE (truth source)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // admin panel
  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem("isAdmin") === "true"
  );

  return (
    <>
      <Router>
        <CartProvider>
          <SearchPopupProvider>
            <Routes>
              <Route
                path="/"
                element={
                  <Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                }
              />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route
                path="/login"
                element={<Login setIsLoggedIn={setIsLoggedIn} />}
              />
              <Route
                path="/login-auth"
                element={<Auth isLoggedIn={setIsLoggedIn} />}
              />
              <Route path="/sign-up" element={<SignUp />} />

              {/* Admin Routes */}

              <Route
                path="/admin/login"
                element={<AdminLogin setIsAdmin={setIsAdmin} />}
              />
              <Route 
                path="/"
                element={<Layout/>}
                />
              <Route
                path="/admin/dashboard"
                element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                }
              />

              <Route
                path="/admin/categories"
                element={
                  <AdminProtectedRoute>
                    <CategoryDashboard />
                  </AdminProtectedRoute>
                }
              />

              <Route
                path="/admin/categories/add"
                element={
                  <AdminProtectedRoute>
                    <AddCategory />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/mobile-brand/add"
                element={
                  <AdminProtectedRoute>
                    <AddMobileBrand />
                  </AdminProtectedRoute>
                }
              />
               <Route
                path="/admin/mobile-brand"
                element={
                  <AdminProtectedRoute>
                    <MobileBrandDashboard />
                  </AdminProtectedRoute>
                }
              />
               <Route
                path="/admin/mobile-model"
                element={
                  <AdminProtectedRoute>
                    <MobileModelDashboard />
                  </AdminProtectedRoute>
                }
              />
               <Route
                path="/admin/mobile-model/add"
                element={
                  <AdminProtectedRoute>
                    <AddMobileModel />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <AdminProtectedRoute>
                    <ProductsDashboard/>
                  </AdminProtectedRoute>
                }
              />
             
              <Route
                path="/admin/products/add"
                element={
                  <AdminProtectedRoute>
                    <AddProduct/>
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/mobile-case"
                element={
                  <AdminProtectedRoute>
                    <MobileCase/>
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/mobile-case/add"
                element={
                  <AdminProtectedRoute>
                    <AddMobileCase/>
                  </AdminProtectedRoute>
                }
              />
              

            </Routes>
          </SearchPopupProvider>
        </CartProvider>
      </Router>
    </>
  );
}

export default App;
