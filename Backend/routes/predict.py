from fastapi import APIRouter, Request
from utils.predictor import run_prediction

router = APIRouter(prefix="/predict")

@router.post("/")
async def predict_leak_status(request: Request):
    input_json = await request.json()
    prediction = run_prediction(input_json)
    return {"prediction": prediction, "details": "Leak" if prediction else "No Leak"}
