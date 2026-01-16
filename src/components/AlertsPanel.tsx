import { AlertTriangle, AlertCircle, Info, CheckCircle, Clock } from 'lucide-react';

export function AlertsPanel() {
  const alerts = [
    {
      type: 'warning',
      title: 'AQI Spike Predicted',
      message: 'Expected AQI increase to 85 in next 12 hours',
      time: '2 min ago',
      icon: AlertTriangle,
      color: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800',
    },
    {
      type: 'info',
      title: 'Weather Update',
      message: 'Low wind conditions may affect air quality',
      time: '15 min ago',
      icon: Info,
      color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',
    },
    {
      type: 'success',
      title: 'Air Quality Improving',
      message: 'AQI decreased by 12 points in San Diego',
      time: '1 hour ago',
      icon: CheckCircle,
      color: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
    },
    {
      type: 'alert',
      title: 'High Pollution Alert',
      message: 'PM2.5 levels exceeding safe limits in LA',
      time: '3 hours ago',
      icon: AlertCircle,
      color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Alerts</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">System notifications</p>
        </div>
        <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className={`border rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer ${alert.color.split(' ').slice(2).join(' ')}`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg flex-shrink-0 ${alert.color.split(' ').slice(2).join(' ')}`}>
                <alert.icon className={`w-5 h-5 ${alert.color.split(' ')[0]} ${alert.color.split(' ')[1]}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1">{alert.title}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{alert.message}</p>
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>{alert.time}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
        Load More Alerts
      </button>
    </div>
  );
}