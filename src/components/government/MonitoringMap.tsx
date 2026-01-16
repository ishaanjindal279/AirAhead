import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { MapPin, AlertTriangle, Building2, Factory } from 'lucide-react';
import { Badge } from '../ui/Badge';

export function MonitoringMap() {
  const sites = [
    { type: 'violation', icon: AlertTriangle, name: 'Industrial Zone A', x: 35, y: 40, severity: 'high' },
    { type: 'construction', icon: Building2, name: 'Downtown Project', x: 55, y: 30, severity: 'medium' },
    { type: 'factory', icon: Factory, name: 'Manufacturing Plant', x: 70, y: 60, severity: 'high' },
    { type: 'construction', icon: Building2, name: 'Highway Extension', x: 45, y: 70, severity: 'low' },
    { type: 'violation', icon: AlertTriangle, name: 'Power Plant', x: 25, y: 65, severity: 'critical' },
  ];

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'critical': return 'from-red-600 to-red-700';
      case 'high': return 'from-orange-500 to-orange-600';
      case 'medium': return 'from-yellow-500 to-yellow-600';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monitoring & Compliance Map</CardTitle>
        <CardDescription>Real-time site tracking and violation monitoring</CardDescription>
      </CardHeader>

      <div className="px-6 pb-6">
        <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl h-[600px] overflow-hidden">
          {/* Grid */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
          
          {/* Site markers */}
          {sites.map((site, index) => (
            <div
              key={index}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{ left: `${site.x}%`, top: `${site.y}%` }}
            >
              {/* Pulse for violations */}
              {site.type === 'violation' && (
                <div className={`absolute inset-0 w-16 h-16 bg-gradient-to-br ${getSeverityColor(site.severity)} rounded-full opacity-20 animate-ping`}></div>
              )}
              
              {/* Marker */}
              <div className={`relative w-12 h-12 bg-gradient-to-br ${getSeverityColor(site.severity)} rounded-full shadow-lg flex items-center justify-center border-4 border-white dark:border-gray-800 hover:scale-110 transition-transform`}>
                <site.icon className="w-6 h-6 text-white" />
              </div>

              {/* Tooltip */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-3 rounded-lg shadow-xl whitespace-nowrap">
                  <p className="font-semibold text-sm">{site.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant={site.type === 'violation' ? 'error' : 'warning'} 
                      size="sm"
                    >
                      {site.type}
                    </Badge>
                    <span className="text-xs capitalize">{site.severity}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Legend</p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="text-gray-700 dark:text-gray-300">Violations</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-700 dark:text-gray-300">Construction</span>
              </div>
              <div className="flex items-center gap-2">
                <Factory className="w-4 h-4 text-orange-500" />
                <span className="text-gray-700 dark:text-gray-300">Industrial</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
