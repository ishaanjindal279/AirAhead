import { useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export function ComparisonChart() {
  const chartRef = useRef(null);

  const labels = ['12AM', '6AM', '12PM', '6PM', '12AM'];
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Predicted',
        data: [55, 62, 78, 85, 70],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderDash: [5, 5],
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: 'Actual',
        data: [52, 65, 75, 82, 68],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
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
        <CardTitle>Prediction vs Actual</CardTitle>
        <CardDescription>Model accuracy comparison for last 24 hours</CardDescription>
      </CardHeader>
      
      <div className="px-6 pb-6">
        <div className="h-[300px]">
          <Line ref={chartRef} data={data} options={options} />
        </div>
      </div>
    </Card>
  );
}
