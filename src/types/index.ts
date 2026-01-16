export enum RiskCategory {
  good = "good",
  satisfactory = "satisfactory",
  moderate = "moderate",
  poor = "poor",
  very_poor = "very_poor",
  severe = "severe",
}

export enum PersonaType {
  jogger = "jogger",
  asthmatic = "asthmatic",
  child = "child",
  elderly = "elderly",
}

export enum Horizon {
  h6 = 6,
  h24 = 24,
  h72 = 72,
}

export interface ForecastPoint {
  timestamp: string; // ISO8601
  aqi: number;
  category: RiskCategory;
  pm2_5?: number;
  pm10?: number;
  o3?: number;
}

export interface CurrentWeather {
  temp_c: number;
  humidity: number;
  wind_kph: number;
  uv: number;
  pm2_5: number;
  pm10: number;
  no2?: number;
  o3?: number;
}

export interface ForecastResponse {
  city: string;
  horizon: number;
  series: ForecastPoint[];
  currentRisk: RiskCategory;
  currentWeather?: CurrentWeather;
}

export interface SimulationModifiers {
  traffic?: number;
  temperature?: number;
  festival?: boolean;
}

export interface SimulationRequest {
  modifiers: SimulationModifiers;
}

export interface RiskShiftResponse {
  from: RiskCategory;
  to: RiskCategory;
}

export interface SimulationResponse {
  baseline: ForecastPoint[];
  simulated: ForecastPoint[];
  riskShift: RiskShiftResponse;
}

export interface AdviceItem {
  timestamp: string;
  message: string;
  severity: number;
}

export interface PersonaAdviceResponse {
  persona: PersonaType;
  adviceTimeline: AdviceItem[];
  contextualMessage: string;
}

// --- New Types Sync ---

export interface AQIBreakdown {
  pm2_5?: number;
  pm10?: number;
  no2?: number;
  o3?: number;
}

export interface ConfidenceInterval {
  lower: number;
  upper: number;
}

export interface PredictPoint {
  timestamp: string;
  aqi: number;
  aqiCategory: RiskCategory;
  aqiBreakdown: AQIBreakdown;
  confidence: ConfidenceInterval;
  recommendationScore: number;
}

export interface RequestPeriod {
  from: string;
  to: string;
}

export interface PredictResponse {
  zoneId: string;
  requestPeriod: RequestPeriod;
  predictions: PredictPoint[];
  model: Record<string, any>;
  cache: Record<string, any>;
  uiHints?: Record<string, any>;
}

export interface Center {
  lat: number;
  lng: number;
}

export interface Severity {
  level: string;
  score: number;
}

export interface HotspotItem {
  zoneId: string;
  center: Center;
  expectedMaxAQI: number;
  expectedTime: string;
  drivers: string[];
  severity: Severity;
  recommendedAction: string[];
  uiHint?: Record<string, any>;
}

export interface HotspotsResponse {
  generatedAt: string;
  hotspots: HotspotItem[];
  meta: Record<string, any>;
}

export interface RerouteSuggestion {
  routeId: string;
  etaChangeMin: number;
  description: string;
  confidence: number;
  uiHint?: Record<string, any>;
}

export interface RelatedAQI {
  zoneId: string;
  aqiNow: number;
  aqiForecastMax: number;
}

export interface TrafficResponse {
  asOf: string;
  route: Record<string, any>;
  rerouteSuggestions: RerouteSuggestion[];
  relatedAQI: RelatedAQI;
}

export interface AlertAction {
  type: string;
  payload?: Record<string, any>;
}

export interface AlertItem {
  id: string;
  type: string;
  title: string;
  message: string;
  severity: string;
  zones: string[];
  validFrom: string;
  validUntil: string;
  confidence: number;
  actions: AlertAction[];
  personaSpecific?: Record<string, any>;
  ui?: Record<string, any>;
}

export interface AlertsResponse {
  generatedAt: string;
  alerts: AlertItem[];
}

export interface PurifierControlRequest {
  deviceId: string;
  zoneId: string;
  command: string;
  level?: number;
  schedule?: Record<string, any>;
  reason?: string;
  sim?: Record<string, any>;
}

export interface PurifierControlResponse {
  status: string;
  deviceId: string;
  appliedCommand: Record<string, any>;
  recommendation?: Record<string, any>;
  modelReasoning?: Record<string, any>;
}
