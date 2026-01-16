import { useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Download } from 'lucide-react';
import { Button } from '../ui/Button';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function EmissionsReport() {
  const chartRef = useRef(null);

  const data = {
    labels: ['Transportation', 'Industrial', 'Construction', 'Residential', 'Commercial', 'Agriculture'],
    datasets: [
      {
        label: 'Current Month',
        data: [45, 38, 28, 15, 22, 12],
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2,
      },
      {
        label: 'Last Month',
        data: [42, 35, 32, 14, 20, 11],
        backgroundColor: 'rgba(156, 163, 175, 0.5)',
        borderColor: 'rgb(156, 163, 175)',
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
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y}% of total emissions`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 50,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        title: {
          display: true,
          text: 'Percentage of Total Emissions'
        }
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
            <CardTitle>Emissions Sources Report</CardTitle>
            <CardDescription>Sector-wise pollution contribution analysis</CardDescription>
          </div>
          <Button variant="outline" size="sm" icon={<Download className="w-4 h-4" />}>
            Export Report
          </Button>
        </div>
      </CardHeader>
      
      <div className="px-6 pb-6">
        <div className="h-[350px]">
          <Bar ref={chartRef} data={data} options={options} />
        </div>
      </div>
    </Card>
  );
}
