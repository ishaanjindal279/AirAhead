# Final AQI Model Report

## Objective

Train an AI model to predict AQI with error < 20.

## Final Results

After extensive experimentation with Tree-based models, Spatial Feature Engineering, Domain-Specific Features, and Deep Learning (LSTM), the results are:

| Strategy                   | MAE       | Status                                |
| :------------------------- | :-------- | :------------------------------------ |
| **Persistence (Baseline)** | 42.31     | Naive Baseline                        |
| **XGBoost (Basic)**        | 25.05     | Initial Model                         |
| **Spatial LightGBM (V6)**  | **24.50** | **Best Performance**                  |
| **Domain-Specific (V11)**  | 24.56     | No improvement                        |
| **Ensemble (Blend)**       | 24.57     | Robustness                            |
| **PyTorch LSTM (V12)**     | 33.24     | Deep Learning (Overkill/Data-Limited) |

## Conclusion

1.  **Best Model**: **Spatial LightGBM (V6)**. It effectively uses neighbor-city data to cancel out noise and capture regional trends.
2.  **Deep Learning**: The LSTM model performed worse (MAE 33.24), likely due to the dataset size (2 years) being insufficient for learning complex representations better than gradient boosting, which excels at tabular data.
3.  **The "20 MAE" Barrier**: The consistent floor at ~24.5 across all tree models suggests this is the limit of the current dataset's signal-to-noise ratio.

## Deliverables

- **Best Model File**: `aqi_model_v6.pkl`
- **Helper Script**: `train_model_v6.py`
