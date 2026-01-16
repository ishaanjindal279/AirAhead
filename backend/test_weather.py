import asyncio
import json
from services.weather_service import get_live_features

async def main():
    try:
        print("Fetching live data for Delhi from WeatherAPI...")
        features = await get_live_features("Delhi")
        
        print("\n--- Feature Vector (24-dim) ---")
        print(json.dumps(features, indent=2))
        
        # Validation
        required_keys = ['Wind speed', 'temperature', 'aqi', 'hour_sin', 'Delhi', 'pm25']
        missing = [k for k in required_keys if k not in features]
        
        if missing:
            print(f"FAILED. Missing keys: {missing}")
        else:
            print("\nSUCCESS. All critical keys present.")
            print(f"PM2.5: {features['pm25']}")
            print(f"IND-AQI: {features['aqi']} (Expected > 10 usually)")

    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"ERROR: {repr(e)}")

if __name__ == "__main__":
    asyncio.run(main())
