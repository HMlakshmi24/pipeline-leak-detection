import React, { useState } from "react";
import './Simulate.css';
import { useContext } from "react";
import { SimulationContext } from "../SimulationContext";





const Simulate = () => {
  const [simulationResult, setSimulationResult] = useState(null);
  const [manualInput, setManualInput] = useState({
    flow_in: "",
    flow_out: "",
    pressure_in: "",
    pressure_out: "",
    temperature_in: "",
    temperature_out: "",
    density_in: "",
    density_out: "",
    velocity_variation: "",
    vorticity: "",
    mass_deviation: "",
    energy_loss: "",
    gps_segment_id: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showManual, setShowManual] = useState(false); // new

  const { setSimulationData } = useContext(SimulationContext);

  const handleAutoTrigger = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:8000/simulate/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const result = await response.json();
      setSimulationResult(result);
      setSimulationData(result); // ✅ Update context state
    } catch (error) {
      setError("Simulation failed. Please check backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async () => {
    setError("");
    for (const key in manualInput) {
      if (manualInput[key] === "") {
        setError("Please enter all the values.");
        return;
      }
    }

    const parsedInput = {};
    for (const key in manualInput) {
      parsedInput[key] =
        key === "gps_segment_id"
          ? parseInt(manualInput[key])
          : parseFloat(manualInput[key]);
    }

    try {
      const response = await fetch("http://localhost:8000/predict/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(parsedInput)
      });

      const result = await response.json();
      setSimulationData({
        simulation_input: parsedInput,
        result
      }); // ✅ Update context state
      setSimulationResult({
        simulation_input: parsedInput,
        result
      });
    } catch (error) {
      setError("Prediction failed. Please check backend.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setManualInput((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="simulate-container px-4 py-8 bg-white w-full overflow-hidden">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Leak Simulation</h2>

      <div className="flex flex-col gap-8">
        {/* Auto Trigger */}
        <div className="bg-blue-100 p-6 rounded-xl shadow-md w-full">
          <button
            onClick={handleAutoTrigger}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition"
          >
            {loading ? "Simulating..." : "Auto Trigger"}
          </button>
        </div>

        {/* Manual Trigger (Dropdown) */}
        <div className="bg-green-100 p-6 rounded-xl shadow-md w-full">
          <button
            onClick={() => setShowManual(!showManual)}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-lg transition"
          >
            {showManual ? "Hide Manual Trigger" : "Manual Trigger"}
          </button>

          {showManual && (
            <div className="mt-6 transition-all duration-300 ease-in-out">
              <h3 className="text-lg font-semibold mb-6 text-gray-700">Manual Input</h3>
              <div className="form-grid">
                {Object.keys(manualInput).map((key) => (
                  <div className="input-container" key={key}>
                    <label className="block text-gray-700">{key.replace(/_/g, " ")}</label>
                    <input
                      type="number"
                      name={key}
                      value={manualInput[key]}
                      onChange={handleInputChange}
                      placeholder={`Enter ${key.replace(/_/g, " ")}`}
                      className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={handleManualSubmit}
                className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition"
              >
                Submit Manual Input
              </button>
              {error && <p className="text-red-600 mt-3 font-medium">{error}</p>}
            </div>
          )}
        </div>
      </div>

      {/* Result Section */}
      {simulationResult && (
        <div className="simulation-result mt-10 bg-gray-50 p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-800">Simulation Input:</h3>
          <pre className="bg-white p-4 rounded overflow-x-auto text-sm text-gray-700">
            {JSON.stringify(simulationResult.simulation_input, null, 2)}
          </pre>

          <h3 className="text-lg font-semibold text-gray-800 mt-6">Result:</h3>
          <pre className="bg-white p-4 rounded overflow-x-auto text-sm text-gray-700">
            {JSON.stringify(simulationResult.result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default Simulate;
