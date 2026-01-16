import { MapPin, ChevronDown } from 'lucide-react';

interface LocationSelectorProps {
  selectedLocation: string;
  onLocationChange: (location: string) => void;
}

export function LocationSelector({ selectedLocation, onLocationChange }: LocationSelectorProps) {
  const locations = [
    'San Francisco, CA',
    'Los Angeles, CA',
    'New York, NY',
    'Chicago, IL',
    'Houston, TX',
    'Phoenix, AZ',
  ];

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
        <MapPin className="w-5 h-5" />
        <span className="font-medium">Location:</span>
      </div>
      <div className="relative">
        <select
          value={selectedLocation}
          onChange={(e) => onLocationChange(e.target.value)}
          className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-10 font-medium text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
        >
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
      </div>
    </div>
  );
}