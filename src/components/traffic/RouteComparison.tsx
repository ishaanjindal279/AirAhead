import { useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function RouteComparison() {
  const chartRef = useRef(null);

  const data = {
    labels: ['Coastal Highway', 'Park Boulevard', 'Downtown Express', 'Marina Route', 'Highway 101'],
    datasets: [
      {
        label: 'Average AQI',
        data: [45, 52, 88, 62, 78],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(16, 185, 129, 0.6)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(245, 158, 11, 0.6)',
        ],
        borderColor: [
          'rgb(16, 185, 129)',
          'rgb(16, 185, 129)',
          'rgb(239, 68, 68)',
          'rgb(245, 158, 11)',
          'rgb(245, 158, 11)',
        ],
        borderWidth: 2,
      },
      {
        label: 'Travel Time (min)',
        data: [18, 22, 15, 25, 20],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
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
        <CardTitle>Route Comparison</CardTitle>
        <CardDescription>Air quality vs travel time analysis</CardDescription>
      </CardHeader>
      
      <div className="px-6 pb-6">
        <div className="h-[300px]">
          <Bar ref={chartRef} data={data} options={options} />
        </div>
      </div>
    </Card>
  );
}
