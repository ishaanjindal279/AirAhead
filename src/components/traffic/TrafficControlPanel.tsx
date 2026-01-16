
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { AlertTriangle, TrendingDown, Ban, Car, Activity } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

// Initial mocks (but connected to real Simulation API)
const INITIAL_ROADS = [
  { id: '1', name: 'Ring Road (South)', aqi: 385, traffic: 'Heavy', status: 'Active' },
  { id: '2', name: 'ITO Intersection', aqi: 410, traffic: 'Severe', status: 'Active' },
  { id: '3', name: 'Outer Ring Road', aqi: 310, traffic: 'Moderate', status: 'Active' },
  { id: '4', name: 'DND Flyway', aqi: 290, traffic: 'Moderate', status: 'Active' },
];

export function TrafficControlPanel() {
  const [roads, setRoads] = useState(INITIAL_ROADS);
  const [simulating, setSimulating] = useState<string | null>(null);

  const handleDivert = async (id: string) => {
    setSimulating(id);
    try {
      // Call Real Backend Simulation
      const res = await fetch('http://localhost:8000/traffic/control', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ zoneId: id, action: 'block' })
      });
      const data = await res.json();
      
      if (data.status === 'success') {
          // Update State with Backend Projections
          setRoads(prev => prev.map(r => {
            if (r.id === id) {
              return { 
                  ...r, 
                  status: 'Diverted', 
                  aqi: data.projected_aqi, // From Backend
                  traffic: 'Diverted' 
              };
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
     // For demo, just reset to initial known state in Mock
     setRoads(prev => prev.map(r => {
      if (r.id === id) {
        const original = INITIAL_ROADS.find(init => init.id === id);
        return original || r;
      }
      return r;
    }));
  };

  return (
    <Card className="h-full border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
             <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
             <CardTitle className="text-xl">Traffic Control</CardTitle>
             <CardDescription>Govt Interface • Zone Management</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <div className="px-6 pb-6 space-y-4 max-h-[600px] overflow-y-auto">
        {roads.map((road) => (
          <div 
            key={road.id}
            className={`group relative p-4 rounded-xl border transition-all duration-300 ${
              road.status === 'Diverted' 
                ? 'border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20' 
                : road.aqi > 350
                  ? 'border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/20 hover:shadow-red-900/10 hover:shadow-lg'
                  : 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    {road.name}
                    {road.status === 'Diverted' && <Activity className="w-4 h-4 text-green-500 animate-pulse" />}
                </h4>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={road.traffic === 'Severe' ? 'destructive' : road.traffic === 'Diverted' ? 'success' : 'secondary'}>
                    {road.traffic}
                  </Badge>
                  {road.status === 'Diverted' && (
                    <span className="flex items-center gap-1 text-xs text-green-600 font-bold bg-green-100 dark:bg-green-900/40 px-2 py-0.5 rounded-full">
                      <TrendingDown className="w-3 h-3" />
                      -30% AQI
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-black ${road.status === 'Diverted' ? 'text-green-600' : 'text-gray-900 dark:text-white'}`}>
                    {road.aqi}
                </div>
                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">AQI Level</div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3">
              {road.status === 'Active' ? (
                <Button 
                  onClick={() => handleDivert(road.id)} 
                  disabled={!!simulating}
                  variant="destructive"
                  className="w-full shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all font-semibold"
                >
                  {simulating === road.id ? (
                      <span className="animate-pulse">Optimizing...</span> 
                  ) : (
                    <>
                      <Ban className="w-4 h-4 mr-2" />
                      Block & Reroute
                    </>
                  )}
                </Button>
              ) : (
                <Button 
                  onClick={() => handleRestore(road.id)}
                  variant="outline"
                  className="w-full font-medium"
                >
                  <Car className="w-4 h-4 mr-2" />
                  Restore Flow
                </Button>
              )}
            </div>
            
            {/* Background decoration for severe pollution */}
            {road.aqi > 400 && road.status !== 'Diverted' && (
                <div className="absolute inset-0 bg-red-500/5 pointer-events-none rounded-xl animate-pulse" />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
