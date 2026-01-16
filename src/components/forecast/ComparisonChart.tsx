
import { useEffect, useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { apiClient } from '../../api/client';
import { ForecastResponse } from '../../types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export function ComparisonChart() {
  const chartRef = useRef(null);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await apiClient.getForecast('delhi');
        setForecast(data);
      } catch (e) { console.error(e); }
    };
    fetch();
  }, []);

  if (!forecast) return <Card><div className="p-6">Loading comparison...</div></Card>;

  // Simulate "Actual" vs "Predicted"
  // We use the model forecast as "Predicted"
  // We create a noisy "Sensor" line to show "Actual" (Simulated)
  
  const points = forecast.series.slice(0, 12); // First 12 hours
  const labels = points.map(p => new Date(p.timestamp).toLocaleTimeString([], { hour: 'numeric' }));
  
  // Model Prediction (Smooth)
  const predicted = points.map(p => p.aqi);
  
  // Simulated Sensor Data (Noisy)
  // V6 model (MAE 24.5) implies sensor data deviates by ~20-30 points
  const actual = predicted.map(v => v + (Math.random() * 50 - 25));

  const data = {
    labels,
    datasets: [
      {
        label: 'Model Prediction (V6)',
        data: predicted,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderDash: [5, 5],
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
       
      },
      {
        label: 'Sensor Readings (Simulated)',
        data: actual,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.1,
        borderWidth: 2,
        pointRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
      },
      x: { grid: { display: false } },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prediction vs Actual (Simulation)</CardTitle>
        <CardDescription>Evaluating V6 Model smoothing against sensor noise</CardDescription>
      </CardHeader>
      
      <div className="px-6 pb-6">
        <div className="h-[300px]">
          <Line ref={chartRef} data={data} options={options} />
        </div>
      </div>
    </Card>
  );
}
