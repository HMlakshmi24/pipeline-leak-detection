import pandas as pd
import numpy as np

# Seed for reproducibility
np.random.seed(42)

# Generate synthetic data for 500 time steps
num_samples = 500

# Simulate normal flow in/out (with occasional deviations)
flow_in = np.random.normal(loc=100.0, scale=2.0, size=num_samples)
flow_out = flow_in - np.random.normal(loc=0.5, scale=0.5, size=num_samples)  # slight expected loss

# Pressure simulation
pressure_in = np.random.normal(loc=70.0, scale=1.5, size=num_samples)
pressure_out = pressure_in - np.random.normal(loc=1.0, scale=0.5, size=num_samples)

# Temperature simulation
temperature_in = np.random.normal(loc=50.0, scale=2.0, size=num_samples)
temperature_out = temperature_in - np.random.normal(loc=1.5, scale=0.5, size=num_samples)

# Density simulation (assuming minor variation)
density_in = np.random.normal(loc=0.85, scale=0.01, size=num_samples)
density_out = density_in - np.random.normal(loc=0.005, scale=0.003, size=num_samples)

# Velocity & vorticity (simplified for now)
velocity_variation = np.random.normal(loc=0.0, scale=0.1, size=num_samples)
vorticity = np.random.normal(loc=0.0, scale=0.05, size=num_samples)

# Mass deviation
mass_deviation = flow_in - flow_out

# Energy loss (simplified physical formula: E = 0.5 * density * velocity^2)
energy_in = 0.5 * density_in * (flow_in ** 2)
energy_out = 0.5 * density_out * (flow_out ** 2)
energy_loss = energy_in - energy_out

# GPS Segment ID simulation (e.g., segment number along the pipeline)
gps_segment_id = np.random.randint(low=1, high=20, size=num_samples)

# Create DataFrame
df = pd.DataFrame({
    "flow_in": flow_in,
    "flow_out": flow_out,
    "pressure_in": pressure_in,
    "pressure_out": pressure_out,
    "temperature_in": temperature_in,
    "temperature_out": temperature_out,
    "density_in": density_in,
    "density_out": density_out,
    "velocity_variation": velocity_variation,
    "vorticity": vorticity,
    "mass_deviation": mass_deviation,
    "energy_loss": energy_loss,
    "gps_segment_id": gps_segment_id
})

# Save as CSV
csv_path = "pipeline_sensor_data.csv"
df.to_csv(csv_path, index=False)

csv_path
