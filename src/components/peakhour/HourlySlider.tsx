import { Card } from '../ui/Card';
import { Clock, Sun, Moon, Sunrise, Sunset } from 'lucide-react';

interface HourlySliderProps {
  selectedHour: number;
  onHourChange: (hour: number) => void;
}

export function HourlySlider({ selectedHour, onHourChange }: HourlySliderProps) {
  const getTimeIcon = (hour: number) => {
    if (hour >= 6 && hour < 8) return Sunrise;
    if (hour >= 8 && hour < 18) return Sun;
    if (hour >= 18 && hour < 20) return Sunset;
    return Moon;
  };

  const TimeIcon = getTimeIcon(selectedHour);

  const formatTime = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    if (hour > 12) return `${hour - 12} PM`;
    return `${hour} AM`;
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-950 rounded-xl">
            <TimeIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Time Selection</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Slide to view hourly pollution patterns</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">Selected Time</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatTime(selectedHour)}</p>
        </div>
      </div>

      {/* Slider */}
      <div className="relative">
        <input
          type="range"
          min="0"
          max="23"
          value={selectedHour}
          onChange={(e) => onHourChange(parseInt(e.target.value))}
          className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, rgb(59, 130, 246) 0%, rgb(59, 130, 246) ${(selectedHour / 23) * 100}%, rgb(229, 231, 235) ${(selectedHour / 23) * 100}%, rgb(229, 231, 235) 100%)`
          }}
        />
        
        {/* Hour markers */}
        <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          {[0, 6, 12, 18, 23].map((hour) => (
            <span key={hour} className={hour === selectedHour ? 'font-bold text-blue-600 dark:text-blue-400' : ''}>
              {formatTime(hour)}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}
