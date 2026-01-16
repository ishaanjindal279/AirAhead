import { Activity, Wind, Droplets, ThermometerSun, Eye, Gauge } from 'lucide-react';
import { Card } from '../ui/Card';
import { AQIBadge } from '../ui/AQIBadge';

export function AQIMetricsGrid() {
  const metrics = [
    {
      icon: Activity,
      label: 'Current AQI',
      value: 68,
      unit: '',
      change: -5,
      status: 'good',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Wind,
      label: 'PM2.5',
      value: 28.5,
      unit: 'μg/m³',
      change: -3,
      status: 'good',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Droplets,
      label: 'PM10',
      value: 45.2,
      unit: 'μg/m³',
      change: 2,
      status: 'moderate',
      color: 'from-cyan-500 to-teal-500',
    },
    {
      icon: Gauge,
      label: 'Ozone (O₃)',
      value: 52,
      unit: 'ppb',
      change: -1,
      status: 'good',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: ThermometerSun,
      label: 'Temperature',
      value: 72,
      unit: '°F',
      change: 4,
      status: 'neutral',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Eye,
      label: 'Visibility',
      value: 8.5,
      unit: 'mi',
      change: -2,
      status: 'good',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {metrics.map((metric) => (
        <Card 
          key={metric.label}
          className="relative overflow-hidden hover:shadow-lg transition-all duration-300 group"
          padding="md"
        >
          {/* Gradient background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
          
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${metric.color}`}>
                <metric.icon className="w-5 h-5 text-white" />
              </div>
              {metric.label === 'Current AQI' && (
                <AQIBadge value={metric.value} size="sm" showLabel={false} />
              )}
            </div>
            
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{metric.label}</p>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {metric.value}
                </p>
                {metric.unit && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">{metric.unit}</p>
                )}
              </div>
              
              <div className="flex items-center gap-1 mt-2">
                <span className={`text-xs font-medium ${
                  metric.change < 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {metric.change > 0 ? '+' : ''}{metric.change}%
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">vs yesterday</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
