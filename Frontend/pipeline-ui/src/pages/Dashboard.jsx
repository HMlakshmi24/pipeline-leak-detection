import React, { useContext, useEffect, useState } from "react";
import { SimulationContext } from "../SimulationContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./Dashboard.css";

const SEGMENT_POINTS = ["A", "B", "C", "D"];

const Dashboard = () => {
  const { simulationData } = useContext(SimulationContext);
  const [hardwareStatus, setHardwareStatus] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const [inletPoint, setInletPoint] = useState(() => {
    return localStorage.getItem("inletPoint") || "A";
  });
  const [outletPoint, setOutletPoint] = useState(() => {
    return localStorage.getItem("outletPoint") || "B";
  });

  const [segmentDataMap, setSegmentDataMap] = useState(() => {
    const saved = localStorage.getItem("segmentDataMap");
    return saved ? JSON.parse(saved) : {};
  });

  const currentKey = `${inletPoint}->${outletPoint}`;

  useEffect(() => {
    fetch("http://localhost:8000/check-hardware")
      .then((res) => res.json())
      .then((data) => setHardwareStatus(data))
      .catch((err) => console.error("Hardware status fetch error:", err));
  }, []);

  useEffect(() => {
    if (simulationData?.simulation_input) {
      setSegmentDataMap((prev) => {
        const newMap = {
          ...prev,
          [currentKey]: {
            input: simulationData.simulation_input,
            result: simulationData.result,
          },
        };
        localStorage.setItem("segmentDataMap", JSON.stringify(newMap));
        return newMap;
      });

      // Alerts update
      const { flow_in, pressure_in, temperature_in } = simulationData.simulation_input;
      const newAlerts = [];
      if (flow_in > 222) newAlerts.push({ type: "High Flow Rate", value: flow_in, unit: "L/s", color: "red" });
      if (pressure_in > 115) newAlerts.push({ type: "High Pressure", value: pressure_in, unit: "Pa", color: "orange" });
      if (temperature_in > 123) newAlerts.push({ type: "High Temperature", value: temperature_in, unit: "°C", color: "purple" });
      setAlerts(newAlerts);
    }
  }, [simulationData, currentKey]);

  // Update localStorage on inlet/outlet change
  useEffect(() => {
    localStorage.setItem("inletPoint", inletPoint);
    localStorage.setItem("outletPoint", outletPoint);
  }, [inletPoint, outletPoint]);

  const segmentData = segmentDataMap[currentKey] || {};
  const allInput = segmentData.input || {};
  const leakDetected = segmentData.result?.prediction === 1;

  const inletParams = ["flow_in", "pressure_in", "temperature_in", "density_in"];
  const outletParams = [
    "flow_out",
    "pressure_out",
    "temperature_out",
    "density_out",
    "vorticity",
    "mass_deviation",
    "energy_loss"
  ];

  const inletData = inletParams.map((key) => ({
    name: key.replace(/_/g, " "),
    value: Number(allInput[key]) || 0,
  }));

  const outletData = outletParams.map((key) => ({
    name: key.replace(/_/g, " "),
    value: Number(allInput[key]) || 0,
  }));

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">System Dashboard</h1>

      <div className={`leak-status-card ${leakDetected ? "leak" : "no-leak"}`}>
        <h2>{leakDetected ? "Leak Detected!" : "No Leak Detected"}</h2>
      </div>

      {/* Segment Selector */}
      <div className="card selector-card">
        <h2>Select Inlet and Outlet</h2>
        <div className="selectors">
          <label>
            Inlet:
            <select value={inletPoint} onChange={(e) => setInletPoint(e.target.value)}>
              {SEGMENT_POINTS.map((point) => (
                <option key={point} value={point}>{point}</option>
              ))}
            </select>
          </label>
          <label>
            Outlet:
            <select value={outletPoint} onChange={(e) => setOutletPoint(e.target.value)}>
              {SEGMENT_POINTS.map((point) => (
                <option key={point} value={point}>{point}</option>
              ))}
            </select>
          </label>
        </div>
        <p>Selected Segment: <strong>{inletPoint} → {outletPoint}</strong></p>
      </div>

      {/* Inlet Graph */}
      <div className="card chart-card">
        <h2>Inlet Parameters - Segment {inletPoint}</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={inletData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#4A90E2" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Outlet Graph */}
      <div className="card chart-card">
        <h2>Outlet Parameters - Segment {outletPoint}</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={outletData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#50e3c2" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Hardware Status */}
      <div className="card hardware-card">
        <h2>Hardware Status</h2>
        <ul>
          {hardwareStatus.length > 0 ? (
            hardwareStatus.map((hardware, index) => (
              <li key={index} className="hardware-item">
                <span>{hardware.name}</span>
                <span className={`status-indicator ${hardware.active ? "active" : "inactive"}`}>
                  {hardware.active ? "Active" : "Inactive"}
                </span>
              </li>
            ))
          ) : (
            <li className="text-gray-500">No hardware data available.</li>
          )}
        </ul>
      </div>

      {/* Alerts */}
      <div className="card alerts-card">
        <h2>Recent Alerts</h2>
        {alerts.length === 0 ? (
          <p>No alerts at this time.</p>
        ) : (
          <ul>
            {alerts.map((alert, index) => (
              <li key={index} className={`alert-item ${alert.color}`}>
                {alert.type}: {alert.value} {alert.unit}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
