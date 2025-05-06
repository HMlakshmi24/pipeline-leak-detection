# routers/logger.py
from fastapi import APIRouter
from fastapi.responses import FileResponse
import os

router = APIRouter(prefix="/logs")

LOG_FILE_PATH = os.path.join("logs", "prediction_log.txt")

@router.get("/download")
def download_log():
    if os.path.exists(LOG_FILE_PATH):
        return FileResponse(path=LOG_FILE_PATH, filename="prediction_log.txt", media_type='text/plain')
    return {"error": "Log file not found"}
