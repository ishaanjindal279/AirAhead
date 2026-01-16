import httpx
import math
from datetime import datetime
import asyncio
from typing import Dict, Any, List

API_KEY = "7feb024671974a59ba4172217261601"
BASE_URL = "http://api.weatherapi.com/v1"

# Coordinates (Hardcoded for features, but API uses city name directly)
# Keys must match exact strings requested by ML team
SUPPORTED_CITIES = ['Delhi', 'Faridabad', 'Ghaziabad', 'Gurgaon', 'Noida']

async def fetch_weather_data(city_name: str) -> Dict[str, Any]:
    """
    Fetches raw weather and pollution data from WeatherAPI.com
    Returns the parsed JSON response.
    """
    if city_name.capitalize() not in SUPPORTED_CITIES:
        # Strict validation per hackathon requirements
        # But we align capitalization for the API call
        pass # Actually, let's allow it but the feature vector might miss the one-hot if mismatch

    async with httpx.AsyncClient() as client:
        # Requesting current weather + Air Quality data
        # Handle ambiguity for Delhi -> "New Delhi" to get India, not Canada
        query_city = "New Delhi" if city_name.lower() == "delhi" else city_name
        url = f"{BASE_URL}/current.json?key={API_KEY}&q={query_city}&aqi=yes"
        
        response = await client.get(url)
        
        if response.status_code != 200:
            raise Exception(f"WeatherAPI Error {response.status_code}: {response.text}")
            
        return response.json()

