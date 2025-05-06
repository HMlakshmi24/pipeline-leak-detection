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

const Dashboard = () => {
  const { simulationData } = useContext(SimulationContext);
  const [hardwareStatus, setHardwareStatus] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Fetch hardware status
    fetch("http://localhost:8000/check-hardware")
      .then((res) => res.json())
      .then((data) => setHardwareStatus(data))
      .catch((err) => console.error("Hardware status fetch error:", err));
  }, []);

  useEffect(() => {
    // Generate alerts based on simulation data
    if (simulationData?.simulation_input) {
      const { flow_in, pressure_in, temperature_in } =
        simulationData.simulation_input;
      const newAlerts = [];

      if (flow_in > 222) {
        newAlerts.push({
          type: "High Flow Rate",
          value: flow_in,
          unit: "L/s",
          color: "red",
        });
      }

      if (pressure_in > 115) {
        newAlerts.push({
          type: "High Pressure",
          value: pressure_in,
          unit: "Pa",
          color: "orange",
        });
      }

      if (temperature_in > 123) {
        newAlerts.push({
          type: "High Temperature",
          value: temperature_in,
          unit: "°C",
          color: "purple",
        });
      }

      setAlerts(newAlerts);
    }
  }, [simulationData]);

  if (!simulationData) {
    return (
      <p className="text-gray-500">No data to display. Trigger a simulation first.</p>
    );
  }

  const inputData = Object.entries(simulationData.simulation_input || {}).map(
    ([key, value]) => ({
      name: key.replace(/_/g, " "),
      value: Number(value),
    })
  );

  const leakDetected = simulationData.result?.prediction === 1;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">System Dashboard</h1>

      {/* Leak Detection Status */}
      <div
        className={`leak-status-card ${
          leakDetected ? "leak" : "no-leak"
        }`}
      >
        <h2>{leakDetected ? "Leak Detected!" : "No Leak Detected"}</h2>
      </div>

      {/* Input Parameters Chart */}
      <div className="card chart-card">
        <h2>Input Parameters</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={inputData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#4A90E2" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Hardware Status */}
      <div className="card hardware-card">
        <h2>Hardware Status</h2>
        <ul>
          {Array.isArray(hardwareStatus) && hardwareStatus.length > 0 ? (
            hardwareStatus.map((hardware, index) => (
              <li key={index} className="hardware-item">
                <span>{hardware.name}</span>
                <span
                  className={`status-indicator ${
                    hardware.active ? "active" : "inactive"
                  }`}
                >
                  {hardware.active ? "Active" : "Inactive"}
                </span>
              </li>
            ))
          ) : (
            <li className="text-gray-500">No hardware data available.</li>
          )}
        </ul>
      </div>

      {/* Recent Alerts */}
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
