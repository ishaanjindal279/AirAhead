
import { useEffect, useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingUp } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { apiClient } from '../../api/client';
import { ForecastResponse } from '../../types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface MultiMetricForecastProps {
  city: string;
}

export function MultiMetricForecast({ city }: MultiMetricForecastProps) {
  const chartRef = useRef(null);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForecast = async () => {
      setLoading(true); // Reset loading state on city change
      try {
        const data = await apiClient.getForecast(city, 24); // Use prop city
        setForecast(data);
      } catch (e) {
        console.error("MultiMetric Load Failed", e);
      } finally {
        setLoading(false);
      }
    };
    fetchForecast();
  }, [city]); // Dependency on city

  if (loading || !forecast) {
     return <Card><div className="p-12 text-center">Loading live metrics...</div></Card>;
  }

  // Map API series to chart
  // Use first 7 points if daily, or just show hourly trend?
  // Let's show every 3rd hour to avoid overcrowding if 24h
  const points = forecast.series; 
  const labels = points.map(p => new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit' }));

  const data = {
    labels,
    datasets: [
      {
        label: 'AQI',
        data: points.map(p => p.aqi),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 2,
      },
      {
        label: 'PM2.5',
        data: points.map(p => p.pm2_5 || 0),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 2,
      },
      {
        label: 'PM10',
        data: points.map(p => p.pm10 || 0),
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 2,
      },
      {
        label: 'Ozone',
        data: points.map(p => p.o3 || 0),
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Multi-Metric Forecast (Live ML)</CardTitle>
            <CardDescription>Real-time AI prediction for {forecast.city}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success" dot>Spatial LightGBM v6</Badge>
            <Badge variant="info">MAE 24.5</Badge>
          </div>
        </div>
      </CardHeader>
      
      <div className="px-6 pb-6">
        <div className="h-[400px]">
          <Line ref={chartRef} data={data} options={options} />
        </div>
      </div>
    </Card>
  );
}
