import datetime

def log_prediction(data, prediction):
    with open("logs/prediction_log.txt", "a") as f:
        f.write(f"{datetime.datetime.now()} | Input: {data} | Prediction: {prediction}\n")
