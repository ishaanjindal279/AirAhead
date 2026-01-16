import { useEffect, useState } from 'react';
import { Navigation, Loader2 } from 'lucide-react';
import { apiClient } from '../api/client';
import { HotspotItem } from '../types';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Component to handle map center updates
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 11);
  }, [center, map]);
  return null;
}

export function AQIMap() {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState<[number, number]>([28.6139, 77.2090]); // Delhi Center

  const getColorHex = (aqi: number) => {
    if (aqi <= 50) return '#22c55e'; // green-500
    if (aqi <= 100) return '#14b8a6'; // teal-500
    if (aqi <= 200) return '#eab308'; // yellow-500
    if (aqi <= 300) return '#f97316'; // orange-500
    if (aqi <= 400) return '#ef4444'; // red-500
    return '#581c87'; // purple-900
  };

  useEffect(() => {
    const fetchHotspots = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getHotspots();
        
        // Map realistic coordinates for demo purposes if backend sends generic ones
        // In a real app, backend would send real coordinates
        const realCoords = [
          { lat: 28.6508, lng: 77.3152 }, // Anand Vihar
          { lat: 28.6295, lng: 77.2177 }, // Connaught Place
          { lat: 28.5728, lng: 77.0673 }, // Dwarka
          { lat: 28.7186, lng: 77.0988 }, // Rohini
          { lat: 28.5325, lng: 77.2750 }, // Okhla
        ];

        const locationsList = ["Anand Vihar", "Connaught Place", "Dwarka Sector 8", "Rohini", "Okhla Phase 2"];

        if (data && data.hotspots) {
          const mapped = data.hotspots.slice(0, 5).map((h: HotspotItem, i: number) => ({
              name: locationsList[i] || h.zoneId,
              aqi: h.expectedMaxAQI,
              lat: realCoords[i]?.lat || h.center.lat,
              lng: realCoords[i]?.lng || h.center.lng,
              color: getColorHex(h.expectedMaxAQI)
          }));
          setLocations(mapped);
        }
      } catch (e) {
        console.error("Failed to load map data", e);
      } finally {
        setLoading(false);
      }
    };
    fetchHotspots();
  }, []);

  const handleRecenter = () => {
    setCenter([28.6139, 77.2090]);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Hotspots - Delhi NCR</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Real-time severe pollution zones</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={handleRecenter}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors text-sm font-medium"
            >
            <Navigation className="w-4 h-4" />
            <span>Recenter</span>
            </button>
        </div>
      </div>

      <div className="relative h-[400px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 z-0">
         {loading && (
             <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50 dark:bg-black/50 backdrop-blur-sm">
                 <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
             </div>
         )}
         
         <MapContainer 
            center={[28.6139, 77.2090]} 
            zoom={11} 
            scrollWheelZoom={false} 
            style={{ height: '100%', width: '100%' }}
         >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater center={center} />

            {locations.map((loc, idx) => (
                <CircleMarker 
                    key={idx}
                    center={[loc.lat, loc.lng]}
                    radius={12}
                    pathOptions={{ 
                        color: 'white', 
                        fillColor: loc.color, 
                        fillOpacity: 0.8, 
                        weight: 2 
                    }}
                >
                    <Popup>
                        <div className="text-center">
                            <h3 className="font-bold text-gray-900">{loc.name}</h3>
                            <div className="text-sm font-medium" style={{ color: loc.color }}>
                                AQI: {loc.aqi}
                            </div>
                        </div>
                    </Popup>
                </CircleMarker>
            ))}
         </MapContainer>
      </div>
      
      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full ring-2 ring-green-100 dark:ring-green-900"></div>
          <span className="text-gray-600 dark:text-gray-400">Good</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-teal-500 rounded-full ring-2 ring-teal-100 dark:ring-teal-900"></div>
          <span className="text-gray-600 dark:text-gray-400">Satisfactory</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full ring-2 ring-yellow-100 dark:ring-yellow-900"></div>
          <span className="text-gray-600 dark:text-gray-400">Moderate</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full ring-2 ring-orange-100 dark:ring-orange-900"></div>
          <span className="text-gray-600 dark:text-gray-400">Poor</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full ring-2 ring-red-100 dark:ring-red-900"></div>
          <span className="text-gray-600 dark:text-gray-400">Severe</span>
        </div>
      </div>
    </div>
  );
}