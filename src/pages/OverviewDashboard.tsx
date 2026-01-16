import { AQIMetricsGrid } from '../components/dashboard/AQIMetricsGrid';
import { SevenDayForecast } from '../components/dashboard/SevenDayForecast';
import { AlertsFeed } from '../components/dashboard/AlertsFeed';
import { QuickActions } from '../components/dashboard/QuickActions';
import { SmartControls } from '../components/dashboard/SmartControls';
import { AQIMap } from '../components/AQIMap';
import { RecentActivity } from '../components/dashboard/RecentActivity';

export function OverviewDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Smart Controls & Quick Actions */}
        <SmartControls />
        {/* <QuickActions /> */}

        {/* AQI Metrics Grid */}
        <AQIMetricsGrid />

        {/* 7-Day Forecast & Alerts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <SevenDayForecast />
          </div>
          <AlertsFeed />
        </div>

        {/* Map & Recent Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <AQIMap />
          </div>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
