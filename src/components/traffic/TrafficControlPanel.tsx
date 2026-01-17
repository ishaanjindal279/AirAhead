
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { AlertTriangle, TrendingDown, Ban, Car, Activity, MapPin, RefreshCw, Navigation, BarChart3 } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface Road {
  id: string;
  name: string;
  lat: number;
  lng: number;
  aqi: number;
  traffic: string;
  status: string;
  via: string;
  length_km: number;
  needs_action: boolean;
}

interface TrafficDistribution {
  name: string;
  via: string;
  traffic_share: number;
  current_aqi: number;
  projected_aqi: number;
  length_km: number;
}

interface ControlResponse {
  status: string;
  blocked_road: string;
  projected_aqi: number;
  original_aqi: number;
  load_balance_score: number;
  traffic_distribution: TrafficDistribution[];
}

export function TrafficControlPanel() {
  const [roads, setRoads] = useState<Road[]>([]);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [distributions, setDistributions] = useState<Record<string, ControlResponse>>({});

  const fetchRoads = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/traffic/critical-roads');
      const data = await res.json();
      setRoads(data.roads || []);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (e) {
      console.error("Failed to fetch critical roads", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoads();
    const interval = setInterval(fetchRoads, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleDivert = async (road: Road) => {
    setSimulating(road.id);
    try {
      const res = await fetch('http://localhost:8000/traffic/control', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ zoneId: road.id, action: 'block' })
      });
      const data: ControlResponse = await res.json();
      
      if (data.status === 'success') {
          setDistributions(prev => ({ ...prev, [road.id]: data }));
          setRoads(prev => prev.map(r => {
            if (r.id === road.id) {
              return { ...r, status: 'Diverted', aqi: data.projected_aqi, traffic: 'Rerouted' };
            }
            return r;
          }));
      }
    } catch (e) {
        console.error("Simulation Failed", e);
    } finally {
        setSimulating(null);
    }
  };

  const handleRestore = (id: string) => {
    setDistributions(prev => { const u = { ...prev }; delete u[id]; return u; });
    fetchRoads();
  };

  return (
    <Card className="h-full border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
               <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
               <CardTitle className="text-xl">Traffic Control</CardTitle>
               <CardDescription>Multi-Route Load Balancing</CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={fetchRoads} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      
      <div className="px-6 pb-6 space-y-3 max-h-[700px] overflow-y-auto">
        {loading && roads.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Loading roads...</div>
        ) : (
          roads.map((road) => (
            <div 
              key={road.id}
              className={`p-4 rounded-xl border transition-all duration-300 ${
                road.status === 'Diverted' 
                  ? 'border-green-200 bg-green-50/50 dark:border-green-800' 
                  : road.needs_action
                    ? 'border-red-200 bg-red-50/50 dark:border-red-800'
                    : 'border-gray-200 bg-white dark:border-gray-800'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      {road.name}
                      {road.status === 'Diverted' && <Activity className="w-4 h-4 text-green-500 animate-pulse" />}
                  </h4>
                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {road.via} • {road.length_km} km
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-black ${road.status === 'Diverted' ? 'text-green-600' : road.aqi > 350 ? 'text-red-600' : 'text-gray-900'}`}>
                    {road.aqi}
                  </div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold">AQI</div>
                </div>
              </div>

              {/* TRAFFIC DISTRIBUTION DISPLAY */}
              {road.status === 'Diverted' && distributions[road.id] && (
                <div className="mt-3 p-3 bg-green-100/80 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between text-xs font-bold text-green-700 dark:text-green-400 mb-3">
                    <span className="flex items-center gap-1">
                      <BarChart3 className="w-4 h-4" /> TRAFFIC DISTRIBUTION
                    </span>
                    <span className="bg-green-600 text-white px-2 py-0.5 rounded">
                      Balance: {distributions[road.id].load_balance_score}%
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    {distributions[road.id].traffic_distribution.slice(0, 4).map((dist, idx) => (
                      <div key={idx} className="relative">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="font-medium text-gray-700 dark:text-gray-300 truncate max-w-[140px]">
                            {dist.name}
                          </span>
                          <span className="font-bold text-green-700 dark:text-green-400">
                            {dist.traffic_share}%
                          </span>
                        </div>
                        {/* Progress bar */}
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all"
                            style={{ width: `${Math.min(dist.traffic_share * 2, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-500 mt-0.5">
                          <span>AQI: {dist.current_aqi} → {dist.projected_aqi}</span>
                          <span>{dist.length_km} km</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                {road.status === 'Active' && road.needs_action ? (
                  <Button 
                    onClick={() => handleDivert(road)} 
                    disabled={!!simulating}
                    variant="destructive"
                    className="w-full font-semibold"
                  >
                    {simulating === road.id ? (
                        <span className="animate-pulse">Calculating Distribution...</span> 
                    ) : (
                      <><Ban className="w-4 h-4 mr-2" /> Block & Distribute Traffic</>
                    )}
                  </Button>
                ) : road.status === 'Diverted' ? (
                  <Button onClick={() => handleRestore(road.id)} variant="outline" className="w-full">
                    <Car className="w-4 h-4 mr-2" /> Restore Flow
                  </Button>
                ) : (
                  <div className="text-center text-sm text-green-600 font-medium py-2">✓ Safe</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
