import { DeviceGrid } from '../components/smarthome/DeviceGrid';
import { AutomationRules } from '../components/smarthome/AutomationRules';
import { EnergyUsage } from '../components/smarthome/EnergyUsage';
import { AirQualityHistory } from '../components/smarthome/AirQualityHistory';

export function SmartHomeView() {
  return (
    <div className="p-6 space-y-6">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Device Grid */}
        <DeviceGrid />

        {/* Automation and Energy */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <AutomationRules />
          <EnergyUsage />
        </div>

        {/* Air Quality History */}
        <AirQualityHistory />
      </div>
    </div>
  );
}
