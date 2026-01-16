import { TrendingUp, TrendingDown, Wind, Droplets, ThermometerSun, Activity } from 'lucide-react';

interface AQIOverviewProps {
  location: string;
}

export function AQIOverview({ location }: AQIOverviewProps) {
  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800';
    if (aqi <= 100) return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800';
    if (aqi <= 150) return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800';
    if (aqi <= 200) return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800';
    return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800';
  };

  const getAQILabel = (aqi: number) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    return 'Very Unhealthy';
  };

  const currentAQI = 68;
  const aqiColorClass = getAQIColor(currentAQI);

  const metrics = [
    {
      icon: Activity,
      label: 'Current AQI',
      value: currentAQI.toString(),
      sublabel: getAQILabel(currentAQI),
      trend: -5,
      color: aqiColorClass,
    },
    {
      icon: TrendingUp,
      label: '24h Prediction',
      value: '72',
      sublabel: 'Moderate',
      trend: 4,
      color: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800',
    },
    {
      icon: Wind,
      label: 'PM2.5',
      value: '28.5',
      sublabel: 'μg/m³',
      trend: -2,
      color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',
    },
    {
      icon: Droplets,
      label: 'PM10',
      value: '45.2',
      sublabel: 'μg/m³',
      trend: 1,
      color: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800',
    },
    {
      icon: ThermometerSun,
      label: 'Temperature',
      value: '72°F',
      sublabel: 'Current',
      trend: 3,
      color: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className={`bg-white border rounded-xl p-6 hover:shadow-md transition-shadow ${metric.color.split(' ').find(c => c.startsWith('border-'))}`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-lg ${metric.color.split(' ').slice(1).join(' ')}`}>
              <metric.icon className={`w-6 h-6 ${metric.color.split(' ')[0]} ${metric.color.split(' ')[1]}`} />
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${metric.trend > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
              {metric.trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(metric.trend)}%
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{metric.label}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{metric.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{metric.sublabel}</p>
          </div>
        </div>
      ))}
    </div>
  );
}