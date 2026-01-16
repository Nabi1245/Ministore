import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Auth = ({ setIsLoggedIn }) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    console.log(setIsLoggedIn, "swapnil")

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
      console.log(res.status)

      if (res.status == 200) {
        console.log("if condition");
        // 🔥 here Login Cnf
        localStorage.setItem("token", data.token);
        // setIsLoggedIn(true);
        navigate("/");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert("Server error", err);
    console.log(err)
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