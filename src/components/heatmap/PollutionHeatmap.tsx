
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';

interface PollutionHeatmapProps {
  timeSlot: string;
  pollutant: string;
}

interface GridPoint {
  lat: number;
  lng: number;
  aqi: number;
}

interface GridResponse {
  grid: GridPoint[];
  lat_step: number;
  lng_step: number;
  grid_points: number;
}

// Continuous Color Scale - Gradual darkening for high AQI
const getColorForAQI = (aqi: number): string => {
  // Good: Green
  if (aqi <= 50) return '#10B981';
  // Satisfactory: Light Green
  if (aqi <= 100) return '#84CC16';
  // Moderate: Yellow
  if (aqi <= 200) return '#FACC15';
  // Poor: Orange
  if (aqi <= 300) return '#F97316';
  
  // Very Poor to Severe (300-500+): Gradual Red Darkening
  // Base red at 300, darkening every 10 AQI points
  // At 300: #EF4444 (bright red)
  // At 500: #450a0a (very dark red)
  
  const minAQI = 300;
  const maxAQI = 500;
  const clampedAQI = Math.min(Math.max(aqi, minAQI), maxAQI);
  
  // Normalize to 0-1 range
  const t = (clampedAQI - minAQI) / (maxAQI - minAQI);
  
  // Interpolate RGB: Bright Red (239, 68, 68) -> Dark Red (69, 10, 10)
  const r = Math.round(239 - t * (239 - 69));
  const g = Math.round(68 - t * (68 - 10));
  const b = Math.round(68 - t * (68 - 10));
  
  return `rgb(${r}, ${g}, ${b})`;
};

function MapLegend() {
  return (
    <div className="absolute bottom-6 right-6 z-[1000] bg-white/90 dark:bg-gray-900/90 backdrop-blur p-3 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 text-xs">
      <h4 className="font-bold mb-2 text-gray-900 dark:text-gray-100">AQI Index</h4>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2"><div className="w-3 h-3" style={{ backgroundColor: '#10B981' }} /><span>0-50 Good</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3" style={{ backgroundColor: '#84CC16' }} /><span>51-100 Satisfactory</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3" style={{ backgroundColor: '#FACC15' }} /><span>101-200 Moderate</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3" style={{ backgroundColor: '#F97316' }} /><span>201-300 Poor</span></div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-6 rounded" style={{ background: 'linear-gradient(to bottom, #EF4444, #450a0a)' }} />
          <span>300-500+ Very Poor → Severe</span>
        </div>
      </div>
    </div>
  );
}

// Component to render contours as GeoJSON
function ContourLayer({ gridData, latStep, lngStep }: { gridData: GridPoint[], latStep: number, lngStep: number }) {
  const map = useMap();

  // Calculate grid dimensions
  const gridInfo = useMemo(() => {
    if (!gridData.length) return null;
    
    const lats = [...new Set(gridData.map(p => p.lat))].sort((a, b) => a - b);
    const lngs = [...new Set(gridData.map(p => p.lng))].sort((a, b) => a - b);
    
    const nRows = lats.length;
    const nCols = lngs.length;
    const latMin = lats[0];
    const lngMin = lngs[0];
    
    // Build 2D matrix (row-major: [row][col] = [lat_idx][lng_idx])
    const values: number[] = new Array(nRows * nCols).fill(0);
    
    gridData.forEach(p => {
      const row = Math.round((p.lat - latMin) / latStep);
      const col = Math.round((p.lng - lngMin) / lngStep);
      if (row >= 0 && row < nRows && col >= 0 && col < nCols) {
        values[row * nCols + col] = p.aqi;
      }
    });

    return { nRows, nCols, latMin, lngMin, values, lats, lngs };
  }, [gridData, latStep, lngStep]);

  useEffect(() => {
    if (!gridInfo) return;

    const { nRows, nCols, latMin, lngMin, values } = gridInfo;

    // Generate contours using D3 with granular thresholds
    // Every 10 AQI from 300-500 for discrete darkening steps
    const thresholds = [
      50, 100, 200, 300, // Base levels
      310, 320, 330, 340, 350, 360, 370, 380, 390, 400, // Very Poor increments
      410, 420, 430, 440, 450, 460, 470, 480, 490, 500  // Severe increments
    ];
    
    const contourGenerator = d3.contours()
      .size([nCols, nRows])
      .thresholds(thresholds);

    const contours = contourGenerator(values);

    // Transform contour coordinates from grid indices to Lat/Lng
    const transformCoords = (coords: number[][]): [number, number][] => {
      return coords.map(([x, y]) => {
        const lng = lngMin + x * lngStep;
        const lat = latMin + y * latStep;
        return [lat, lng]; // Leaflet uses [lat, lng]
      });
    };

    // Convert D3 contours to Leaflet GeoJSON format
    const layers: L.Layer[] = [];

    contours.forEach((contour) => {
      const color = getColorForAQI(contour.value);

      contour.coordinates.forEach((polygon) => {
        // polygon is an array of rings (outer + holes)
        const latLngs = polygon.map(ring => transformCoords(ring));

        const layer = L.polygon(latLngs as L.LatLngExpression[][], {
          color: color,
          weight: 1,
          fillColor: color,
          fillOpacity: 0.35,
          stroke: true,
          opacity: 0.6
        });

        layer.bindPopup(`<div class="text-center"><strong>AQI Zone</strong><br/>Level: ${contour.value}+</div>`);
        layers.push(layer);
      });
    });

    const layerGroup = L.layerGroup(layers);
    layerGroup.addTo(map);

    return () => {
      map.removeLayer(layerGroup);
    };
  }, [map, gridInfo, lngStep, latStep]);

  return null;
}

export function PollutionHeatmap({ timeSlot, pollutant }: PollutionHeatmapProps) {
  const [gridData, setGridData] = useState<GridPoint[]>([]);
  const [gridSteps, setGridSteps] = useState({ lat: 0.04, lng: 0.039 });
  const [loading, setLoading] = useState(false);

  const center: [number, number] = [28.6139, 77.2090];

  useEffect(() => {
    const fetchGrid = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:8000/hotspots');
        const data: GridResponse = await res.json();

        setGridData(data.grid || []);
        if (data.lat_step && data.lng_step) {
          setGridSteps({ lat: data.lat_step, lng: data.lng_step });
        }
      } catch (e) {
        console.error("Heatmap Load Failed:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchGrid();
  }, [timeSlot]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Regional Air Quality Assessment</CardTitle>
        <CardDescription>Smooth Contour Visualization (IDW Interpolation)</CardDescription>
      </CardHeader>

      <div className="px-6 pb-6">
        <div className="rounded-xl h-[600px] overflow-hidden relative border border-gray-200 dark:border-gray-700">
          {loading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 dark:bg-black/40">
              <div className="text-sm font-medium">Generating contours...</div>
            </div>
          )}

          <MapContainer center={center} zoom={10} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {gridData.length > 0 && (
              <ContourLayer gridData={gridData} latStep={gridSteps.lat} lngStep={gridSteps.lng} />
            )}

            <MapLegend />
          </MapContainer>
        </div>
      </div>
    </Card>
  );
}
