import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { AlertTriangle, AlertCircle, Info, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { apiClient } from '../../api/client';
import { AlertItem } from '../../types';

export function AlertsFeed() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await apiClient.getAlerts();
        // Map backend alerts to UI format
        const mapped = data.alerts.map((a: AlertItem) => {
          let icon = Info;
          let color = 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800';
          let priority = 'low';

          // Map severity/type to UI styles
          if (a.severity === 'high' || a.severity === 'critical') {
            priority = 'high';
            icon = AlertCircle;
            color = 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800';
          } else if (a.severity === 'medium') {
            priority = 'medium';
            icon = AlertTriangle;
            color = 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800';
          } else if (a.type === 'improvement') {
            priority = 'low';
            icon = CheckCircle;
            color = 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800';
          }

          // Relative time calculation (simple)
          const validFrom = new Date(a.validFrom);
          const now = new Date();
          const diffMin = Math.floor((now.getTime() - validFrom.getTime()) / 60000);
          let timeStr = 'Just now';
          if (diffMin > 60) timeStr = `${Math.floor(diffMin / 60)}h ago`;
          else if (diffMin > 0) timeStr = `${diffMin}m ago`;

          return {
            ...a,
            time: timeStr,
            icon,
            priority,
            color
          };
        });
        setAlerts(mapped);
      } catch (err) {
        console.error("Failed to load alerts", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="secondary">Medium</Badge>;
      default:
        return <Badge variant="outline">Low</Badge>;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Alerts {loading && "..."}</CardTitle>
            <CardDescription>System notifications & updates</CardDescription>
          </div>
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-1">
            View All
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </CardHeader>

      <div className="px-6 pb-6 space-y-3 max-h-[500px] overflow-y-auto">
        {alerts.length === 0 && !loading && (
          <div className="text-center text-gray-500 py-4">No active alerts</div>
        )}
        {alerts.map((alert, index) => (
          <div
            key={index}
            className={`border rounded-lg p-4 hover:shadow-sm transition-all cursor-pointer group ${alert.color.split(' ').slice(2).join(' ')}`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg flex-shrink-0 ${alert.color.split(' ').slice(2).join(' ')}`}>
                <alert.icon className={`w-4 h-4 ${alert.color.split(' ')[0]} ${alert.color.split(' ')[1]}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                    {alert.title}
                  </h4>
                  {getPriorityBadge(alert.priority)}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{alert.message}</p>
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>{alert.time}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
