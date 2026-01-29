import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { userAuthAPI } from "../utils/api";
import "./auth.css";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate();
  const { mergeGuestCart } = useCart();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");
      
      const data = await userAuthAPI.signin(email, password);
      
      if (data.token) {
        localStorage.setItem("token", data.token);
        
        // Dispatch event to sync login state across components
        window.dispatchEvent(new Event("loginStatusChanged"));
        
        // Merge guest cart into user cart after successful login
        try {
          await mergeGuestCart();
        } catch (mergeError) {
          console.error('Error merging cart:', mergeError);
          // Don't block login if merge fails, just log it
        }
        
        // Redirect to intended destination or home
        const redirectTo = localStorage.getItem('redirectAfterLogin') || '/'
        localStorage.removeItem('redirectAfterLogin')
        navigate(redirectTo);
      } else {
        setError(data.message || "Invalid login");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="row w-100 justify-content-center">
          <div className="col-11 col-sm-8 col-md-6 col-lg-4">
            <div className="card shadow border-0">
              <div className="card-body p-4">

                {/* Title */}
                <div className="text-center mb-4">
                  <h4 className="fw-bold mb-1" style={{ fontSize: '1.5rem' }}>
                    {isSignup ? "Sign Up" : "Sign In"}
                  </h4>
                  <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>
                    {isSignup
                      ? "Create your account"
                      : "Sign in to continue"}
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div className="alert alert-danger py-2">
                    {error}
                  </div>
                )}

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className={`form-control ${error ? "is-invalid" : ""}`}
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Password */}
                <div className="mb-2">
                  <label className="form-label">Password</label>
                  <div className="input-group">
                    <input
                    type={showPassword ?  "text" : "password"}
                    className={`form-control ${error ? "is-invalid" : ""}`}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                  type="button" 
                  className="btn btn-outline-secondary" 
                  onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                  </button>
                  </div>
                </div>
                {!isSignup && (
                  <div className="mb-3 text-end">
                    <Link to="/forgot-password" className="small text-decoration-none">
                      Forgot password?
                    </Link>
                  </div>
                )}

                {/* Button */}
                <div className="d-grid mb-3">
                  <button
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading
                      ? "Please wait..."
                      : isSignup
                      ? "Sign Up"
                      : "Sign In" }
                  </button>
                </div>

                {/* Toggle */}
                <div className="text-center">
                  <button
                    className="btn btn-link p-0 text-decoration-none"
                    onClick={() => setIsSignup(!isSignup)}
                  >
                    {isSignup
                      ? "Already have an account? Sign In"
                      : (
                        <Link to={"/sign-up"} className="text-decoration-none">
                          New user? Sign Up
                        </Link>
                      )
                    }
                    
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
   
  );
};

export default Login;
