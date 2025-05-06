import random

def generate_simulated_data():
    return {
        "flow_in": random.uniform(221, 225),
        "flow_out": random.uniform(220,222),
        "pressure_in": random.uniform(113.5, 118),
        "pressure_out": random.uniform(113.5, 118.0),
        "temperature_in": random.uniform(120, 135),
        "temperature_out": random.uniform(120, 130),
        "density_in": random.uniform(800, 900),
        "density_out": random.uniform(800, 850),
        "velocity_variation": random.uniform(-0.5, 0.5),
        "vorticity": random.uniform(0, 10),
        "mass_deviation": random.uniform(-3, 3),
        "energy_loss": random.uniform(0, 15),
        "gps_segment_id": random.randint(1000, 1100)
    }
