import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SearchPopupProvider } from "./contexts/SearchPopupContext";
import { CartProvider } from "./contexts/CartContext";
import UserLayout from "./components/UserLayout";
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
import ContactUs from "./pages/ContactUs.jsx";
import MobileBrandDetails from "./admin/pages/mobileBrand/mobileBrandDetails.jsx";



function App() {
  useEffect(() => {
    // Initialize Bootstrap tooltips and dropdowns if needed
    if (typeof window !== "undefined" && window.bootstrap) {
      // Bootstrap is available via CDN
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
              {/* User Routes with Universal Layout */}
              <Route path="/" element={<UserLayout />}>
                <Route index element={<Home />} />
                <Route path="shop" element={<Shop />} />
                <Route path="contact-us" element={<ContactUs />} />
                <Route path="product/:id" element={<ProductDetails />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="login" element={<Login />} />
                <Route path="login-auth" element={<Auth />} />
                <Route path="sign-up" element={<SignUp />} />
              </Route>

              {/* Admin Routes */}

              <Route
                path="/admin/login"
                element={<AdminLogin setIsAdmin={setIsAdmin} />}
              />
              
              {/* Admin Routes with Layout */}
              <Route
                path="/admin"
                element={
                  <AdminProtectedRoute>
                    <Layout />
                  </AdminProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route
                  path="dashboard"
                  element={<AdminDashboard />}
                />
                <Route
                  path="categories"
                  element={<CategoryDashboard />}
                />
                <Route
                  path="categories/add"
                  element={<AddCategory />}
                />
                <Route
                  path="mobile-brand"
                  element={<MobileBrandDashboard />}
                />
                <Route
                  path="mobile-brand/add"
                  element={<AddMobileBrand />}
                />
                <Route
                  path="/admin/mobile-brand/details/:id"
                  element={<MobileBrandDetails />}
                />
                <Route
                  path="mobile-model"
                  element={<MobileModelDashboard />}
                />
                <Route
                  path="mobile-model/add"
                  element={<AddMobileModel />}
                />
                <Route
                  path="products"
                  element={<ProductsDashboard />}
                />
                <Route
                  path="products/add"
                  element={<AddProduct />}
                />
                <Route
                  path="/admin/products/details/:id"
                  element={<ProductDetails />}
                />
                <Route
                  path="mobile-case"
                  element={<MobileCase />}
                />
                <Route
                  path="mobile-case/add"
                  element={<AddMobileCase />}
                />
              </Route>
              

            </Routes>
          </SearchPopupProvider>
        </CartProvider>
      </Router>
    </>
  );
}

export default App;
