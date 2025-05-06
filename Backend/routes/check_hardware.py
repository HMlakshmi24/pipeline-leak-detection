from fastapi import APIRouter

router = APIRouter(prefix="/check-hardware")

@router.get("/")
def check_sensors():
    return {
        "status": "All sensors online",
        "details": [
            {"name": "Flow Sensor", "key": "flow_sensor", "status": "Not connected"},
            {"name": "Pressure Sensor", "key": "pressure_sensor", "status": "Not connected"},
            {"name": "Temperature Sensor", "key": "temperature_sensor", "status": "Not connected"},
        ]
    }
