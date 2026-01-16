import { MonitoringMap } from '../components/government/MonitoringMap';
import { HotspotClusters } from '../components/government/HotspotClusters';
import { ComplianceStats } from '../components/government/ComplianceStats';
import { ConstructionSites } from '../components/government/ConstructionSites';
import { EmissionsReport } from '../components/government/EmissionsReport';

export function GovernmentView() {
  return (
    <div className="p-6 space-y-6">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Compliance Stats */}
        <ComplianceStats />

        {/* Map and Hotspots */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <MonitoringMap />
          </div>
          <div className="space-y-6">
            <HotspotClusters />
            <ConstructionSites />
          </div>
        </div>

        {/* Emissions Report */}
        <EmissionsReport />
      </div>
    </div>
  );
}
