import { TrafficMap } from '../components/traffic/TrafficMap';
import { RouteComparison } from '../components/traffic/RouteComparison';
import { CleanRoutes } from '../components/traffic/CleanRoutes';
import { TrafficStats } from '../components/traffic/TrafficStats';

export function TrafficView() {
  return (
    <div className="p-6 space-y-6">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Traffic Stats */}
        <TrafficStats />

        {/* Map and Clean Routes */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <TrafficMap />
          </div>
          <CleanRoutes />
        </div>

        {/* Route Comparison */}
        <RouteComparison />
      </div>
    </div>
  );
}
