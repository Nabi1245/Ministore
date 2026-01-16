import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = ({ setIsAdmin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Email and password are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        "https://artiststation.co.in/foxecom/api/auth/admin/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();
      console.log("LOGIN RESPONSE:", data);

      if (res.ok && data.token) {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("isAdmin", "true");
        navigate("/admin/dashboard", { replace: true });
      } else {
        //alert(data.message || "Invalid admin credentials");
        setError(data.message || "Invalid admin credentials");
      }
    } catch (error) {
      //console.error("Admin login error:", error);
      alert("Server error. Please try again later.");
      setError("Server error. Please try again later.");
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
              {/* Header */}
              <div className="text-center mb-4">
                <h4 className="fw-bold">Admin Login</h4>
                <p className="text-muted mb-0">
                  Sign in to access admin dashboard
                </p>
              </div>

              {/* ERROR MESSAGE */}
              {error && <div className="alert alert-danger py-2">{error}</div>}

              {/* Email */}
              <div className="mb-3">
                <label className="form-label">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Button */}
              <div className="d-grid">
                <button
                  className="btn btn-primary"
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Login"}
                </button>
              </div>

              {/* Footer */}
              <div className="text-center mt-3 text-muted small">
                Authorized personnel only
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
