
// src/pages/Home.jsx
import React from 'react';
import './Page.css';

export function HomePage() {
  return (
    <div className="page">
      <div className="welcome-box small-card">
        <h1>Welcome to Pipeline Leak Detection</h1>
        <p>
          Monitor and predict pipeline issues in real-time. Use the sidebar to run simulations, detect leaks, or check your hardware.
        </p>
      </div>
    </div>
  );
}

export function AboutPage() {
  return (
    <div className="page">
      <div className="welcome-box small-card">
        <h1>About Us</h1>
        <p>
          We are a team committed to providing advanced pipeline leak detection using AI and real-time data analysis. Our system combines CFD,
          RTTM, and modern UI/UX to simulate and detect leaks with precision.
        </p>
      </div>
    </div>
  );
}

export function ContactPage() {
  return (
    <div className="page">
      <div className="welcome-box small-card">
        <h1>Contact Us</h1>
        <p>
          Email: demo@gmail.com<br />
          Phone: +91 98765 43210<br />
          Address: Bengaluru, India
        </p>
      </div>
    </div>
  );
}


