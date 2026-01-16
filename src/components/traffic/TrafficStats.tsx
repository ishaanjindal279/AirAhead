import { Car, Route, Clock, Wind } from 'lucide-react';
import { Card } from '../ui/Card';

export function TrafficStats() {
  const stats = [
    {
      icon: Car,
      label: 'Active Routes',
      value: '1,247',
      change: '+12%',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Route,
      label: 'Clean Routes',
      value: '89',
      change: '+5',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Clock,
      label: 'Avg. Delay',
      value: '8 min',
      change: '-3 min',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Wind,
      label: 'Avg. Route AQI',
      value: '62',
      change: '-8',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-semibold text-green-600 dark:text-green-400">
              {stat.change}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
        </Card>
      ))}
    </div>
  );
}
