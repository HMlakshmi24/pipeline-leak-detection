import React, { useState } from "react";
import axios from "axios";
import './CheckHardware.css';

export default function CheckHardware() {
  const [sensors, setSensors] = useState([]);

  const checkSensors = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/check-hardware/");
      setSensors(data.details || []);
    } catch (err) {
      console.error("Sensor check failed", err);
    }
  };

  const handleAction = (sensorKey, action) => {
    alert(`Performing "${action}" on ${sensorKey}. Please wait!!`);
    // In future: axios.post(`/api/sensors/${sensorKey}/${action}`);
  };

  return (
    <div className="hardware-container">
      <h1>Hardware Integration Panel</h1>
      <button className="check-button" onClick={checkSensors}>🔍 Check Sensor Status</button>

      <div className="sensor-grid">
        {sensors.map((sensor, index) => (
          <div className="sensor-card" key={index}>
            <h3>{sensor.name}</h3>
            <p className={`status ${sensor.status.toLowerCase()}`}>{sensor.status}</p>

            <div className="sensor-actions">
              <button onClick={() => handleAction(sensor.key, "connect")}>🔌 Connect</button>
              <button onClick={() => handleAction(sensor.key, "fetch")}>📡 Fetch Data</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
