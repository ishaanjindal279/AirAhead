import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Zap, Clock, TrendingUp, Plus } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export function AutomationRules() {
  const rules = [
    {
      name: 'High AQI Auto-On',
      trigger: 'AQI > 75',
      action: 'Turn on all purifiers',
      status: 'active',
      executions: 12,
    },
    {
      name: 'Night Mode',
      trigger: '10:00 PM',
      action: 'Switch to sleep mode',
      status: 'active',
      executions: 28,
    },
    {
      name: 'Energy Saver',
      trigger: 'AQI < 50 for 2h',
      action: 'Reduce fan speed',
      status: 'active',
      executions: 45,
    },
    {
      name: 'Morning Boost',
      trigger: '6:00 AM',
      action: 'Max purification',
      status: 'paused',
      executions: 19,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Automation Rules</CardTitle>
            <CardDescription>Smart triggers and actions</CardDescription>
          </div>
          <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
            Add Rule
          </Button>
        </div>
      </CardHeader>

      <div className="px-6 pb-6 space-y-3">
        {rules.map((rule, index) => (
          <div
            key={index}
            className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
                  <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                    {rule.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {rule.executions} executions this week
                  </p>
                </div>
              </div>
              <Badge 
                variant={rule.status === 'active' ? 'success' : 'default'} 
                size="sm"
                dot
              >
                {rule.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 mb-1">
                  <Clock className="w-3 h-3" />
                  <span>Trigger</span>
                </div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{rule.trigger}</p>
              </div>
              <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 mb-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>Action</span>
                </div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{rule.action}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
