// src/pages/Logger.jsx
import React from "react";
import './Logger.css';

export default function Logger() {
  const downloadLogs = () => {
    const link = document.createElement("a");
    link.href = "http://localhost:8000/logs/download"; // adjust if hosted differently
    link.download = "pipeline_logs.txt";
    link.click();
  };

  return (
    <div className="logger-page">
      <div className="logger-card">
        <h2>System Logger</h2>
        <p>Download the logs of all simulated operations.</p>
        <button onClick={downloadLogs}>📥 Download Log File</button>
      </div>
    </div>
  );
}
