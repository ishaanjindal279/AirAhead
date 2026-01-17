
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Navigation } from 'lucide-react';
import { Badge } from '../ui/Badge';
import L from 'leaflet';

// Fix Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const CENTER: [number, number] = [28.6139, 77.2090];

interface Hotspot {
  lat: number;
  lng: number;
  aqi: number;
  name: string;
}

const getAQIColor = (aqi: number) => {
  if (aqi <= 100) return '#10B981';
  if (aqi <= 200) return '#FACC15';
  if (aqi <= 300) return '#F97316';
  return '#EF4444';
};

// Sample route polylines (simplified paths)
const ROUTES = [
  { name: 'Ring Road', coords: [[28.57, 77.20], [28.58, 77.22], [28.60, 77.24], [28.62, 77.25]] as [number, number][], color: '#EF4444' },
  { name: 'DND Flyway', coords: [[28.57, 77.30], [28.59, 77.32], [28.61, 77.35]] as [number, number][], color: '#10B981' },
];

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, 11);
  return null;
}

export function TrafficMap() {
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHotspots = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:8000/hotspots');
        const data = await res.json();
        
        // Get top 15 highest AQI points as hotspots
        const grid = data.grid || [];
        const sorted = [...grid].sort((a: Hotspot, b: Hotspot) => b.aqi - a.aqi);
        setHotspots(sorted.slice(0, 15));
      } catch (e) {
        console.error("Hotspot fetch failed", e);
      } finally {
        setLoading(false);
      }
    };
    fetchHotspots();
  }, []);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="w-5 h-5" />
              Live Traffic Pollution Map
            </CardTitle>
            <CardDescription>Real-time congestion hotspots in NCR</CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="destructive">High AQI</Badge>
            <Badge variant="secondary">Moderate</Badge>
          </div>
        </div>
      </CardHeader>
      
      <div className="flex-1 min-h-[500px] overflow-hidden rounded-b-xl relative z-0">
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60">
            <span className="text-sm">Loading hotspots...</span>
          </div>
        )}
        
        <MapContainer center={CENTER} zoom={11} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
          <ChangeView center={CENTER} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Route Polylines */}
          {ROUTES.map((route) => (
            <Polyline 
              key={route.name}
              positions={route.coords}
              pathOptions={{ color: route.color, weight: 4, opacity: 0.7, dashArray: '10, 5' }}
            >
              <Popup>{route.name}</Popup>
            </Polyline>
          ))}
          
          {/* Hotspot Markers */}
          {hotspots.map((spot, idx) => (
             <CircleMarker 
                key={idx} 
                center={[spot.lat, spot.lng]} 
                radius={12 + (spot.aqi > 350 ? 8 : 0)}
                pathOptions={{ 
                    color: getAQIColor(spot.aqi),
                    fillColor: getAQIColor(spot.aqi),
                    fillOpacity: 0.7,
                    weight: 2
                }}
             >
                <Popup>
                    <div className="p-2 min-w-[120px]">
                        <strong className="block text-base">{spot.name}</strong>
                        <div className="text-lg font-bold mt-1" style={{ color: getAQIColor(spot.aqi) }}>
                          AQI: {spot.aqi}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {spot.aqi > 300 ? '⚠️ Very Poor' : spot.aqi > 200 ? '⚡ Poor' : '✓ Moderate'}
                        </div>
                    </div>
                </Popup>
             </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </Card>
  );
}
