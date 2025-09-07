import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import { HomePage, AboutPage, ContactPage } from './pages/Home'; // Updated imports
import Dashboard from './pages/Dashboard';
import Simulate from './pages/Simulate';
import CheckHardware from './pages/CheckHardware';
import Alerts from './pages/Alerts';
import Logger from './pages/Logger';
import EquipmentFailure from './pages/EquipmentFailure';
import Visualize from './pages/Visualize';
import { SimulationProvider } from "./SimulationContext";

function App() {
  return (
    <SimulationProvider>
      <div className="app-container">
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/predict" element={<Dashboard />} />
            <Route path="/simulate/" element={<Simulate />} />
            <Route path="/check-hardware/" element={<CheckHardware />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/logger" element={<Logger />} />
            <Route path="/equipment-failure" element={<EquipmentFailure />} />
            <Route path="/visualize" element={<Visualize />} />
          </Routes>
        </Router>
      </div>
    </SimulationProvider>
  );
}

export default App;
