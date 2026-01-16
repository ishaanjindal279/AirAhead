import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Activity, Bike, Trees, Home } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface ActivitySafetyProps {
  persona: string;
}

export function ActivitySafety({ persona }: ActivitySafetyProps) {
  const activities = [
    {
      icon: Activity,
      name: 'Running',
      safety: persona === 'asthma' ? 'unsafe' : persona === 'runner' ? 'safe' : 'moderate',
      time: persona === 'asthma' ? 'Not recommended' : '6-8 AM',
    },
    {
      icon: Bike,
      name: 'Cycling',
      safety: persona === 'asthma' ? 'moderate' : 'safe',
      time: persona === 'asthma' ? 'Limited duration' : 'Before 3 PM',
    },
    {
      icon: Trees,
      name: 'Outdoor Play',
      safety: persona === 'child' ? 'safe' : 'safe',
      time: 'Morning hours',
    },
    {
      icon: Home,
      name: 'Indoor Activities',
      safety: 'safe',
      time: 'Anytime',
    },
  ];

  const getSafetyBadge = (safety: string) => {
    switch(safety) {
      case 'safe':
        return <Badge variant="success" size="sm">Safe</Badge>;
      case 'moderate':
        return <Badge variant="warning" size="sm">Caution</Badge>;
      case 'unsafe':
        return <Badge variant="error" size="sm">Unsafe</Badge>;
      default:
        return <Badge variant="info" size="sm">Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Safety Index</CardTitle>
        <CardDescription>Current conditions for different activities</CardDescription>
      </CardHeader>
      <div className="px-6 pb-6 space-y-3">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-xl">
                <activity.icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {activity.name}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
              </div>
            </div>
            {getSafetyBadge(activity.safety)}
          </div>
        ))}
      </div>
    </Card>
  );
}
