from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from datetime import datetime

router = APIRouter()

# -------------------- Pydantic Models --------------------

class Component(BaseModel):
    id: int
    name: str

class FailureDetail(BaseModel):
    status: str
    last_checked: str
    cause: str
    recommendation: str

# -------------------- Sample Data --------------------

components = [
    {"id": 1, "name": "Valve A"},
    {"id": 2, "name": "Pump B"},
    {"id": 3, "name": "Compressor C"},
    {"id": 4, "name": "Sensor D"}
]

failure_details = {
    1: {
        "status": "Operational",
        "last_checked": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "cause": "N/A",
        "recommendation": "Continue regular monitoring."
    },
    2: {
        "status": "Failure Detected",
        "last_checked": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "cause": "Mechanical wear",
        "recommendation": "Schedule immediate maintenance."
    },
    3: {
        "status": "Operational",
        "last_checked": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "cause": "N/A",
        "recommendation": "No action required."
    },
    4: {
        "status": "Operational",
        "last_checked": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "cause": "N/A",
        "recommendation": "Continue regular monitoring."
    }
}

# -------------------- Routes --------------------

@router.get("/api/components", response_model=List[Component])
def get_components():
    return components

@router.get("/api/components/{component_id}/failure", response_model=FailureDetail)
def get_failure_detail(component_id: int):
    return failure_details.get(component_id, {
        "status": "Unknown",
        "last_checked": "N/A",
        "cause": "Unknown",
        "recommendation": "No data available."
    })
