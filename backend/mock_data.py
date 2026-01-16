from datetime import datetime, timedelta, timezone
from typing import List
from schemas import (
    ForecastPoint, RiskCategory, ForecastResponse, 
    SimulationResponse, RiskShiftResponse,
    PersonaAdviceResponse, AdviceItem, PersonaType
)
import random
from datetime import timedelta, timezone


# --- New mock endpoints implementations ---
def _build_aqi_breakdown(aqi: int):
    # crude split for mock
    pm2_5 = round(aqi * 0.6, 1)
    pm10 = round(aqi * 0.2, 1)
    no2 = round(aqi * 0.1, 1)
    o3 = round(aqi * 0.1, 1)
    return {"pm2_5": pm2_5, "pm10": pm10, "no2": no2, "o3": o3}

def mock_predict(zoneId: str = "zone_1", horizon: int = 24, sim: dict = None) -> dict:
    now = datetime.now(timezone.utc)
    base_aqi = 140
    if sim:
        if sim.get("traffic") and sim.get("traffic") > 1.0:
            base_aqi += int(40 * (sim.get("traffic") - 1.0))
        if sim.get("festival"):
            base_aqi += 80

    series = []
    for i in range(horizon):
        t = now + timedelta(hours=i)
        val = base_aqi + int(10 * (0.5 + 0.5 * (i % 12) / 12.0))
        if 18 <= t.hour <= 22:
            val += 40
        breakdown = _build_aqi_breakdown(val)
        conf = {"lower": max(0, val - 15), "upper": val + 20}
        series.append({
            "timestamp": t,
            "aqi": val,
            "aqiCategory": get_risk_category(val),
            "aqiBreakdown": breakdown,
            "confidence": conf,
            "recommendationScore": round(min(1.0, (val - 50) / 300), 2)
        })

    resp = {
        "zoneId": zoneId,
        "requestPeriod": {"from": now, "to": now + timedelta(hours=horizon)},
        "predictions": series,
        "model": {"name": "aqi-ensemble-v1", "version": "2026-01-10", "inferenceTimeMs": 220},
        "cache": {"hit": False, "ttl_sec": 300},
        "uiHints": {"displayAsSparklineAfter": "200ms"}
    }
    return resp

def mock_hotspots(horizon: int = 24, minAQI: int = 151, limit: int = 10, sim: dict = None) -> dict:
    now = datetime.now(timezone.utc)
    # Create several zones with varying peak AQI
    hotspots = []
    for z in range(1, 8):
        peak = 120 + z * 20
        if sim and sim.get("festival"):
            peak += 60
        if peak >= minAQI:
            hotspots.append({
                "zoneId": f"zone_{z}",
                "center": {"lat": 12.9 + z * 0.01, "lng": 77.6 + z * 0.01},
                "expectedMaxAQI": peak,
                "expectedTime": now + timedelta(hours=18),
                "drivers": ["traffic"] + (["festival"] if sim and sim.get("festival") else []),
                "severity": {"level": "critical" if peak > 200 else "high", "score": min(1.0, peak / 300)},
                "recommendedAction": ["avoid_outdoor", "wear_n95"],
                "uiHint": {"color": "#8B0000", "icon": "warning"}
            })

    hotspots = sorted(hotspots, key=lambda h: -h["expectedMaxAQI"])[:limit]
    return {"generatedAt": now, "hotspots": hotspots, "meta": {"count": len(hotspots), "modelVersion": "aqi-ensemble-v1"}}

def mock_traffic(origin_lat: float = None, origin_lng: float = None, dest_lat: float = None, dest_lng: float = None, zoneId: str = None, departureAt = None, sim: dict = None) -> dict:
    now = datetime.now(timezone.utc)
    est = 30
    if sim and sim.get("traffic"):
        est = int(est * sim.get("traffic"))
    route = {"estimatedTimeMin": est, "distanceMeters": 10500, "congestionScore": min(1.0, 0.6 if not sim else 0.6 * sim.get("traffic",1.0)),
             "segments": [{"from": {"lat": origin_lat or 12.9, "lng": origin_lng or 77.6}, "to": {"lat": dest_lat or 12.95, "lng": dest_lng or 77.63}, "congestion": "high", "estimatedTimeMin": int(est*0.35)}]}
    reroutes = [{"routeId": "r2", "etaChangeMin": -6, "description": "Avoid main avenue during 08:30-09:00", "confidence": 0.85, "uiHint": {"color": "#FFA500"}}]
    related = {"zoneId": zoneId or "zone_1", "aqiNow": 140, "aqiForecastMax": 180}
    return {"asOf": now, "route": route, "rerouteSuggestions": reroutes, "relatedAQI": related}

