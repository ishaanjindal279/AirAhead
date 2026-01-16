
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { MultiMetricForecast } from '../components/forecast/MultiMetricForecast';
import { ComparisonChart } from '../components/forecast/ComparisonChart';
import { AccuracyMetrics } from '../components/forecast/AccuracyMetrics';
import { ForecastFilters } from '../components/forecast/ForecastFilters';

export function ForecastChartsView() {
  const [city, setCity] = useState("Delhi");

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Filters - Now Controlled */}
        <ForecastFilters 
          selectedCity={city}
          onCityChange={setCity}
        />

        {/* Multi-metric Forecast - Reacts to city */}
        <MultiMetricForecast city={city} />

        {/* Comparison & Accuracy */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ComparisonChart />
          <AccuracyMetrics />
        </div>
      </div>
    </div>
  );
}
