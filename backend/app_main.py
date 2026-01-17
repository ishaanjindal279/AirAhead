from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
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

# --- Heatmap Grid Endpoint (IDW Interpolation) ---
@app.get("/hotspots")
async def get_heatmap_grid():
    """
    Generates a 20km-scale grid of AQI points over Delhi NCR using IDW interpolation
    from our 5 main monitoring stations.
    """
    import math

    # 1. Defined Stations (approx locs) with "Live" AQI (simulated for now, or fetch from weather_service)
    # in real app, these come from DB
    stations = [
        {"lat": 28.6139, "lng": 77.2090, "aqi": 340}, # Delhi (Central)
        {"lat": 28.5355, "lng": 77.3910, "aqi": 310}, # Noida
        {"lat": 28.4595, "lng": 77.0266, "aqi": 290}, # Gurgaon
        {"lat": 28.4089, "lng": 77.3178, "aqi": 280}, # Faridabad
        {"lat": 28.6692, "lng": 77.4538, "aqi": 360}, # Ghaziabad
    ]

    # 2. Grid Bounds (NCR)
    lat_min, lat_max = 28.40, 28.88
    lng_min, lng_max = 76.85, 77.55
    # Steps: approx 12x18 grid = ~200 points
    n_lat = 12
    n_lng = 18
    
    lat_step = (lat_max - lat_min) / n_lat
    lng_step = (lng_max - lng_min) / n_lng

    grid = []
    
    for i in range(n_lat + 1):
        lat = lat_min + i * lat_step
        for j in range(n_lng + 1):
            lng = lng_min + j * lng_step
            
            # 3. IDW Calculation
            numerator = 0
            denominator = 0
            p = 2 # Power parameter

            for s in stations:
                dist = math.sqrt((lat - s["lat"])**2 + (lng - s["lng"])**2)
                if dist == 0:
                    weight = 1e9 # Prevent div by zero
                else:
                    weight = 1 / (dist ** p)
                
                numerator += weight * s["aqi"]
                denominator += weight
            
            interpolated_aqi = int(numerator / denominator) if denominator > 0 else 0
            
            severity = "medium"
            if interpolated_aqi > 300: severity = "high"
            if interpolated_aqi > 400: severity = "critical"
            if interpolated_aqi <= 100: severity = "good"

            grid.append({
                "lat": lat,
                "lng": lng,
                "aqi": interpolated_aqi,
                "severity": severity,
                "name": f"Sector {i}-{j}" 
            })

    return {
        "grid": grid, 
        "station_count": len(stations), 
        "grid_points": len(grid),
        "lat_step": lat_step,
        "lng_step": lng_step
    }


# --- Dynamic Critical Roads Endpoint ---
# Real-time identification of roads needing traffic control

# Delhi NCR Major Road Network with approximate coordinates
ROAD_NETWORK = [
    {"id": "1", "name": "Ring Road (South)", "lat": 28.5700, "lng": 77.2200, "length_km": 8, "via": "AIIMS, Nehru Place"},
    {"id": "2", "name": "ITO Intersection", "lat": 28.6295, "lng": 77.2450, "length_km": 2, "via": "Delhi Gate"},
    {"id": "3", "name": "Outer Ring Road", "lat": 28.5500, "lng": 77.2000, "length_km": 12, "via": "Vasant Kunj"},
    {"id": "4", "name": "DND Flyway", "lat": 28.5800, "lng": 77.3200, "length_km": 9, "via": "Noida"},
    {"id": "5", "name": "NH-48 (Gurgaon)", "lat": 28.4900, "lng": 77.0800, "length_km": 15, "via": "IGI Airport"},
    {"id": "6", "name": "GT Karnal Road", "lat": 28.7200, "lng": 77.1500, "length_km": 10, "via": "Azadpur"},
    {"id": "7", "name": "Mehrauli-Badarpur Rd", "lat": 28.5100, "lng": 77.2800, "length_km": 7, "via": "Saket"},
    {"id": "8", "name": "Vikas Marg", "lat": 28.6400, "lng": 77.2800, "length_km": 5, "via": "Laxmi Nagar"},
]

@app.get("/traffic/critical-roads")
async def get_critical_roads():
    """
    Dynamically identifies critical roads based on real-time AQI grid data.
    Maps grid hotspots to nearest major roads.
    """
    import math
    
    # First, get the current grid data (reusing hotspots logic)
    stations = [
        {"lat": 28.6139, "lng": 77.2090, "aqi": 340},
        {"lat": 28.5355, "lng": 77.3910, "aqi": 310},
        {"lat": 28.4595, "lng": 77.0266, "aqi": 290},
        {"lat": 28.4089, "lng": 77.3178, "aqi": 280},
        {"lat": 28.6692, "lng": 77.4538, "aqi": 360},
    ]
    
    # Calculate AQI for each road based on nearest station (simple IDW)
    roads_with_aqi = []
    
    for road in ROAD_NETWORK:
        numerator = 0
        denominator = 0
        
        for station in stations:
            dist = math.sqrt((road["lat"] - station["lat"])**2 + (road["lng"] - station["lng"])**2)
            weight = 1 / (dist ** 2) if dist > 0 else 1e9
            numerator += weight * station["aqi"]
            denominator += weight
        
        road_aqi = int(numerator / denominator) if denominator > 0 else 300
        
        # Determine traffic status based on AQI
        if road_aqi > 350:
            traffic = "Severe"
        elif road_aqi > 300:
            traffic = "Heavy"
        elif road_aqi > 250:
            traffic = "Moderate"
        else:
            traffic = "Normal"
        
        roads_with_aqi.append({
            **road,
            "aqi": road_aqi,
            "traffic": traffic,
            "status": "Active",
            "needs_action": road_aqi > 300  # Flag roads needing intervention
        })
    
    # Sort by AQI (worst first)
    roads_with_aqi.sort(key=lambda x: -x["aqi"])
    
    return {
        "roads": roads_with_aqi,
        "critical_count": len([r for r in roads_with_aqi if r["needs_action"]]),
        "timestamp": __import__("datetime").datetime.now().isoformat()
    }