def mock_alerts(zoneId: str = None, persona: str = None, horizon: int = 24, sim: dict = None) -> dict:
    now = datetime.now(timezone.utc)
    alerts = []
    # Example alert
    alerts.append({
        "id": "alert_1",
        "type": "no_run",
        "title": "Avoid running tomorrow morning",
        "message": "AQI expected to exceed 200 between 06:00-10:00. Consider indoor exercise.",
        "severity": "high",
        "zones": [zoneId or "zone_1"],
        "validFrom": now + timedelta(days=1),
        "validUntil": now + timedelta(days=1, hours=12),
        "confidence": 0.88,
        "actions": [{"type": "open_url", "payload": {"url": "https://help.example/precautions"}}],
        "personaSpecific": {"appliesToPersona": persona or None, "overrides": {"severity": "critical" if persona == "elderly" else "high"}},
        "ui": {"bannerColor": "#FF4500", "icon": "no_run"}
    })
    return {"generatedAt": now, "alerts": alerts}

def mock_purifier_control(body: dict) -> dict:
    # Body is expected to have deviceId, zoneId, command, optional level
    now = datetime.now(timezone.utc)
    status = "queued"
    applied = {"command": body.get("command"), "level": body.get("level")}
    recommendation = {"powerSaveMode": False, "recommendedLevel": body.get("level") or 3}
    reasoning = {"predictedAQI": 190, "expiresAt": now + timedelta(hours=3)}
    return {"status": status, "deviceId": body.get("deviceId"), "appliedCommand": applied, "recommendation": recommendation, "modelReasoning": reasoning}

# Deterministic mock helpers
def get_risk_category(aqi: int) -> RiskCategory:
    if aqi <= 50: return RiskCategory.good
    if aqi <= 100: return RiskCategory.satisfactory
    if aqi <= 200: return RiskCategory.moderate
    if aqi <= 300: return RiskCategory.poor
    if aqi <= 400: return RiskCategory.very_poor
    return RiskCategory.severe

def generate_series(start_time: datetime, hours: int, base_aqi: int, variance: int) -> List[ForecastPoint]:
    series = []
    for i in range(hours):
        t = start_time + timedelta(hours=i)
        # Simple wave pattern for deterministic "randomness"
        val = base_aqi + int(variance * (0.5 + 0.5 * (i % 12) / 12.0))
        # Add a spike in the evening
        if 18 <= t.hour <= 22:
            val += 50
        series.append(ForecastPoint(
            timestamp=t,
            aqi=val,
            category=get_risk_category(val)
        ))
    return series

def mock_forecast(city: str, horizon: int) -> ForecastResponse:
    now = datetime.now(timezone.utc)
    base_aqi = 150 # Moderate baseline
    series = generate_series(now, horizon, base_aqi, 20)
    return ForecastResponse(
        city=city,
        horizon=horizon,
        series=series,
        currentRisk=series[0].category
    )

def mock_simulation(modifiers) -> SimulationResponse:
    now = datetime.now(timezone.utc)
    horizon = 24
    
    # Baseline
    baseline = generate_series(now, horizon, 150, 20)
    
    # Apply modifiers
    sim_base = 150
    if modifiers.traffic and modifiers.traffic > 1.0:
        sim_base += int(50 * (modifiers.traffic - 1.0))
    if modifiers.festival:
        sim_base += 100
        
    simulated = generate_series(now, horizon, sim_base, 30)
    
    return SimulationResponse(
        baseline=baseline,
        simulated=simulated,
        riskShift=RiskShiftResponse(
            **{"from": baseline[0].category, "to": simulated[0].category}
        )
    )

def mock_persona_advice(persona: PersonaType, horizon: int) -> PersonaAdviceResponse:
    now = datetime.now(timezone.utc)
    timeline = []
    
    messages = {
        PersonaType.jogger: "Air quality is poor. Avoid outdoor running.",
        PersonaType.asthmatic: "High particulate matter. Keep inhaler nearby.",
        PersonaType.child: "Limit outdoor playtime.",
        PersonaType.elderly: "Stay indoors with air purification."
    }
    
    base_msg = messages.get(persona, "Caution advised.")
    
    for i in range(0, horizon, 4): # Advice every 4 hours
        item_time = now + timedelta(hours=i)
        timeline.append(AdviceItem(
            timestamp=item_time,
            message=f"{base_msg} (Hour {i})",
            severity=random.randint(3, 8)
        ))
        
    return PersonaAdviceResponse(
        persona=persona,
        adviceTimeline=timeline,
        contextualMessage=f"Dashboard alert for {persona.value}: Conditions are deteriorating in the evening."
    )
