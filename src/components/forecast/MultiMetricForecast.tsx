import { useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingUp } from 'lucide-react';
import { Badge } from '../ui/Badge';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export function MultiMetricForecast() {
  const chartRef = useRef(null);

  const labels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
  
  const data = {
    labels,
    datasets: [
      {
        label: 'AQI',
        data: [65, 72, 85, 78, 68, 55, 62],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
      },
      {
        label: 'PM2.5',
        data: [25, 28, 35, 32, 27, 22, 24],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
      },
      {
        label: 'PM10',
        data: [42, 48, 55, 51, 45, 38, 41],
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
      },
      {
        label: 'Ozone',
        data: [48, 52, 58, 54, 50, 45, 47],
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
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
            <CardTitle>Multi-Metric 7-Day Forecast</CardTitle>
            <CardDescription>Comprehensive air quality predictions across all pollutants</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success" dot>ML Model v3.2</Badge>
            <Badge variant="info">95% Accuracy</Badge>
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
