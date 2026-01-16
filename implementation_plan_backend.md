# Backend Model Integration Plan

## Goal

Connect the trained `aqi_model_v6.pkl` to the FastAPI backend to serve live predictions to the frontend.

## 1. New Service: `backend/services/ml_service.py`

This service will handle model loading and inference-time feature engineering.

- **Load Model**: on module import using `joblib`.
- **Feature Engineering (Inference Mode)**:
  - Since we don't have a history DB, we approximate:
    - `aqi_lag_1`, `aqi_lag_2` ≈ `current_aqi`
    - `aqi_roll_6h` ≈ `current_aqi`
    - `peer_aqi` = Average of _current_ AQI of other NCR cities.
    - `peer_aqi_lag_1` ≈ `peer_aqi`
  - **Calculated Features**:
    - `diff_self_peer_aqi` = `aqi` - `peer_aqi`
    - `ratio_co_peer` = `co` / `peer_aqi`
    - `hour_ang`, `month_sin`, `month_cos` (from current time).
- **Prediction**:
  - Returns `predicted_aqi` for T+0.
  - We will project this for T+1...T+H using a diurnal curve.

## 2. Update `backend/services/weather_service.py`

- **New Function**: `get_ncr_data()`
  - Fetches data for ALL 5 cities (Delhi, Noida, Gurgaon, Faridabad, Ghaziabad) concurrently (`asyncio.gather`).
  - Needed to calculate `peer_aqi`.

## 3. Update `backend/app_main.py`

- **Endpoint**: `/forecast`
  - **Old**: Naive projection.
  - **New**:
    1. Call `weather_service.get_ncr_data()`.
    2. Identify target city data and "peer" data.
    3. Call `ml_service.predict(target_data, peer_data)`.
    4. Generate forecast series starting from the ML prediction.

## Verification

- **Test**: `curl http://localhost:8000/forecast?city=Delhi`
- **Verify**: Output `aqi` should roughly match the live AQI but adjusted by the ML model (e.g., if model thinks it should be higher due to neighbors).
- **Logs**: Check console for "Model loaded" and "Prediction: X".
