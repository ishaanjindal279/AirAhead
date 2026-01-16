import { 
  ForecastResponse, 
  SimulationRequest, 
  SimulationResponse, 
  PersonaAdviceResponse, 
  PersonaType, 
  Horizon,
  AlertsResponse,
  HotspotsResponse,
  TrafficResponse,
  PurifierControlRequest,
  PurifierControlResponse
} from "../types";

const BASE_URL = "http://localhost:8000";

export const apiClient = {
  getForecast: async (city: string = "delhi", h: number = 24): Promise<ForecastResponse> => {
    const response = await fetch(`${BASE_URL}/forecast?city=${city}&h=${h}`);
    if (!response.ok) throw new Error("Failed to fetch forecast");
    return response.json();
  },

  simulate: async (payload: SimulationRequest): Promise<SimulationResponse> => {
    const response = await fetch(`${BASE_URL}/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Failed to run simulation");
    return response.json();
  },

  getPersonaAdvice: async (type: PersonaType, h: number = 24): Promise<PersonaAdviceResponse> => {
    const response = await fetch(`${BASE_URL}/persona?type=${type}&h=${h}`);
    if (!response.ok) throw new Error("Failed to fetch persona advice");
    return response.json();
  },

  getAlerts: async (): Promise<AlertsResponse> => {
    const response = await fetch(`${BASE_URL}/alerts`);
    if (!response.ok) throw new Error("Failed to fetch alerts");
    return response.json();
  },

  getHotspots: async (): Promise<HotspotsResponse> => {
    const response = await fetch(`${BASE_URL}/hotspots`);
    if (!response.ok) throw new Error("Failed to fetch hotspots");
    return response.json();
  },

  getTraffic: async (): Promise<TrafficResponse> => {
    const response = await fetch(`${BASE_URL}/traffic`);
    if (!response.ok) throw new Error("Failed to fetch traffic");
    return response.json();
  },
  
  controlPurifier: async (payload: PurifierControlRequest): Promise<PurifierControlResponse> => {
    const response = await fetch(`${BASE_URL}/purifier-control`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Failed to control purifier");
    return response.json();
  },
};
