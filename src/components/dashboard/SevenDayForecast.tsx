import { useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Calendar, TrendingUp } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

export function SevenDayForecast() {
  const chartRef = useRef(null);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const aqiValues = [65, 72, 85, 78, 68, 55, 62];
  
  const data = {
    labels: days,
    datasets: [
      {
        label: 'AQI Forecast',
        data: aqiValues,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 3,
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
        titleColor: '#fff',
        bodyColor: '#fff',
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            const aqi = context.parsed.y;
            let quality = '';
            if (aqi <= 50) quality = 'Good';
            else if (aqi <= 100) quality = 'Moderate';
            else if (aqi <= 150) quality = 'Unhealthy for Sensitive';
            return `AQI: ${aqi} (${quality})`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 150,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: function(value: any) {
            return value;
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800';
    if (aqi <= 100) return 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
    return 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>7-Day AQI Forecast</CardTitle>
            <CardDescription>Predicted air quality trends for the upcoming week</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium">
              <Calendar className="w-4 h-4" />
              <span>Weekly</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <div className="px-6 pb-6">
        <div className="h-[280px] mb-6">
          <Line ref={chartRef} data={data} options={options} />
        </div>

        {/* Daily breakdown */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => (
            <div 
              key={day}
              className={`p-3 rounded-lg border text-center ${getAQIColor(aqiValues[index])}`}
            >
              <div className="text-xs font-medium mb-1">{day}</div>
              <div className="text-lg font-bold">{aqiValues[index]}</div>
              <div className="text-xs opacity-75 mt-1">
                {aqiValues[index] <= 50 ? 'Good' : aqiValues[index] <= 100 ? 'Moderate' : 'Unhealthy'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
