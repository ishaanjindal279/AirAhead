from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field, validator
from datetime import datetime

# --- Shared Enums ---
class RiskCategory(str, Enum):
    good = "good"
    satisfactory = "satisfactory"
    moderate = "moderate"
    poor = "poor"
    very_poor = "very_poor"
    severe = "severe"

class PersonaType(str, Enum):
    jogger = "jogger"
    asthmatic = "asthmatic"
    child = "child"
    elderly = "elderly"

# --- Base Models ---
class ForecastPoint(BaseModel):
    timestamp: datetime = Field(..., description="ISO8601 timestamp")
    aqi: int = Field(..., description="Numeric AQI value")
    category: RiskCategory

class Horizon(int, Enum):
    h6 = 6
    h24 = 24
    h72 = 72

# --- Endpoint 1: Forecast ---
class ForecastResponse(BaseModel):
    city: str
    horizon: int
    series: List[ForecastPoint]
    currentRisk: RiskCategory

# --- Endpoint 2: Simulation ---
class SimulationModifiers(BaseModel):
    traffic: Optional[float] = Field(None, ge=0, le=5, description="Traffic multiplier, 1.0 is normal")
    temperature: Optional[float] = Field(None, ge=-50, le=50, description="Temperature delta in Celsius")
    festival: Optional[bool] = Field(None, description="Is festival active?")

class SimulationRequest(BaseModel):
    modifiers: SimulationModifiers

class RiskShiftResponse(BaseModel):
    from_category: RiskCategory = Field(..., alias="from")
    to_category: RiskCategory = Field(..., alias="to")

class SimulationResponse(BaseModel):
    baseline: List[ForecastPoint]
    simulated: List[ForecastPoint]
    riskShift: RiskShiftResponse

# --- Endpoint 3: Persona Advice ---
class AdviceItem(BaseModel):
    timestamp: datetime
    message: str
    severity: int = Field(..., ge=1, le=10)

class PersonaAdviceResponse(BaseModel):
    persona: PersonaType
    adviceTimeline: List[AdviceItem]
    contextualMessage: str
