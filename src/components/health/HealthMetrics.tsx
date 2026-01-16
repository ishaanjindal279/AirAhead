import { Card } from '../ui/Card';
import { Shield, AlertTriangle, Clock, TrendingDown } from 'lucide-react';

interface HealthMetricsProps {
  persona: string;
}

export function HealthMetrics({ persona }: HealthMetricsProps) {
  const getMetrics = () => {
    const baseMetrics = [
      {
        icon: Shield,
        label: 'Safety Level',
        value: persona === 'asthma' ? 'Moderate' : 'Good',
        color: persona === 'asthma' ? 'from-yellow-500 to-orange-500' : 'from-green-500 to-emerald-500',
        status: persona === 'asthma' ? 'warning' : 'success',
      },
      {
        icon: Clock,
        label: 'Safe Outdoor Time',
        value: persona === 'asthma' ? '30 min' : persona === 'runner' ? '90 min' : '60 min',
        color: 'from-blue-500 to-cyan-500',
        status: 'info',
      },
      {
        icon: AlertTriangle,
        label: 'Risk Level',
        value: persona === 'asthma' ? 'Elevated' : 'Low',
        color: persona === 'asthma' ? 'from-orange-500 to-red-500' : 'from-gray-500 to-gray-600',
        status: persona === 'asthma' ? 'error' : 'neutral',
      },
      {
        icon: TrendingDown,
        label: 'Next Safe Window',
        value: '6:00 PM',
        color: 'from-purple-500 to-pink-500',
        status: 'info',
      },
    ];
    return baseMetrics;
  };

  const metrics = getMetrics();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.label} className="p-6">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${metric.color} mb-4 w-fit`}>
            <metric.icon className="w-6 h-6 text-white" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{metric.label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{metric.value}</p>
        </Card>
      ))}
    </div>
  );
}
