import { Clock, Layers, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeatmapControlsProps {
  timeSlot: string;
  onTimeSlotChange: (time: string) => void;
  pollutant: string;
  onPollutantChange: (pollutant: string) => void;
}

export function HeatmapControls({ timeSlot, onTimeSlotChange, pollutant, onPollutantChange }: HeatmapControlsProps) {
  const timeSlots = [
    { value: 'current', label: 'Current' },
    { value: '6h', label: '+6 Hours' },
    { value: '12h', label: '+12 Hours' },
    { value: '24h', label: '+24 Hours' },
  ];

  const pollutants = [
    { value: 'aqi', label: 'Overall AQI' },
    { value: 'pm25', label: 'PM2.5' },
    { value: 'pm10', label: 'PM10' },
    { value: 'ozone', label: 'Ozone' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Time Toggle */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Clock className="w-4 h-4" />
              Time Period
            </label>
            <div className="flex gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot.value}
                  onClick={() => onTimeSlotChange(slot.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    timeSlot === slot.value
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pollutant Selector */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Layers className="w-4 h-4" />
              Pollutant Type
            </label>
            <select
              value={pollutant}
              onChange={(e) => onPollutantChange(e.target.value)}
              className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-gray-100"
            >
              {pollutants.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
        </div>

        <Button variant="outline" size="sm" icon={<RefreshCw className="w-4 h-4" />}>
          Refresh Data
        </Button>
      </div>
    </div>
  );
}
