// src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import './Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

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

  return (
    <>
      <nav className="navbar">
        <h1>Pipeline Leak Detection</h1>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <button className="more-btn" onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faBars} shake />
          </button>
        </div>
      </nav>

      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={toggleSidebar}>×</button>
        <Link to="/predict">🔍 Long Pipline Dashboard</Link>
        <Link to="/simulate">⚙️ Simulate</Link>
        <Link to="/check-hardware">🧪 Hardware</Link>
        <Link to="/alerts">🚨 Alerts</Link>
        <Link to="/logger">📝 Logger</Link>
        <Link to="/equipment-failure">⚠️ Equipment Failure</Link>
      </div>
    </>
  );
}
