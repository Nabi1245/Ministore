import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Auth = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { mergeGuestCart } = useCart();

  const handleLogin = async () => {
    try {
      const res = await fetch(
        "https://artiststation.co.in/foxecom/api/auth/user/signin",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (res.status == 200) {
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
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Server error. Please try again.");
    }
  };


  return (
    <>
        <h2>Login page</h2>
        <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </>
  )
}

export default Auth;