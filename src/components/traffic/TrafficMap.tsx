import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Navigation, MapPin } from 'lucide-react';
import { Badge } from '../ui/Badge';

export function TrafficMap() {
  const routes = [
    { name: 'Route A', color: 'bg-green-500', aqi: 45, label: 'Clean Route' },
    { name: 'Route B', color: 'bg-yellow-500', aqi: 75, label: 'Moderate' },
    { name: 'Route C', color: 'bg-red-500', aqi: 115, label: 'Congested' },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Traffic & Route Map</CardTitle>
            <CardDescription>Real-time congestion and air quality routing</CardDescription>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors text-sm font-medium">
            <Navigation className="w-4 h-4" />
            <span>Navigate</span>
          </button>
        </div>
      </CardHeader>

      <div className="px-6 pb-6">
        <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-xl h-[500px] overflow-hidden">
          {/* Grid */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
          
          {/* Start and End Markers */}
          <div className="absolute top-8 left-8 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
            <MapPin className="w-4 h-4" />
            <span className="font-semibold">Start</span>
          </div>
          
          <div className="absolute bottom-8 right-8 flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg">
            <MapPin className="w-4 h-4" />
            <span className="font-semibold">Destination</span>
          </div>

          {/* Route Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Route A - Clean (Green) */}
            <path
              d="M 50 50 Q 150 100, 250 150 T 450 250"
              stroke="#10b981"
              strokeWidth="6"
              fill="none"
              strokeDasharray="10,5"
              opacity="0.8"
            />
            {/* Route B - Moderate (Yellow) */}
            <path
              d="M 50 50 Q 200 200, 400 300 T 500 380"
              stroke="#f59e0b"
              strokeWidth="6"
              fill="none"
              strokeDasharray="10,5"
              opacity="0.8"
            />
            {/* Route C - Congested (Red) */}
            <path
              d="M 50 50 Q 300 100, 350 250 T 500 380"
              stroke="#ef4444"
              strokeWidth="6"
              fill="none"
              strokeDasharray="10,5"
              opacity="0.8"
            />
          </svg>

          {/* Route Legend */}
          <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Routes</p>
            <div className="space-y-2">
              {routes.map((route) => (
                <div key={route.name} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 ${route.color} rounded-full`}></div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{route.name}</span>
                  </div>
                  <Badge variant={route.aqi <= 50 ? 'success' : route.aqi <= 100 ? 'warning' : 'error'} size="sm">
                    {route.aqi}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
