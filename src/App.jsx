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
import ProductView from "./admin/pages/products/ProductView.jsx";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
import TrackOrder from "./pages/TrackOrder";
// Import new admin pages
import EditCategory from "./admin/pages/EditCategory";
import EditProduct from "./admin/pages/products/EditProduct";
import EditMobileBrand from "./admin/pages/mobileBrand/EditMobileBrand";
import EditMobileModel from "./admin/pages/mobileModel/EditMobileModel";
import EditMobileCase from "./admin/pages/caseDetails/EditMobileCase";
import OrdersDashboard from "./admin/pages/orders/OrdersDashboard";
import OrderView from "./admin/pages/orders/OrderView";
import UsersDashboard from "./admin/pages/users/UsersDashboard";
import UserView from "./admin/pages/users/UserView";
import AdminsDashboard from "./admin/pages/admins/AdminsDashboard";
import AddAdmin from "./admin/pages/admins/AddAdmin";
import EditAdmin from "./admin/pages/admins/EditAdmin";



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
      <Router basename="/foxecom-frontend">
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
                <Route path="order-success/:id" element={<OrderSuccess />} />
                <Route path="my-orders" element={<MyOrders />} />
                <Route path="order/:id/track" element={<TrackOrder />} />
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
                  path="categories/edit/:id"
                  element={<EditCategory />}
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
                  path="mobile-brand/edit/:id"
                  element={<EditMobileBrand />}
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
                  path="mobile-model/edit/:id"
                  element={<EditMobileModel />}
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
                  path="/admin/products/view/:id"
                  element={<ProductView />}
                />
                <Route
                  path="products/edit/:id"
                  element={<EditProduct />}
                />
                <Route
                  path="mobile-case"
                  element={<MobileCase />}
                />
                <Route
                  path="mobile-case/add"
                  element={<AddMobileCase />}
                />
                <Route
                  path="mobile-case/edit/:id"
                  element={<EditMobileCase />}
                />
                <Route
                  path="orders"
                  element={<OrdersDashboard />}
                />
                <Route
                  path="orders/view/:id"
                  element={<OrderView />}
                />
                <Route
                  path="users"
                  element={<UsersDashboard />}
                />
                <Route
                  path="users/view/:id"
                  element={<UserView />}
                />
                <Route
                  path="admins"
                  element={<AdminsDashboard />}
                />
                <Route
                  path="admins/add"
                  element={<AddAdmin />}
                />
                <Route
                  path="admins/edit/:id"
                  element={<EditAdmin />}
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
