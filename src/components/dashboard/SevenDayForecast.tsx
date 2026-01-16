import { useEffect, useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Calendar } from 'lucide-react';
import { apiClient } from '../../api/client';
import { ForecastResponse } from '../../types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

export function SevenDayForecast() {
  const chartRef = useRef(null);
  const [data, setData] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await apiClient.getForecast('delhi');
        setData(resp);
      } catch (err) {
        console.error("Failed to load forecast", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !data) {
    return (
      <Card>
        <div className="p-12 text-center text-gray-500">Loading forecast...</div>
      </Card>
    );
  }

  // Process API series for chart
  // API returns 24h forecast (or more). For 7-day, we might need longer horizon or we just show what we have.
  // The backend default H is 24. If we want 7 days, we need H=168.
  // But wait, the component name is "SevenDayForecast". The backend logic I wrote projects mostly for 24h (h in loop).
  // If I request H=72 (3 days) or generic... 
  // Let's stick to what we have (24h) and maybe label the chart "24-Hour Forecast" or adjust the request.
  // The user prompt didn't specify changing the horizon logic deep down.
  // I'll show the data we have. If it's 24 points, it's a daily chart.
  
  const labels = data.series.map(p => {
    const d = new Date(p.timestamp);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });
  
  const aqiValues = data.series.map(p => p.aqi);
  
  const chartData = {
    labels: labels,
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
        pointRadius: 4, // Smaller for 24 points
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
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
            else if (aqi <= 100) quality = 'Satisfactory';
            else if (aqi <= 200) quality = 'Moderate';
            else if (aqi <= 300) quality = 'Poor';
            else if (aqi <= 400) quality = 'Very Poor';
            else quality = 'Severe';
            return `AQI: ${aqi} (${quality})`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        // No hard max, let it scale
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
      },
      x: {
        grid: { display: false },
        ticks: { maxTicksLimit: 8 } // Don't crowd X axis
      },
    },
  };

  // Helper for daily bubbles (below chart) - We can just show a few key hours
  // Or remove the daily breakdown since we are showing hourly now.
  // The original UI had 7 days. We have 24 hours.
  // I will adapt the bottom section to show "Key Times" (Morning, Afternoon, Evening, Night)

  const getKeyTimeIndex = (hour: number) => {
     // find closest index in series
     return data.series.findIndex(p => new Date(p.timestamp).getHours() === hour);
  };
  
  const keyHours = [8, 12, 18, 22]; // 8am, 12pm, 6pm, 10pm
  const keyPoints = keyHours.map(h => {
     const idx = getKeyTimeIndex(h);
     return idx !== -1 ? data.series[idx] : null;
  }).filter(Boolean);

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800';
    if (aqi <= 100) return 'bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800'; 
    if (aqi <= 200) return 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
    if (aqi <= 300) return 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800';
    return 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Forecast (24 Hours)</CardTitle>
            <CardDescription>Predicted air quality trend in {data.city}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium">
              <Calendar className="w-4 h-4" />
              <span>24h</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <div className="px-6 pb-6">
        <div className="h-[280px] mb-6">
          <Line ref={chartRef} data={chartData} options={options} />
        </div>

        {/* Key Time Breakdown */}
        <div className="grid grid-cols-4 gap-2">
          {keyPoints.map((point: any, index) => {
             const d = new Date(point.timestamp);
             const label = d.toLocaleTimeString([], {hour: 'numeric', hour12: true});
             return (
            <div 
              key={point.timestamp}
              className={`p-3 rounded-lg border text-center ${getAQIColor(point.aqi)}`}
            >
              <div className="text-xs font-medium mb-1">{label}</div>
              <div className="text-lg font-bold">{point.aqi}</div>
              <div className="text-xs opacity-75 mt-1">
                {point.aqi <= 50 ? 'Good' : point.aqi <= 200 ? 'Moderate' : 'Poor'}
              </div>
            </div>
          )})}
        </div>
      </div>
    </Card>
  );
}
