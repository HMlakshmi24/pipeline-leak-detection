import React, { createContext, useState, useEffect } from "react";

export const SimulationContext = createContext();

export const SimulationProvider = ({ children }) => {
  const [simulationData, setSimulationData] = useState(() => {
    const stored = localStorage.getItem("simulationData");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (simulationData) {
      localStorage.setItem("simulationData", JSON.stringify(simulationData));
    }
  }, [simulationData]);

  return (
    <SimulationContext.Provider value={{ simulationData, setSimulationData }}>
      {children}
    </SimulationContext.Provider>
  );
};
