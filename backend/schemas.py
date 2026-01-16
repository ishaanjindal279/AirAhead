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

# --- New schemas for expanded API ---
class AQIBreakdown(BaseModel):
    pm2_5: Optional[float] = None
    pm10: Optional[float] = None
    no2: Optional[float] = None
    o3: Optional[float] = None

class ConfidenceInterval(BaseModel):
    lower: float
    upper: float

class PredictPoint(BaseModel):
    timestamp: datetime
    aqi: int
    aqiCategory: RiskCategory
    aqiBreakdown: AQIBreakdown
    confidence: ConfidenceInterval
    recommendationScore: float = Field(..., ge=0.0, le=1.0)

class RequestPeriod(BaseModel):
    from_ts: datetime = Field(..., alias="from")
    to_ts: datetime = Field(..., alias="to")

class PredictResponse(BaseModel):
    zoneId: str
    requestPeriod: RequestPeriod
    predictions: List[PredictPoint]
    model: dict
    cache: dict
    uiHints: Optional[dict]

class Center(BaseModel):
    lat: float
    lng: float

class Severity(BaseModel):
    level: str
    score: float

class HotspotItem(BaseModel):
    zoneId: str
    center: Center
    expectedMaxAQI: int
    expectedTime: datetime
    drivers: List[str]
    severity: Severity
    recommendedAction: List[str]
    uiHint: Optional[dict]

class HotspotsResponse(BaseModel):
    generatedAt: datetime
    hotspots: List[HotspotItem]
    meta: dict

class RouteSegment(BaseModel):
    from_lat: float = Field(..., alias="from_lat")
    from_lng: float = Field(..., alias="from_lng")
    to_lat: float = Field(..., alias="to_lat")
    to_lng: float = Field(..., alias="to_lng")
    congestion: str
    estimatedTimeMin: int

class RouteInfo(BaseModel):
    estimatedTimeMin: int
    distanceMeters: int
    congestionScore: float
    segments: List[dict]

class RerouteSuggestion(BaseModel):
    routeId: str
    etaChangeMin: int
    description: str
    confidence: float
    uiHint: Optional[dict]

class RelatedAQI(BaseModel):
    zoneId: str
    aqiNow: int
    aqiForecastMax: int

class TrafficResponse(BaseModel):
    asOf: datetime
    route: dict
    rerouteSuggestions: List[RerouteSuggestion]
    relatedAQI: RelatedAQI

class AlertAction(BaseModel):
    type: str
    payload: Optional[dict]

class AlertItem(BaseModel):
    id: str
    type: str
    title: str
    message: str
    severity: str
    zones: List[str]
    validFrom: datetime
    validUntil: datetime
    confidence: float
    actions: List[AlertAction]
    personaSpecific: Optional[dict]
    ui: Optional[dict]

class AlertsResponse(BaseModel):
    generatedAt: datetime
    alerts: List[AlertItem]

class PurifierCommand(BaseModel):
    command: str
    level: Optional[int]

class PurifierControlRequest(BaseModel):
    deviceId: str
    zoneId: str
    command: str
    level: Optional[int] = None
    schedule: Optional[dict] = None
    reason: Optional[str] = None
    sim: Optional[dict] = None

class PurifierControlResponse(BaseModel):
    status: str
    deviceId: str
    appliedCommand: dict
    recommendation: Optional[dict]
    modelReasoning: Optional[dict]
