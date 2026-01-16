from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from schemas import (
    ForecastResponse, SimulationRequest, SimulationResponse, 
    PersonaAdviceResponse, PersonaType, Horizon
)
import mock_data
from schemas import (
    PredictResponse, HotspotsResponse, TrafficResponse, AlertsResponse,
    PurifierControlRequest, PurifierControlResponse
)

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


@app.get("/predict", response_model=PredictResponse)
def predict(zoneId: str = "zone_1", horizon_hours: int = 24, sim: str = None):
    # sim is expected to be a JSON string or None; mock_data accepts a dict
    import json
    sim_obj = None
    if sim:
        try:
            sim_obj = json.loads(sim)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid sim JSON")
    return mock_data.mock_predict(zoneId, horizon_hours, sim_obj)


@app.get("/hotspots", response_model=HotspotsResponse)
def hotspots(horizon_hours: int = 24, minAQI: int = 151, limit: int = 20, sim: str = None):
    import json
    sim_obj = None
    if sim:
        try:
            sim_obj = json.loads(sim)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid sim JSON")
    return mock_data.mock_hotspots(horizon_hours, minAQI, limit, sim_obj)


@app.get("/traffic", response_model=TrafficResponse)
def traffic(origin_lat: float = None, origin_lng: float = None, dest_lat: float = None, dest_lng: float = None, zoneId: str = None, departureAt: str = None, sim: str = None):
    import json
    sim_obj = None
    if sim:
        try:
            sim_obj = json.loads(sim)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid sim JSON")
    return mock_data.mock_traffic(origin_lat, origin_lng, dest_lat, dest_lng, zoneId, departureAt, sim_obj)


@app.get("/alerts", response_model=AlertsResponse)
def alerts(zoneId: str = None, persona: str = None, horizon_hours: int = 24, sim: str = None):
    import json
    sim_obj = None
    if sim:
        try:
            sim_obj = json.loads(sim)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid sim JSON")
    return mock_data.mock_alerts(zoneId, persona, horizon_hours, sim_obj)


@app.post("/purifier-control", response_model=PurifierControlResponse)
def purifier_control(body: PurifierControlRequest):
    # In production this would authenticate & call device gateway
    # Use Pydantic v2 API to avoid deprecation warnings
    # model_dump() returns a dict representation similar to dict()
    return mock_data.mock_purifier_control(body.model_dump())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
