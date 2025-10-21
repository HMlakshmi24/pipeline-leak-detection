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
  const [aboutOpen, setAboutOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  useEffect(() => {
    const savedLogin = localStorage.getItem("loggedIn");
    if (savedLogin === "true") setIsLoggedIn(true);
  }, []);

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
          <Link to="/" className="navbar h1 ">Home</Link>
          <button className="nav-btn" onClick={() => setAboutOpen(true)}>About</button>
          <button className="nav-btn" onClick={() => setContactOpen(true)}>Contact</button>

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

      {/* Sidebar */}
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

      {/* About Slide Panel */}
      {aboutOpen && (
        <div className="slide-panel">
          <div className="slide-content">
            <button className="close-btn" onClick={() => setAboutOpen(false)}>×</button>
            <h2>About Us</h2>
            <p>
              We are a team committed to providing advanced pipeline leak detection using AI and real-time
              data analysis. Our system combines CFD, RTTM, and modern UI/UX to simulate and detect leaks
              with precision.
            </p>
          </div>
        </div>
      )}

      {/* Contact Slide Panel */}
      {contactOpen && (
        <div className="slide-panel">
          <div className="slide-content">
            <button className="close-btn" onClick={() => setContactOpen(false)}>×</button>
            <h2>Contact Us</h2>
            <p>
              📧 Email: hm.lakshmi@parijat.com <br />
              📞 Phone: +91 98765 43210 <br />
              📍 Address: Bengaluru, India
            </p>
          </div>
        </div>
      )}

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
