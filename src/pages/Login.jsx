import React, { useState } from "react";
import Header from "../components/Header";
import SVGSymbols from "../components/SVGSymbols";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";

const Login = ({ setIsLoggedIn }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const res = await fetch(
        "https://artiststation.co.in/foxecom/api/auth/user/signin",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      console.log(res);

      const data = await res.json();
      console.log(data);

      if (res.status === 200) {
        console.log("nabi status 200");
        localStorage.setItem("token", data.token); // browser memory
        setIsLoggedIn(true); // react state
        navigate("/");
      } else {
        //alert(data.message || "Invalid login");
        setError(data.message || "Invalid login");
      }
    } catch (error) {
      //alert("Server error");
      console.log(error, "errormil gaya");
    }
  };

  return (
    <>
      <SVGSymbols />
      <Header />

      <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="row w-100 justify-content-center">
          <div className="col-11 col-sm-8 col-md-6 col-lg-4">
            <div className="card shadow border-0">
              <div className="card-body p-4">

                {/* Title */}
                <div className="text-center mb-4">
                  <h4 className="fw-bold mb-1">
                    {isSignup ? "Sign Up" : "Sign In"}
                  </h4>
                  <p className="text-muted mb-0">
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
                <div className="mb-4">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className={`form-control ${error ? "is-invalid" : ""}`}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

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

                      : 
                      <Link to={"/sign-up"}>
                        "New user? Sign Up"
                      </Link>
                    }
                    
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
