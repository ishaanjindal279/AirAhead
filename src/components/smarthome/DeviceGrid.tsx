import { Card } from '../ui/Card';
import { Wind, Thermometer, Droplets, Fan, Power, Settings } from 'lucide-react';
import { Badge } from '../ui/Badge';

export function DeviceGrid() {
  const devices = [
    {
      icon: Wind,
      name: 'Living Room Purifier',
      status: 'active',
      mode: 'Auto',
      aqi: 42,
      power: 'On',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Wind,
      name: 'Bedroom Purifier',
      status: 'active',
      mode: 'Sleep',
      aqi: 38,
      power: 'On',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Fan,
      name: 'Kitchen Ventilation',
      status: 'idle',
      mode: 'Manual',
      aqi: 55,
      power: 'Off',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Thermometer,
      name: 'Smart Thermostat',
      status: 'active',
      mode: 'Eco',
      aqi: 45,
      power: 'On',
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {devices.map((device, index) => (
        <Card key={index} className="p-6 hover:shadow-lg transition-all group">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${device.color}`}>
              <device.icon className="w-6 h-6 text-white" />
            </div>
            <Badge 
              variant={device.power === 'On' ? 'success' : 'default'} 
              size="sm"
              dot
            >
              {device.power}
            </Badge>
          </div>

          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {device.name}
          </h3>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
              <span>Mode:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{device.mode}</span>
            </div>
            <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
              <span>Room AQI:</span>
              <Badge variant="aqi-good" size="sm">{device.aqi}</Badge>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
            <button className="flex-1 py-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors text-sm font-medium flex items-center justify-center gap-2">
              <Power className="w-4 h-4" />
              <span>Toggle</span>
            </button>
            <button className="p-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}
