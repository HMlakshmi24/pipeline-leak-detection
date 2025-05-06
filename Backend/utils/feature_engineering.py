# # feature_engineering.py

# import numpy as np
# import pandas as pd
# from pykalman import KalmanFilter

# # Constants
# f = 0.015  # friction factor
# bulk_modulus = 2.2e9  # Pa
# D = 1.0  # meters
# A = np.pi * (D / 2) ** 2  # cross-sectional area

# def compute_features(input_json: dict, prev_row: dict = None) -> pd.DataFrame:
#     """
#     Compute physics-enhanced features from raw input.
#     Optionally accepts prev_row to compute diffs (for real-time).
#     """
#     df = pd.DataFrame([input_json])

#     # Density average
#     rho = (df['density_in'] + df['density_out']) / 2

#     # Velocity
#     df['v_in'] = df['flow_in'] / (rho * A)
#     df['v_out'] = df['flow_out'] / (rho * A)

#     # Mass deviation (requires prev row)
#     if prev_row:
#         df['dm_dt'] = (df['flow_in'] - prev_row['flow_in']) - (df['flow_out'] - prev_row['flow_out'])
#         df['v_out_diff'] = df['v_out'] - prev_row['v_out']
#         df['pressure_out_diff'] = df['pressure_out'] - prev_row['pressure_out']
#     else:
#         df['dm_dt'] = 0.0
#         df['v_out_diff'] = 0.0
#         df['pressure_out_diff'] = 0.0

#     # Momentum loss
#     df['momentum_loss'] = (
#         df['v_out_diff'] +
#         (df['v_out'] * df['v_out_diff']) +
#         (1 / rho) * df['pressure_out_diff'] +
#         f * (df['v_out'].abs() * df['v_out']) / (2 * D)
#     )

#     # Sound speed
#     df['sound_speed'] = np.sqrt(bulk_modulus / rho)

#     # Apply Kalman filter only if there are enough data points
#     if len(df['flow_out'].values) > 1:
#         kf = KalmanFilter(initial_state_mean=df['flow_out'].iloc[0], n_dim_obs=1)
#         flow_out_filtered, _ = kf.em(df['flow_out'].values).filter(df['flow_out'].values)
#         df['flow_out_filtered'] = flow_out_filtered
#     else:
#         df['flow_out_filtered'] = df['flow_out']  # fallback, no Kalman filtering

#     # Predicted flow
#     df['flow_predicted'] = rho * A * df['v_in']
#     df['flow_residual'] = df['flow_out'] - df['flow_predicted']

#     # Final feature list
#     final_df = df[[
#         'v_in', 'v_out', 'dm_dt', 'momentum_loss',
#         'sound_speed', 'flow_out_filtered', 'flow_residual'
#     ]]

#     return final_df


import numpy as np
import pandas as pd
from pykalman import KalmanFilter

# Constants
f = 0.015  # friction factor
bulk_modulus = 2.2e9  # Pa
D = 1.0  # meters
A = np.pi * (D / 2) ** 2  # cross-sectional area

def compute_features(input_json: dict, prev_row: dict = None) -> pd.DataFrame:
    """
    Compute physics-enhanced features from raw input.
    Automatically initializes prev_row if not provided.
    """
    df = pd.DataFrame([input_json])

    df['density_in'] = pd.to_numeric(df['density_in'], errors='coerce')
    df['density_out'] = pd.to_numeric(df['density_out'], errors='coerce')

    # Density average
    rho = (df['density_in'] + df['density_out']) / 2

    # Velocity
    df['v_in'] = df['flow_in'] / (rho * A)
    df['v_out'] = df['flow_out'] / (rho * A)

    # --- Initialize prev_row if None ---
    if prev_row is None:
        prev_row = {
            'flow_in': df['flow_in'].iloc[0],
            'flow_out': df['flow_out'].iloc[0],
            'v_out': df['v_out'].iloc[0],
            'pressure_out': df['pressure_out'].iloc[0],
        }

    # Mass deviation
    df['dm_dt'] = (df['flow_in'] - prev_row['flow_in']) - (df['flow_out'] - prev_row['flow_out'])
    df['v_out_diff'] = df['v_out'] - prev_row['v_out']
    df['pressure_out_diff'] = df['pressure_out'] - prev_row['pressure_out']

    # Momentum loss
    df['momentum_loss'] = (
        df['v_out_diff'] +
        (df['v_out'] * df['v_out_diff']) +
        (1 / rho) * df['pressure_out_diff'] +
        f * (df['v_out'].abs() * df['v_out']) / (2 * D)
    )

    # Sound speed
    df['sound_speed'] = np.sqrt(bulk_modulus / rho)

    # Kalman filter (skip if only one point)
    if len(df['flow_out'].values) > 1:
        kf = KalmanFilter(initial_state_mean=df['flow_out'].iloc[0], n_dim_obs=1)
        flow_out_filtered, _ = kf.em(df['flow_out'].values).filter(df['flow_out'].values)
        df['flow_out_filtered'] = flow_out_filtered
    else:
        df['flow_out_filtered'] = df['flow_out']

    # Predicted flow and residual
    df['flow_predicted'] = rho * A * df['v_in']
    df['flow_residual'] = df['flow_out'] - df['flow_predicted']

    # Final features to return
    final_df = df[[
        'v_in', 'v_out', 'dm_dt', 'momentum_loss',
        'sound_speed', 'flow_out_filtered', 'flow_residual'
    ]]

    return final_df
