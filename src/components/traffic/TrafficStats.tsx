
import { useEffect, useState } from 'react';
import { Car, Route, Clock, Wind, AlertTriangle, TrendingDown } from 'lucide-react';
import { Card } from '../ui/Card';

interface StatItem {
  icon: typeof Car;
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  color: string;
}

export function TrafficStats() {
  const [stats, setStats] = useState<StatItem[]>([
    { icon: Car, label: 'Monitored Zones', value: '...', change: '', changeType: 'neutral', color: 'from-blue-500 to-cyan-500' },
    { icon: Route, label: 'Clean Routes', value: '...', change: '', changeType: 'neutral', color: 'from-green-500 to-emerald-500' },
    { icon: AlertTriangle, label: 'High AQI Zones', value: '...', change: '', changeType: 'neutral', color: 'from-red-500 to-orange-500' },
    { icon: Wind, label: 'Avg Zone AQI', value: '...', change: '', changeType: 'neutral', color: 'from-purple-500 to-pink-500' },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:8000/hotspots');
        const data = await res.json();
        
        const grid = data.grid || [];
        const totalZones = grid.length;
        const cleanZones = grid.filter((p: any) => p.aqi <= 100).length;
        const highAQIZones = grid.filter((p: any) => p.aqi > 300).length;
        const avgAQI = grid.length > 0 
          ? Math.round(grid.reduce((sum: number, p: any) => sum + p.aqi, 0) / grid.length)
          : 0;

        setStats([
          {
            icon: Car,
            label: 'Monitored Zones',
            value: totalZones.toString(),
            change: 'Live Data',
            changeType: 'neutral',
            color: 'from-blue-500 to-cyan-500',
          },
          {
            icon: Route,
            label: 'Clean Routes',
            value: cleanZones.toString(),
            change: cleanZones > 0 ? `${Math.round(cleanZones/totalZones*100)}% clean` : 'None',
            changeType: cleanZones > 10 ? 'positive' : 'negative',
            color: 'from-green-500 to-emerald-500',
          },
          {
            icon: AlertTriangle,
            label: 'High AQI Zones',
            value: highAQIZones.toString(),
            change: highAQIZones > 50 ? 'Critical!' : 'Manageable',
            changeType: highAQIZones > 50 ? 'negative' : 'neutral',
            color: 'from-red-500 to-orange-500',
          },
          {
            icon: Wind,
            label: 'Avg Zone AQI',
            value: avgAQI.toString(),
            change: avgAQI > 300 ? 'Very Poor' : avgAQI > 200 ? 'Poor' : avgAQI > 100 ? 'Moderate' : 'Good',
            changeType: avgAQI > 200 ? 'negative' : avgAQI > 100 ? 'neutral' : 'positive',
            color: 'from-purple-500 to-pink-500',
          },
        ]);
      } catch (e) {
        console.error("Stats fetch failed", e);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <span className={`text-sm font-semibold ${
              stat.changeType === 'positive' ? 'text-green-600 dark:text-green-400' :
              stat.changeType === 'negative' ? 'text-red-600 dark:text-red-400' :
              'text-gray-500'
            }`}>
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
