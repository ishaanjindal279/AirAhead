import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { MultiMetricForecast } from '../components/forecast/MultiMetricForecast';
import { ComparisonChart } from '../components/forecast/ComparisonChart';
import { AccuracyMetrics } from '../components/forecast/AccuracyMetrics';
import { ForecastFilters } from '../components/forecast/ForecastFilters';

export function ForecastChartsView() {
  return (
    <div className="p-6 space-y-6">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Filters */}
        <ForecastFilters />

        {/* Multi-metric Forecast */}
        <MultiMetricForecast />

        {/* Comparison & Accuracy */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ComparisonChart />
          <AccuracyMetrics />
        </div>
      </div>
    </div>
  );
}
