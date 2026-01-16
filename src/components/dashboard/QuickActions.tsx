import { Download, Share2, Settings, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

export function QuickActions() {
  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live Data</span>
          <span className="text-gray-400">•</span>
          <span>Updated 30s ago</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" icon={<RefreshCw className="w-4 h-4" />}>
          Refresh
        </Button>
        <Button variant="outline" size="sm" icon={<Download className="w-4 h-4" />}>
          Export
        </Button>
        <Button variant="outline" size="sm" icon={<Share2 className="w-4 h-4" />}>
          Share
        </Button>
        <Button variant="secondary" size="sm" icon={<Settings className="w-4 h-4" />}>
          Configure
        </Button>
      </div>
    </div>
  );
}
