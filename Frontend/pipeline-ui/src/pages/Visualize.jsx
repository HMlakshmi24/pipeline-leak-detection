import React, { useContext, useEffect, useState } from "react";
import { SimulationContext } from "../SimulationContext";
import "./Visualize.css";

const Visualize = () => {
  const { simulationData } = useContext(SimulationContext);

  const [inletPoint, setInletPoint] = useState("A");
  const [outletPoint, setOutletPoint] = useState("B");
  const [leakPosition, setLeakPosition] = useState(null);

  // pipe length in pixels (same as CSS width of .pipe-line)
  const pipePixelLength = 600;

  useEffect(() => {
    if (simulationData?.result) {
      if (simulationData.result.prediction === 1) {
        // get raw gps_segment_id or segment_id (in meters)
        const leakDistance =
          simulationData.result.gps_segment_id ||
          simulationData.result.segment_id ||
          0;

        setLeakPosition(leakDistance);
      } else {
        setLeakPosition(null);
      }
    }
  }, [simulationData]);

  const inletParams = ["flow_in", "pressure_in", "temperature_in", "density_in"];
  const outletParams = [
    "flow_out",
    "pressure_out",
    "temperature_out",
    "density_out",
    "vorticity",
    "mass_deviation",
    "energy_loss",
  ];

  // Convert meters → pixels for placement
  const leakPixel =
    leakPosition !== null ? Math.min(leakPosition, pipePixelLength) : null;

  return (
    <div className="visualize-container">
      <h1 className="visualize-title">Pipeline Visualization</h1>

      <div className="pipe-container">
        {/* Inlet Section */}
        <div className="valve-section">
          <h3>Inlet Valve {inletPoint}</h3>
          <select
            value={inletPoint}
            onChange={(e) => setInletPoint(e.target.value)}
          >
            {["A", "B", "C"].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
          <div className="dropdown">
            {inletParams.map((p) => (
              <p key={p}>
                {p.replace(/_/g, " ")}:{" "}
                <strong>{simulationData?.simulation_input?.[p] || "-"}</strong>
              </p>
            ))}
          </div>
        </div>

        {/* Pipe with Leak Indicator */}
        <div className="pipe-visual">
          <div className="pipe-line" style={{ width: `${pipePixelLength}px` }}>
            {leakPixel !== null && (
              <div
                className="leak-indicator"
                style={{ left: `${leakPixel}px` }}
                title={`Leak detected at ${leakPosition} meters from inlet valve ${inletPoint}`}
              >
                <span className="leak-text">
                  🚨 Leak @ {leakPosition}m from {inletPoint}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Outlet Section */}
        <div className="valve-section">
          <h3>Outlet Valve {outletPoint}</h3>
          <select
            value={outletPoint}
            onChange={(e) => setOutletPoint(e.target.value)}
          >
            {["A", "B", "C"].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
          <div className="dropdown">
            {outletParams.map((p) => (
              <p key={p}>
                {p.replace(/_/g, " ")}:{" "}
                <strong>{simulationData?.simulation_input?.[p] || "-"}</strong>
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visualize;
