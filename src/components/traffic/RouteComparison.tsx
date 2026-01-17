
import { useEffect, useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Badge } from '../ui/Badge';
import { Navigation, Clock, Leaf } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Delhi NCR Routes
const ROUTES = [
  { name: 'NH-48 (Gurgaon)', distance: 28, baseTime: 45, via: 'Cyber City' },
  { name: 'Ring Road (South)', distance: 22, baseTime: 38, via: 'AIIMS' },
  { name: 'DND Flyway', distance: 18, baseTime: 25, via: 'Noida' },
  { name: 'Outer Ring Road', distance: 32, baseTime: 52, via: 'Nehru Place' },
  { name: 'GT Karnal Road', distance: 24, baseTime: 40, via: 'Azadpur' },
];

const getAQIColor = (aqi: number) => {
  if (aqi <= 100) return 'rgba(16, 185, 129, 0.8)';
  if (aqi <= 200) return 'rgba(250, 204, 21, 0.8)';
  if (aqi <= 300) return 'rgba(249, 115, 22, 0.8)';
  return 'rgba(239, 68, 68, 0.8)';
};

const getAQIBorder = (aqi: number) => {
  if (aqi <= 100) return 'rgb(16, 185, 129)';
  if (aqi <= 200) return 'rgb(250, 204, 21)';
  if (aqi <= 300) return 'rgb(249, 115, 22)';
  return 'rgb(239, 68, 68)';
};

export function RouteComparison() {
  const chartRef = useRef(null);
  const [routeData, setRouteData] = useState<{ aqi: number[], times: number[] }>({ aqi: [], times: [] });
  const [bestRoute, setBestRoute] = useState<number | null>(null);

  useEffect(() => {
    // Fetch live AQI for routes (simulated from hotspots endpoint)
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:8000/hotspots');
        const data = await res.json();
        
        // Sample AQI values from grid for different routes (simulated mapping)
        const grid = data.grid || [];
        const sampleAQIs = ROUTES.map((route, idx) => {
          // Pick different grid points for each route
          const samplePoint = grid[Math.min(idx * 20, grid.length - 1)];
          return samplePoint?.aqi || 280 + Math.random() * 100;
        });
        
        // Calculate adjusted travel times based on congestion
        const times = ROUTES.map((route, idx) => {
          const congestionFactor = sampleAQIs[idx] > 300 ? 1.4 : sampleAQIs[idx] > 200 ? 1.2 : 1;
          return Math.round(route.baseTime * congestionFactor);
        });

        setRouteData({ aqi: sampleAQIs, times });

        // Find best route (lowest combined score of AQI + time)
        const scores = sampleAQIs.map((aqi, idx) => aqi * 0.3 + times[idx] * 2);
        const minIdx = scores.indexOf(Math.min(...scores));
        setBestRoute(minIdx);
      } catch (e) {
        console.error("Route data fetch failed", e);
        // Fallback data
        setRouteData({
          aqi: [320, 385, 290, 340, 310],
          times: [52, 53, 28, 68, 48]
        });
        setBestRoute(2);
      }
    };
    fetchData();
  }, []);

  const data = {
    labels: ROUTES.map(r => r.name),
    datasets: [
      {
        label: 'Average AQI',
        data: routeData.aqi,
        backgroundColor: routeData.aqi.map(getAQIColor),
        borderColor: routeData.aqi.map(getAQIBorder),
        borderWidth: 2,
        yAxisID: 'y',
      },
      {
        label: 'Travel Time (min)',
        data: routeData.times,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        yAxisID: 'y1',
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
        type: 'linear' as const,
        position: 'left' as const,
        beginAtZero: true,
        title: { display: true, text: 'AQI' },
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
      },
      y1: {
        type: 'linear' as const,
        position: 'right' as const,
        beginAtZero: true,
        title: { display: true, text: 'Time (min)' },
        grid: { display: false },
      },
      x: { grid: { display: false } },
    },
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="w-5 h-5" />
              Route Comparison
            </CardTitle>
            <CardDescription>NCR Routes: Air quality vs travel time</CardDescription>
          </div>
          {bestRoute !== null && (
            <Badge variant="success" className="flex items-center gap-1 px-3 py-1">
              <Leaf className="w-3 h-3" />
              Best: {ROUTES[bestRoute].name}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <div className="px-6 pb-6">
        <div className="h-[300px]">
          <Bar ref={chartRef} data={data} options={options} />
        </div>
        
        {/* Route Details */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-3">
          {ROUTES.map((route, idx) => (
            <div 
              key={route.name}
              className={`p-3 rounded-lg border text-center transition-all ${
                bestRoute === idx 
                  ? 'border-green-500 bg-green-50 dark:bg-green-950/30' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="text-xs text-gray-500 mb-1">via {route.via}</div>
              <div className="text-sm font-bold">{route.distance} km</div>
              <div className="flex items-center justify-center gap-1 text-xs mt-1 text-gray-600">
                <Clock className="w-3 h-3" />
                {routeData.times[idx] || route.baseTime} min
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
