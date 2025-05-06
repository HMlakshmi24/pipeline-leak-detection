from fastapi import APIRouter
from utils.simulation import generate_simulated_data
import httpx

router = APIRouter(prefix="/simulate")

@router.post("/")
async def simulate_leak():
    simulated_data = generate_simulated_data()

    # Internal POST request to /predict endpoint
    async with httpx.AsyncClient() as client:
        response = await client.post("http://localhost:8000/predict/", json=simulated_data)

    return {
        "simulation_input": simulated_data,
        "result": response.json()
    }
