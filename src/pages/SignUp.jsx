import React, { useState } from 'react'
import SVGSymbols from '../components/SVGSymbols'
import Header from '../components/Header'
import "./auth.css";
import { useNavigate } from 'react-router-dom';

const SignUp = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // const handleSignup = async () => {
  //   try{
  //     const res = await fetch( 
  //       "https://artiststation.co.in/foxecom/api/auth/user/signup",
  //       {
  //         method: "POST",
  //         headers:{
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           email: email,
  //           password: password,
  //         })
  //       }
  //     )
  //   }
  // }

  const handleSignup = async () => {
  try {
    const res = await fetch(
      "https://artiststation.co.in/foxecom/api/auth/user/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      alert("Signup successful, please login");
      navigate("/login"); // ya signin page
    } else {
      alert(data.message || "Signup failed");
    }
  } catch (error) {
    console.log(error);
    alert("Server error");
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

                {/* Header */}
                <div className="text-center mb-4">
                  <h4 className="fw-bold mb-1">Sign Up</h4>
                  <p className="text-muted mb-0">
                    Create your account
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div className="alert alert-danger py-2">
                    {error}
                  </div>
                )}

                {/* Success */}
                {success && (
                  <div className="alert alert-success py-2">
                    {success}
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
                    placeholder="Create password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {/* Button */}
                <div className="d-grid mb-3">
                  <button
                    className="btn btn-primary"
                    onClick={handleSignup}
                    disabled={loading}
                  >
                    {loading ? "Creating account..." : "Sign Up"}
                  </button>
                </div>

                {/* Footer */}
                <div className="text-center">
                  <button
                    className="btn btn-link p-0 text-decoration-none"
                    onClick={() => navigate("/login")}
                  >
                    Already have an account? Sign In
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SignUp