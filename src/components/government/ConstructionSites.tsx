import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Building2, AlertCircle } from 'lucide-react';
import { Badge } from '../ui/Badge';

export function ConstructionSites() {
  const sites = [
    { name: 'Downtown Tower', status: 'compliant', dust: 'Low' },
    { name: 'Highway Extension', status: 'warning', dust: 'Medium' },
    { name: 'Bridge Project', status: 'violation', dust: 'High' },
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'compliant':
        return <Badge variant="success" size="sm">Compliant</Badge>;
      case 'warning':
        return <Badge variant="warning" size="sm">Warning</Badge>;
      default:
        return <Badge variant="error" size="sm">Violation</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          <CardTitle>Construction Sites</CardTitle>
        </div>
      </CardHeader>

      <div className="px-6 pb-6 space-y-3">
        {sites.map((site, index) => (
          <div
            key={index}
            className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{site.name}</p>
              {getStatusBadge(site.status)}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
              <AlertCircle className="w-3 h-3" />
              <span>Dust Level: {site.dust}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
