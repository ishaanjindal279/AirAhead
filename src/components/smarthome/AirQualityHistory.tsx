import { useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export function AirQualityHistory() {
  const chartRef = useRef(null);

  const labels = ['12AM', '4AM', '8AM', '12PM', '4PM', '8PM', '12AM'];
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Outdoor AQI',
        data: [58, 62, 75, 85, 92, 78, 65],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: 'Indoor AQI (Living Room)',
        data: [45, 48, 52, 48, 42, 38, 40],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: 'Indoor AQI (Bedroom)',
        data: [42, 44, 46, 43, 38, 35, 36],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        borderWidth: 2,
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
        <CardTitle>Indoor vs Outdoor Air Quality</CardTitle>
        <CardDescription>24-hour comparison showing purifier effectiveness</CardDescription>
      </CardHeader>
      
      <div className="px-6 pb-6">
        <div className="h-[350px]">
          <Line ref={chartRef} data={data} options={options} />
        </div>
      </div>
    </Card>
  );
}
