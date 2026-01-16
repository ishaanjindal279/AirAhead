import { useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { TrendingUp } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

interface PeakHourChartProps {
  selectedHour: number;
}

export function PeakHourChart({ selectedHour }: PeakHourChartProps) {
  const chartRef = useRef(null);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const labels = hours.map(h => h === 0 ? '12AM' : h < 12 ? `${h}AM` : h === 12 ? '12PM' : `${h-12}PM`);
  
  // Simulated AQI data peaking during rush hours
  const aqiData = hours.map(h => {
    if (h >= 7 && h <= 9) return 85 + Math.random() * 15; // Morning rush
    if (h >= 17 && h <= 19) return 90 + Math.random() * 20; // Evening rush
    if (h >= 22 || h <= 5) return 40 + Math.random() * 15; // Night
    return 60 + Math.random() * 20; // Other hours
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Hourly AQI',
        data: aqiData,
        backgroundColor: hours.map(h => 
          h === selectedHour 
            ? 'rgba(59, 130, 246, 0.8)'
            : aqiData[h] > 85 
              ? 'rgba(239, 68, 68, 0.5)'
              : aqiData[h] > 60
                ? 'rgba(245, 158, 11, 0.5)'
                : 'rgba(16, 185, 129, 0.5)'
        ),
        borderColor: hours.map(h => 
          h === selectedHour ? 'rgb(59, 130, 246)' : 'transparent'
        ),
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
        callbacks: {
          label: function(context: any) {
            return `AQI: ${Math.round(context.parsed.y)}`;
          },
          afterLabel: function(context: any) {
            const aqi = Math.round(context.parsed.y);
            if (aqi > 85) return 'Peak Hour - High Pollution';
            if (aqi > 60) return 'Moderate Pollution';
            return 'Low Pollution';
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 120,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        title: {
          display: true,
          text: 'AQI Level'
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
            <CardTitle>24-Hour Pollution Pattern</CardTitle>
            <CardDescription>Hourly AQI trends with peak identification</CardDescription>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 rounded-lg text-sm font-medium">
            <TrendingUp className="w-4 h-4" />
            <span>Peak: 5-7 PM</span>
          </div>
        </div>
      </CardHeader>
      
      <div className="px-6 pb-6">
        <div className="h-[400px]">
          <Bar ref={chartRef} data={data} options={options} />
        </div>
      </div>
    </Card>
  );
}
