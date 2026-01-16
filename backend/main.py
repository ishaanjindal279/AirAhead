from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from schemas import (
    ForecastResponse, SimulationRequest, SimulationResponse, 
    PersonaAdviceResponse, PersonaType, Horizon
)
import mock_data

app = FastAPI(title="AirAhead Integration Layer", version="1.0.0")

# CORS Setup - Allow all for Hackathon simplicity
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "ok", "service": "AirAhead Integration Layer"}

@app.get("/forecast", response_model=ForecastResponse)
def get_forecast(city: str = "delhi", h: int = 24):
    # Validate h manually if needed, or rely on Enum if strict
    if h not in [6, 24, 72]:
         # Fallback or strict error? User asked for discrete horizon.
         # Pydantic validation handles it if we used the Enum in query, 
         # but let's be flexible in input parsing, strict in logic.
         if h not in [6, 24, 72]:
             raise HTTPException(status_code=400, detail="Horizon must be 6, 24, or 72")
    
    return mock_data.mock_forecast(city, h)

@app.post("/simulate", response_model=SimulationResponse)
def simulate(request: SimulationRequest):
    return mock_data.mock_simulation(request.modifiers)

@app.get("/persona", response_model=PersonaAdviceResponse)
def get_persona_advice(type: PersonaType, h: int = 24):
    if h not in [6, 24, 72]:
        raise HTTPException(status_code=400, detail="Horizon must be 6, 24, or 72")
    return mock_data.mock_persona_advice(type, h)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
