import { Card, CardHeader, CardTitle } from '../ui/Card';
import { MapPin, Users, TrendingUp } from 'lucide-react';
import { Badge } from '../ui/Badge';

export function HotspotClusters() {
  const hotspots = [
    { name: 'Industrial District', sites: 12, aqi: 145, trend: '+8' },
    { name: 'Port Area', sites: 8, aqi: 132, trend: '+5' },
    { name: 'Highway Corridor', sites: 15, aqi: 118, trend: '+12' },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-red-600 dark:text-red-400" />
          <CardTitle>Hotspot Clusters</CardTitle>
        </div>
      </CardHeader>

      <div className="px-6 pb-6 space-y-3">
        {hotspots.map((spot, index) => (
          <div
            key={index}
            className="p-4 rounded-xl border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                {spot.name}
              </h4>
              <Badge variant="error" size="sm">Critical</Badge>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <Users className="w-3 h-3" />
                <span>{spot.sites} sites</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-red-600 dark:text-red-400">AQI: {spot.aqi}</span>
                <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                  <TrendingUp className="w-3 h-3" />
                  <span>{spot.trend}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
