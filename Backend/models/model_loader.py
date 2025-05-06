import os
import pickle

# Use correct relative path
MODEL_PATH = os.path.join(os.path.dirname(__file__), "pipeline_leak_detection_model.pkl")

with open(MODEL_PATH, "rb") as f:
    loaded_pipeline = pickle.load(f)

def predict_leak(input_data):
    return loaded_pipeline.predict(input_data)

