import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Route, Clock, Wind, ChevronRight } from 'lucide-react';
import { Badge } from '../ui/Badge';

export function CleanRoutes() {
  const routes = [
    {
      name: 'Coastal Highway',
      distance: '12.3 mi',
      time: '18 min',
      aqi: 45,
      savings: '30 AQI points',
      recommended: true,
    },
    {
      name: 'Park Boulevard',
      distance: '11.8 mi',
      time: '22 min',
      aqi: 52,
      savings: '23 AQI points',
      recommended: true,
    },
    {
      name: 'Downtown Express',
      distance: '9.5 mi',
      time: '15 min',
      aqi: 88,
      savings: '0',
      recommended: false,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Route className="w-5 h-5 text-green-600 dark:text-green-400" />
          <CardTitle>Clean Route Suggestions</CardTitle>
        </div>
      </CardHeader>

      <div className="px-6 pb-6 space-y-3">
        {routes.map((route, index) => (
          <div
            key={index}
            className={`p-4 rounded-xl border-2 cursor-pointer hover:shadow-md transition-all ${
              route.recommended
                ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1">
                  {route.name}
                </h4>
                <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                  <span>{route.distance}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {route.time}
                  </span>
                </div>
              </div>
              {route.recommended && (
                <Badge variant="success" size="sm">Recommended</Badge>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  AQI: {route.aqi}
                </span>
              </div>
              {route.recommended && (
                <span className="text-xs text-green-700 dark:text-green-300 font-medium">
                  Saves {route.savings}
                </span>
              )}
            </div>

            {route.recommended && (
              <button className="w-full mt-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                <span>Navigate</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
