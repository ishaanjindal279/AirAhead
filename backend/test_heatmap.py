
import asyncio
import math

async def get_heatmap_grid():
    print("Starting Grid Generation...")
    stations = [
        {"lat": 28.6139, "lng": 77.2090, "aqi": 340},
        {"lat": 28.5355, "lng": 77.3910, "aqi": 310},
        {"lat": 28.4595, "lng": 77.0266, "aqi": 290},
        {"lat": 28.4089, "lng": 77.3178, "aqi": 280},
        {"lat": 28.6692, "lng": 77.4538, "aqi": 360},
    ]

    lat_min, lat_max = 28.40, 28.88
    lng_min, lng_max = 76.85, 77.55
    n_lat = 12
    n_lng = 18
    
    lat_step = (lat_max - lat_min) / n_lat
    lng_step = (lng_max - lng_min) / n_lng

    grid = []
    
    for i in range(n_lat + 1):
        lat = lat_min + i * lat_step
        for j in range(n_lng + 1):
            lng = lng_min + j * lng_step
            
            numerator = 0
            denominator = 0
            p = 2 

            for s in stations:
                dist = math.sqrt((lat - s["lat"])**2 + (lng - s["lng"])**2)
                if dist == 0:
                    weight = 1e9 
                else:
                    weight = 1 / (dist ** p)
                
                numerator += weight * s["aqi"]
                denominator += weight
            
            interpolated_aqi = int(numerator / denominator) if denominator > 0 else 0
            grid.append({
                "lat": lat, "lng": lng, "aqi": interpolated_aqi
            })

    print(f"Generated {len(grid)} points.")
    return grid

if __name__ == "__main__":
    loop = asyncio.new_event_loop()
    loop.run_until_complete(get_heatmap_grid())
