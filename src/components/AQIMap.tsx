import { MapPin, Navigation } from 'lucide-react';

export function AQIMap() {
  const locations = [
    { name: 'San Francisco', aqi: 68, color: 'bg-yellow-500', lat: 37.7749, lng: -122.4194 },
    { name: 'Los Angeles', aqi: 95, color: 'bg-orange-500', lat: 34.0522, lng: -118.2437 },
    { name: 'San Diego', aqi: 42, color: 'bg-green-500', lat: 32.7157, lng: -117.1611 },
    { name: 'Sacramento', aqi: 78, color: 'bg-yellow-500', lat: 38.5816, lng: -121.4944 },
    { name: 'Oakland', aqi: 62, color: 'bg-yellow-500', lat: 37.8044, lng: -122.2711 },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">AQI Map - Regional Overview</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Real-time monitoring across multiple locations</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors text-sm font-medium">
          <Navigation className="w-4 h-4" />
          <span>Recenter</span>
        </button>
      </div>

      {/* Map Container */}
      <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-lg h-[400px] overflow-hidden">
        {/* Simplified map visualization */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>
        
        {/* Location markers */}
        {locations.map((location, index) => (
          <div
            key={location.name}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            style={{
              left: `${25 + index * 15}%`,
              top: `${30 + (index % 2) * 20}%`,
            }}
          >
            {/* Pulse animation */}
            <div className={`absolute inset-0 ${location.color} rounded-full opacity-20 animate-ping`}></div>
            
            {/* Marker */}
            <div className={`relative w-12 h-12 ${location.color} rounded-full shadow-lg flex items-center justify-center border-4 border-white hover:scale-110 transition-transform`}>
              <MapPin className="w-6 h-6 text-white" />
            </div>

            {/* Tooltip */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-xl">
                <p className="font-semibold">{location.name}</p>
                <p className="text-xs text-gray-300">AQI: {location.aqi}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-600 dark:text-gray-400">Good (0-50)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-gray-600 dark:text-gray-400">Moderate (51-100)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <span className="text-gray-600 dark:text-gray-400">Unhealthy (101-150)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-gray-600 dark:text-gray-400">Very Unhealthy (151+)</span>
        </div>
      </div>
    </div>
  );
}