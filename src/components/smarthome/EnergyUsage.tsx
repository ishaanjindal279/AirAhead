import { useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Zap, TrendingDown } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function EnergyUsage() {
  const chartRef = useRef(null);

  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Energy (kWh)',
        data: [3.2, 2.8, 3.5, 3.1, 2.9, 2.5, 2.7],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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
            <CardTitle>Energy Usage</CardTitle>
            <CardDescription>Weekly consumption trends</CardDescription>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium">
            <TrendingDown className="w-4 h-4" />
            <span>-12% vs last week</span>
          </div>
        </div>
      </CardHeader>
      
      <div className="px-6 pb-6">
        <div className="h-[280px]">
          <Bar ref={chartRef} data={data} options={options} />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">This Week</p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">20.7 kWh</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Avg/Day</p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">2.96 kWh</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Cost</p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">$3.11</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
