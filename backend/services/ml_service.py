
import joblib
import pandas as pd
import numpy as np
import os
import math
from typing import Dict, Any

# Path to the model (in root directory)
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "aqi_model_v6.pkl")

print(f"Loading ML Model from: {MODEL_PATH}")
try:
    model = joblib.load(MODEL_PATH)
    print("AQI Model V6 Loaded Successfully.")
except Exception as e:
    print(f"FAILED to load ML Model: {e}")
    model = None

def calculate_spatial_features(target_city: str, ncr_data: Dict[str, Dict[str, Any]]) -> Dict[str, float]:
    """
    Calculates peer metrics (mean AQI of other cities).
    """
    peer_aqis = []
    
    for city, data in ncr_data.items():
        if city == target_city:
            continue
        peer_aqis.append(data.get('aqi', 0))
        
    if not peer_aqis:
        # Fallback if no peers (shouldn't happen if get_ncr_data works)
        # Use target's own AQI to avoid 0
        return {'peer_aqi': ncr_data.get(target_city, {}).get('aqi', 0)}
        
    peer_mean = sum(peer_aqis) / len(peer_aqis)
    return {'peer_aqi': peer_mean}

def predict_aqi(target_city: str, ncr_data: Dict[str, Dict[str, Any]]) -> float:
    """
    Predicts AQI for the target city using the ML model.
    Constructs the feature vector dynamically from live mock/API data.
    """
    if model is None:
        print("Model not loaded, returning naive projection.")
        return ncr_data.get(target_city, {}).get('aqi', 0)
    
    # Get Target City Data
    # Handle "New Delhi" mapping if needed, but weather_service handles it.
    # We expect keys 'Delhi', 'Noida' etc.
    if target_city not in ncr_data:
         # Try capitalization fix
         target_city = target_city.capitalize()
         if target_city not in ncr_data:
             print(f"City {target_city} not found in NCR data.")
             return 0
             
    feats = ncr_data[target_city]
    
    # Get Spatial Features
    spatial = calculate_spatial_features(target_city, ncr_data)
    
    # Construct DataFrame for Model
    # Model expects specific columns in specific order (or name-based if LGBM handles it).
    # We will construct a dict with ALL trained features.
    
    # Persistence Assumptions for Lagged Features (Since we lack history DB)
    curr_aqi = feats.get('aqi', 0)
    curr_co = feats.get('co', 0)
    curr_no2 = feats.get('no2', 0)
    curr_so2 = feats.get('so2', 0)
    peer_aqi = spatial['peer_aqi']
    
    input_data = {
        # Base Features
        'location_lat': feats.get('location_lat', 0),
        'location_lon': feats.get('location_lon', 0),
        'co': curr_co,
        'no2': curr_no2,
        'so2': curr_so2,
        'aqi': curr_aqi,
        'temp': feats.get('temperature', 0),
        'humidity': feats.get('humidity', 0),
        'precip': feats.get('rainfall', 0),
        'windspeed': feats.get('Wind speed', 0),
        
        # Time
        'year': feats.get('year', 2024),
        'day_of_week': feats.get('day_of_week', 0),
        'is_weekend': feats.get('is_weekend', 0),
        'hour_sin': feats.get('hour_sin', 0),
        'hour_cos': feats.get('hour_cos', 0),
        'month_sin': feats.get('month_sin', 0),
        'month_cos': feats.get('month_cos', 0),
        
        # One-Hot Cities
        'Delhi': feats.get('Delhi', 0),
        'Faridabad': feats.get('Faridabad', 0),
        'Ghaziabad': feats.get('Ghaziabad', 0),
        'Gurgaon': feats.get('Gurgaon', 0),
        'Noida': feats.get('Noida', 0),
        
        # --- Synthesized Lags (Persistence) ---
        'aqi_lag_1': curr_aqi,
        'aqi_lag_2': curr_aqi,
        'aqi_lag_24': curr_aqi,
        'aqi_roll_6h': curr_aqi,
        'aqi_roll_24h': curr_aqi,
        
        'co_lag_1': curr_co,
        'co_lag_2': curr_co,
        'co_lag_24': curr_co,
        'co_roll_24h': curr_co,
        
        'no2_lag_1': curr_no2,
        'no2_lag_24': curr_no2,
        'no2_roll_24h': curr_no2,
        
        'so2_lag_1': curr_so2,
        'so2_lag_2': curr_so2,
        'so2_lag_3': curr_so2,
        'so2_lag_24': curr_so2,
        
        # --- Spatial Features ---
        'peer_aqi': peer_aqi,
        'peer_aqi_lag_1': peer_aqi, # Persistence
        'peer_aqi_lag_2': peer_aqi, 
        'peer_aqi_roll_6h': peer_aqi,
        
        'diff_self_peer_aqi': curr_aqi - peer_aqi, # Using Lag 1 in model but approx with current
        'diff_self_peer_roll': curr_aqi - peer_aqi,
        'peer_trend': 0, # Assuming steady state
        'ratio_co_peer': curr_co / (peer_aqi + 1),
        
        # --- Interactions ---
        'hour_ang': np.arctan2(feats.get('hour_sin', 0), feats.get('hour_cos', 0))
    }
    
    # Create DF
    df = pd.DataFrame([input_data])
    
    # Predict
    try:
        pred = model.predict(df)[0]
        return float(pred)
    except Exception as e:
        print(f"Prediction Error: {e}")
        # Print missing cols if any
        # print(f"Cols: {df.columns}")
        return curr_aqi
