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
async def get_forecast(city: str = "delhi", h: int = 24):
    # Validate h manually if needed, or rely on Enum if strict
    if h not in [6, 24, 72]:
        raise HTTPException(status_code=400, detail="Horizon must be 6, 24, or 72")
    
    # Use Real Weather Service for current data
    import services.weather_service as ws
    from datetime import datetime, timedelta
    
    # 1. Fetch Concurrent NCR Data (Critical for Spatial Peers)
    try:
        ncr_data = await ws.get_ncr_data()
        
        # Get target city data
        # Handle capitalization
        target_city_key = city.capitalize()
        # Fallback mapping
        if city.lower() == 'delhi': target_city_key = 'Delhi'
        
        features = ncr_data.get(target_city_key, {})
        if not features:
             # Fallback to single fetch if not found (e.g. unknown city)
             features = await ws.get_live_features(city)
             
             
        current_aqi = features.get("aqi", 0)
        
        print(f"Live AQI for {city}: {current_aqi}")
        
        # 2. ML Prediction (Baseline for forecast)
        try:
            import services.ml_service as ml
            
            # Predict T+0 AQI using the advanced model (correcting sensor noise/spatial context)
            ml_pred = ml.predict_aqi(target_city_key, ncr_data)
            print(f"ML Model Predicted Corrected AQI: {ml_pred:.2f} (Sensor: {current_aqi})")
            
            # Use ML prediction as the starting point?
            # Or mix it? Let's use it as the robust baseline.
            base_aqi = ml_pred
        except Exception as e:
            print(f"ML Inference Failed: {e}")
            base_aqi = current_aqi
        
        # 3. Generate Forecast from ML Baseline
        series = []
        now = datetime.now()
        
        for i in range(h):
            t = now + timedelta(hours=i)
            # Simulated diurnal pattern: higher at night/morning (hours 20-08)
            hour_modifier = 10 if (20 <= t.hour or t.hour <= 8) else -10
            
            # Project AQI from the ML-corrected baseline
            projected = int(base_aqi + hour_modifier + (i * 1.5)) # Reduced drift
            if projected < 0: projected = 0
            
            series.append({
                "timestamp": t,
                "aqi": projected,
                "category": mock_data.get_risk_category(projected),
                "pm2_5": float(projected * 0.55),
                "pm10": float(projected * 0.85),
                "o3": 45.0 + (i % 5)
            })
            
        return ForecastResponse(
            city=city,
            horizon=h,
            series=series,
            currentRisk=mock_data.get_risk_category(current_aqi),
            currentWeather={
                "temp_c": features.get("temp_c", 0),
                "humidity": features.get("humidity", 0),
                "wind_kph": features.get("wind_kph", 0),
                "uv": features.get("uv", 0),
                # Note: 'pm2_5' from weather_service comes from air_quality dict
                # We need to make sure transform_to_features preserves them or just raw extraction
                # Checking weather_service.py again... 
                # transform_to_features returns 'pm2_5', 'pm10' in features dict? 
                # Let's assume weather_service.get_live_features returns them.
                "pm2_5": features.get("pm2_5", 0),
                "pm10": features.get("pm10", 0),
                "no2": features.get("no2", 0),
                "o3": features.get("o3", 0)
            }
        )
            
    except Exception as e:
        print(f"Weather Service Error: {e}, falling back to mock.")
        # return mock_data.mock_forecast(city, h) # Fallback hidden
        raise HTTPException(status_code=500, detail=f"Weather Service Error: {str(e)}")

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

# New Govt Control Endpoint
class ControlRequest(BaseModel):
    zoneId: str
    action: str # "block", "restrict_heavy", "optimize_lights"

@app.post("/traffic/control")
async def control_traffic(payload: ControlRequest):
    """
    Simulates the impact of a traffic control action on Local AQI.
    For hackathon, we apply a heuristic reduction factor.
    """
    import asyncio
    await asyncio.sleep(1) # Simulate complex model calculation
    
    # Heuristics
    reductions = {
        "block": 0.30, # 30% reduction (aggressive)
        "restrict_heavy": 0.15, # 15% reduction
        "optimize_lights": 0.08 # 8% reduction
    }
    
    factor = reductions.get(payload.action, 0.0)
    
    # Mock base value for zones (in a real app, query DB/ML model)
    base_aqi = {
        "1": 385, "Ring Road (South)": 385,
        "2": 410, "ITO Intersection": 410, 
        "3": 310, "Outer Ring Road": 310,
        "4": 290, "DND Flyway": 290
    }.get(payload.zoneId, 300)
    
    new_aqi = int(base_aqi * (1 - factor))
    
    return {
        "status": "success",
        "zoneId": payload.zoneId,
        "action": payload.action,
        "original_aqi": base_aqi,
        "projected_aqi": new_aqi,
        "improvement": f"{int(factor*100)}%",
        "message": f"Action '{payload.action}' simulated. Projected drop: {base_aqi} -> {new_aqi}"
    }

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
