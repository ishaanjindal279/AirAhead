import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Wind, Droplets, Gauge, ThermometerSun } from 'lucide-react';

interface HourlyBreakdownProps {
  selectedHour: number;
}

export function HourlyBreakdown({ selectedHour }: HourlyBreakdownProps) {
  const isPeakHour = (selectedHour >= 7 && selectedHour <= 9) || (selectedHour >= 17 && selectedHour <= 19);
  
  const metrics = [
    {
      icon: Wind,
      label: 'PM2.5',
      value: isPeakHour ? 38.5 : 22.3,
      unit: 'μg/m³',
      status: isPeakHour ? 'high' : 'moderate',
    },
    {
      icon: Droplets,
      label: 'PM10',
      value: isPeakHour ? 62.1 : 41.8,
      unit: 'μg/m³',
      status: isPeakHour ? 'high' : 'moderate',
    },
    {
      icon: Gauge,
      label: 'Ozone',
      value: selectedHour >= 12 && selectedHour <= 16 ? 68 : 42,
      unit: 'ppb',
      status: selectedHour >= 12 && selectedHour <= 16 ? 'high' : 'moderate',
    },
    {
      icon: ThermometerSun,
      label: 'Temperature',
      value: selectedHour >= 14 && selectedHour <= 17 ? 78 : selectedHour >= 22 || selectedHour <= 6 ? 58 : 68,
      unit: '°F',
      status: 'moderate',
    },
  ];

  const getStatusColor = (status: string) => {
    if (status === 'high') return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950';
    if (status === 'moderate') return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950';
    return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pollutant Breakdown</CardTitle>
        <CardDescription>Detailed metrics for selected hour</CardDescription>
      </CardHeader>
      
      <div className="px-6 pb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className={`p-4 rounded-xl border ${getStatusColor(metric.status)}`}
          >
            <metric.icon className="w-6 h-6 mb-3" />
            <p className="text-xs opacity-75 mb-1">{metric.label}</p>
            <p className="text-2xl font-bold">{metric.value}</p>
            <p className="text-xs opacity-75 mt-1">{metric.unit}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