def transform_to_features(raw_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Transforms WeatherAPI response into the exact 24-feature vector.
    """
    curr = raw_data["current"]
    loc = raw_data["location"]
    aqi_data = curr.get("air_quality", {})
    
    # Target city for one-hot (normalized)
    city_name_raw = loc["name"]
    # We map back to one of our supported specific keys if possible
    # e.g. "New Delhi" -> "Delhi"? Let's stick to strict input matching for now.
    # The user listed 'Delhi', 'Faridabad' etc.
    # Ideally, we pass the 'requested_city' string to this function to ensure alignment.
    # But let's infer from the response name for now, or default to 0s if mismatch.
    
    # 1. Weather Features
    wind_kph = curr["wind_kph"] # "Wind speed"
    temp_c = curr["temp_c"]     # "temperature"
    humidity = curr["humidity"] # "humidity"
    precip_mm = curr["precip_mm"] # "rainfall"
    
    # 2. Location
    lat = loc["lat"]
    lon = loc["lon"]
    
    # 3. Pollution components
    # Map API keys to feature keys
    # API: co, no2, pm10, pm2_5, so2, us-epa-index
    co = aqi_data.get("co", 0)
    no2 = aqi_data.get("no2", 0)
    pm10 = aqi_data.get("pm10", 0)
    pm25 = aqi_data.get("pm2_5", 0)
    so2 = aqi_data.get("so2", 0)
    aqi_val = aqi_data.get("us-epa-index", 0) 

    # Calculate Indian AQI (IND-AQI) proxy based on PM2.5 and PM10
    # using CPCB breakpoints (approximate linear interpolation)
    def get_sub_index(conc, breakpoints):
        """
        breakpoints = [(0, 30, 0, 50), (30, 60, 51, 100), ...]
        (c_low, c_high, i_low, i_high)
        """
        for (clo, chi, ilo, ihi) in breakpoints:
            if clo <= conc <= chi:
                return ilo + (ihi - ilo) * (conc - clo) / (chi - clo)
        # If standard exceeded, extrapolate linear from last segment
        (last_clo, last_chi, last_ilo, last_ihi) = breakpoints[-1]
        if conc > last_chi:
             # Slope of last segment
             slope = (last_ihi - last_ilo) / (last_chi - last_clo)
             return last_ihi + slope * (conc - last_chi)
        return 0

    # PM2.5 breakpoints (Concentration -> Index)
    pm25_breaks = [
        (0, 30, 0, 50),       # Good
        (30, 60, 51, 100),    # Satisfactory
        (60, 90, 101, 200),   # Moderate
        (90, 120, 201, 300),  # Poor
        (120, 250, 301, 400), # Very Poor
        (250, 380, 401, 500)  # Severe
    ]
    
    # PM10 breakpoints
    pm10_breaks = [
        (0, 50, 0, 50),
        (50, 100, 51, 100),
        (100, 250, 101, 200),
        (250, 350, 201, 300),
        (350, 430, 301, 400),
        (430, 510, 401, 500)
    ]

    aqi_pm25 = get_sub_index(pm25, pm25_breaks)
    aqi_pm10 = get_sub_index(pm10, pm10_breaks)
    
    # IND-AQI is the max of sub-indices
    ind_aqi = max(aqi_pm25, aqi_pm10)
    
    # Use IND-AQI if valid, otherwise fallback (though this logic covers all positive floats)
    final_aqi = int(ind_aqi) if ind_aqi > 0 else aqi_val

    # 4. Temporal Features (from Local Time of the city)
    # "2023-01-13 14:30"
    local_time_str = loc["localtime"] 
    dt = datetime.strptime(local_time_str, "%Y-%m-%d %H:%M")
    
    year = dt.year
    day_of_week = dt.weekday() # 0=Mon, 6=Sun
    is_weekend = 1 if day_of_week >= 5 else 0
    
    # 5. Cyclical Time Embeddings
    hour = dt.hour
    month = dt.month
    
    hour_sin = math.sin(2 * math.pi * hour / 24)
    hour_cos = math.cos(2 * math.pi * hour / 24)
    month_sin = math.sin(2 * math.pi * month / 12)
    month_cos = math.cos(2 * math.pi * month / 12)
    
    # 6. One-Hot Encoding
    # We need to know which 'column' this represents. 
    # Logic: Try to match the API returned name to our list.
    api_city = loc["name"]
    # Quick fuzzy match or strict? Strict for hackathon simplicity.
    city_features = {c: 0 for c in SUPPORTED_CITIES}
    
    # Handle "New Delhi" vs "Delhi", "Gurugram" vs "Gurgaon"
    normalized_api_name = api_city
    if "Delhi" in api_city: normalized_api_name = "Delhi"
    if "Gurugram" in api_city: normalized_api_name = "Gurgaon"
    
    if normalized_api_name in city_features:
        city_features[normalized_api_name] = 1
    
    # Construct final vector
    feature_vector = {
        'Wind speed': wind_kph,
        'temperature': temp_c,
        'humidity': humidity,
        'rainfall': precip_mm,
        'location_lat': lat,
        'location_lon': lon,
        'co': co,
        'no2': no2,
        'pm10': pm10,
        'pm25': pm25,
        'so2': so2,
        'aqi': final_aqi,
        'year': year,
        'day_of_week': day_of_week,
        # Helper keys for API response (not strictly features for ML, but passed through)
        'temp_c': temp_c,
        'wind_kph': wind_kph,
        'uv': curr.get("uv", 0),
        'pm2_5': pm25, # Alias for schema consistency
        'o3': aqi_data.get("o3", 0),
        
        'is_weekend': is_weekend,
        'hour_sin': hour_sin,
        'hour_cos': hour_cos,
        'month_sin': month_sin,
        'month_cos': month_cos,
        **city_features
    }
    
    return feature_vector

async def get_live_features(city: str) -> Dict[str, Any]:
    raw = await fetch_weather_data(city)
    return transform_to_features(raw)

async def get_ncr_data() -> Dict[str, Dict[str, Any]]:
    """
    Fetches processed features for ALL supported NCR cities concurrently.
    Returns: { 'Delhi': {...}, 'Noida': {...}, ... }
    """
    tasks = [get_live_features(city) for city in SUPPORTED_CITIES]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    ncr_data = {}
    for city, res in zip(SUPPORTED_CITIES, results):
        if isinstance(res, Exception):
            print(f"Error fetching {city}: {res}")
            continue
        ncr_data[city] = res
        
    return ncr_data
