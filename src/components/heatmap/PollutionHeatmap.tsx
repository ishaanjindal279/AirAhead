import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { MapPin, AlertTriangle } from 'lucide-react';

interface PollutionHeatmapProps {
  timeSlot: string;
  pollutant: string;
}

export function PollutionHeatmap({ timeSlot, pollutant }: PollutionHeatmapProps) {
  const hotspots = [
    { name: 'Downtown', aqi: 125, x: 40, y: 35, severity: 'high' },
    { name: 'Financial District', aqi: 98, x: 55, y: 28, severity: 'medium' },
    { name: 'Industrial Zone', aqi: 156, x: 70, y: 55, severity: 'critical' },
    { name: 'Marina', aqi: 45, x: 25, y: 20, severity: 'low' },
    { name: 'Mission', aqi: 88, x: 48, y: 62, severity: 'medium' },
    { name: 'SoMa', aqi: 112, x: 52, y: 45, severity: 'high' },
  ];

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'critical': return 'from-red-500 to-red-600';
      case 'high': return 'from-orange-500 to-orange-600';
      case 'medium': return 'from-yellow-500 to-yellow-600';
      default: return 'from-green-500 to-green-600';
    }
  };

  const getSeveritySize = (severity: string) => {
    switch(severity) {
      case 'critical': return 'w-24 h-24';
      case 'high': return 'w-20 h-20';
      case 'medium': return 'w-16 h-16';
      default: return 'w-12 h-12';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pollution Heatmap - {timeSlot === 'current' ? 'Live' : `Forecast ${timeSlot}`}</CardTitle>
        <CardDescription>Interactive pollution zones and hotspot visualization</CardDescription>
      </CardHeader>

      <div className="px-6 pb-6">
        {/* Map Container */}
        <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl h-[600px] overflow-hidden">
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
          
          {/* Pollution zones (heat circles) */}
          {hotspots.map((spot, index) => (
            <div
              key={index}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
            >
              {/* Pulsing heat effect */}
              <div className={`absolute inset-0 ${getSeveritySize(spot.severity)} bg-gradient-to-br ${getSeverityColor(spot.severity)} rounded-full opacity-20 animate-ping`}></div>
              <div className={`absolute inset-0 ${getSeveritySize(spot.severity)} bg-gradient-to-br ${getSeverityColor(spot.severity)} rounded-full opacity-30 blur-xl`}></div>
              
              {/* Marker */}
              <div className="relative group cursor-pointer">
                <div className={`w-12 h-12 bg-gradient-to-br ${getSeverityColor(spot.severity)} rounded-full shadow-lg flex items-center justify-center border-4 border-white dark:border-gray-800 hover:scale-110 transition-transform`}>
                  <MapPin className="w-6 h-6 text-white" />
                </div>

                {/* Tooltip */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-3 rounded-lg shadow-xl whitespace-nowrap">
                    <p className="font-semibold text-sm">{spot.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs">AQI:</span>
                      <span className="text-lg font-bold">{spot.aqi}</span>
                    </div>
                    {spot.severity === 'critical' && (
                      <div className="flex items-center gap-1 mt-1 text-red-400 dark:text-red-600">
                        <AlertTriangle className="w-3 h-3" />
                        <span className="text-xs">Danger Zone</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Legend overlay */}
          <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Hotspot Count</p>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">Critical: 1</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">High: 2</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">Medium: 2</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">Low: 1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