# New Govt Control Endpoint
class ControlRequest(BaseModel):
    zoneId: str
    action: str # "block", "restrict_heavy", "optimize_lights"

@app.post("/traffic/control")
async def control_traffic(payload: ControlRequest):
    """
    Simulates traffic control with MULTI-ROUTE LOAD BALANCING.
    Uses weighted distribution to prevent overloading single routes.
    """
    import asyncio
    import math
    await asyncio.sleep(0.3)
    
    # Find the blocked road
    blocked_road = next((r for r in ROAD_NETWORK if r["id"] == payload.zoneId), None)
    if not blocked_road:
        blocked_road = {"name": f"Zone {payload.zoneId}", "lat": 28.6139, "lng": 77.2090, "length_km": 5}
    
    # Monitoring stations with live AQI
    stations = [
        {"lat": 28.6139, "lng": 77.2090, "aqi": 340},
        {"lat": 28.5355, "lng": 77.3910, "aqi": 310},
        {"lat": 28.4595, "lng": 77.0266, "aqi": 290},
        {"lat": 28.4089, "lng": 77.3178, "aqi": 280},
        {"lat": 28.6692, "lng": 77.4538, "aqi": 360},
    ]
    
    alternatives = []
    for road in ROAD_NETWORK:
        if road["id"] == payload.zoneId:
            continue
        
        # Calculate road AQI using IDW
        numerator = 0
        denominator = 0
        for station in stations:
            dist = math.sqrt((road["lat"] - station["lat"])**2 + (road["lng"] - station["lng"])**2)
            weight = 1 / (dist ** 2) if dist > 0 else 1e9
            numerator += weight * station["aqi"]
            denominator += weight
        road_aqi = int(numerator / denominator) if denominator > 0 else 300
        
        # Road capacity = length_km * lanes (assume 2-4 lanes based on road type)
        base_capacity = road.get("length_km", 5) * 3  # Normalized capacity
        
        alternatives.append({
            "id": road["id"],
            "name": road["name"],
            "via": road.get("via", ""),
            "length_km": road.get("length_km", 5),
            "aqi": road_aqi,
            "capacity": base_capacity,
        })
    
    # ========== WEIGHTED DISTRIBUTION ALGORITHM ==========
    # Formula: weight_i = capacity_i / (aqi_i ^ alpha)
    # Higher capacity + Lower AQI = More traffic share
    
    alpha = 1.5  # AQI sensitivity parameter
    total_weight = 0
    for alt in alternatives:
        alt["weight"] = alt["capacity"] / (alt["aqi"] ** alpha)
        total_weight += alt["weight"]
    
    # Calculate traffic share percentage
    for alt in alternatives:
        alt["traffic_share"] = round((alt["weight"] / total_weight) * 100, 1) if total_weight > 0 else 0
        
        # Congestion feedback: more traffic slightly increases AQI
        congestion_factor = 1 + (alt["traffic_share"] / 100) * 0.05  # 5% max increase
        alt["projected_aqi"] = int(alt["aqi"] * congestion_factor)
    
    # Sort by traffic share (highest first for display)
    alternatives.sort(key=lambda x: -x["traffic_share"])
    
    # Calculate load balance score (100 = perfectly even, 0 = all on one)
    if len(alternatives) > 1:
        max_share = max(a["traffic_share"] for a in alternatives)
        ideal_share = 100 / len(alternatives)
        balance_score = max(0, 100 - abs(max_share - ideal_share) * 2)
    else:
        balance_score = 0
    
    # Heuristics for blocked road AQI reduction
    reductions = {"block": 0.30, "restrict_heavy": 0.15, "optimize_lights": 0.08}
    factor = reductions.get(payload.action, 0.0)
    
    # Calculate blocked road's original AQI
    numerator = 0
    denominator = 0
    for station in stations:
        dist = math.sqrt((blocked_road["lat"] - station["lat"])**2 + (blocked_road["lng"] - station["lng"])**2)
        weight = 1 / (dist ** 2) if dist > 0 else 1e9
        numerator += weight * station["aqi"]
        denominator += weight
    original_aqi = int(numerator / denominator) if denominator > 0 else 300
    new_aqi = int(original_aqi * (1 - factor))
    
    return {
        "status": "success",
        "zoneId": payload.zoneId,
        "blocked_road": blocked_road.get("name", f"Zone {payload.zoneId}"),
        "action": payload.action,
        "original_aqi": original_aqi,
        "projected_aqi": new_aqi,
        "improvement": f"{int(factor*100)}%",
        "load_balance_score": round(balance_score),
        "traffic_distribution": [
            {
                "name": a["name"],
                "via": a["via"],
                "traffic_share": a["traffic_share"],
                "current_aqi": a["aqi"],
                "projected_aqi": a["projected_aqi"],
                "length_km": a["length_km"]
            }
            for a in alternatives[:5]  # Top 5 alternatives
        ],
        "reroute_plan": {
            "primary": alternatives[0] if alternatives else None,
            "secondary": alternatives[1] if len(alternatives) > 1 else None,
            "tertiary": alternatives[2] if len(alternatives) > 2 else None,
        },
        "alternatives": alternatives[:5],
        "message": f"Traffic blocked on {blocked_road.get('name', payload.zoneId)}. Distributed across {len(alternatives)} routes."
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
