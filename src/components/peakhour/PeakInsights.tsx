import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Lightbulb, AlertTriangle, TrendingUp, Clock } from 'lucide-react';

interface PeakInsightsProps {
  selectedHour: number;
}

export function PeakInsights({ selectedHour }: PeakInsightsProps) {
  const isPeakHour = (selectedHour >= 7 && selectedHour <= 9) || (selectedHour >= 17 && selectedHour <= 19);
  
  const insights = isPeakHour ? [
    {
      icon: AlertTriangle,
      title: 'Peak Traffic Hour',
      description: 'High vehicle emissions detected',
      color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950',
    },
    {
      icon: TrendingUp,
      title: 'AQI Spike Expected',
      description: 'Typical rush hour pattern',
      color: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950',
    },
    {
      icon: Lightbulb,
      title: 'Recommendation',
      description: 'Avoid outdoor activities if sensitive',
      color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950',
    },
  ] : [
    {
      icon: Clock,
      title: 'Off-Peak Hour',
      description: 'Lower pollution levels expected',
      color: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950',
    },
    {
      icon: Lightbulb,
      title: 'Good Time for Outdoor',
      description: 'Suitable for exercise and activities',
      color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950',
    },
    {
      icon: TrendingUp,
      title: 'Stable Conditions',
      description: 'No significant changes expected',
      color: 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <CardTitle>Insights</CardTitle>
        </div>
      </CardHeader>
      
      <div className="px-6 pb-6 space-y-3">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`p-4 rounded-xl ${insight.color}`}
          >
            <div className="flex items-start gap-3">
              <insight.icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
                <p className="text-xs opacity-90">{insight.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
