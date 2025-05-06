from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import home, predict, simulate, check_hardware, logger, EquipmentFailure



app = FastAPI(title="Pipeline Leak Detection API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(home.router)
app.include_router(predict.router)
app.include_router(simulate.router)
app.include_router(check_hardware.router)
app.include_router(logger.router)
app.include_router(EquipmentFailure.router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
