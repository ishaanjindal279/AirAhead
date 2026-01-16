import { Card, CardHeader, CardTitle } from '../ui/Card';

export function HeatmapLegend() {
  const ranges = [
    { label: 'Good', range: '0-50', color: 'bg-green-500' },
    { label: 'Moderate', range: '51-100', color: 'bg-yellow-500' },
    { label: 'Unhealthy', range: '101-150', color: 'bg-orange-500' },
    { label: 'Very Unhealthy', range: '151-200', color: 'bg-red-500' },
    { label: 'Hazardous', range: '200+', color: 'bg-purple-500' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>AQI Scale</CardTitle>
      </CardHeader>
      <div className="px-6 pb-6 space-y-3">
        {ranges.map((range) => (
          <div key={range.label} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 ${range.color} rounded-lg shadow-sm`}></div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{range.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{range.range}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
