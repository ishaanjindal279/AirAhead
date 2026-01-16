import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { MapPin, AlertTriangle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

interface PollutionHeatmapProps {
  timeSlot: string;
  pollutant: string;
}

// Hotspot type
interface Hotspot {
  name: string;
  aqi: number;
  lat: number;
  lng: number;
  severity: string;
}

// Sample hotspots with real lat/lng coordinates (examples centered around a city)
const hotspots: Hotspot[] = [
  { name: 'Downtown', aqi: 125, lat: 12.9716, lng: 77.5946, severity: 'high' },
  { name: 'Financial District', aqi: 98, lat: 12.9750, lng: 77.6050, severity: 'medium' },
  { name: 'Industrial Zone', aqi: 156, lat: 12.9600, lng: 77.5800, severity: 'critical' },
  { name: 'Marina', aqi: 45, lat: 12.9850, lng: 77.5700, severity: 'low' },
  { name: 'Mission', aqi: 88, lat: 12.9550, lng: 77.6100, severity: 'medium' },
  { name: 'SoMa', aqi: 112, lat: 12.9650, lng: 77.5950, severity: 'high' },
];

const getSeverityColor = (severity: string) => {
  switch(severity) {
    case 'critical': return '#DC2626'; // red-600
    case 'high': return '#F97316'; // orange-500
    case 'medium': return '#F59E0B'; // yellow-500
    default: return '#10B981'; // green-500
  }
};

// Helper component to add the heat layer (leaflet.heat) to the map
function HeatLayer({ points }: { points: Array<[number, number, number]> }) {
  const map = useMap();

  useEffect(() => {
    // dynamic import of leaflet.heat (avoids type issues)
    let heat: any;
    import('leaflet.heat').then((mod) => {
      // @ts-ignore
      heat = (L as any).heatLayer(points, { radius: 25, blur: 15, maxZoom: 17 });
      heat.addTo(map);
    });

    return () => {
      if (heat) {
        map.removeLayer(heat);
      }
    };
  }, [map, points]);

  return null;
}

export function PollutionHeatmap({ timeSlot, pollutant }: PollutionHeatmapProps) {
  const [liveHotspots, setLiveHotspots] = useState<typeof hotspots>(hotspots);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Convert hotspots to heat points: [lat, lng, intensity]
  const heatPoints = liveHotspots.map(h => [h.lat, h.lng, Math.min(1, (h.aqi - 50) / 200)]) as Array<[number, number, number]>;

  const center: [number, number] = [12.9716, 77.5946];

  // Fetch live hotspots from backend
  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();
    const base = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:8000';
    const url = `${base.replace(/\/$/, '')}/hotspots?horizon_hours=24&limit=50`;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        // data.hotspots is expected
        if (mounted && data?.hotspots) {
          // Map backend shape to local hotspot shape if needed
          const mapped = data.hotspots.map((z: any) => ({
            name: z.zoneId || z.name || 'zone',
            aqi: z.expectedMaxAQI || z.aqi || 0,
            lat: z.center?.lat || z.lat || 12.9716,
            lng: z.center?.lng || z.lng || 77.5946,
            severity: z.severity?.level || (z.expectedMaxAQI > 200 ? 'critical' : z.expectedMaxAQI > 150 ? 'high' : 'medium')
          }));
          setLiveHotspots(mapped);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') setError(err.message || String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; controller.abort(); };
  }, [timeSlot, pollutant]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pollution Heatmap - {timeSlot === 'current' ? 'Live' : `Forecast ${timeSlot}`}</CardTitle>
        <CardDescription>Interactive pollution zones and hotspot visualization</CardDescription>
      </CardHeader>

      <div className="px-6 pb-6">
        <div className="rounded-xl h-[600px] overflow-hidden relative">
          {loading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 dark:bg-black/40">
              <div className="text-sm font-medium">Loading heatmap…</div>
            </div>
          )}
          {error && (
            <div className="absolute top-4 right-4 z-30 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 px-3 py-2 rounded shadow">
              <strong>Error:</strong> {error}
            </div>
          )}

          <MapContainer center={center} zoom={13} scrollWheelZoom={true} style={{ height: '600px', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Heat layer */}
            <HeatLayer points={heatPoints} />

            {/* Hotspot markers and danger circle overlays */}
            {liveHotspots.map((spot, idx) => (
              <Marker key={idx} position={[spot.lat, spot.lng] as [number, number]}>
                <Popup>
                  <div className="min-w-[160px]">
                    <p className="font-semibold">{spot.name}</p>
                    <p className="text-sm">AQI: <strong>{spot.aqi}</strong></p>
                    {spot.severity === 'critical' && <p className="text-xs text-red-600">Danger Zone</p>}
                  </div>
                </Popup>
              </Marker>
            ))}

            {liveHotspots.map((spot, i) => (
              <Circle
                key={`c-${i}`}
                center={[spot.lat, spot.lng]}
                radius={spot.severity === 'critical' ? 1200 : spot.severity === 'high' ? 800 : 400}
                pathOptions={{ color: getSeverityColor(spot.severity), fillColor: getSeverityColor(spot.severity), fillOpacity: 0.15 }}
              />
            ))}
          </MapContainer>
        </div>
      </div>
    </Card>
  );
}
