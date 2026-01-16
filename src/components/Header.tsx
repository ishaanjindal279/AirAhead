import { Bell, Settings, User, MapPin } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  currentPage?: string;
}

export function Header({ currentPage }: HeaderProps) {
  const getPageTitle = () => {
    const titles: Record<string, { title: string; subtitle: string }> = {
      overview: { title: 'Overview Dashboard', subtitle: 'Real-time air quality monitoring and forecasting' },
      forecast: { title: 'AQI Forecasts', subtitle: '7-day air quality predictions' },
      heatmap: { title: 'Pollution Heatmap', subtitle: 'Danger zones and hotspot analysis' },
      'peak-hours': { title: 'Peak Hour Analysis', subtitle: 'Hourly pollution patterns' },
      traffic: { title: 'Traffic & Routes', subtitle: 'Clean route recommendations' },
      health: { title: 'Health Alerts', subtitle: 'Personalized activity recommendations' },
      'smart-home': { title: 'Smart Home Control', subtitle: 'Air purifier automation' },
      government: { title: 'Government Dashboard', subtitle: 'Monitoring and compliance' },
      'design-system': { title: 'Design System', subtitle: 'UI components library' },
    };
    return titles[currentPage || 'overview'] || titles.overview;
  };

  const { title, subtitle } = getPageTitle();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{title}</h1>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 rounded-full text-sm">
              <MapPin className="w-3 h-3" />
              <span>San Francisco, CA</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          <button className="relative p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          
          <div className="hidden md:flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-gray-700">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Admin User</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">admin@aqiplatform.com</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
