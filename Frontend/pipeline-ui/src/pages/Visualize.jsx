// src/pages/Visualize.jsx
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { SimulationContext } from "../SimulationContext";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "./Visualize.css";

/* Fix default leaflet icon paths for many bundlers */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

/* Default pipeline polyline coordinates (replace with real coords if available) */
const DEFAULT_PIPELINE_COORDS = [
  { lat: 39.80, lng: -100.50 },
  { lat: 39.78, lng: -100.44 },
  { lat: 39.76, lng: -100.38 },
];

const PIPE_PIXEL_LENGTH = 600; // must match CSS .pipe-line width

/* helper component to programmatically move map to new center when prop changes */
function MapFlyTo({ center }) {
  const map = useMap();
  useEffect(() => {
    if (!center || !map) return;
    map.flyTo([center.lat, center.lng], 14, { duration: 0.8 });
  }, [center, map]);
  return null;
}

const Visualize = ({ onEmergency, onDispatch, onNotify } = {}) => {
  const { simulationData } = useContext(SimulationContext);

  // UI selections
  const [inletPoint, setInletPoint] = useState(
    () => localStorage.getItem("inletPoint") || "A"
  );
  const [outletPoint, setOutletPoint] = useState(
    () => localStorage.getItem("outletPoint") || "B"
  );
  const [showLabels, setShowLabels] = useState(false);
  const [muted, setMuted] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(true);

  // map ref (MapContainer whenCreated)
  const mapRef = useRef(null);

  // derive simulation input & result consistently
  const simInput = simulationData?.simulation_input ?? simulationData ?? null;
  const simResult = simulationData?.result ?? null;

  // compute a leak entry when result indicates leak
  const latestLeak = useMemo(() => {
    if (!simResult) return null;
    const isLeak = simResult.prediction === 1 || simResult.details === "Leak";
    if (!isLeak) return null;

    const seg = simInput?.gps_segment_id ?? simInput?.segment_id ?? 0;
    const latlng = segmentToLatLng(seg, DEFAULT_PIPELINE_COORDS);

    return {
      id: `leak-${seg}-${Date.now()}`,
      seg,
      latlng,
      rawInput: simInput,
      rawResult: simResult,
      time: new Date().toISOString(),
      confidence: simResult.confidence ?? null,
    };
  }, [simInput, simResult]);

  // Keep history of leaks (simple)
  const [leakHistory, setLeakHistory] = useState([]);
  useEffect(() => {
    if (!latestLeak) return;
    setLeakHistory((prev) => [latestLeak, ...prev].slice(0, 20));
    if (!muted) playAlert();
  }, [latestLeak, muted]);

  // persist inlet/outlet selections
  useEffect(() => {
    localStorage.setItem("inletPoint", inletPoint);
    localStorage.setItem("outletPoint", outletPoint);
  }, [inletPoint, outletPoint]);

  // prepare chart data (inlet + outlet)
  const inletParams = [
    "flow_in",
    "pressure_in",
    "temperature_in",
    "density_in",
  ];
  const outletParams = [
    "flow_out",
    "pressure_out",
    "temperature_out",
    "density_out",
    "vorticity",
    "mass_deviation",
    "energy_loss",
  ];

  const inletData = inletParams.map((k) => ({
    name: k.replace(/_/g, " "),
    value: Number(simInput?.[k] ?? 0),
  }));
  const outletData = outletParams.map((k) => ({
    name: k.replace(/_/g, " "),
    value: Number(simInput?.[k] ?? 0),
  }));

  // pipeline inline pixels for leak markers (map gps_segment_id -> pixel)
  const leakPixels = leakHistory.map((lk) => {
    const seg = Number(lk.seg ?? 0);
    const px = Number.isFinite(seg)
      ? Math.max(0, Math.min(PIPE_PIXEL_LENGTH, seg % PIPE_PIXEL_LENGTH))
      : Math.round((0.5 * PIPE_PIXEL_LENGTH));
    return { id: lk.id, px, seg, time: lk.time };
  });

  // map center (initially pipeline midpoint or latest leak)
  const initialCenter = DEFAULT_PIPELINE_COORDS[
    Math.floor(DEFAULT_PIPELINE_COORDS.length / 2)
  ];
  const mapCenter = latestLeak?.latlng ?? initialCenter;

  // action handlers (pass-through callbacks + small UX)
  const handleEmergency = () => {
    if (!latestLeak) return alert("No active leak to act upon.");
    if (typeof onEmergency === "function") onEmergency(latestLeak);
    alert(`Emergency shutdown requested for segment ${latestLeak.seg}`);
  };
  const handleDispatch = () => {
    if (!latestLeak) return alert("No active leak to dispatch team.");
    if (typeof onDispatch === "function") onDispatch(latestLeak);
    alert(`Dispatch team to segment ${latestLeak.seg}`);
  };
  const handleNotify = () => {
    if (!latestLeak) return alert("No active leak to notify.");
    if (typeof onNotify === "function") onNotify(latestLeak);
    alert(`Notified maintenance for segment ${latestLeak.seg}`);
  };

  // small helpers
  function playAlert() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.type = "sine";
      o.frequency.value = 640;
      g.gain.value = 0.02;
      o.start();
      setTimeout(() => {
        o.stop();
        ctx.close();
      }, 200);
    } catch (e) {
      // ignore on unsupported envs
    }
  }

  return (
    <div className="visualize-container">
      <h1 className="visualize-title">Pipeline Visualization — Live</h1>

      <div className="controls-row">
        <div className="controls-left">
          <label className="small-label">
            Inlet
            <select
              value={inletPoint}
              onChange={(e) => setInletPoint(e.target.value)}
            >
              {["A", "B", "C", "D"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label className="small-label">
            Outlet
            <select
              value={outletPoint}
              onChange={(e) => setOutletPoint(e.target.value)}
            >
              {["A", "B", "C", "D"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="controls-right">
          <button
            className="btn"
            onClick={() => setShowLabels((s) => !s)}
            aria-pressed={showLabels}
          >
            {showLabels ? "Hide Labels" : "Show Labels"}
          </button>
          <button className="btn" onClick={() => setMuted((m) => !m)}>
            {muted ? "Unmute" : "Mute Alerts"}
          </button>
        </div>
      </div>

      {/* top layout: left valve, pipe visual, right valve */}
      <div className="pipe-container">
        <div className="valve-section">
          <h3>Inlet Valve {inletPoint}</h3>
          <div className="dropdown">
            {inletParams.map((k) => (
              <p key={k}>
                {k.replace(/_/g, " ")}:{" "}
                <strong>
                  {simInput?.[k] !== undefined ? Number(simInput[k]).toFixed(2) : "-"}
                </strong>
              </p>
            ))}
          </div>
        </div>

        <div className="pipe-visual">
          <div className="pipe-line" style={{ width: `${PIPE_PIXEL_LENGTH}px` }}>
            {/* optional segment divisions */}
            <div className={`pipe-segment ${showLabels ? "show" : ""}`} style={{ left: "0%", width: "25%" }}>
              {showLabels && <div className="seg-label">Inlet</div>}
            </div>
            <div className={`pipe-segment ${showLabels ? "show" : ""}`} style={{ left: "25%", width: "25%" }}>
              {showLabels && <div className="seg-label">A</div>}
            </div>
            <div className={`pipe-segment ${showLabels ? "show" : ""}`} style={{ left: "50%", width: "25%" }}>
              {showLabels && <div className="seg-label" id="leakSegmentVisual">B</div>}
            </div>
            <div className={`pipe-segment ${showLabels ? "show" : ""}`} style={{ left: "75%", width: "25%" }}>
              {showLabels && <div className="seg-label">Outlet</div>}
            </div>

            {/* leak indicators placed by pixel */}
            {leakPixels.map((lp) => (
              <div
                key={lp.id}
                className="leak-indicator"
                style={{ left: `${lp.px}px` }}
                title={`Leak @ seg ${lp.seg}`}
              >
                <span className="leak-text">🚨</span>
              </div>
            ))}
          </div>
        </div>

        <div className="valve-section">
          <h3>Outlet Valve {outletPoint}</h3>
          <div className="dropdown">
            {outletParams.map((k) => (
              <p key={k}>
                {k.replace(/_/g, " ")}:{" "}
                <strong>
                  {simInput?.[k] !== undefined ? Number(simInput[k]).toFixed(2) : "-"}
                </strong>
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* metrics grid */}
      <div className="metrics-grid">
        <div className="metric card blue">
          <div className="metric-title">Flow Rate Difference</div>
          <div className="metric-value">
            {simInput?.flow_in !== undefined && simInput?.flow_out !== undefined
              ? (Number(simInput.flow_in) - Number(simInput.flow_out)).toFixed(2)
              : "-"}
          </div>
          <div className="metric-sub">m³/s</div>
        </div>

        <div className="metric card red">
          <div className="metric-title">Mass Deviation</div>
          <div className="metric-value">
            {simInput?.mass_deviation !== undefined
              ? Number(simInput.mass_deviation).toFixed(2)
              : "-"}
          </div>
          <div className="metric-sub">kg/m³</div>
        </div>

        <div className="metric card yellow">
          <div className="metric-title">Energy Loss</div>
          <div className="metric-value">
            {simInput?.energy_loss !== undefined ? Number(simInput.energy_loss).toFixed(2) : "-"}
          </div>
          <div className="metric-sub">kJ</div>
        </div>

        <div className="metric card purple">
          <div className="metric-title">Vorticity</div>
          <div className="metric-value">
            {simInput?.vorticity !== undefined ? Number(simInput.vorticity).toFixed(2) : "-"}
          </div>
          <div className="metric-sub">rad/s</div>
        </div>
      </div>

      {/* Map + right side panel */}
      <div className="map-and-panel">
        <div className="map-card">
          <div className="map-header">
            <h3>Leak Location</h3>
            <div className="map-controls">
              <button
                className="btn small"
                onClick={() => {
                  if (!latestLeak || !mapRef.current) return;
                  mapRef.current.flyTo([latestLeak.latlng.lat, latestLeak.latlng.lng], 15, { duration: 0.7 });
                }}
              >
                Center Latest
              </button>
              <button
                className="btn small"
                onClick={() => {
                  if (!mapRef.current) return;
                  const bounds = DEFAULT_PIPELINE_COORDS.map((c) => [c.lat, c.lng]);
                  mapRef.current.fitBounds(bounds, { padding: [40, 40] });
                }}
              >
                Fit Pipeline
              </button>
            </div>
          </div>

          <div className="leaflet-map-wrapper">
            <MapContainer
              center={[mapCenter.lat, mapCenter.lng]}
              zoom={13}
              whenCreated={(mapInstance) => {
                mapRef.current = mapInstance;
              }}
              className="leaflet-map"
              key={latestLeak ? latestLeak.id : "map-initial"}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {/* pipeline polyline markers as simple markers */}
              {DEFAULT_PIPELINE_COORDS.map((c, i) => (
                <Marker key={i} position={[c.lat, c.lng]}>
                  <Popup>Pipeline point {i + 1}</Popup>
                </Marker>
              ))}

              {/* leak marker(s) */}
              {leakHistory.map((lk) => (
                <Marker key={lk.id} position={[lk.latlng.lat, lk.latlng.lng]}>
                  <Popup>
                    Leak at segment {lk.seg}
                    <br />
                    Time: {new Date(lk.time).toLocaleString()}
                  </Popup>
                </Marker>
              ))}

              {/* fly-to control when latestLeak changes */}
              {latestLeak && <MapFlyTo center={latestLeak.latlng} />}
            </MapContainer>
          </div>

          <div className="map-footer">
            <div>
              GPS Coordinates:{" "}
              <span className="gps-span">
                {latestLeak ? `${latestLeak.latlng.lat.toFixed(5)}, ${latestLeak.latlng.lng.toFixed(5)}` : "—"}
              </span>
            </div>
            <div>
              Detected: <span>{latestLeak ? new Date(latestLeak.time).toLocaleString() : "—"}</span>
            </div>
          </div>
        </div>

        <div className="right-panel">
          <div className="actions card">
            <h4>Leak Response Actions</h4>
            <button className="action-btn emergency" onClick={handleEmergency}>
              Emergency Shutdown
            </button>
            <button className="action-btn notify" onClick={handleNotify}>
              Notify Maintenance
            </button>
            <button className="action-btn dispatch" onClick={handleDispatch}>
              Dispatch Team
            </button>
            <button
              className="action-btn report"
              onClick={() => {
                if (!latestLeak) return alert("No leak to report.");
                // simple CSV download example
                const csv = [
                  ["key", "value"],
                  ...Object.entries(latestLeak.rawInput || {}).map(([k, v]) => [k, String(v)]),
                ]
                  .map((r) => r.join(","))
                  .join("\n");
                const blob = new Blob([csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `leak_${latestLeak.seg || "unknown"}.csv`;
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Generate Report
            </button>
          </div>

          <div className="analysis card">
            <h4>Leak Analysis</h4>
            <div className="analysis-row">
              <span>Confidence Level</span>
              <span className="bold red">{latestLeak?.confidence ?? "N/A"}</span>
            </div>
            <div className="analysis-row">
              <span>Estimated Size</span>
              <span className="bold">Medium</span>
            </div>
            <div className="analysis-row">
              <span>Detected At</span>
              <span className="bold">{latestLeak ? new Date(latestLeak.time).toLocaleTimeString() : "—"}</span>
            </div>
            <div className="analysis-row">
              <span>Response Time</span>
              <span className="bold green">Immediate</span>
            </div>
          </div>

          <div className="alerts card">
            <div className="alerts-header">
              <h4>Alerts</h4>
              <button className="btn tiny" onClick={() => setAlertsOpen((s) => !s)}>
                {alertsOpen ? "Hide" : "Show"}
              </button>
            </div>

            {alertsOpen && (
              <div className="alerts-list">
                {leakHistory.length === 0 && <div className="muted">No active alerts</div>}
                {leakHistory.map((le) => (
                  <div key={le.id} className="alert-item">
                    <div className="alert-left">
                      <div className="alert-dot" />
                      <div>
                        <div className="alert-title">Leak — {le.seg}</div>
                        <div className="alert-meta">{new Date(le.time).toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="alert-actions">
                      <button
                        className="tiny"
                        onClick={() => {
                          if (mapRef.current) mapRef.current.flyTo([le.latlng.lat, le.latlng.lng], 15, { duration: 0.6 });
                        }}
                      >
                        Map
                      </button>
                      <button className="tiny" onClick={handleDispatch}>
                        Dispatch
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* charts: inlet/outlet */}
          <div className="card chart-card">
            <h4>Inlet Parameters</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={inletData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card chart-card">
            <h4>Outlet Parameters</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={outletData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#db2777" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visualize;

/* -------------------------
   Helper functions (outside component)
   ------------------------- */
function segmentToLatLng(segmentId, polyline) {
  const num = Number(segmentId) || 0;
  const pts = polyline;
  if (!pts || pts.length < 2 || Number.isNaN(num)) {
    const mid = pts[Math.floor(pts.length / 2)];
    return { lat: mid.lat, lng: mid.lng };
  }
  const normalized = Math.abs(num);
  const t = (normalized % PIPE_PIXEL_LENGTH) / PIPE_PIXEL_LENGTH; // 0..1
  return interpolatePolylineAtT(pts, t);
}

function interpolatePolylineAtT(pts, t) {
  const dists = [0];
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    dists.push(Math.hypot(b.lat - a.lat, b.lng - a.lng));
  }
  const total = dists.reduce((a, b) => a + b, 0);
  if (total === 0) return { lat: pts[0].lat, lng: pts[0].lng };
  let acc = 0;
  const target = t * total;
  for (let i = 1; i < pts.length; i++) {
    const seg = dists[i];
    if (acc + seg >= target) {
      const remain = target - acc;
      const ratio = seg === 0 ? 0 : remain / seg;
      const a = pts[i - 1],
        b = pts[i];
      return { lat: a.lat + (b.lat - a.lat) * ratio, lng: a.lng + (b.lng - a.lng) * ratio };
    }
    acc += seg;
  }
  const last = pts[pts.length - 1];
  return { lat: last.lat, lng: last.lng };
}
