import { Home, TrendingUp, Map, Clock, Car, Heart, Home as HomeIcon, Shield, Palette, Menu, X, BarChart3 } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNavigate?: (page: string) => void;
  currentPage?: string;
}

export function Sidebar({ isOpen, onToggle, onNavigate, currentPage = 'overview' }: SidebarProps) {
  const menuItems = [
    { icon: Home, label: 'Overview', page: 'overview', description: 'Dashboard home' },
    { icon: TrendingUp, label: 'AQI Forecasts', page: 'forecast', description: '7-day predictions' },
    { icon: Map, label: 'Heatmap & Zones', page: 'heatmap', description: 'Pollution maps' },
    { icon: Clock, label: 'Peak Hours', page: 'peak-hours', description: 'Hourly analysis' },
    { icon: Car, label: 'Traffic & Routes', page: 'traffic', description: 'Clean routes' },
    { icon: Heart, label: 'Health Alerts', page: 'health', description: 'Persona insights' },
    { icon: HomeIcon, label: 'Smart Home', page: 'smart-home', description: 'Air purifiers' },
    { icon: Shield, label: 'Government', page: 'government', description: 'Monitoring' },
    { icon: Palette, label: 'Design System', page: 'design-system', description: 'UI components' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-gray-900 dark:text-gray-100 block">AQI Platform</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">v2.0</span>
            </div>
          </div>
          <button onClick={onToggle} className="lg:hidden p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-88px)]">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => onNavigate?.(item.page)}
              className={`
                w-full flex items-start gap-3 px-4 py-3 rounded-lg transition-all
                ${currentPage === item.page
                  ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }
              `}
            >
              <item.icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                currentPage === item.page ? 'text-blue-600 dark:text-blue-400' : ''
              }`} />
              <div className="text-left flex-1">
                <div className="font-medium">{item.label}</div>
                <div className="text-xs opacity-75 mt-0.5">{item.description}</div>
              </div>
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile menu button */}
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 lg:hidden w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center z-10 hover:bg-blue-700 transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>
    </>
  );
}
