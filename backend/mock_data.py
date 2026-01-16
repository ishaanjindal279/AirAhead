from datetime import datetime, timedelta, timezone
from typing import List
from schemas import (
    ForecastPoint, RiskCategory, ForecastResponse, 
    SimulationResponse, RiskShiftResponse,
    PersonaAdviceResponse, AdviceItem, PersonaType
)
import random

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
