import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EquipmentFailure.css';

const EquipmentFailure = () => {
  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [failureDetails, setFailureDetails] = useState(null);

  useEffect(() => {
    // Fetch the list of components from the backend
    axios.get('http://localhost:8000/api/components')
      .then(response => setComponents(response.data))
      .catch(error => console.error('Error fetching components:', error));
  }, []);

  const handleComponentClick = (component) => {
    setSelectedComponent(component);
    // Fetch failure details for the selected component
    axios.get(`http://localhost:8000/api/components/${component.id}/failure`)
      .then(response => setFailureDetails(response.data))
      .catch(error => console.error('Error fetching failure details:', error));
  };

  return (
    <div className="equipment-failure-container">
      <h2>Equipment Failure Detection</h2>
      <div className="components-list">
        {components.map(component => (
          <div
            key={component.id}
            className="component-item"
            onClick={() => handleComponentClick(component)}
          >
            {component.name}
          </div>
        ))}
      </div>
      {selectedComponent && failureDetails && (
        <div className="failure-details">
          <h3>{selectedComponent.name} Failure Details</h3>
          <p><strong>Status:</strong> {failureDetails.status}</p>
          <p><strong>Last Checked:</strong> {failureDetails.last_checked}</p>
          <p><strong>Failure Cause:</strong> {failureDetails.cause}</p>
          <p><strong>Recommended Action:</strong> {failureDetails.recommendation}</p>
        </div>
      )}
    </div>
  );
};

export default EquipmentFailure;
