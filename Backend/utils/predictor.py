# import pandas as pd
# from models.model_loader import predict_leak
# from utils.logger import log_prediction

# def run_prediction(input_json: dict):
#     input_df = pd.DataFrame([input_json])
#     prediction = predict_leak(input_df)[0]
#     log_prediction(input_json, prediction)
#     return int(prediction)


import pandas as pd
from models.model_loader import predict_leak
from utils.logger import log_prediction
from utils.feature_engineering import compute_features

REQUIRED_KEYS = [
    "flow_in", "flow_out", "pressure_in", "pressure_out",
    "temperature_in", "temperature_out", "density_in", "density_out",
    "velocity_variation", "vorticity", "mass_deviation", "energy_loss",
    "gps_segment_id", "v_out"  # add any other keys used in compute_features
]

prev_row = None

def run_prediction(input_json: dict):
    global prev_row

    # Initialize prev_row with zeros for all required keys if first time
    if prev_row is None:
        prev_row = {key: 0.0 for key in REQUIRED_KEYS}

    # Fill missing keys in input_json with zeros to ensure compatibility
    for key in REQUIRED_KEYS:
        if key not in input_json:
            input_json[key] = 0.0

    # Feature engineering
    input_df = compute_features(input_json, prev_row)

    # Save current input as previous for next run
    prev_row = input_json.copy()

    # Predict
    prediction = predict_leak(input_df)[0]

    # Log
    log_prediction(input_json, prediction)

    return int(prediction)

