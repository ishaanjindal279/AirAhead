
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Navigation } from 'lucide-react';
import { Badge } from '../ui/Badge';

// Fix Leaflet marker icons in React
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Delhi Center
const CENTER: [number, number] = [28.6139, 77.2090];

const HOTSPOTS = [
  { id: '1', name: 'Ring Road', lat: 28.5700, lng: 77.2300, aqi: 385, color: 'red' },
  { id: '2', name: 'ITO', lat: 28.6295, lng: 77.2450, aqi: 410, color: 'purple' },
  { id: '3', name: 'Outer Ring Road', lat: 28.5500, lng: 77.2000, aqi: 310, color: 'orange' },
];

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center);
  return null;
}

export function TrafficMap() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Live Traffic Pollution Map</CardTitle>
            <CardDescription>Real-time high-emission zones in NCR</CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="destructive">Severe Congestion</Badge>
            <Badge variant="warning">Moderate</Badge>
          </div>
        </div>
      </CardHeader>
      
      <div className="flex-1 min-h-[500px] overflow-hidden rounded-b-xl relative z-0">
        <MapContainer center={CENTER} zoom={11} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <ChangeView center={CENTER} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {HOTSPOTS.map((spot) => (
             <CircleMarker 
                key={spot.id} 
                center={[spot.lat, spot.lng]} 
                radius={20}
                pathOptions={{ 
                    color: spot.color === 'red' ? '#ef4444' : spot.color === 'purple' ? '#7e22ce' : '#f97316',
                    fillColor: spot.color === 'red' ? '#ef4444' : spot.color === 'purple' ? '#7e22ce' : '#f97316',
                    fillOpacity: 0.6 
                }}
             >
                <Popup>
                    <div className="p-1">
                        <strong className="block text-lg">{spot.name}</strong>
                        <div className="text-sm">AQI: <span className="font-bold">{spot.aqi}</span></div>
                        <div className="text-xs text-gray-500 mt-1">Traffic Impact: High</div>
                    </div>
                </Popup>
             </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </Card>
  );
}
