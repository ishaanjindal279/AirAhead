import { Calendar, MapPin, Filter } from 'lucide-react';
import { Button } from '../ui/Button';

export function ForecastFilters() {
  return (
    <div className="flex items-center justify-between flex-wrap gap-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <select className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100">
            <option>San Francisco, CA</option>
            <option>Los Angeles, CA</option>
            <option>New York, NY</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <select className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100">
            <option>7 Days</option>
            <option>14 Days</option>
            <option>30 Days</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <select className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100">
            <option>All Metrics</option>
            <option>AQI Only</option>
            <option>PM2.5 Only</option>
            <option>PM10 Only</option>
          </select>
        </div>
      </div>

      <Button variant="primary" size="sm">
        Apply Filters
      </Button>
    </div>
  );
}
