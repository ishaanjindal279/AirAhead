
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
from lightgbm import LGBMRegressor
import joblib
import warnings

warnings.filterwarnings('ignore')

def train():
    print("Loading data...")
    df = pd.read_csv('final3.csv')
    df = df.loc[:, ~df.columns.str.contains('^Unnamed')]
    
    # Time Key
    df['time_key'] = (
        df['year'].astype(str) + '_' + 
        df['month_sin'].round(4).astype(str) + '_' + 
        df['month_cos'].round(4).astype(str) + '_' + 
        df['hour_sin'].round(4).astype(str) + '_' + 
        df['hour_cos'].round(4).astype(str) + '_' +
        df['day_of_week'].astype(str)
    )
    
    print("Generating spatial features...")
    # Pivot for multiple columns
    cols_to_pivot = ['aqi', 'aqi_lag_1', 'aqi_lag_2', 'aqi_roll_6h']
    
    spatial_df = df[['time_key', 'city'] + cols_to_pivot].copy()
    
    # Merge helper
    # We want to add columns: peer_mean_aqi, peer_mean_lag1, etc.
    # Approach: Calculate sum and count per time_key, then subtract self
    
    # Group by TimeKey
    grp = spatial_df.groupby('time_key')
    
    # Calculate sums and counts for all pivot cols
    sums = grp[cols_to_pivot].sum().add_suffix('_sum')
    counts = grp[cols_to_pivot].count().add_suffix('_count')
    
    # Merge Stats back to df
    df = df.merge(sums, on='time_key', how='left')
    df = df.merge(counts, on='time_key', how='left')
    
    # Calculate Leave-One-Out Mean for each col
    for col in cols_to_pivot:
        sum_col = f'{col}_sum'
        count_col = f'{col}_count'
        # peer_mean = (Sum - Self) / (Count - 1)
        # Handle count=1 (div/0) -> Use Self or NaN. Using Self might leak? No, assumes stability.
        # If count=1, peer_mean is undef.
        
        numerator = df[sum_col] - df[col]
        denominator = df[count_col] - 1
        
        df[f'peer_{col}'] = numerator / denominator.replace(0, np.nan)
        
        # Fill NaNs where peers are missing (single city data)?
        # If no peers, use self value (persistence assumption) or global mean
        df[f'peer_{col}'] = df[f'peer_{col}'].fillna(df[col])
        
    # --- Advanced Features ---
    print("Engineering interactions...")
    
    # 1. Self vs Peer Deltas
    # "Is my city cleaner than neighbors right now?" - using lag1 to avoid current leakage if desired, 
    # but we are using 'peer_aqi' (current) as a PRIMARY predictor.
    df['diff_self_peer_aqi'] = df['aqi_lag_1'] - df['peer_aqi_lag_1']
    df['diff_self_peer_roll'] = df['aqi_roll_6h'] - df['peer_aqi_roll_6h']
    
    # 2. Peer Momentum
    df['peer_trend'] = df['peer_aqi'] - df['peer_aqi_lag_1'] # Trend of neighbors
    
    # 3. Ratios
    df['ratio_co_peer'] = df['co'] / (df['peer_aqi'] + 1)
    
    # 4. Cyclical Time
    df['hour_ang'] = np.arctan2(df['hour_sin'], df['hour_cos'])
    
    # Clean up
    target = 'aqi'
    drop_cols = [c for c in df.columns if '_sum' in c or '_count' in c or c == 'time_key' or c == 'city']
    df = df.drop(columns=drop_cols)
    df = df.dropna()
    
    X = df.drop(columns=[target])
    y = df[target]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.15, random_state=42)
    
    print(f"Training on {X_train.shape[0]} samples with {X_train.shape[1]} features...")
    
    # LGBM with high capacity
    model = LGBMRegressor(
        n_estimators=5000,
        learning_rate=0.01,
        num_leaves=128,
        colsample_bytree=0.8,
        subsample=0.8,
        objective='mae',
        n_jobs=-1,
        random_state=42,
        importance_type='gain'
    )
    
    model.fit(
        X_train, y_train,
        eval_set=[(X_test, y_test)],
        eval_metric='mae',
        callbacks=[]
    )
    
    preds = model.predict(X_test)
    mae = mean_absolute_error(y_test, preds)
    
    print(f"\nFINAL MAE (V6): {mae:.4f}")
    
    # Feature Importance
    imp = pd.DataFrame({
        'feature': X.columns,
        'gain': model.feature_importances_
    }).sort_values('gain', ascending=False).head(10)
    print("\nTop Features:")
    print(imp)
    
    joblib.dump(model, 'aqi_model_v6.pkl')

if __name__ == "__main__":
    train()
