import httpx
import math
from datetime import datetime
import asyncio
from typing import Dict, Any, List

API_KEY = "7feb024671974a59ba4172217261601"

# Coordinates (Hardcoded for hackathon stability)
CITY_COORDS = {
    "Delhi": {"lat": 28.6139, "lon": 77.2090},
    "Faridabad": {"lat": 28.4089, "lon": 77.3178},
    "Ghaziabad": {"lat": 28.6692, "lon": 77.4538},
    "Gurgaon": {"lat": 28.4595, "lon": 77.0266},
    "Noida": {"lat": 28.5355, "lon": 77.3910}
}

SUPPORTED_CITIES = ['Delhi', 'Faridabad', 'Ghaziabad', 'Gurgaon', 'Noida']

async def fetch_openweather_data(city_name: str) -> Dict[str, Any]:
    """
    Fetches raw weather and pollution data for a city.
    Returns a combined dictionary.
    """
    # Normalize city name
    city_key = city_name.capitalize()
    if city_key not in CITY_COORDS:
        raise ValueError(f"City {city_key} not supported. Must be one of {CITY_COORDS.keys()}")
    
    coords = CITY_COORDS[city_key]
    lat, lon = coords["lat"], coords["lon"]
    
    async with httpx.AsyncClient() as client:
        # 1. Current Weather
        weather_url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric"
        # 2. Air Pollution
        pollution_url = f"http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={API_KEY}"
        
        responses = await asyncio.gather(
            client.get(weather_url),
            client.get(pollution_url)
        )
        
        weather_res = responses[0]
        pollution_res = responses[1]
        
        if weather_res.status_code != 200 or pollution_res.status_code != 200:
            raise Exception(f"OpenWeather API Error: {weather_res.status_code} / {pollution_res.status_code}")
            
        return {
            "weather": weather_res.json(),
            "pollution": pollution_res.json(),
            "city_name": city_key
        }

def transform_to_features(raw_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Transforms raw API response into the exact 24-feature vector requested.
    """
    w = raw_data["weather"]
    p = raw_data["pollution"]["list"][0] # Current pollution
    city = raw_data["city_name"]
    
    # Timestamp parsing
    dt = datetime.now() # Use server time effectively as 'current' for inference context
    
    # 1. Weather Features
    wind_speed = w.get("wind", {}).get("speed", 0)
    temp = w.get("main", {}).get("temp", 0)
    humidity = w.get("main", {}).get("humidity", 0)
    # Rainfall: 'rain' might be {'1h': 0.5} or missing
    rainfall = w.get("rain", {}).get("1h", 0)
    
    # 2. Location
    lat = w["coord"]["lat"]
    lon = w["coord"]["lon"]
    
    # 3. Pollution components
    components = p["components"]
    co = components.get("co", 0)
    no2 = components.get("no2", 0)
    pm10 = components.get("pm10", 0)
    pm25 = components.get("pm2_5", 0)
    so2 = components.get("so2", 0)
    aqi = p["main"]["aqi"] # OWM AQI is 1-5, but model might want raw. User listed 'aqi'.
    
    # 4. Temporal Features
    year = dt.year
    day_of_week = dt.weekday() # 0=Monday, 6=Sunday
    is_weekend = 1 if day_of_week >= 5 else 0
    
    # 5. Cyclical Time Embeddings
    hour = dt.hour
    month = dt.month
    
    hour_sin = math.sin(2 * math.pi * hour / 24)
    hour_cos = math.cos(2 * math.pi * hour / 24)
    month_sin = math.sin(2 * math.pi * month / 12)
    month_cos = math.cos(2 * math.pi * month / 12)
    
    # 6. One-Hot Encoding for Cities
    # Keys: 'Delhi', 'Faridabad', 'Ghaziabad', 'Gurgaon', 'Noida'
    city_features = {c: (1 if c == city else 0) for c in SUPPORTED_CITIES}
    
    # Construct final vector dict
    feature_vector = {
        'Wind speed': wind_speed,
        'temperature': temp,
        'humidity': humidity,
        'rainfall': rainfall,
        'location_lat': lat,
        'location_lon': lon,
        'co': co,
        'no2': no2,
        'pm10': pm10,
        'pm25': pm25,
        'so2': so2,
        'aqi': aqi,
        'year': year,
        'day_of_week': day_of_week,
        'is_weekend': is_weekend,
        'hour_sin': hour_sin,
        'hour_cos': hour_cos,
        'month_sin': month_sin,
        'month_cos': month_cos,
        **city_features
    }
    
    return feature_vector
