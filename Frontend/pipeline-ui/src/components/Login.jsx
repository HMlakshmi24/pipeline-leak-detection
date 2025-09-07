// src/components/Login.jsx
import React, { useState } from 'react';
import './Login.css';

export default function Login({ mode, onClose, onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAction = () => {
    if (mode === "register") {
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userPassword", password);
      alert("Registered successfully!");
      onClose();
    } else {
      const savedEmail = localStorage.getItem("userEmail");
      const savedPassword = localStorage.getItem("userPassword");
      if (email === savedEmail && password === savedPassword) {
        alert("Logged in successfully!");
        onSuccess();
      } else {
        alert("Invalid credentials!");
      }
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-modal">
        <h2>{mode === "register" ? "Register" : "Login"}</h2>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <div className="login-actions">
          <button onClick={handleAction}>
            {mode === "register" ? "Register" : "Login"}
          </button>
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
