// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import './Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Login from './Login';

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // "login" or "register"

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  useEffect(() => {
    const savedLogin = localStorage.getItem("loggedIn");
    if (savedLogin === "true") setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.closest('.sidebar') === null && e.target.closest('.more-btn') === null) {
        setSidebarOpen(false);
      }
    };
    if (sidebarOpen) {
      document.addEventListener('click', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [sidebarOpen]);

  const handleLogout = () => {
    localStorage.setItem("loggedIn", "false");
    setIsLoggedIn(false);
    setSidebarOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <h1>Pipeline Leak Detection</h1>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>

          {!isLoggedIn ? (
            <>
              <button
                className="auth-btn register-btn"
                onClick={() => { setAuthMode("register"); setShowLoginModal(true); }}
              >
                Register
              </button>
              <button
                className="auth-btn login-btn"
                onClick={() => { setAuthMode("login"); setShowLoginModal(true); }}
              >
                Login
              </button>
            </>
          ) : (
            <>
              <button className="auth-btn logout-btn" onClick={handleLogout}>
                Logout
              </button>
              <button className="more-btn" onClick={toggleSidebar}>
                <FontAwesomeIcon icon={faBars} shake />
              </button>
            </>
          )}
        </div>
      </nav>

      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={toggleSidebar}>×</button>
        <Link to="/predict">🔍 Long Pipeline Dashboard</Link>
        <Link to="/visualize">📊 Visualize</Link>
        <Link to="/simulate">⚙️ Simulate</Link>
        <Link to="/check-hardware">🧪 Hardware</Link>
        <Link to="/alerts">🚨 Alerts</Link>
        <Link to="/logger">📝 Logger</Link>
        <Link to="/equipment-failure">⚠️ Equipment Failure</Link>
      </div>

      {showLoginModal && (
        <Login
          mode={authMode}
          onClose={() => setShowLoginModal(false)}
          onSuccess={() => {
            setIsLoggedIn(true);
            localStorage.setItem("loggedIn", "true");
            setShowLoginModal(false);
          }}
        />
      )}
    </>
  );
}
