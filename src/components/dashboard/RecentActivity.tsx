import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function RecentActivity() {
  const activities = [
    {
      location: 'Downtown',
      change: 'increased',
      value: 12,
      time: '10 min ago',
      trend: 'up',
    },
    {
      location: 'Mission District',
      change: 'decreased',
      value: 8,
      time: '25 min ago',
      trend: 'down',
    },
    {
      location: 'Marina',
      change: 'stable',
      value: 0,
      time: '45 min ago',
      trend: 'neutral',
    },
    {
      location: 'Financial District',
      change: 'increased',
      value: 15,
      time: '1 hour ago',
      trend: 'up',
    },
    {
      location: 'SoMa',
      change: 'decreased',
      value: 5,
      time: '2 hours ago',
      trend: 'down',
    },
  ];

  const getTrendIcon = (trend: string) => {
    switch(trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-green-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Location-based changes</CardDescription>
          </div>
        </div>
      </CardHeader>

      <div className="px-6 pb-6 space-y-3">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              {getTrendIcon(activity.trend)}
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {activity.location}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {activity.time}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-semibold ${
                activity.trend === 'up' ? 'text-red-600 dark:text-red-400' :
                activity.trend === 'down' ? 'text-green-600 dark:text-green-400' :
                'text-gray-600 dark:text-gray-400'
              }`}>
                {activity.trend === 'up' ? '+' : activity.trend === 'down' ? '-' : ''}{activity.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">AQI points</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
