
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Target, TrendingUp, Award, Zap } from 'lucide-react';

export function AccuracyMetrics() {
  const metrics = [
    {
      icon: Target,
      label: 'Mean Absolute Error',
      value: '24.5',
      change: '-2.1',
      color: 'from-blue-500 to-cyan-500',
      unit: ' AQI'
    },
    {
      icon: TrendingUp,
      label: 'Spatial Correlation',
      value: '0.86',
      change: '+0.12',
      color: 'from-green-500 to-emerald-500',
      unit: ' R²'
    },
    {
      icon: Award,
      label: 'Validation Score',
      value: '88.4%',
      change: '+4.5%',
      color: 'from-purple-500 to-pink-500',
      unit: ''
    },
    {
      icon: Zap,
      label: 'Inference Latency',
      value: '45ms',
      change: '-12ms',
      color: 'from-orange-500 to-red-500',
      unit: ''
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Performance (V6)</CardTitle>
        <CardDescription>Metrics for Spatial LightGBM v6.0</CardDescription>
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
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{metric.value}</p>
                  <p className="text-sm text-gray-500">{metric.unit}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-semibold ${metric.change.startsWith('-') ? 'text-green-600' : 'text-green-600'}`}>
                {metric.change}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">vs v5 (Base)</p>
            </div>
          </div>
        ))}

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Model Version:</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">v6.0 (Spatial LightGBM)</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-gray-600 dark:text-gray-400">Features:</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">Peer Lags, Rolling Means</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
