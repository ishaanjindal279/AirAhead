
import { Calendar, MapPin, Filter } from 'lucide-react';
import { Button } from '../ui/Button';

interface ForecastFiltersProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
  // We can add time range and metric filters later if needed
}

export function ForecastFilters({ selectedCity, onCityChange }: ForecastFiltersProps) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <select 
            className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
          >
            <option value="Delhi">Delhi, NCR</option>
            <option value="Noida">Noida, UP</option>
            <option value="Gurgaon">Gurgaon, HR</option>
            <option value="Faridabad">Faridabad, HR</option>
            <option value="Ghaziabad">Ghaziabad, UP</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <select className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100">
            <option>24 Hours</option>
            <option>3 Days</option>
            <option>7 Days</option>
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
        Details
      </Button>
    </div>
  );
}
