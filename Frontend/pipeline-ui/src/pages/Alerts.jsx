import React, { useState } from "react";
import "./Alerts.css";

export default function Alerts() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      // In future, send this email to backend
      setSubscribed(true);
    }
  };

  return (
    <div className="alerts-page">
      <div className="alert-card">
        <h2>Leak Alert Notification</h2>
        <p>Enter your email to receive leak alerts during this session.</p>
        <form onSubmit={handleSubscribe} className="email-form">
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Subscribe</button>
        </form>
        {subscribed && (
          <div className="subscribed-confirmation">
            ✅ Alerts will be sent to: <strong>{email}</strong>
          </div>
        )}
      </div>
    </div>
  );
}
