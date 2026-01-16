import { Card, CardHeader, CardTitle } from '../ui/Card';
import { AlertTriangle, MapPin, Users } from 'lucide-react';
import { Badge } from '../ui/Badge';

export function DangerZones() {
  const zones = [
    { name: 'Industrial Zone', aqi: 156, population: '12K', risk: 'critical' },
    { name: 'Downtown', aqi: 125, population: '45K', risk: 'high' },
    { name: 'SoMa', aqi: 112, population: '28K', risk: 'high' },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          <CardTitle>Danger Zones</CardTitle>
        </div>
      </CardHeader>
      <div className="px-6 pb-6 space-y-3">
        {zones.map((zone) => (
          <div
            key={zone.name}
            className="p-4 rounded-lg border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-600 dark:text-red-400" />
                <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">{zone.name}</p>
              </div>
              <Badge variant={zone.risk === 'critical' ? 'error' : 'warning'} size="sm">
                {zone.risk}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{zone.population}</span>
              </div>
              <span className="font-bold text-red-600 dark:text-red-400">AQI: {zone.aqi}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
