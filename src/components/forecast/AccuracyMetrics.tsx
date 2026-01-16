import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Target, TrendingUp, Award, Zap } from 'lucide-react';

export function AccuracyMetrics() {
  const metrics = [
    {
      icon: Target,
      label: 'Overall Accuracy',
      value: '94.8%',
      change: '+2.3%',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: TrendingUp,
      label: 'Trend Prediction',
      value: '91.2%',
      change: '+1.8%',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Award,
      label: 'Peak Detection',
      value: '96.5%',
      change: '+3.1%',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Zap,
      label: 'Real-time Sync',
      value: '99.1%',
      change: '+0.5%',
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Performance</CardTitle>
        <CardDescription>Accuracy metrics and improvements</CardDescription>
      </CardHeader>
      
      <div className="px-6 pb-6 space-y-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${metric.color}`}>
                <metric.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{metric.value}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                {metric.change}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">vs last week</p>
            </div>
          </div>
        ))}

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Model Version:</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">v3.2.1</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">2 hours ago</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
