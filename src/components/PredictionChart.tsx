import { useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Brain } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

interface PredictionChartProps {
  location: string;
}

export function PredictionChart({ location }: PredictionChartProps) {
  const chartRef = useRef(null);

  const labels = ['Now', '+6h', '+12h', '+18h', '+24h', '+30h', '+36h'];
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Predicted AQI',
        data: [68, 72, 78, 85, 82, 75, 70],
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: 'rgb(147, 51, 234)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
      {
        label: 'Confidence Range (Upper)',
        data: [70, 78, 85, 92, 90, 83, 77],
        borderColor: 'rgba(147, 51, 234, 0.3)',
        backgroundColor: 'rgba(147, 51, 234, 0.05)',
        borderWidth: 1,
        borderDash: [5, 5],
        tension: 0.4,
        pointRadius: 0,
        fill: '+1',
      },
      {
        label: 'Confidence Range (Lower)',
        data: [66, 66, 71, 78, 74, 67, 63],
        borderColor: 'rgba(147, 51, 234, 0.3)',
        backgroundColor: 'rgba(147, 51, 234, 0.05)',
        borderWidth: 1,
        borderDash: [5, 5],
        tension: 0.4,
        pointRadius: 0,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
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
        max: 150,
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
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">AQI Prediction - Next 36 Hours</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">ML-powered forecasting with confidence intervals</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium">
          <Brain className="w-4 h-4" />
          <span>AI Model</span>
        </div>
      </div>
      <div className="h-[300px]">
        <Line ref={chartRef} data={data} options={options} />
      </div>
    </div>
  );
}